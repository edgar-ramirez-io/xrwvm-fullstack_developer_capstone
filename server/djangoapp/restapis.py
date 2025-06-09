# Uncomment the imports below before you add the function code
# import requests
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
ai_backend_url = os.getenv('AI_BACKEND_URL', default='http://localhost:8000/')
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params
    print("Get from {}".format(request_url))

    try:
        response = requests.get(request_url)
        return response.json()
    except:
        print("Network exception occurred")
        return None

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return None

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url,json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")
        return None

def fetch_chat(prompt):
    request_url = ai_backend_url + "endpoint"
    is_mock = True
    print(f"Request to {request_url} with params: {prompt} and isMock: {is_mock}")
    if is_mock:
        with open('djangoapp/mocks/gpt-4o-mini-openai-v1-chat-completions.json', 'r') as file:
            return json.load(file)
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return None
