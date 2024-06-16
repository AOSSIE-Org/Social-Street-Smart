<h1 align="center">Google Summer of Code 2022 <img src="https://media2.giphy.com/media/KB8MHRUq55wjXVwWyl/source.gif" width="50"></h1>

<p align="center"><i>A full report on my Google Summer of Code 2022 work with Aossie</i></p>
<p align="center"><i>Project: "Social Street Smart" </i>  👨‍💻</p>



<p align="center">
  <img src="https://i.imgur.com/fF5RFGo.png" />
</p>

### GSoC 2022 Report: Social Street Smart


#### Summary

This was the fourth year for Social Street Smart. Building upon the work done in the previous year, this year's GSoC tasks were aimed to safeguard users from Malicious URLs and improve their experience. 

Here is a quick summary of the work done over this year:

- :construction_worker: A CI / CD Pipeline has been added with
  - :white_check_mark: Unit Tests for all Newly Created APIs 
  - 🚀 Deployment through the GitLab Pipeline
- :sparkles: New Features -
	-  *Security Header Checker API*.
	-  *SSL Validator API*.
- :bento: Addition of a new front-end where ever needed
- :bug: Fixing bugs 
- :rocket: Deployed the Updated Chrome Extension to the Chrome Webstore.

#### [NEW] Security Header Checker 

Cyberattack incidences have increased significantly as a result of the Internet's connections expanding exponentially. A significant number of links on today's social media platforms are malicious. So to safeguard users from those, I introduced the Security Header Checker API this summer.  It enables the user to lookup for any link and get information about browsing status of that link. A header checker would be beneficial in making sure that our users are as secure as possible from those malicious links.

#### [NEW] SSL Validator 

In today's world of the Internet, SSL certificates help keep user data secure,
prevent attackers from creating a fake version of the site, verify ownership of the website and provide consumers a sense of security. So I introduced the SSL Validator API this summer. It enables the user to lookup for any link and get information about SSL certificates of that link.

#### Unit Testing [ For Newly Created Features ]

I have implemented Unit Testing into the project, that makes it much easier to validate that all the APIs are functioning properly. The tests run in GitLab's CI/CD Pipeline. Pytest was used to run the tests for the APIs.



#### Running the APIs locally

##### SSL Validator API

This can be run locally in the same way as they were before GSoC 2022. The steps are as follows

```bash
# Go to the directory of the API
cd /server/Security-Headers

# Install all the requirements
pip install -r requirements.txt

# Run the server
flask run
```
##### Security Header API

This can also be run locally in the same way as they were before GSoC 2022. The steps are as follows 

```bash
# Go to the directory of the API
cd /server/SSL

# Install all the requirements
pip install -r requirements.txt

# Run the server
flask run
```

For making the API calls, please follow the following format

```bash
For SSL Validator API
`localhost:5000/ssl/?url=<LINK_FOR_LOOKUP>`

For Security Header API
`localhost:5000/shc/?url=<LINK_FOR_LOOKUP>`
```

The API keys are to be encoded in base64 and passed as a string.

##### Unit Testing the APIs

Unit testing for the APIs was done using `pytest` . 
To run the tests locally

##### For SSL Validator and Security Headers API

```bash
cd /server/<directory_of_the_API>
pip install -r requirements.txt
pytest
```

#### Project Links
- [Download the Extension (Chrome Webstore)](<https://chrome.google.com/webstore/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en-GB&authuser=0>)
- [Chrome Extension Repository](https://gitlab.com/aossie/social-street-smart)
- [All API's Repository](https://gitlab.com/aossie/social-street-smart-api)


#### Issues 
- [SSS-Phase 1](https://gitlab.com/aossie/social-street-smart/-/issues/?sort=updated_desc&state=opened&label_name%5B%5D=GSoC%202022%20Coding%20Phase%201&first_page_size=20)
- [SSS -Phase 2](https://gitlab.com/aossie/social-street-smart/-/issues/?sort=updated_desc&state=opened&label_name%5B%5D=GSoC%202022%20Coding%20Phase%202&first_page_size=20)
- [SSS API - Phase 1 ](https://gitlab.com/aossie/social-street-smart-api/-/issues/?sort=updated_desc&state=opened&label_name%5B%5D=GSoC%202022%20Coding%20Phase%201&first_page_size=20)


#### Merge Requests

The following merge requests were made to the project during GSoC 2022.


##### Social Street Smart API Repository
- [!16 Combined PRs for SSL Validator and Security Header Checker API (Merged)](https://gitlab.com/aossie/social-street-smart-api/-/merge_requests/16)

##### Social Street Smart Repository (Chrome Extension)
- [!94 Added new UI for Settings Page (Merged)](https://gitlab.com/aossie/social-street-smart/-/merge_requests/94)
- [!64 SSL Certificate Validator Support (Open)](https://gitlab.com/aossie/social-street-smart/-/issues/64)
- [!65 Security Header Checker Support (Open)](https://gitlab.com/aossie/social-street-smart/-/issues/65)
- [!61 SSL Certificate Validator API -Integration and Tests (Merged)](https://gitlab.com/aossie/social-street-smart/-/issues/61)
- [!62 Security Header Checker API -New API and Deployment (Merged)](https://gitlab.com/aossie/social-street-smart/-/issues/62)
- [!60 SSL Certificate Validator API -New API and Deployment (Merged)](https://gitlab.com/aossie/social-street-smart/-/issues/60)
- [!63 Security Header Checker API -Integration and Tests (Merged)](https://gitlab.com/aossie/social-street-smart/-/issues/63)