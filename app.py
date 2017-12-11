from flask import Flask, render_template
from flask_assets import Environment, Bundle
app = Flask(__name__, static_folder='static')
assets = Environment(app)

app.config['ASSETS_DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['HOST'] = "0.0.0.0"

js = Bundle('js/main.js', output='out/main.js')
css = Bundle('sass/main.scss', filters='scss', output='out/main.css')

assets.register('js_all', js)
assets.register('css_all', css)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', threaded=True)
