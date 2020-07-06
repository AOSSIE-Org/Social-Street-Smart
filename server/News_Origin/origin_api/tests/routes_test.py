import json
import pytest
from origin_api import app

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


def test_dummy(client):
    response = client.get('/')
    assert b'Hello, World!' in response.data


def test_ht(client):
    response = client.get('/pred?text=On Tuesday, Delhi reported 1,298 Covid cases with the total tally reaching 22,132. Eleven more people died over the last 24 hours, taking the toll to 556, according to the Delhi government’s daily bulletin')
    assert response.status_code == 200
    sites = []
    for site in json_of_response(response)['HIGH']:
            sites.append(str(site[0]))
    assert 'hindustantimes.com' in sites


def test_newsbrig(client):
    response = client.get('/pred?text=New York City looters were caught on camera pulling up in luxury SUVs — including what was claimed to be a pricey Rolls-Royce — before apparently looting an upscale retail store in Manhattan, according to footage shared on social media.')
    assert response.status_code == 200
    sites = []
    for site in json_of_response(response)['HIGH']:
            sites.append(str(site[0]))
    assert 'newsbrig.com' in sites

def test_independ(client):
    response = client.get('/pred?text=As many parts of the UK brace themselves for wetter weather, the prime minister stressed his government had relaxed lockdown rules only for gatherings which take place outdoors')
    assert response.status_code == 200
    sites = []
    for site in json_of_response(response)['HIGH']:
            sites.append(str(site[0]))
    assert 'independent.co.uk' in sites

# def test_independ(client):
#     response = client.get('/pred?text=As many parts of the UK brace themselves for wetter weather, the prime minister stressed his government had relaxed lockdown rules only for gatherings which take place outdoors')
#     assert response.status_code == 200
#     sites = []
#     for site in json_of_response(response)['HIGH']:
#             sites.append(str(site[0]))
#     assert 'independent.co.uk' in sites



