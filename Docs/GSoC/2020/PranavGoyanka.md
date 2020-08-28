# GSoC 2020 Report: Social Street Smart

### *By Pranav Goyanka* 

[Chrome Extension Repository](https://gitlab.com/aossie/social-street-smart)

[All API's Repository](https://gitlab.com/aossie/social-street-smart-api)

[Download the Extension (Chrome Webstore)](<https://chrome.google.com/webstore/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en-GB&authuser=0>)



#### New API Endpoints

- Clickbait API :  https://17u8uun009.execute-api.us-east-1.amazonaws.com/dev/pred?text=
- Hate Speech API : https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=
- News Origin API :  https://phcg4hgf84.execute-api.us-east-1.amazonaws.com/dev/pred?text=
- Fake News API : https://59rfocmnrd.execute-api.us-east-1.amazonaws.com/dev/predict
- News Scrapper (View Scrapped Data) : https://0nb874owq6.execute-api.us-east-1.amazonaws.com/dev/fakenews/show
- News Scrapper (Get News Data) : https://0nb874owq6.execute-api.us-east-1.amazonaws.com/dev/fakenews/getNews/<url_of_news_article_ins_base64>
- Disinformation in Images API (New) : https://j9sgfnzwo8.execute-api.us-east-1.amazonaws.com/dev/lookup/?creds=<CREDS>&link=<URL_OR_IMAGE>



#### Summary

This was the second year for Social Street Smart. Building upon the work done in the previous year, this year's GSoC tasks were aimed to make the project production ready. 

Here is a quick summary of the work done over the summer:

- :construction_worker: A CI / CD Pipeline has been added with
  - :white_check_mark: Unit Tests for all APIs and the Chrome Extension
  - 🚀 Deployment through the GitLab Pipeline
- :truck: Reimplemented the 'Fake News API' ​as two separate modules for making it deployment ready
- :sparkles: Addition of the 'Disinformation in Images API'
- :whale: Used Docker to compiled TFLite and Google Cloud API packages for Amazon Linux ​ 
- :bento: Addition of a new front-end whereever needed
- :bug: Fixing bugs 
- :rocket: Deployed the Chrome Extension to the Chrome Webstore



#### [NEW] Unit Testing 

I have implemented Unit Testing into the project, making it much easier to ensure that all the APIs and the Chrome Extension are functioning properly. The tests run in GitLab's CI/CD Pipeline. For the APIs, Pytest was used to run the tests and for the Chrome Extension, MochaJS and Puppeteer were used. 



One major problem that I came across was that testing the Chrome Extension required rendering actual Google Chrome on a display and automating it. This was not possible inside a pipeline, but with the help of `Xbfv`, a headless version of Chrome could be run inside the pipeline. This made the extension testing possible.



#### [NEW] Deployments of all APIs

All of the APIs, as discussed in the GSoC proposal, have been hosted on AWS Lambda by me.  Lambda uses very little resources because it is 'serverless'. This means that there is no 24x7 running server, but rather a small instance that runs each time the API is called. This helps in saving resources and cutting the cost needed to keep the APIs live.



I used the Serverless Framework to deploy the APIs to Lambda. Serverless allows creating APIs as well as deploying existing APIs such as those made in Flask with simplicity. This also allows the APIs to access other Amazon Web Services such as the DynamoDB, which is an essential part of the Fake News API.  



One major problem I faced during deployment was that AWS Lambda limits the project size to 256 MB. This includes the code for the API as well as the dependencies that it needs to run. Therefore, I had to strip down many of the dependencies being used in the APIs to meet this size limit. The Fake News API was the most challenging one to deploy. Even after splitting it up into two separate APIs, I was not able to meet the size requirements, because it uses TensorFlow, which is a heavy library. Luckily, Google has released TFLite, a compact and light weight version of TensorFlow. I converted the existing model to a TFLite model and now the size of the entire project was well under 256 MB. But then I faced another challenge. TFLite compiled on my Ubuntu machine won't work on Amazon Linux. Luckily, a Docker Container running Amazon Linux was able to solve this problem by allowing to me compile TFLite on it and using it for deployment. The News Scarping part of the Fake News API has been deployed as a separate API endpoint.



#### [NEW] Disinformation in Images API

I introduced the Disinformation in Images API (DII) this summer.  It enables the user to lookup any image on the web and get results about where that image has been used on the internet. It also uses an open source corpus to provide data about the factual reliability of the website that has used the said image. This allows for checking if these sources can be trusted with their use of the image. 



During the implementation of this API, I was faced with a problem. The Google Cloud API Python Packages that my API relied upon, did not work with Amazon Linux. Hence deploying the API as it is, on AWS Lambda, did not work. I decided to use a Docker Image based on Amazon Linux to build the Google Cloud API packages on the correct environment and copied them over to my computer. I then zipped all these dependencies that I got from the Docker container and used a Shell Script to unzip these dependencies, deploy the API and then delete the unzipped files. This helps in keeping the Git Repository clean.



#### [NEW] Frontend for Disinformation in Images API and Fake News API

I developed a new front end for the DII and Fake News APIs. It is a simple popup that is launched once the API's result has been received by the Chrome Extension. It shows the results by taking the result and API names as a parameter in its URL, and then using JavaScript to render the results on the page.



#### [NEW] Support for Custom API Keys in the News Origin and Disinformation in Images APIs

In the News Origin API, I have introduced support for custom API keys that the user wishes to use. These can be set on the Settings page of Social Street Smart's Chrome Extension. These are stored locally on the user's machine and are never shared with anyone. This was implemented by passing the API keys in the API's call. If no keys are passed, then the API defaults to a predefined set of keys. 

I have also introduced  similar support in DII API by using the same features while implementing the DII API.



#### [NEW] Deployments through the pipeline

The GitLab CI/CD Pipeline can now not only test the APIs, but also deploy them to AWS Lambda.



#### Getting API Keys

##### Disinformation in Images API

The Disinformation in Images API requires you to generate a set of custom API keys for yourself.

Please follow these steps to obtain a JSON file containing your API keys: https://youtu.be/1Oz5TfwvhfQ.

You can then input this JSON file on the settings page of Social Street Smart's Chrome Extension.

##### News Origin API

The News Origin API would perform better if the user has their own set of API keys. To do so, follow these steps:

1. Go to <https://developers.google.com/custom-search/v1/introduction>
2. Click on `Get a Key`
3. Click on `Select or Create a new project`
4. Create a project called `NewsOriginAPI` (You can name it anything you want) and click `Next`
5. An API Key would be generated. Copy and it save it somewhere. You can input this key in the settings page of Social Street Smart's Chrome Extension.

Or you can open https://developers.google.com/custom-search/v1/introduction and follow this video guide https://youtu.be/hZP4H0Ox3Ik



#### Running the APIs locally

##### Clickbait, Hate Speech and News Origin APIs

These can be run locally in the same way as they were before GSoC 2020. The steps are as follows

```bash
# cd to the directory of the API
cd /server/Click-Bait

# Install all the requirements
pip install -r requirements.txt

# Run the server
flask run
```



##### Fake News API

The Fake News API is now broken into two parts, one for predictions and one for scrapping news.

Running the News Scrapper

```bash
cd /server/fakeNews/newsScapper
pip install -r requirements.txt
# Please follow the prerequisites in the deployment section to run this API
npm install -g serverless
npm install --save-dev serverless-wsgi serverless-python-requirements
sls wsgi-serve
```

Running the Predictions API

```bash
cd /server/fakeNews/predictions
pip install -r requirements.txt
npm install -g serverless
npm install --save-dev serverless-wsgi serverless-python-requirements
sls wsgi-serve
```



##### Disinformation in Images API

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



#### Deployment of the APIs

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



##### Clickbait, Hate Speech, News Origin and Fake News APIs

NOTE: The Fake News API uses a build of TensorFlow Lite that has specially been compiled for Amazon Linux. Please do not remove it while deploying the API

```bash
# cd to the directory of the API
cd /server/Click-Bait

# Deploy the API
sls deploy
```



##### Disinformation in Images API

This API used the Google Cloud API packages for Python. These, just like Tensorflow Lite, do not work on Amazon Linux unless a build compiled specifically for it is deployed.  These packages are available in an archive names `awsPackages.zip`.  Please do not delete it. A script named `deploy.sh` unzips these packages, deploys the API and then deletes the extracted data. Hence, you don't have to manually use `sls deploy`.

```bash
cd /server/imageAPI

chmod +x ./deploy.sh
./deploy.sh
```



##### Compiling Python Packages for Amazon Linux

Amazon Linux seems to be architecturally different from other Linux distributions, causing some Python packages to not work unless they are built / installing on Amazon Linux natively. 

You can use the `Dockerfile` in the `tflite_for_amazon_linux` directory to compile any package for Amazon Linux yourself

```bash
docker build -t tflite_amazonlinux .
docker run -it --name=tflite_amazonlinux tflite_amazonlinux bash
```

Now you will have a bash prompt running inside a Docker Container.

Please refer to [this file](<https://gitlab.com/pranavgoyanka/social-street-smart-api/-/blob/diiAPI/tflite_build_for_amazonLinux/README.md>) for instructions to build `tflite`

For Python packages available on `PyPi`

```bash
pip install package_name
cd <directory where pip installs packages> #This could be a virtual env if you wish you make one
zip -r <package_name>.zip ./<package_name>
curl curl --upload-file <package_name>.zip https://transfer.sh/<anything_you_want>
```

Now, you can download the package from `https://transfer.sh/<anything_you_want>` and paste it in your working directory outside Docker.



#### Unit Testing

All the unit tests and deployment code for the pipeline can be found in `./.gitlab-ci.yml` in the root directory of each repository.

##### The APIs

Unit testing for the APIs was done using `pytest` . 

To run the tests locally

##### For the Clickbait, Hate Speech, News Origin or Disinformation in Images API

```bash
cd /server/<directory_of_the_API>
pip install -r requirements.txt
pytest
```

##### For the Fake News API

```bash
cd /server/fakeNews/predictions
pip install -r requirements.txt
npm install serverless-wsgi serverless-python-requirements
chmod +x ./slsbg.sh
./slsbg.sh
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

The following merge requests were made to the project during GSoC 2020.

##### Social Street Smart API Repository

- [!2 - CI Pipeline For the APIs (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/2)
- [!4 - Port Existing APIs to AWS Lambda (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/4)
- [!5 - Makes the Fake News API AWS Lambda ready and deploy it (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/5)
- [!6 - Tensorflow Lite for Amazon Linux (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/6)
- [!7 - Disinformation in Images API Backend (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/7)
- [!8 - News Origin Custom API Keys and DII API Deploy (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/8)
- [!9 - Fixes Tensorflow Lite Merge Request (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/9)
- [!10 - Phase 3: Bug Fixes and Pipeline Deploy (Open)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/10)

##### Social Street Smart Repository (Chrome Extension)

- [!72 - Pipeline testing for the Chrome extension (Merged)](<https://gitlab.com/aossie/social-street-smart/-/merge_requests/72>)

- [!73 - Adds UI and backend support for Disinformation in Images API (Open)](<https://gitlab.com/aossie/social-street-smart/-/merge_requests/73>)

- [!77 - Revert "Merge branch 'diiAPI' into 'master'" (Merged)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/77)

- [!78 - Adds UI and backend support for Disinformation in Images API (Open)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/78)

- [!74 - Custom Keys for News Origin API (Open)](<https://gitlab.com/aossie/social-street-smart/-/merge_requests/74>)

- [!76 - Bug fixes done in phase 3 (Open)](<https://gitlab.com/aossie/social-street-smart/-/merge_requests/76>)

  

  

   































