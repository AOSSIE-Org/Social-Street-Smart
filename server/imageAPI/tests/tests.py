import json
import pytest
from ... import app
import os
import tempfile
from flaskr import flaskr


@pytest.fixture
def client(request):
    """Creating the test client for testing"""
    flaskr.app.config['TESTING'] = True

    with flaskr.app.test_client() as client:
        with flaskr.app.app_context():
            flaskr.init_db()
        yield client

def test_dummy(client):
    response = client.get('/')
    assert b'Hello World' in response.data
