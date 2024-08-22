from groq import Groq
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directly pass the API key into the Groq client
api_key = "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"  # Retain your API key here
client = Groq(api_key=api_key)

def get_response(prompt):
    try:
        # Create a chat completion request to Groq's API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama3-8b-8192"
        )
        # Extract and return the response from the API
        response = chat_completion.choices[0].message.content
        logger.info(f"AI response: {response}")
        return response
    except Exception as e:
        # Log and return the error message
        error_message = f"Error fetching response: {e}"
        logger.error(error_message)
        return error_message
