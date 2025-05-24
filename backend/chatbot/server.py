from flask import Flask, request, jsonify
from flask_cors import CORS
from ollama import Client

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

    try:
        response = client.chat(model=MODEL, messages=[
            {'role': 'user', 'content': user_message}
        ])
        return jsonify({'response': response['message']['content']})
    except Exception as e:
        return jsonify({'response': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
