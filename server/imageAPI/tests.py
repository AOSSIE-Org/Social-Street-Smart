import json
import pytest
from app import app
import os
import tempfile
# from flaskr import flaskr
import pprint
pp = pprint.PrettyPrinter(indent=4)
@pytest.fixture
def client(request):
    """Creating the test client for testing"""
    test_client = app.test_client()
    def teardown():
        pass 
    request.addfinalizer(teardown)
    return test_client


def test_dummy(client):
    response = client.get('/')
    assert b'Hello World' in response.data

def test_one(client):
    link = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
    response = client.get('/lookup/?link=' + link)
    # pp.pprint(response.__dict__)
    # pprint(len(response.data))
    assert response.status_code == 200
    assert len(response.data) > 0

def test_two(client):
    link = "https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg"
    response = client.get('/lookup/?link=' + link)
    # pp.pprint(response.__dict__)
    # pprint(len(response.data))
    assert response.status_code == 200
    assert len(response.data) > 0

# Broken Test?
# def test_three(client):
#     link = "https://th.thgim.com/news/national/iogff3/article30067660.ece/alternates/FREE_435/BRICS-SUMMITLEADERSTHNAK"
#     response = client.get('/lookup/?link=' + link)
#     # pp.pprint(response.__dict__)
#     # pprint(len(response.data))
#     assert response.status_code == 200
#     assert len(response.data) > 0
