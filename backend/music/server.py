from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import librosa
import numpy as np
import tensorflow as tf
from tensorflow.image import resize

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')

classes = ['disco','pop', 'hiphop', 'jazz', 'classical', 'metal', 'blues', 'reggae', 'rock', 'country']
model = tf.keras.models.load_model("./models/Trained-model210-50eps.h5")

def process_audio_chunk(audio_data, sample_rate):
    # Ensure audio length matches expected size
    if len(audio_data) < 2048:
        return None
    
    # Convert to numpy array and normalize
    audio_np = np.array(audio_data, dtype=np.float32)
    
    # Generate mel spectrogram
    mel = librosa.feature.melspectrogram(
        y=audio_np,
        sr=sample_rate,
        n_fft=2048,
        hop_length=512,
        n_mels=128
    )
    
    # Resize and format for model input
    mel = resize(np.expand_dims(mel, -1), (210, 210))
    return np.expand_dims(mel, axis=0)

def get_top_predictions(predictions, top_n=3):
    top_indices = np.argsort(predictions)[-top_n:][::-1]
    return [(classes[i], float(predictions[i])) for i in top_indices]

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
        audio, sr = librosa.load(temp_path, sr=22050)
        chunks = []
        
        # Process in 4-second chunks with 50% overlap
        for i in range(0, len(audio)-22050*4, 22050*2):
            chunk = audio[i:i+22050*4]
            if len(chunk) < 22050*4:
                break
            processed = process_audio_chunk(chunk, sr)
            if processed is not None:
                chunks.append(processed)
        
        if not chunks:
            return jsonify({'error': 'No valid audio chunks found'}), 400
            
        predictions = model.predict(np.vstack(chunks))
        aggregated = np.mean(predictions, axis=0)
        return jsonify({'predictions': get_top_predictions(aggregated)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@socketio.on('audio_chunk')
def handle_realtime_chunk(data):
    try:
        processed = process_audio_chunk(data['chunk'], data['sample_rate'])
        if processed is None:
            return
            
        prediction = model.predict(processed)
        emit('prediction', {'predictions': get_top_predictions(prediction[0])})
    except Exception as e:
        print(f"Processing error: {str(e)}")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)