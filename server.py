from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='dist/')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('dist/js/', path)
    
@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('dist/css/', path)

@app.route('/manifest.json')
def send_manifest():
    return app.send_static_file('mainfest.json')

@app.route("/")
def webapp():
    return app.send_static_file('index.html')

