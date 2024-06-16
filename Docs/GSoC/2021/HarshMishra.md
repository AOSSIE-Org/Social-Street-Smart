
# GSoC 2021 Report: Social Street Smart

### *By Harsh Mishra* 

[Chrome Extension Repository](https://gitlab.com/aossie/social-street-smart)

[All API's Repository](https://gitlab.com/aossie/social-street-smart-api)

[Download the Extension (Chrome Webstore)](<https://chrome.google.com/webstore/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en-GB&authuser=0>)



#### New API Endpoints

-	ReportFake API : https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/reportfake?text=
-	ReportHate API : https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/reporthate?text=
-	SaveFactCheckerResults API : https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/savefc  [POST ]
-	getTitleFromLink API : https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/getText?text=  [Both GET and POST]
-  FakeNews API : https://e9jbajkrq6.execute-api.us-east-2.amazonaws.com/dev/predict  [POST]

#### Summary

This was the third year for Social Street Smart. Building upon the work done in the previous year, this year's GSoC tasks were aimed to improve user experience and personalisation.

Here is a quick summary of the work done over the summer:

- :construction_worker: A CI / CD Pipeline has been added with
  - :white_check_mark: Unit Tests for all Newly Created APIs and the Chrome Extension
  - 🚀 Deployment through the GitLab Pipeline
- :truck: Reimplemented the *Fake News API* ​to make it more scalable.
- :sparkles: New Features -
	-  *Google Fact Checker API*.
	-  *Report Posts as Fake/Toxic*.
	-  *Hide/Unhide Reported Posts*.
- :bento: Addition of a new front-end where ever needed
- :bug: Fixing bugs 
- :rocket: Deployed the Updated Chrome Extension to the Chrome Webstore.

#### [NEW] Auto Hide/ Unhide Flagged Posts

During the last deployment of the chrome extension, it only flagged posts as toxic or clickbaits, but it doesn’t automatically hide them. This year, to allow users a great and interactive experience, the auto-hiding/unhiding feature was introduced. This would reduce the chances of irrelevant posts, providing a smooth user experience.

#### [NEW] Report Posts as Fake/Toxic

ML models are prone to errors. We always need an enormous corpus to train them on. As of now, users cannot provide any feedback for the results produced by our model. But this will be the start of the user's interaction with our product. Users can report posts as Fake/Toxic. Users will have options to hide them, same as other flagged posts.


#### [NEW] Google Fact Checker 

The prevalence of fake news has increased with the rise of [social media](https://en.wikipedia.org/wiki/Social_media "Social media"), especially the [Facebook News Feed](https://en.wikipedia.org/wiki/Facebook_News_Feed "Facebook News Feed"). These posts can influence users, manipulating them for political or economic reasons.

I introduced the Google Fact Checker API this summer.  It enables the user to lookup for any text or link and gets related facts with their factuality ratings from different Fact-Checkers. Having a fact-checker handy could avoid the unnecessary hurdle of google search and cross verifying. 

This feature requires user's Google Search API Key, steps have been described in this report.

#### [NEW] More Scalable Fake News Detection API


Previously, the Fake News Detection API was based on stance detection, where stances of lots of posts were done. Since the news rapidly changes, hence to keep up to date, we needed to continuously add new data to our corpus. This resulted in a lot of storage usage. Another drawback was, the stances were calculated with every data point till we get to a conclusion since the amount of data was increasing exponentially, so was the time for a prediction.

To get rid of searching in a lot of posts, I have introduced a new way, through which we would perform stance detection on related data, which would increase efficiency and prediction time. 

#### Unit Testing [ For Newly Created Features ]

I have implemented Unit Testing into the project, making it much easier to ensure that all the APIs and the Chrome Extension are functioning properly. The tests run in GitLab's CI/CD Pipeline. For the APIs, Pytest was used to run the tests, and for the Chrome Extension, MochaJS and Puppeteer were used. 

#### [NEW] Deployments of Report Posts, Save FactChecks and Fake News APIs


All of the APIs have been hosted on AWS Lambda.  Lambda uses very few resources because it is *serverless*. This means that there is no 24x7 running server but rather a tiny instance that runs each time the API is called. This helps in saving resources and cutting the cost needed to keep the APIs live.

I used the Serverless Framework to deploy the APIs to Lambda. Serverless allows creating APIs as well as deploying existing APIs such as those made in Flask with simplicity. This also enables the APIs to access other Amazon Web Services such as the DynamoDB, an essential part of the Report API.  

As discussed in [Pranav's Blog](https://gitlab.com/aossie/social-street-smart/-/blob/gsoc-2020/Docs/GSoC/2020/PranavGoyanka.md "Pranav's Blog"), I have also faced a lot of issues while deploying the new Fake News API. Even though by eliminating the use of DynamoDB and additional API for data scraping, the API wasn't working due to various version mismatches and other reasons. I was able to cut down requirements to a great extent. Thanks to Pranav, I reused the previously compiled TFLite and was able to deploy the API quickly. To read more, check out [this](https://gitlab.com/aossie/social-street-smart/-/blob/gsoc-2020/Docs/GSoC/2020/PranavGoyanka.md) blog.

#### [NEW] Deployments through the pipeline

The GitLab CI/CD Pipeline can now not only test the APIs, but also deploy them to AWS Lambda.

#### Getting API Keys

##### Google Fact Checker

1. Go to <https://developers.google.com/custom-search/v1/introduction>
2. Click on `Get a Key`
3. Click on `Select or Create a new project`
4. Create a project called `FactCheckerSSS` (You can name it anything you want) and click `Next`
5. An API Key would be generated. Copy and it save it somewhere. You can input this key in the settings page of Social Street Smart's Chrome Extension.

Or you can open https://developers.google.com/custom-search/v1/introduction and follow this video guide https://youtu.be/hZP4H0Ox3Ik

To user Fact Checker API, you'll also have to enable it https://console.cloud.google.com/apis/library/factchecktools.googleapis.com?authuser=0&project=carbide-atlas-310504&pli=1


#### Running the APIs locally

##### Clickbait, Hate Speech, Report API and News Origin APIs

These can be run locally in the same way as they were before GSoC 2021. The steps are as follows

```bash
# cd to the directory of the API
cd /server/Click-Bait

# Install all the requirements
pip install -r requirements.txt

# Run the server
flask run
```
##### Disinformation in Images API

It can be run locally in the same way as it was before GSoC 2021. 
This API requires you to have a set of Google Cloud API Keys (see Getting API Keys for how to obtain them).

Running the Disinformation in Images API

```bash
cd /server/imageAPI
pip install -r requirements.txt
flask run
```

For making the API calls, please follow the following format

`localhost:5000/lookup/?creds=<YOUR_API_KEYS_HERE>&link=<LINK_OF_IMAGE_TO_LOOKUP>`

The API keys are to be encoded in base64 and passed as a string.



#### Deployment of the Newly Created APIs

The API Deployment steps follow the same pattern for each API

##### Prerequisites for deployment

Installing Serverless and other dependencies
```bash
npm install -g serverless
# Run this in each API's folder separately since these are not globally installed
npm install --save-dev serverless-wsgi serverless-python-requirements
```
Amazon Web Services Credentials
You also need AWS Credentials to Deploy and even run certain APIs locally. These are free to obtain. Follow the steps at   <https://www.serverless.com/framework/docs/providers/aws/guide/credentials/> to get them and set them up on your system.
Now your system should be ready to deploy all of the APIs.

##### Clickbait, Hate Speech, News Origin, Report APIs,  and Fake News APIs

NOTE: The Fake News API uses a build of TensorFlow Lite that has specially been compiled for Amazon Linux. Please do not remove it while deploying the API

```bash
# cd to the directory of the API
cd DirectoryName

# Deploy the API
sls deploy
```

#### Unit Testing

All the unit tests and deployment code for the pipeline can be found in `./.gitlab-ci.yml` in the root directory of each repository.

##### The APIs

Unit testing for the APIs was done using `pytest` . 

To run the tests locally

##### For the Clickbait, Hate Speech, News Origin, Report API or Disinformation in Images API

```bash
cd /server/<directory_of_the_API>
pip install -r requirements.txt
pytest
```


##### The Chrome Extension

Unit testing the Chrome Extension required headless Chrome and needed automation.

The automation was achieved using `puppeteer` 

`Xvfb` has been used for running headless Chrome in the pipeline. 

```bash
apt-get install xvfb
npm install
chmod +x ./test.sh
./test.sh 
```

#### Merge Requests

The following merge requests were made to the project during GSoC 2021.

##### Social Street Smart API Repository
- [!14 Combined PRs ReportAPI + Fake News API (Open)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/14)
- [!13 Upgraded to tensorflow2 (Open) ](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/13)

##### Social Street Smart Repository (Chrome Extension)

- [!92 GSoC 2021 Report - Harsh Mishra (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/92)
- [!91 Combined PRs for Rest of the opened issues (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/91)
- [!90 Combined PR- Report Functionality and Fact Checker (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/90)
- [!89 Integrated report functionality (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/89)
- [!88 added buttons and reset option (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/88)
- [!86 Updated functionality of settings page (Merged)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/86)
- [!85 Fixed lookup time for website info (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/85)
- [!84 Ported client side API calls from sync to async (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/84)
- [!83 Added test for Facebook HateSpeech (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/83)
- [!82 Updated support for facebook (Merged)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/82)
- [!81 Added support for twitter (Merged)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/81)

