from flask import Blueprint, jsonify, request, send_file
from services.image_service import process_image_custom, process_image_ai
import io
from PIL import Image
import json
import base64

image_bp = Blueprint('image', __name__, url_prefix='/process_image')

@image_bp.route('/', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded.'}), 400

    file = request.files['image']
    algorithm = request.form.get('algorithm', 'ai')
    processed_image = None

    try:
        # Converte a imagem para Base64
        image = Image.open(file.stream)
        img_buffer = io.BytesIO()
        image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')

        # Passa a string Base64 para a camada de serviço
        if algorithm == 'custom':
            parameters = request.form.get('parameters')
            if parameters:
                parameters = json.loads(parameters)
            else:
                return jsonify({'error': 'Parameters are required for custom algorithm.'}), 400

            processed_image = process_image_custom(img_base64, parameters)
        else:
            processed_image = process_image_ai(img_base64)
        
        # Decodifica a imagem processada de volta para bytes para envio
        processed_img_bytes = base64.b64decode(processed_image)
        img_io = io.BytesIO(processed_img_bytes)
        img_io.seek(0)

        return send_file(img_io, mimetype='image/png')
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
