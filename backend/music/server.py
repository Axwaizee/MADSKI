import os
import librosa
import numpy as np
import tensorflow as tf
from tensorflow.image import resize
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

classes = ['disco','pop', 'hiphop', 'jazz', 'classical', 'metal', 'blues', 'reggae', 'rock', 'country']
model = tf.keras.models.load_model("./models/Trained-model210-50eps.h5")

def load_and_preprocess_file(file_path, target_shape=(210,210)):
    data= []
    audio_data, sample_rate = librosa.load(file_path, sr=None)
    chunk_duration = 4
    overlap_duration = 2

    chunk_samples = chunk_duration * sample_rate
    overlap_samples = overlap_duration * sample_rate

    num_chunks = int(np.ceil((len(audio_data)-chunk_samples) / (chunk_samples-overlap_samples)))+1
    for i in range(num_chunks):
        start = i * (chunk_samples-overlap_samples)
        end = start + chunk_samples

        chunk = audio_data[start:end]
        mel_spectogram = librosa.feature.melspectrogram(y=chunk, sr=sample_rate)
        mel_spectogram = resize(np.expand_dims(mel_spectogram, axis=-1), target_shape)
        data.append(mel_spectogram)

    return np.array(data)

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

    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)
    
    try:
        predictions = model_prediction(temp_path)
        os.remove(temp_path)
        return jsonify({'predictions': predictions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@socketio.on('audio_chunk')
def handle_audio_chunk(data):
    try:
        # Convert base64 audio data to numpy array
        audio_data = np.frombuffer(data['chunk'], dtype=np.float32)
        sample_rate = data['sample_rate']
        
        # Process single chunk
        mel_spectogram = librosa.feature.melspectrogram(y=audio_data, sr=sample_rate)
        mel_spectogram = resize(np.expand_dims(mel_spectogram, axis=-1), (210, 210))
        predictions = model.predict(np.array([mel_spectogram]))
        
        top_predictions = get_top_predictions(predictions[0], 3)
        emit('prediction', {'predictions': top_predictions})
    except Exception as e:
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)