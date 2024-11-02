import base64
from flask import Blueprint, request, jsonify
from services.image_service import process_image

image_bp = Blueprint('image', __name__)

@image_bp.route('/process_image', methods=['POST'])
def process_image_route():
    data = request.json  # Obtém os dados da requisição JSON
    image_base64 = data['image']  # Extrai a imagem em base64
    x = data['x']
    y = data['y']
    use_removal = data['use_removal']

    image_data = base64.b64decode(image_base64)

    result_image = process_image(image_data, x, y, use_removal)

    return jsonify({'result_image': result_image})
