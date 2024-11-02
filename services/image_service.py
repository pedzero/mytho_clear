import io
from PIL import Image, ImageDraw
import base64
from rembg import remove  # Biblioteca para remoção de fundo

def create_checkerboard(size, box_size):
    """Cria uma imagem quadriculada."""
    checkerboard = Image.new('RGBA', size)
    draw = ImageDraw.Draw(checkerboard)
    
    for y in range(0, size[1], box_size):
        for x in range(0, size[0], box_size):
            if (x // box_size) % 2 == (y // box_size) % 2:
                draw.rectangle([x, y, x + box_size, y + box_size], fill=(255, 255, 255, 255))  # Quadrados brancos
            else:
                draw.rectangle([x, y, x + box_size, y + box_size], fill=(192, 192, 192, 255))  # Quadrados cinzas

    return checkerboard

def process_image(image, x, y, use_removal):
    img_gray = Image.open(io.BytesIO(image)).convert('L')  

    if use_removal:
        img_rgba_bytes = remove(image)  

        img_rgba = Image.open(io.BytesIO(img_rgba_bytes))  

        img_rgba = img_rgba.convert('RGBA')

        
        checkerboard = create_checkerboard(img_rgba.size, 20)  # 20px de tamanho do quadrado

        combined = Image.alpha_composite(checkerboard, img_rgba)
    else:
        #outra logica baseado no front
        pass


    byte_io = io.BytesIO()
    combined.save(byte_io, 'PNG')
    byte_io.seek(0)

    # Retorna a imagem em base64
    return base64.b64encode(byte_io.getvalue()).decode('utf-8')
