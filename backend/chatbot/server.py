from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Response, stream_with_context
from ollama import Client
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
client = Client(host='http://localhost:11434')

MODEL ='llama3.2:1b'
MODEL ='madski'

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'response': "No message provided."}), 400

    def generate():
        try:
            response = client.chat(
                model=MODEL,
                messages=[{'role': 'user', 'content': user_message}],
                stream=True
            )
            
            for chunk in response:
                # Send only the content without additional formatting
                yield f"data: {json.dumps({'content': chunk['message']['content']})}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(stream_with_context(generate()), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
