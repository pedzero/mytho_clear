import cv2
import numpy as np
import base64
import io
from PIL import Image
from rembg import remove

def base64_to_image(base64_str):
    img_data = base64.b64decode(base64_str)
    np_array = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(np_array, cv2.IMREAD_COLOR)

def image_to_base64(image):
    _, buffer = cv2.imencode('.png', image)
    return base64.b64encode(buffer).decode('utf-8')

def custom_algorithm(img, canny_threshold1=100, canny_threshold2=200,
                  morph_kernel_size=3, dilation_iterations=1,
                  contour_fill_color=255, min_contour_area=100,
                  erosion_iterations=1, blur_kernel_size=5):
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, canny_threshold1, canny_threshold2)

    kernel = np.ones((morph_kernel_size, morph_kernel_size), np.uint8)
    dilated_edges = cv2.dilate(edges, kernel, iterations=dilation_iterations)

    contours, _ = cv2.findContours(dilated_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    contour_mask = np.zeros_like(dilated_edges)
    cv2.drawContours(contour_mask, contours, -1, contour_fill_color, thickness=cv2.FILLED)

    combined_mask = cv2.bitwise_or(dilated_edges, contour_mask)

    smoothed_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel)

    eroded_mask = cv2.erode(smoothed_mask, kernel, iterations=erosion_iterations)
    refined_mask = cv2.morphologyEx(eroded_mask, cv2.MORPH_CLOSE, kernel)

    final_contours, _ = cv2.findContours(refined_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filtered_mask = np.zeros_like(refined_mask)
    for contour in final_contours:
        if cv2.contourArea(contour) > min_contour_area:
            cv2.drawContours(filtered_mask, [contour], -1, contour_fill_color, thickness=cv2.FILLED)

    rounded_mask = cv2.GaussianBlur(filtered_mask, (blur_kernel_size, blur_kernel_size), 0)

    b, g, r = cv2.split(img)
    alpha = rounded_mask

    result = cv2.merge([b, g, r, alpha])

    return result

def process_image_custom(base64_str, parameters):
    img = base64_to_image(base64_str)
    img_size = img.shape[1::-1]
    img_num_pixels = img_size[0] * img_size[1]

    canny_threshold1 = int(parameters.get('lowerThreshold', 50))
    canny_threshold2 = int(parameters.get('upperThreshold', 150))
    morph_kernel_size = int(parameters.get('kernelSize', 3))
    dilation_iterations = int(parameters.get('edgeDilate', 1))
    min_contour_area = int(img_num_pixels * (float(parameters.get('minContour', 1)) / 100))
    erosion_iterations = int(parameters.get('erosion', 1))
    blur_size = int(parameters.get('blur', 1))
    
    blur_kernel_size = (blur_size * 2) + 1 if blur_size > 0 else 1

    processed_img = custom_algorithm(
        img,
        canny_threshold1,
        canny_threshold2,
        morph_kernel_size,
        dilation_iterations,
        255,
        min_contour_area,
        erosion_iterations,
        blur_kernel_size
    )

    return image_to_base64(processed_img)

def process_image_ai(base64_str):
    img_data = base64.b64decode(base64_str)
    
    img = Image.open(io.BytesIO(img_data)).convert('RGBA')
    
    img_no_bg = remove(img)
    
    byte_io = io.BytesIO()
    img_no_bg.save(byte_io, format='PNG')
    byte_io.seek(0)
    
    return base64.b64encode(byte_io.getvalue()).decode('utf-8')
