from flask import Flask, jsonify, request
from groq import Groq
import speech_recognition as sr
import pyttsx3

app = Flask(__name__)

# Initialize Groq client with API key
client = Groq(api_key="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")

def get_response(prompt):
    try:
        # Make the API call
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="llama3-8b-8192"
        )
        # Accessing response content, adjust based on actual object structure
        response = chat_completion.choices[0].message.content
        return response
    except Exception as e:
        return f"Error fetching response: {e}"

def speak_text(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def listen_to_audio():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Sorry, I did not understand that."
    except sr.RequestError:
        return "Sorry, there was an issue with the speech recognition service."

@app.route('/listen', methods=['POST'])
def listen():
    text = listen_to_audio()
    response = get_response(text)
    speak_text(response)
    return jsonify({"response": response})

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
