import json
import pytest
from clickbait_api import app

def post_json(client, url, json_dict): 
    """Send dictionary json_dict as a json to the specified url """
    return client.post(url, data=json.dumps(json_dict), content_type='application/json')


def json_of_response(response):
    """Decode json from response"""
    return json.loads(response.data.decode('utf8'))


@pytest.fixture
def client(request):
    test_client = app.test_client()

    def teardown():
        pass 
    request.addfinalizer(teardown)
    return test_client


def test_dummy(client):
    response = client.get('/')
    assert b'Hello, World!' in response.data


def test_pred_get_cb(client):
    response = client.get('/pred?text=you wont believe what happend next')
    assert response.status_code == 200
    assert float((json_of_response(response))['Result']) >= 0.9


def test_pred_get_no_cb(client):
    response = client.get('/pred?text=Clash between Pygmies and DRC gorilla sanctuary rangers leaves one dead')
    assert response.status_code == 200
    assert float((json_of_response(response))['Result']) <= 0.5


def test_pred_post_cb(client):
    data = {
        'text': 'you wont believe what happend next'
    }
    url = '/pred'
    response = client.post(url, data = data)
    #response = client.post(client, '/pred', {'text': 'you wont believe what happend next'})
    assert response.status_code == 200
    assert float((json_of_response(response))['Result']) >= 0.9


def test_pred_post_no_cb(client):
    data = {
        'text': 'Clash between Pygmies and DRC gorilla sanctuary rangers leaves one dead'
    }
    url = '/pred'
    response = client.post(url, data = data)
    assert response.status_code == 200
    assert float((json_of_response(response))['Result']) <= 0.5





