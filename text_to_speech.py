import pyttsx3

def speak_text(text, rate=150, volume=1.0, voice_id=None):
    engine = pyttsx3.init()
    
    # Set the rate (speed) of speech
    engine.setProperty('rate', rate)
    
    # Set the volume (0.0 to 1.0)
    engine.setProperty('volume', volume)
    
    # Set the voice (if voice_id is provided)
    if voice_id:
        voices = engine.getProperty('voices')
        for voice in voices:
            if voice.id == voice_id:
                engine.setProperty('voice', voice.id)
                break
    
    engine.say(text)
    engine.runAndWait()

# Example usage:
# speak_text("Hello, how can I assist you?", rate=125, volume=0.8)
