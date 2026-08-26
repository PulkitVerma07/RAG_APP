import requests
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
url =  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"
headers= {
    'Content-Type': 'application/json',
    'X-goog-api-key':api_key
}
payload ={
    "contents": [
        {
            "parts": [
                {
                    "text": "Explain how AI works in a few words"
                }
            ]
        }
    ]
}
try:
    # Gemini generation requires a POST request
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    
    # Check for HTTP errors
    response.raise_for_status()
    
    # Print the JSON output from Gemini
    print(response.json())

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")


