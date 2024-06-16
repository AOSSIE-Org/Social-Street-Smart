<h1 align="center">Google Summer of Code 2023 </h1>

<p align="center"><i>A full report on my Google Summer of Code 2023 work with AOSSIE</i></p>
<p align="center"><i>Project: "Social Street Smart" </i>  👨‍💻</p>



<p align="center">
  <img src="https://i.imgur.com/fF5RFGo.png" />
</p>

### GSoC 2023 Report: Social Street Smart

#### Motive for the project

With the advent of Internet, the problems faced by the people have also grown. These include abusive languages, fake news articles, click-baits, malicious websites and security attacks. Fake news has become increasingly prevalent over the last few years. Fake news's adverse effect can be seen more and more as people’s reach to social media and to the internet is been increasing.

#### Summary

This was the fifth year for Social Street Smart. Building upon the work done in the previous year, this year's GSoC tasks were aimed to integrate the extension with GPT-3 and implement a rating mechanism for websites to improve their experience. 

Here is a quick summary of the work done over this year:

- :construction_worker: A CI / CD Pipeline has been added with
  - :white_check_mark: Unit Tests for all Newly Created APIs 
  - 🚀 Deployment through the GitLab Pipeline
- :sparkles: New Features -
	-  *OpenAI GPT-3 API*.
	-  *Rating mechanism for website*.
- :bento: Addition of a new front-end where ever needed
- :bug: Fixing bugs 
- :rocket: Deployed the Updated Chrome Extension to the Chrome Webstore.

#### [NEW] Integration of GPT-3 

The integration of the OpenAI GPT-3 API provides users with a powerful tool to gain deeper insights into specific news articles they wish to verify. To access this functionality, users are required to input their unique API key in the settings page of the Chrome extension. The API key is securely stored in the local storage of the Chrome browser and serves as the input for generating prompts for the GPT-3 model.

Once the API key is set up, users can generate up to 30 prompts using their authorized API key.The generated responses are displayed to the user, offering valuable insights and analysis regarding the news article in question. 



#### Unit Testing [ For Newly Created Features ]

I have implemented Unit Testing into the project, that makes it much easier to validate that all the APIs are functioning properly. The tests run in GitLab's CI/CD Pipeline. Unittest was used to run the tests for the APIs.



#### Running the APIs locally

##### GPT3 API

This can be run locally in the same way as they were before GSoC 2023. The steps are as follows

```bash
# Go to the directory of the API
cd /server/Context Analysis

# Install all the requirements
pip install -r requirements.txt

# Run the server
flask run
```
#### How to Get OpenAI API Key

To access the OpenAI API and use services like GPT-3, you need to obtain an API key. Here's how you can get one:

1. Open your web browser and visit the [OpenAI website](https://openai.com/).

2. Sign in to your OpenAI account or create a new account if you don't have one.

3. Once logged in, navigate to the API section or developer portal.

4. Look for the option to "Generate API Key" or something similar.

5. Click on the button to generate a new API key.

6. Follow any additional prompts or instructions provided by the OpenAI platform.

7. Your API key should be generated and displayed on the screen.

**Important**: Treat your API key as sensitive information, similar to a password. Do not share it publicly or in unencrypted formats, as it grants access to your OpenAI account and services.


##### Unit Testing the APIs

Unit testing for the APIs was done using `unittest` . 
To run the tests locally

```bash
cd /server/<directory_of_the_API>
pip install -r requirements.txt
python -m unittest test_file.py
```

#### [NEW] Implementation of Rating Mechanism
The rating mechanism empowers users to provide credibility ratings for websites they visit. These ratings are collected and combined to generate a credibility score for each website. By utilizing this system, users gain valuable insights into the reliability of the sources they encounter during their browsing activities. This information enables users to make more informed decisions about the credibility of the content they consume and the websites they trust. The aggregation of user ratings helps create a collective understanding of website trustworthiness

#### [NEW] Upgradation of Manifest to Version 3
Manifest version 2 (MV2) and Manifest version 3 (MV3) are two versions for Chrome extensions. MV3 aims to make extensions safer and more private for users. MV3 uses event-driven scripts instead of always-on background pages, saving resources. It also offers tighter control over permissions, so extensions can't easily misuse them. MV3 has separate environments for content scripts, making data more secure. Also, MV3 prefers the declarativeNetRequest API over the old 'blocking' webRequest API. This change means extensions see less of a user's data, making browsing safer. 

### API Endpoints (Serverless Deployment on AWS Lambda)
Using Serverless, Flask APIs are deployed to AWS Lambda, ensuring scalability without the need for server maintenance.

- Report API : (<https://vsvpgs5rl3.execute-api.us-east-2.amazonaws.com/dev/{proxy+}>)
- SSL API :
  	- ANY : (<https://q4ri22coa3.execute-api.us-east-1.amazonaws.com/dev/>)
  	- POST : (<https://q4ri22coa3.execute-api.us-east-1.amazonaws.com/dev/ssl>)
- Security Header API :
  	- GET : (<https://8ynkqfv6qk.execute-api.us-east-1.amazonaws.com/dev/>)
  	- POST : (<https://8ynkqfv6qk.execute-api.us-east-1.amazonaws.com/dev/shc>)
- Hate Speech API :
	- ANY : (<https://v7ss9zc1l7.execute-api.us-east-1.amazonaws.com/dev>)
   	- ANY : (<https://v7ss9zc1l7.execute-api.us-east-1.amazonaws.com/dev/{proxy+}>)
- Disinformation in Images API (ImageAPI) :
  	- ANY : (<https://39rpx1thbf.execute-api.us-east-1.amazonaws.com/dev>)
  	- ANY : (<https://39rpx1thbf.execute-api.us-east-1.amazonaws.com/dev/{proxy+}>)

- Context Analysis API (GPT-3 API) :
  	- ANY : (<https://gy0sdopqv5.execute-api.us-east-1.amazonaws.com/dev>)
  	- ANY : (<https://gy0sdopqv5.execute-api.us-east-1.amazonaws.com/dev/{proxy+}>)

- Click Bait API :
  	- ANY : (<https://gpx2itno4d.execute-api.us-east-1.amazonaws.com/dev>)
  	- ANY : (<https://gpx2itno4d.execute-api.us-east-1.amazonaws.com/dev/{proxy+}>)

- Fake News API :
  	- ANY : (<https://tmi1r2xgxa.execute-api.us-east-2.amazonaws.com/dev>)
  	- ANY : (<https://tmi1r2xgxa.execute-api.us-east-2.amazonaws.com/dev/{proxy+}>)

  
  

#### Project Links
- [Download the Extension (Chrome Webstore)](<https://chrome.google.com/webstore/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en-GB&authuser=0>)
- [Social Street Smart Chrome Extension Repository](https://gitlab.com/aossie/social-street-smart)
- [Social Street Smart API Repository](https://gitlab.com/aossie/social-street-smart-api)





#### Merge Requests

The following merge requests were made to the project during GSoC 2023.


##### Social Street Smart API Repository
- [!19 Addition of GPT-3 API to the API repository](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/19)

##### Social Street Smart Repository (Chrome Extension)
- [!111 Combined PR for Addition of Rating Mechanism, GPT-3 functionality, and Upgradation of Gulp Version](https://gitlab.com/aossie/social-street-smart/-/merge_requests/111)
  - [Rating and GPT-3 Functionality Added](https://gitlab.com/aossie/social-street-smart/-/commit/20b64c7c54328525d5b0d720cece68467de1bd9b?merge_request_iid=111)
  - [Added UI for Context analysis](https://gitlab.com/aossie/social-street-smart/-/merge_requests/111/diffs?commit_id=4d2486b4c0fa77041bc5d0632348d7540a1ae2ec)
  - [Upgraded gulp to v4 and changed functional dependencies](https://gitlab.com/aossie/social-street-smart/-/merge_requests/111/diffs?commit_id=34fd45720e338f2ea443aa222580f5e7588421f0)
  - [Manifest version improved to V3](https://gitlab.com/aossie/social-street-smart/-/merge_requests/111/diffs?commit_id=37cb0bb272172489c5f54230150e814322e349ad)
  - [Added docs for future contributor reference](https://gitlab.com/aossie/social-street-smart/-/merge_requests/111/diffs?commit_id=e7f1d02f911c2c26bda59d6014308b9027a192e0)



### Future Scope
- Could enhance extension credibility by implementing a content filtering mechanism with AI-driven credibility scoring, user feedback loop, transparency, and educational resources.
