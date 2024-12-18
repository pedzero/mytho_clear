from flask import Flask
from flask_cors import CORS

from controllers.image_controller import image_bp
from controllers.index_controller import index_bp

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app)

app.register_blueprint(index_bp)
app.register_blueprint(image_bp)

if __name__ == '__main__':
    app.run(debug=True)