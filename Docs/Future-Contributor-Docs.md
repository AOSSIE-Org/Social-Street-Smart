# Social Street Smart - Technical Documentation

## Introduction 
The rise of the Internet has also birthed challenges such as abusive language, fake news, click-baits, and security threats. Fake news, in particular, can skew perceptions and influence major events like elections. Click-baits, with sensationalized headlines, waste users' time by not delivering promised content. Malicious websites pose security risks, targeting unsuspecting users. This project aims to develop a Chrome Extension to safeguard users, ensuring a more informed, productive, and safer online experience.

<p align="center">
  <img src="https://gitlab.com/uploads/-/system/project/avatar/2314503/AOSSIE_logo_04.png" width="300" height="300" />
</p>

## Project Overview

Social Street Smart is a Chrome extension addressing various online challenges:
- Abusive language and hate speech
- Fake news and misinformation
- Clickbait content
- Malicious websites and security threats
- Privacy concerns

## Tech Stack

### Frontend
- JavaScript/TypeScript
- React
- Chrome Extension APIs
- Node.js and npm

### Backend
- Python
- Flask REST APIs
- PostgreSQL Database
- Flask-SQLAlchemy
- Docker and Docker Compose
- AWS Lambda (Serverless)

### Machine Learning
- Natural Language Processing (NLP)
- Neural Networks (NN)
- Recurrent Neural Networks (RNN)
- Support Vector Machines (SVM)
- Word and Sentence Embeddings
- Feature Engineering
- LLMs (Large Language Models) Integration

## Project Resources

- Main Repository: [Social Street Smart](https://github.com/AOSSIE/Social-Street-Smart)
- Chrome Web Store: [Extension Link](https://chrome.google.com/webstore/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm)
- Docker Hub: [https://hub.docker.com/repository/docker/vishav9933](https://hub.docker.com/repository/docker/vishav9933)

## API Documentation

### Fake News API

**Divided into two parts:**

**Frontend/ Chrome extension part:** Regular struct like all other chrome extensions. content scripts facebook.js, twitter.js, newsWeb.js, scraps news post and send it to server-side for its verification.

**Backend/ Server-side:**

**Fake News/ML:** consist of all py script to do text-processing, generate embedding, generate hand feature and model weight for ML model. Jupyter notebook on trained model is also attached within this repo.

**Fake News/News_Scrapper:** scripts to scrap news and authentic news from two websites on a regular interval with help of News-please API.

**Fake News/ DB:** contain Postgres DB table definition to store news.

**Fake News/ Cache:** definition of Cache table to store the result from various source so that we don't need to call ML model always for the same post.

**Fake News/ application.py:** main Flask APP which handles post request, Scheduled scrapping of news, etc.

**Fake News/ API_manager.py:** app manager to handle DB migration and hosting.

<p align="center">
  <img src="https://lh3.googleusercontent.com/WpVNZgHSiAVrU-DV1qfUU0rL5YFe_ibyfEG5oFpmqPHfkJ5xpnnuuXU6d_OqQZxTr2F-laJdyA4NLPZLnvBX5Cq6Dg=w640-h400-e365-rj-sc0x00ffffff" height="300" />
</p>

### News Origin API

**Profanity Word Blur**
This functionality searches for the profanity words on the webpage and if found they are blurred.

**Objectionable website alert**
When the user visits a News website it displays a chrome notification containing information like bias/ownership of the webiste.

**Marking Clickbaits on Social media sites**
This functionality checks if the links shared on Twitter, Facebook and Youtube are clickbait and if they are the Chrome Extension marks them as clickbait.

**Probable News Origin**
Using this functionality one can find the probable origin of a viral news piece or a rumour. Select a piece of text right click and select Get probable Origin option and soon a chrome notification showing the probable News Origin would be displayed. This can't always tell the source of the news with 100% accuracy but it definitely shows what type of websites are publishing news similar to it. For example for a satire news piece you are likely to get sites like Reddit and Onion as output but not no nonsense sites like Guardian and C-Span.

The News Origin API would perform better if the user has their own set of API keys. To do so, follow these steps:

- Go to https://developers.google.com/custom-search/v1/introduction

- Click on Get a Key

- Click on Select or Create a new project

- Create a project called NewsOriginAPI (You can name it anything you want) and click Next

- An API Key would be generated. Copy and it save it somewhere. You can input this key in the settings page of Social Street Smart's Chrome Extension.

Or you can open https://developers.google.com/custom-search/v1/introduction and follow this video guide https://youtu.be/hZP4H0Ox3Ik

### Disinformation in Images API

The tool allows users to search the web for any image's usage. It provides data on where the image appears online. Utilizing an open-source corpus, it assesses the website's factual reliability. This determines the trustworthiness of the image's use. Users can verify if a source is credible based on its image use.

The Disinformation in Images API requires you to generate a set of custom API keys for yourself.
- Please follow these steps to obtain a JSON file containing your API keys: https://youtu.be/1Oz5TfwvhfQ.
- You can then input this JSON file on the settings page of Social Street Smart's Chrome Extension.

### SSL Validator API
In our modern digital age, the Internet is rife with potential threats and cyber-attacks. SSL certificates serve as a digital shield, ensuring the safe transmission of user data over the web. More than just data protection, they thwart malicious actors from replicating or 'spoofing' genuine websites. Moreover, these certificates authenticate and confirm the legitimacy of website ownership, providing an additional layer of trust. Recognizing the importance of such verification, I launched the SSL Validator API this summer. This tool empowers users by allowing them to input any web link, subsequently retrieving detailed information about its associated SSL certificate, fostering confidence in online interactions.

More information can be found here: (<https://gitlab.com/aossie/social-street-smart/-/blob/gsoc-2023/Docs/GSoC/2022/DivyanshuSingh.md?ref_type=heads>)

### Security Header API

The digital revolution, characterized by the rapid expansion of Internet connections, has brought countless benefits to modern society. However, it has also paved the way for an alarming surge in cyberattack incidents. As people navigate the vast landscape of the web, especially on social media platforms, they are often unknowingly exposed to a plethora of malicious links. These deceitful links can compromise personal data, inflict malware, or even engage in phishing activities.

Recognizing this pressing concern, the Security Header Checker API was introduced this summer. Its primary function is to provide users with a quick and efficient tool to inspect any link's browsing status. By inputting a link, users are instantly informed about its safety credentials. The API essentially evaluates the header of the web link to discern its legitimacy and potential risks. Such a header checker is invaluable in today's cyber landscape, acting as a digital guardian for users.

### Report API
Machine Learning (ML) models, while powerful and increasingly sophisticated, are not infallible. Their accuracy and reliability heavily depend on the quality and size of the training data provided to them. A vast and diverse dataset is crucial for these models to learn and make accurate predictions. Up until this point, there has been a noticeable gap in our system: the inability for users to give feedback on the model's outcomes.

Addressing this, we're excited to usher in a new era of user engagement with our product. Users now have the capability to critically assess the content they encounter. If they come across any posts they deem as Fake or Toxic, they can actively report them. This not only provides valuable feedback to refine and enhance our ML model but also empowers users to curate their digital environment.

Once flagged, the system will treat these posts like other reported content. Users will see options to hide the flagged posts, ensuring that their browsing experience remains unhindered and aligns with their preferences. This interactive feature not only enriches the user experience but also paves the way for continuous improvement of our ML systems.

#### Auto Hide/ Unhide Flagged Posts

In the previous deployment of our Chrome extension, the tool could identify and label posts deemed as toxic or clickbaits. However, it merely flagged them without taking the further step of concealing them from users. Recognizing the potential for enhancing user experience, this year brought about an important upgrade: the auto-hiding/unhiding feature. Instead of users manually hiding flagged content, the extension now automatically does this for them. If a post is identified as potentially harmful or misleading, it is immediately hidden, though users retain the power to unhide if they choose. The result of this feature is a more streamlined and relevant browsing experience, minimizing distractions and ensuring that users encounter only content that aligns with their preferences and values.

More information can be found here: (<https://gitlab.com/aossie/social-street-smart/-/blob/gsoc-2023/Docs/GSoC/2021/HarshMishra.md?ref_type=heads>)

#### Google Fact Checker Functionality

In the previous deployment of our Chrome extension, the tool could identify and label posts deemed as toxic or clickbaits. However, it merely flagged them without taking the further step of concealing them from users. Recognizing the potential for enhancing user experience, this year brought about an important upgrade: the auto-hiding/unhiding feature. Instead of users manually hiding flagged content, the extension now automatically does this for them. If a post is identified as potentially harmful or misleading, it is immediately hidden, though users retain the power to unhide if they choose. The result of this feature is a more streamlined and relevant browsing experience, minimizing distractions and ensuring that users encounter only content that aligns with their preferences and values.

### Context Analysis API

The incorporation of the OpenAI GPT-3 API into the platform has opened a new frontier for users seeking to validate the authenticity and content of news articles. This fusion of technology provides users with the capability to delve deeper, ensuring that they have accurate and unbiased information at their fingertips.

To harness this feature, there's an initial step users must undertake: inputting their exclusive API key. This is done through the settings page of the Chrome extension, a straightforward process designed for user ease. Once entered, rest assured, this key is safeguarded with utmost priority, stored securely within the local confines of the Chrome browser.

With the key in place, the gateway to generating prompts for the GPT-3 model is unlocked. Each user, with their authenticated API key, has the capacity to generate as many as 30 prompts. What follows is the brilliance of AI: the GPT-3 model processes the prompts and outputs in-depth responses. These responses, exhibited to the users, are not just mere information. They serve as profound insights and critical analyses, shedding light on the nuances and veracity of the selected news article, thus aiding in informed decision-making.

More information can be found here: (<https://gist.github.com/harish2773/12df5134b39593966845ceab8860eb37>)

### Click Bait API

The digital realm, especially platforms like Twitter, Facebook, and YouTube, is replete with content vying for user attention. Amidst this vast ocean of information, a notable challenge is discerning genuine content from clickbait. Addressing this issue is the newly introduced functionality for a Chrome extension. Its primary objective is to scrutinize shared links across these platforms, evaluating them for clickbait characteristics. If a link is determined to be clickbait, the extension leaps into action, distinctly marking it as such. Users, therefore, receive a clear warning before engaging, fostering a more informed and clutter-free browsing experience. This feature not only ensures user protection from misleading content but also promotes a more genuine digital ecosystem.

#### Profanity Words Blur
In the vast expanse of the internet, users often encounter content that may not be appropriate or preferred for all audiences. Addressing this challenge is the latest functionality designed for web browsers. This feature diligently scans web pages for words deemed as profanities. Leveraging a comprehensive database of potentially offensive terms, the system assesses the content in real-time. If any such terms are identified, the functionality takes immediate action. Instead of outright removal, it subtly blurs these words, ensuring the surrounding content remains coherent. This not only ensures a comfortable browsing experience for users but also gives them the choice to view content based on their comfort level, promoting a safer and more user-centric digital space.

#### Objectionable website alert
Upon visiting a news website, users immediately receive a Chrome notification. This alert provides vital details about the site, including its potential bias and ownership. Such features enhance transparency and empower users to better understand the source of their information, ensuring a more informed and discerning browsing experience.

More information can be founf here: (<https://gitlab.com/aossie/social-street-smart/-/blob/gsoc-2023/Docs/GSoC/2019/GSoC-'19_Utsav%20Shukla.md?ref_type=heads>)

### Summarizer API
The Summarizer API provides concise summaries of lengthy articles and content. It uses advanced NLP techniques to:
- Extract key information from long texts
- Generate coherent summaries while maintaining context
- Support multiple languages
- Handle different content types (news articles, blog posts, etc.)

The API uses a combination of extractive and abstractive summarization techniques to provide accurate and readable summaries.

### Text Similarity Detection
This feature helps identify content duplicity and potential plagiarism by:
- Computing semantic similarity between texts
- Using word embeddings for comparison
- Identifying similar content across different sources
- Highlighting potential content repurposing

### Real-time Content Analysis
Real-time analysis of web content provides:
- Instant feedback on content credibility
- Live monitoring of webpage changes
- Dynamic content filtering
- Automated threat detection

### Content Category Classification
This feature automatically categorizes content into:
- News
- Opinion/Editorial
- Satire
- Advertisement
- Academic/Research
- Social Media Posts

### Privacy Protection Features
Enhanced privacy protection through:
- Tracker blocking
- Cookie consent management
- Data collection monitoring
- Privacy policy analysis

### Website Reputation System
Comprehensive website evaluation based on:
- Historical credibility
- User reports
- Security certificates
- Content quality metrics
- External reputation databases

### Report API
Machine Learning (ML) models, while powerful and increasingly sophisticated, are not infallible.
- Report Fake News
- Report Hate Speech

## Development Setup

### Required Data and Models

1. Fake News Model Setup:
   - Download datasets from [AOSSIE Fake News Detection Datasets](https://www.kaggle.com/ad6398/aossie-fake-news-detection-datasets)
   - Place files in `server/fakeNewsAPI/ML/` and `server/fakeNews/predictions/ML/`
   - Download GloVe embeddings from [Stanford NLP](https://nlp.stanford.edu/projects/glove/)

2. Click-Bait Model:
   - Download dataset from [AOSSIE Click-Bait Dataset](https://www.kaggle.com/ad6398/aossie-click-bait-dataset)
   - Place files in `ML/clickbait/`

3. Hate Speech Model:
   - Download GloVe embeddings from [Stanford NLP](https://nlp.stanford.edu/data/glove.6B.zip)
   - Download Toxic Comment dataset from [Kaggle](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data)

4. API Credentials:
   - Google Custom Search API key for News Origin
   - Google Cloud Vision API credentials for Image Analysis
   - OpenAI API key for Context Analysis

### Running the Services

```bash
# Build and start all services
cd server
docker compose up --build

# Individual service setup (development)
cd server/[service-name]
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

## Serverless Deployment Guide

For deploying new APIs using AWS Lambda and Serverless Framework:

1. Install Serverless Framework:
   ```bash
   npm install -g serverless
   ```

2. Configure AWS and Supabase credentials:
   ```bash
   serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET
   ```

3. Deploy service:
   ```bash
   serverless deploy
   ```

More details: [Flask Serverless API Guide](https://www.serverless.com/blog/flask-serverless-api-in-aws-lambda-the-easy-way)





