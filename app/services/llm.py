import requests
from dotenv import load_dotenv
load_dotenv()
from app.core.config import LLm


def llm_processing(question , retreived_text):
    prompt_text = f"""Context:{retreived_text} Question:{question} Answer using only the context above. If the answer isn't in the context, say so. """
    payload ={
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt_text
                        }
                    ]}]}
    url,headers = LLm()
    request = requests.post(url=url,headers=headers,json=payload)
    request.raise_for_status()
    return request.json()
