from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import joblib
from insightface.app import FaceAnalysis
import base64
import json

# Load user information from JSON file
try:
    with open('userinfo.json', 'r') as f:
        user_info = json.load(f)
except FileNotFoundError:
    print("Error: userinfo.json file not found. Server cannot start.")
    exit(1)
except json.JSONDecodeError as e:
    print(f"Error parsing userinfo.json: {str(e)}")
    exit(1)

# Initialize FaceAnalysis with CPU provider
app = FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))  # Prepare model with 640x640 resolution

# Load trained classifier and label encoder
classifier = joblib.load("face_classifier.pkl")
label_encoder = joblib.load("label_encoder.pkl")
THRESHOLD = 0.7  # Minimum confidence threshold for recognition

# Initialize Flask app with CORS
api = Flask(__name__)
CORS(api, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow Vite frontend


@api.route('/recognize', methods=['POST'])
def recognize():
    try:
        # Get base64 image from request
        image_data = base64.b64decode(request.json['image'])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Detect faces and process embeddings
        faces = app.get(frame)
        matches = []

        for face in faces:
            # Extract embedding and reshape for classifier
            emb = face.embedding.reshape(1, -1)

            # Get predictions
            probs = classifier.predict_proba(emb)[0]
            max_prob = np.max(probs)
            pred_label = classifier.predict(emb)[0]

            if max_prob >= THRESHOLD:
                # Decode label and add to matches
                name = label_encoder.inverse_transform([pred_label])[0]
                matches.append({
                    'name': name,
                    'confidence': round(max_prob * 100, 1)
                })

        return jsonify({'matches': matches})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        username = request.json.get('username')

        # In a real system, you would:
        # 1. Verify user exists in database
        # 2. Generate session/JWT token
        # 3. Set authentication cookies
        # 4. Log login attempt

        # Check if user exists in userinfo.json
        if username not in user_info:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404

        # Get user details from userinfo.json
        user_data = user_info[username]

        return jsonify({
            'status': 'success',
            'user': username,
            'token': 'mock_jwt_token',
            'user_info': user_data,
            'message': f'Logged in as {username}'
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Login failed: {str(e)}'
        }), 400
def get_user_info():
    return user_info[username]

def get_current_time():
    return "12:07pm"


if __name__ == '__main__':
    api.run(host="0.0.0.0",port=5000)