from flask import Flask
from flask_cors import CORS  # Importa CORS
from controllers.image_controller import image_bp

app = Flask(__name__)

# Configura o CORS para permitir requisições de qualquer origem
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite todas as origens

# Registrando o blueprint do controlador de imagem
app.register_blueprint(image_bp)

if __name__ == '__main__':
    app.run(debug=True)
