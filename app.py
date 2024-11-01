from flask import Flask

from controllers.image_controller import image_bp
from controllers.index_controller import index_bp

app = Flask(__name__)

app.register_blueprint(index_bp)
app.register_blueprint(image_bp)

if __name__ == '__main__':
    app.run(debug=True)
