from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
from colorthief import ColorThief
from io import BytesIO
from collections import defaultdict
from scipy.spatial import KDTree

app = Flask(__name__)
CORS(app)

# Simpan hasil deteksi di memori
detected_data = []

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_palette_with_percentage(image_bytes, color_count=5):
    color_thief = ColorThief(BytesIO(image_bytes))
    palette = color_thief.get_palette(color_count=color_count)

    # Baca gambar dan konversi ke RGB
    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Hitung frekuensi warna menggunakan warna terdekat
    reshaped_img = image.reshape(-1, 3)
    kd_tree = KDTree(palette)
    nearest_colors = kd_tree.query(reshaped_img)[1]

    color_counts = defaultdict(int)
    for idx in nearest_colors:
        color_counts[tuple(palette[idx])] += 1
    
    total_pixels = len(reshaped_img)
    palette_percentage = [
        {
            "color": color,
            "hex": rgb_to_hex(color),
            "percentage": round((color_counts[color] / total_pixels) * 100, 2)
        }
        for color in palette
    ]

    return palette_percentage

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        image_bytes = file.read()
        palette_with_percentage = get_palette_with_percentage(image_bytes)
        
        # Simpan data ke detected_data
        detected_data.append(palette_with_percentage)
        
        return jsonify(palette_with_percentage)
    else:
        return jsonify({"error": "No file uploaded"}), 400

@app.route('/history', methods=['GET'])
def history():
    return jsonify(detected_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
