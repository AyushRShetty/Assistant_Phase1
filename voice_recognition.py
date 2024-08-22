import speech_recognition as sr

def listen_to_audio(timeout=5):
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        print("Listening...")
        try:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source)
            
            # Listen with a timeout to prevent indefinite hang
            audio = recognizer.listen(source, timeout=timeout)
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Sorry, I did not understand that."
        except sr.RequestError as e:
            return f"Sorry, there was an issue with the speech recognition service: {e}"
        except sr.WaitTimeoutError:
            return "Listening timed out. Please try again."
        except Exception as e:
            return f"An unexpected error occurred: {e}"
