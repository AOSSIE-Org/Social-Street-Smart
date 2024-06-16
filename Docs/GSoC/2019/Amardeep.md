# GSoC'19: Social Street Smart (final report)
_**Amardeep Kumar**_

Gitlab Link: [AOSSIE: Social street Smart](https://gitlab.com/aossie/social-street-smart)

Live API end point: [http://13.233.115.232:8091/predict](http://13.233.115.232:8091/predict)


_**Quick Links**_

* [Motive for Project](https://gist.github.com/ad6398/2e0deeaf75c6990bca4821b4235bc716#motive-for-project)

* [Developer Manual](https://gist.github.com/ad6398/2e0deeaf75c6990bca4821b4235bc716#developer-manual)


* [Installation guide](https://gist.github.com/ad6398/2e0deeaf75c6990bca4821b4235bc716#installation-guide)


* [Work and PRs](https://gist.github.com/ad6398/2e0deeaf75c6990bca4821b4235bc716#work-and-prs)


* [Future work and improvement](https://gist.github.com/ad6398/2e0deeaf75c6990bca4821b4235bc716#future-work-and-improvement)


***

## Motive for Project 
With the advent of Internet, the problems faced by the people have also grown. These include abusive languages, fake news articles, click-baits, malicious websites and security attacks. Fake news has become increasingly prevalent over the last few years. Fake news's adverse effect can be seen more and more as people’s reach to social media and to the internet is been increasing. Fake news is not only creating communal hatred but also, polarizing general elections. 
Click-bait waste a lot of productive time of people. These headlines are written in a very catchy manner such that people are tempted to click these links and they don’t contain any relevant information, hence making it necessary to warn a user about click-bait. _The aim of this project is to develop a Chrome Extension to make Internet a safer and more productive service for the users._

## Developer Manual
These are mainly for fake news Part of project.
### Tech Stacks and skills used
* JavaScript, Chrome Extension Development(Node.js, Gulp packages, WebD)
* Python, Flask REST API, PostgreSQL Database, Flask-SQLAlchemy
* Good Hands on experience with Machine Learning and Natural Language Processing: NN, RNN, SVM, feature engineering, text processing, text similarity, Word and sentence Embeddings, etc.
* familiar with AWS instance and how to host API on it and universal port forwarding.

### Process flow Diagram
![gsoc19](https://user-images.githubusercontent.com/38162294/63384218-e7e72100-c38d-11e9-9a18-13e2775f813e.png)


### Modules
Divided into two parts:
1. **Frontend/ Chrome extension part**: Regular struct like all other chrome extensions. content scripts `facebook.js`, `twitter.js`, `newsWeb.js`, scraps news post and send it to server-side for its verification.
2. **Backend/ Server-side**:  
    * `Fake News/ML`: consist of all py script to do text-processing, generate embedding, generate hand feature and model weight for ML model. Jupyter notebook on trained model is also attached within this repo.
    * `Fake News/News_Scrapper`: scripts to scrap news and authentic news from two websites on a regular interval with help of News-please API.
    * `Fake News/ DB`: contain Postgres DB table definition to store news.
    * `Fake News/ Cache`: definition of Cache table to store the result from various source so that we don't need to call ML model always for the same post.
    * `Fake News/ application.py`: main Flask APP which handles post request, Scheduled scrapping of news, etc.
    * `Fake News/ API_manager.py` : app manager to handle DB migration and hosting. 

### Installation guide
Clone the repository :

  `git clone https://gitlab.com/aossie/social-street-smart.git`

_**for chrome extension**_
1. Install node.js, git

2. Change the directory :
    `cd social-street-smart/`

3. Install the dependencies :
     `npm install`

4. Build the extension :
     `gulp build`

_**for backend/ server**_

change directory to `server/Fake News/`

1. install and activate virtualenv


2. install all required libraries: 

     `pip install -r requirements.txt`

3. also install nltk files, open python terminal:

   ```
    1. import nltk
    2. nltk.download('punkt')
    3. nltk.download('wordnet')
    4. nltk.download('stopwords')
   ```


4. install postgres for DB and cache

   `sudo apt install postgresql postgresql-contrib`

5. create a db

    `sudo -u postgres createdb fakeNewsDB`

    if there is error and required to create user:

        ` sudo -u postgres createuser "usernameOfUrPC"`



6.  to install chrome driver for news web scrapping(if not installed already)

    `sudo apt-get install chromium-chromedriver`

     if there is path error:

     #Adding the path to the selenium line:

     `driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")`


      
7. to create all table and handle migration. Do this once
   
   ```
   python API_manager.py db init

   python API_manager.py db migrate

   python API_manager.py db upgrade
   ```

8. to test if data is committed to DB properly or not
   

   1. login to DB:

      `sudo -u postgres psql`

   2. open DB: list all tables present

      ` \c fakeNewsDB`

   3. to open a relation/table:

      `SELECT * FROM "table_name" `

9. API request struct for

   1. Facebook Request

      ![fb_req](https://user-images.githubusercontent.com/38162294/63384341-27ae0880-c38e-11e9-8f9f-4147dec4c190.png)



   2. Twitter Request

      ![twitter_req](https://user-images.githubusercontent.com/38162294/63384348-2b418f80-c38e-11e9-9404-8cdedfadebb3.png)


   3. web news Request

     
      ![webNews_req](https://user-images.githubusercontent.com/38162294/63384361-33013400-c38e-11e9-8408-1713509fbeda.png)

10. run `python API_manager.py runserver` to start API on a local machine

## Work and PRs
It was a great learning period for me in the summer of 2019. Learned a lot of things like writing Production level of code, readable code. Only writing code is not necessary, it should be readable as well as reproducible,  realized the value of developer as well as a user manual. All work as proposed was completed, relevant PR was sent timely and regularly. 


### List of PR during GSoC working period:
* [ MR 8 (merged) : created structured directory, Basic UI and Popup](https://gitlab.com/aossie/social-street-smart/merge_requests/8)

* [MR 10 (merged) : Data sets and trained ML model for ClickBait classifier](https://gitlab.com/aossie/social-street-smart/merge_requests/10)

* [MR 12(Merged): Fake news ML models](https://gitlab.com/aossie/social-street-smart/merge_requests/12)

* [MR 15 (open) : Fake news API](https://gitlab.com/aossie/social-street-smart/merge_requests/15)

* [MR 16 (open) :ML API on AWS and backend part](https://gitlab.com/aossie/social-street-smart/merge_requests/16)

* [MR 17 (open) :content script for news website](https://gitlab.com/aossie/social-street-smart/merge_requests/17)

* [MR 19 (open): content script for twitter](https://gitlab.com/aossie/social-street-smart/merge_requests/19)

* [MR 23 (open): Content script for Facebook](https://gitlab.com/aossie/social-street-smart/merge_requests/23)

* [MR 24 (open) : Databases integration](https://gitlab.com/aossie/social-street-smart/merge_requests/24)

* [MR 26 (open) : Cache system and API manager](https://gitlab.com/aossie/social-street-smart/merge_requests/26)

* [MR 27 (open) : Scraping scheduler, testing and DB, Cache integration](https://gitlab.com/aossie/social-street-smart/merge_requests/27)

### Future work and improvement
* UI can be improved.

* custom word embedding trained on Indian News corpus will produce a better result.

* list of News website, facebook pages, twitter handle needs to be extended more for scalability.

* session manager and activity logs for API hosted on the server.
* Integration of News Origin detector.




       

