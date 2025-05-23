import os
import librosa
import numpy as np
import tensorflow as tf
from tensorflow.image import resize
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)  # Allow all origins for all routes
socketio = SocketIO(app, cors_allowed_origins="*") 

classes = ['disco','pop', 'hiphop', 'jazz', 'classical', 'metal', 'blues', 'reggae', 'rock', 'country']
model = tf.keras.models.load_model("./models/Trained-model210-50eps.h5")

def load_and_preprocess_file(file_path):
    audio_data, sample_rate = librosa.load(file_path, sr=22050)
    duration = librosa.get_duration(y=audio_data, sr=sample_rate)
    
    # Process 4-second chunks with 2-second overlap
    chunks = []
    for start in np.arange(0, duration, 2):
        end = start + 4
        if end > duration:
            break
        chunk = audio_data[int(start*sample_rate):int(end*sample_rate)]
        mel = librosa.feature.melspectrogram(
            y=chunk, 
            sr=sample_rate, 
            n_fft=2048, 
            hop_length=512
        )
        mel = resize(np.expand_dims(mel, -1), (210, 210))
        chunks.append(mel)
    
    return np.array(chunks)

def get_top_predictions(predictions, top_n=3):
    top_indices = np.argsort(predictions)[-top_n:][::-1]
    return [(classes[i], float(predictions[i])) for i in top_indices]

def model_prediction(file_path):
    X_test = load_and_preprocess_file(file_path)
    y_pred = model.predict(X_test)
    aggregated_pred = np.mean(y_pred, axis=0)
    return get_top_predictions(aggregated_pred, 3)

@app.route('/predict', methods=['POST'])
def predict_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    temp_path = f"tmp/{file.filename}"
    file.save(temp_path)
    
    try:
        X_test = load_and_preprocess_file(temp_path)
        y_pred = model.predict(X_test)
        aggregated_pred = np.mean(y_pred, axis=0)
        predictions = get_top_predictions(aggregated_pred, 3)
        os.remove(temp_path)
        return jsonify({'predictions': predictions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@socketio.on('audio_chunk')
def handle_audio_chunk(data):
    try:
        audio_data = np.array(data['chunk'], dtype=np.float32)
        sample_rate = data['sample_rate']
        
        # Process audio chunk
        mel = librosa.feature.melspectrogram(
            y=audio_data, 
            sr=sample_rate, 
            n_fft=2048, 
            hop_length=512
        )
        mel = resize(np.expand_dims(mel, -1), (210, 210))
        mel = np.expand_dims(mel, axis=0)
        
        predictions = model.predict(mel)
        top_predictions = get_top_predictions(predictions[0], 3)
        emit('prediction', {'predictions': top_predictions})
    except Exception as e:
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)