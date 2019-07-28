import subprocess
from flask import Flask, render_template
from flask_assets import Environment, Bundle
app = Flask(__name__, static_folder='static')
assets = Environment(app)

app.config['ASSETS_DEBUG'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['HOST'] = "0.0.0.0"

js = Bundle('js/main.js', output='out/game.js')
css = Bundle('sass/main.scss', filters='libsass', output='out/main.css')

assets.register('js_all', js)
assets.register('css_all', css)

@app.route('/')
def home():
    raw_commit = subprocess.Popen(["git", "rev-parse", "--short", "HEAD"],
        stdout=subprocess.PIPE).stdout.read()
    commit = raw_commit.decode("utf-8").replace("\n", "")
    return render_template('index.html', commit=commit)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', threaded=True)
