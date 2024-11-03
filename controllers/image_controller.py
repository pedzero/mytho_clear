from flask import Blueprint, jsonify, request
from services.image_service import process_image_custom
from services.image_service import process_image_ai

image_bp = Blueprint('image', __name__, url_prefix='/process_image')


@image_bp.route('/', methods=['POST'])
def process_image():
    data = request.json
    
    base64_str = data.get('image')
    if not base64_str:
        return jsonify({'error': 'Image in Base64 format is required.'}), 400
    
    try:
        processed_image_base64 = None
        if data.get('algorithm') == 'custom':
            parameters = data.get('parameters')
            if not parameters:
                return jsonify({'error': 'If custom algorithm is being used, parameters must be provided'}), 400
            
            processed_image_base64 = process_image_custom(base64_str, parameters)
        else:
            processed_image_base64 = process_image_ai(base64_str)
        
        return jsonify({'image': processed_image_base64})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
