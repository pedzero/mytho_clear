from flask import Blueprint, jsonify, request
from services.image_service import image_service

image_bp = Blueprint('image', __name__, url_prefix='/api/image')


@image_bp.route('/', methods=['GET'])
def get_data():
    data = image_service()
    return jsonify(data)

