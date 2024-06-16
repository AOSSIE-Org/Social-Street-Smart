import json
import pytest
import requests

def test_root():
    print("Testing endpoint '/' ")
    url = "http://localhost:5000/"
    payload = {}
    headers= {}
    response = requests.request("GET", url, headers=headers, data = payload)
    # print(response.text)
    assert "AOSSIE's Fake News API for Social Street Smart" in response.text

def test_1():
    url = "http://localhost:5000/predict"
    payload = "{\n    \"source\": \"FB\",\n    \"body\" : {\n        \"content\": \"Amit Shah announced Sunday that he had tested positive for COVID-19 and will be admitted to hospital on the advice of doctors. The home minister also requested that those who have come in contact with him to self-isolate and get tested.\"\n    }\n}"
    headers = {
    'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data = payload)
    a = json.loads(response.text.encode('utf8'))
    print(a);
    assert 'genuine' in a['prediciton'] 


def test_2():
    url = "http://localhost:5000/predict"
    payload = "{\n    \"source\": \"Twitter\",\n    \"body\" : {\n        \"content\": \"More than two months after arriving at the International Space Station, US astronauts Doug Hurley and Bob Behnken returned to Earth, splashing down at the Gulf of Mexico, marking the first crew recovery at sea since 1975.\"\n    }\n}"
    headers = {
    'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data = payload)
    a = json.loads(response.text.encode('utf8'))
    print(a);
    assert 'genuine' in a['prediciton'] 

def test_3():
    url = "http://localhost:5000/predict"
    payload = "{\n    \"source\": \"newsWeb\",\n    \"body\" : {\n        \"link\": \"https://thewire.in/diplomacy/how-china-turned-the-tables-on-india-and-converted-1993-agreement-into-a-land-grab\"\n    }\n}"
    headers = {
    'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data = payload)
    print(response.text.encode('utf8'))
