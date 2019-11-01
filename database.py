from glob import glob
import os
import json
import unicodedata
import subprocess
import html2text
import re
import sqlite3
import sys

assert sys.getfilesystemencoding() == 'utf-8'


ALLOWED_STATEMENTS = re.compile('^[A-Za-z_]+$')
FILTER_KEYS = set(['topic', 'year', 'edition', 'edition_text', 'tags'])

class DudenDatabase(object):
    def __init__(self, database_filename='duden.db'):
        self.h2t = html2text.HTML2Text()
        self.h2t.escape_all = True
        self.database_filename = database_filename
        did_exist = os.path.exists(self.database_filename)
        if not did_exist:
            self._build()
    @property
    def conn(self):
        conn = sqlite3.connect(self.database_filename)
        # conn.create_function("SEARCH", 2, self._regexp_lower)
        conn.create_function("REGEXP", 2, self._regexp)
        return conn

    def _regexp(self, expr, item):
        reg = re.compile(expr)
        return reg.search(item) is not None

    def _regexp_lower(self, expr, item):
        reg = re.compile(expr)
        return reg.search(item) is not None

    def _build(self):
        texts = {}
        print("Preprocessing data")
        print("-"*8)
        htmls = {}
        blobs = {}
        for rtf_fp in sorted(glob("files/*.rtf")):
            with open(rtf_fp, 'r') as f:
                texts[unicodedata.normalize('NFC', os.path.basename(rtf_fp)[:-4])] = self._rtf_to_text(rtf_fp)
                htmls[unicodedata.normalize('NFC', os.path.basename(rtf_fp)[:-4])] = self._rtf_to_html(rtf_fp)
                blobs[unicodedata.normalize('NFC', os.path.basename(rtf_fp)[:-4])] = f.read()
        meta = {}
        for meta_fp in sorted(glob("files/*.meta")):
            with open(meta_fp, 'r', encoding='utf-8') as f:
                meta[unicodedata.normalize('NFC', os.path.basename(meta_fp)[:-5])] = json.load(f)
        for k,v in meta.items():
            meta[k]['file'] = '{}_{}_{}.rtf'.format(meta[k]['year'], meta[k]['topic'].replace(' ', '_'), meta[k]['edition'])
        
        print("Building database")
        print("-"*8)
        conn = self.conn
        c = conn.cursor()
        c.execute('CREATE TABLE files (file text, topic text, year int, edition int, edition_text text, text text, html text, rtf blob, tags text)')
        c.executemany('INSERT INTO files(file, topic, year, edition, edition_text, text, html, rtf, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [(m['file'], m['topic'], m['year'], m['edition'], m['edition_text'], texts[k], htmls[k], blobs[k],'\t'.join( m['tags'])) for k,m in meta.items()])

        c.execute('CREATE INDEX idx_files_file ON files(file)')
        c.execute('CREATE INDEX idx_files_topic ON files(topic)')
        c.execute('CREATE INDEX idx_files_edition ON files(edition)')
        c.execute('CREATE INDEX idx_files_edition_text ON files(edition_text)')
        print("Building completed")

        conn.commit()
    def _rtf_to_text(self, fp):
        #lines = subprocess.check_output('unrtf --nopict --text --quiet "{}"'.format(fp), shell=True).decode("ISO-8859-1").split('\n')
        #for i in range(0, 20):
        #    if lines[i] == '-----------------':
        #        return '\n'.join(lines[i+1:])
        #return '\n'.join(lines)
        return self.h2t.handle(self.h2t.unescape(self._rtf_to_html(fp)))


    def _rtf_to_html(self, fp):
        return subprocess.check_output('unrtf --nopict --quiet --html "{}"'.format(fp), shell=True).decode("ISO-8859-1")


    def _is_key_numeric(self, key):
        return key == 'year' or key == 'edition'
    
    def _get_operator(self, opkey):
        if opkey == 'lt':
            return '<'
        if opkey == 'le':
            return '<='
        if opkey == 'gt':
            return '>'
        if opkey == 'ge':
            return '>='
        return '='

    def search(self, expression:str, filter:dict, is_regex=False, orderBy = 'year', ordering = 'ASC'):
        if filter and len(set(filter.keys()).difference(FILTER_KEYS)) > 0:
            raise Exception("invalid parameters")
        if not ALLOWED_STATEMENTS.match(orderBy) or not ALLOWED_STATEMENTS.match(ordering):
            raise Exception("invalid parameters")
        if expression.strip() == '' and len(filter.keys()) == 0:
            raise Exception("invalid parameters")

        query_string = 'SELECT rowid, file, topic, year, edition, edition_text, tags, text, html FROM files'
        needles = []
        conditionals = []
        has_expression = expression is not None and len(expression) > 0
        has_filter = filter is not None and len(filter.keys()) > 0
        
        if has_filter:
            for k,v in filter.items():
                # if not ALLOWED_STATEMENTS.match(k):
                #     raise Exception("invalid parameters")
                if k == 'year':
                    conditionals.append('{} '.format(k) + self._get_operator(v[0]) + ' ?')
                    needles.append(v[1])
                elif k != 'tags':
                    # cond = '{} '.format(k) + 'REGEXP ?'
                    # for c in v: #all tokens
                    #     conditionals.append(cond)
                    #     needles.append(f'^{c}$')
                    conditionals.append('{} '.format(k) + 'REGEXP ?')
                    needles.append('^(' + '|'.join([re.escape(c) for c in v]) + ')$')
                else:
                    conditionals.append('{} '.format(k) + 'REGEXP ?')
                    needles.append('(' + '|'.join([re.escape(c) for c in v]) + ')')

        if has_expression:
            if not is_regex:
                cond = 'LOWER(text) REGEXP ?'
                for x in expression.split(' '): #all tokens
                    if x == '':
                        continue
                    conditionals.append(cond)
                    needles.append(x.lower())
                # needles.append('(' + '|'.join([re.escape(x) for x in expression.split(' ') if x != '']) + ')')
            else:
                conditionals.append('text REGEXP ?')
                needles.append(expression)
        if has_expression or has_filter:
            query_string += ' WHERE ' + ' AND '.join(conditionals)
        query_string += ' ORDER BY {} {}'.format(orderBy, ordering)
        print(query_string)
        print(needles)
        c = self.conn.cursor()
        c.execute(query_string, needles)
        return c.fetchall()

    def get_rtf(self, id:int):
        c = self.conn.cursor()
        c.execute('SELECT file, rtf FROM files WHERE rowid = ?', (id,))#COLLATE NOCASE
        return c.fetchone()


if __name__ == "__main__":
    database = DudenDatabase()
    c = database.conn.cursor()
    c.execute('SELECT tags, topic, edition_text FROM files')
    data = c.fetchall()

    editions = set([r[2] for r in data ])
    editions = list(sorted([e for e in editions if len(e) == 1])) + list(sorted([e for e in editions if len(e) > 1]))
    corpus_meta_data = {
        'tags': list(sorted(set([t for r in data for t in r[0].split('\t') ]))),
        'topics': list(sorted(set([r[1] for r in data ]))),
        'editions': editions,
    }
    with open('dist/corpus_meta.json', 'w', encoding='utf-8') as f:
        json.dump(corpus_meta_data, f)
