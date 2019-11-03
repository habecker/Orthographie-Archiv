from flask import Flask, send_from_directory, request, abort, Response
from database import DudenDatabase
import json
import hashlib
import redis


app = Flask(__name__, static_url_path='', static_folder='dist/')
r = redis.Redis(host='redis', port=6379, db=0)
r.flushall()

db = DudenDatabase()

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/js/<path:path>')
def get_js(path):
    return send_from_directory('dist/js/', path)
    
@app.route('/css/<path:path>')
def get_css(path):
    return send_from_directory('dist/css/', path)

@app.route('/manifest.json')
def get_manifest():
    return send_from_directory('dist/', 'manifest.json')

@app.route('/corpus_meta.json')
def get_corpus_meta():
    return send_from_directory('./', 'corpus_meta.json')


SEARCH_ARGUMENTS = {
    'filter':dict,
    'tags':list,
    'expression':str,
    'is_regex': bool,
    'orderBy': str,
    'ordering': str,
}

BATCH_SIZE = 20
import time
def search():
    result = None
    md5 = 'cached_search_'+ hashlib.md5(json.dumps(request.json).encode('utf-8')).hexdigest()
    cached = r.get(md5)
    if cached is None:
        result = db.search(request.json['expression'], filter=request.json['filter'], is_regex=request.json['is_regex'], orderBy=request.json['orderBy'], ordering=request.json['ordering'])
        r.set(md5, json.dumps(result))
        r.expire(md5, 60*60*24)
        return md5, result
    r.expire(md5, 60*60*24)
    return md5, json.loads(cached)


@app.route('/api/search/', methods=['POST'], strict_slashes=False)
@app.route('/api/search/<int:start>/', methods=['POST'], strict_slashes=False)
def post_search(start=0):
    if request.json is None or len(set(SEARCH_ARGUMENTS.keys()).difference(set(request.json.keys()))) > 0:
        abort(400)
    
    app.logger.info(request.json)
    
    for k,v in request.json.items():
        if k not in SEARCH_ARGUMENTS.keys() or type(v) != SEARCH_ARGUMENTS[k]:
            abort(400)
    md5, results = search()
    count = len(results)
    results = results[start:min(len(results), start+BATCH_SIZE)]
    return json.dumps({
            'start': start,
            'count': count,
            'results': results
        })

@app.route('/api/download/<int:id>/', methods=['GET'], strict_slashes=False)
def get_download(id):
    # if request.json is None or len(set(SEARCH_ARGUMENTS.keys()).difference(set(request.json.keys()))) > 0:
    #     abort(400)
    r = db.get_rtf(id)
    app.logger.info(r)
    if not r:
        return None
    resp = Response(r[1], mimetype='text/xml')
    resp.headers['Content-Disposition'] = 'attachment; filename="{}"'.format(r[0].encode('ISO-8859-1'))
    return resp

@app.route("/")
@app.route("/imprint")
@app.route("/about")
@app.route("/privacy")
def webapp():
    return app.send_static_file('index.html')


