try:
    import pytest,json
    from app import app
except Exception as e:
    print(f"Some modules could not be imported: {e}")

@pytest.fixture
def client():
    test_client = app.test_client()
    return test_client

def test_root(client):
    response = client.get("/")
    assert b'Hello World' in response.data

def test_reportFake(client):
    getRequestResponse = client.get("/reportfake?text=Hi")
    link = "https://www.buzzfeednews.com/article/laurenstrapagiel/is-it-time-for-twitch-to-ban-gambling-on-stream"
    postRequestResponse = client.post("/reportfake",
                data=json.dumps({"link":link}),
                headers={"Content-Type": "application/json"})
    assert b'"text":"Hi"' in getRequestResponse.data
    assert b'"text":"Is It Time For Twitch To Ban Gambling On Stream?"' in postRequestResponse.data

def test_getText(client):
    getRequestResponse = client.get("/getText?text=Hi")
    link = "https://www.buzzfeednews.com/article/laurenstrapagiel/is-it-time-for-twitch-to-ban-gambling-on-stream"
    postRequestResponse = client.post("/getText",
                data=json.dumps({"link":link}),
                headers={"Content-Type": "application/json"})
    assert b'"searchText":"Hi"' in getRequestResponse.data
    assert b'"searchText":"Is It Time For Twitch To Ban Gambling On Stream?"' in postRequestResponse.data

def test_reportHate(client):
    getRequestResponse = client.get("/reporthate?text=Hi")
    link = "https://www.buzzfeednews.com/article/laurenstrapagiel/is-it-time-for-twitch-to-ban-gambling-on-stream"
    postRequestResponse = client.post("/reporthate",
                data=json.dumps({"link":link}),
                headers={"Content-Type": "application/json"})
    assert b'"text":"Hi"' in getRequestResponse.data
    assert b'"text":"Is It Time For Twitch To Ban Gambling On Stream?"' in postRequestResponse.data


saveFactCheckdata = {
        "claims": [
            {
            "text": "Video shows COVID protocol flouted in Delhi's Jaffrabad area",
            "claimant": "Facebook,Twitter",
            "claimDate": "2021-05-11T13:44:56Z",
            "claimReview": [
                {
                "publisher": {
                    "name": "The Quint",
                    "site": "thequint.com"
                },
                "url": "https://www.thequint.com/news/webqoof/video-from-lahore-passed-off-as-covid-19-norms-flouted-in-delhi",
                "title": "Video From Lahore Passed Off as COVID-19 Norms Flouted in Delhi",
                "reviewDate": "2021-05-11T13:44:56Z",
                "textualRating": "False",
                "languageCode": "en"
                }
            ]
            }]
        }


def test_saveFactCheck(client):
    postRequestResponse = client.post("/savefc",
                data=json.dumps(saveFactCheckdata),
                headers={"Content-Type": "application/json"})
    assert b'{"statusCode":200}' in postRequestResponse.data

