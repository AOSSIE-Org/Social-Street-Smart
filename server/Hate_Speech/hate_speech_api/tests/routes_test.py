import json
import pytest
from hate_speech_api import app

#Test cases for both POST and GET requests

def post_json(client, url, json_dict): 
    """Send dictionary json_dict as a json to the specified url """
    return client.post(url, data=json.dumps(json_dict), content_type='application/json')


def json_of_response(response):
    """Decode json from response"""
    return json.loads(response.data.decode('utf8'))


@pytest.fixture
def client(request):
    """Creating the test client for testing"""
    test_client = app.test_client()

    def teardown():
        pass 
    request.addfinalizer(teardown)
    return test_client


def test_pred_get_toxic(client):
    response = client.get('/pred?text=Last warning! Stop undoing my edits or die you idiot!')
    assert response.status_code == 200
    assert float((json_of_response(response))['Toxic']) >= 0.8


def test_pred_get_normal(client):
    response = client.get('/pred?text=Clash between Pygmies and DRC gorilla sanctuary rangers leaves one dead')
    assert response.status_code == 200
    assert float((json_of_response(response))['Toxic']) <= 0.5


def test_pred_post_toxic(client):
    data = {
        'text': 'Last warning! Stop undoing my edits or die you idiot!'
    }
    url = '/pred'
    response = client.post(url, data = data)
    #response = client.post(client, '/pred', {'text': 'you wont believe what happend next'})
    assert response.status_code == 200
    assert float((json_of_response(response))['Toxic']) >= 0.8



def test_pred_get_obscene(client):
    response = client.get('/pred?text=COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK AND SHIT ON IT')
    assert response.status_code == 200
    assert float((json_of_response(response))['Obscene']) >= 0.8


def test_pred_get_insult(client):
    response = client.get('/pred?text=Fuck off and stop posting on my talkpage you annoying cunt. Your face look like a fuckhead')
    assert response.status_code == 200
    assert float((json_of_response(response))['Insult']) >= 0.8



'''
def test_pred_get_id_hate(client):
    response = client.get('/pred?text=Kill all the niggas')
    assert response.status_code == 200
    assert float((json_of_response(response))['Identity Hate']) >= 0.5


def test_pred_get_id_threat(client):
    response = client.get('/pred?text=I will find you and choke you to death')
    assert response.status_code == 200
    assert float((json_of_response(response))['Threat']) >= 0.5


'''





