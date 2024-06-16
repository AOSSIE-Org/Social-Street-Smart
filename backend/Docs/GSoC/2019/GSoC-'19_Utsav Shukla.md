# GSoC'19: Social Street Smart (final report)
#### _** -Utsav Shukla**_

###### Main Repository Link: [AOSSIE: Social street Smart](https://gitlab.com/aossie/social-street-smart)
###### Forked Repository Link: [AOSSIE: Social street Smart (Utsav Shukla's fork)](https://gitlab.com/us241098/social-street-smart)
###### Download Chrome Extension (CRX): [Packaged Chrome Extension](https://drive.google.com/open?id=1mm6YjcnEPDfSX-NjCJnZZ6JF8eTiOO7f)
<br>

#### APIs links:

**Heroku** <br>

`Click-Bait API`: https://sss-clickbait.herokuapp.com/swagger <br>
`Hate Speech API`: https://sss-hate-speech.herokuapp.com/swagger <br>
`News Origin API`: https://sss-news.herokuapp.com/swagger/ <br>
<br>

**AWS** <br>

`Click-Bait API`: http://18.221.117.28:7001/swagger/ <br>
`News Origin API`: http://18.221.117.28:7000/swagger/ <br>
<br>

## Summary 
With the sharp increase in Internet users and more than ever content being published online problems like Click Baits, Hate Speech and Fake News are now something we can't ignore any longer. During Summer '19 I got the chance to contribute in AOSSIE's project Social Street Smart which aims at solving these problems. I contributed by implementing following functionalities.

### Profanity Word Blur
This functionality searches for the profanity words on the webpage and if found they are blurred. 

### Objectionable website alert
When the user visits a News website it displays a chrome notification containing information like bias/ownership of the webiste. 

### Marking Clickbaits on Social media sites
This functionality checks if the links shared on Twitter, Facebook and Youtube are clickbait and if they are the Chrome Extension marks them as clickbait.

### Probable News Origin 
Using this functionality one can find the probable origin of a viral news piece or a rumour. Select a piece of text right click and select `Get probable Origin` option and soon a chrome notification showing the probable News Origin would be displayed. This can't always tell the source of the news with 100% accuracy but it definitely shows what type of websites are publishing news similar to it. For example for a satire news piece you are likely to get sites like `Reddit` and `Onion` as output but not no nonsense sites like `Guardian` and `C-Span`.

### Settings page
A Settings page to control where to enable the above functionalities.
<br>
<br>

## Developer Manual

### Languages, Frameworks and Skills used
* HTML, CSS, JavaScript, Chrome Extension Development (Front End).
* Python 3, Flask, Swagger UI, Pattern, NLTK, Rest APIs, gunicorn (Back End).
* pytest for API testing.
* Keras, Tensorflow, Jupyter Notebooks, NLP, Word Embeddings, Pickle, LSTM, CNN and Logistic Regression algorithms. (Deep Learning)
* Heroku and AWS (Deployment)

<br>

### Installation guide
Clone the repository :
  `git clone https://gitlab.com/aossie/social-street-smart.git`

_**for chrome extension**_ 

1. Install node.js, git, gulp

2. Change the directory :
    `cd social-street-smart/`

3. Install the dependencies :
     `npm install`

4. Build the extension :
     `gulp build`
 
5. Open `Google Chrome` navigate to 
   `chrome://extensions/` and add dist (or lib) folder by clicking on 
   `Load unpacked` button.
   
 <br>  
   
_**for backend (Click-Bait and Hate Speech APIs)**_

Though the APIs with their Swagger Documentation are hosted on Heroku and AWS (WIP) you can run the APIs locally by following these steps:


1. Following steps are for Click-Bait and Hate Speech APIs

2. Navigate to the directory of API you want to run, for example:
    `cd API/Click-Bait`

3. Though its not necessary to create a virtual environment, but its recommended to do so.<br><br>
      Install the virtualenv: `pip3 install virtualenv` <br><br>
      Create a virtual environment: `virtualenv venv`  <br><br>
      Activate the virtual environment: `source venv/bin/activate`<br>
    
4.  Install all the required dependencies: `pip3 install -r requirements.txt`

5.  You can run the server either by: `python3 server.py` or `gunicorn server:app`

![image](https://user-images.githubusercontent.com/28961693/63629789-efaffb00-c603-11e9-9260-269ee71e627a.png)


<br>

_**for backend (News Origin API)**_

1.  Follow the Steps 1-4 of running Click-Bait/Hate Speech API.

2.  If you are having troubles installing `pattern` from requirements file, Install it manually: `pip3 install git+https://github.com/clips/pattern@development` 

3.  If you are running the server for the first time then uncomment the `lines 20-25` to download the required resources.


    ![image](https://user-images.githubusercontent.com/28961693/63630249-2ab42d80-c608-11e9-83ab-7a05ac960c2e.png)
    
4.  Run the server either by: `python3 server.py` or `gunicorn server:app`

<br>

_**for API tests**_
1.  Every API have their test cases written using `pytest`. To run them just navigate to the root directory of API. For example `Click-Bait` directory for clickbait API and type `pytest` on terminal.

<br>
<br>

## Experience and Merge Requests

During GSoC 2019 I learned a lot stuff about Web Development and API deployment, though I had developed proof of concepts for my features before the coding period, real test was to optimize those functionalities so that experience for the user is seamless. All the features in my proposal are completed except building a profanity word list for Hindi, which I will try to complete as soon as possible. Overall my GSoC experience was very nice and I wish to continue contributing to this project in future and try to complete the optional features I have mentioned in my proposal after the GSoC.

<br>

### Merge Requests opened during GSoC working period:
* [ MR 9 (merged) : Settings page UI and Profanity Word list](https://gitlab.com/aossie/social-street-smart/merge_requests/9)

* [MR 11 (merged) : Generalised script to blur the profanity words](https://gitlab.com/aossie/social-street-smart/merge_requests/11)

* [MR 13(Merged): Websites alert feature and News/Magazines website list ](https://gitlab.com/aossie/social-street-smart/merge_requests/13)

* [MR 14 (open) : Hate speech models](https://gitlab.com/aossie/social-street-smart/merge_requests/14)

* [MR 18 (open) : Hate Speech and Clickbait APIs](https://gitlab.com/aossie/social-street-smart/merge_requests/18)

* [MR 20 (open) : Clickbait frontend](https://gitlab.com/aossie/social-street-smart/merge_requests/20)

* [MR 21 (open): Api Unit Tests and Documentation](https://gitlab.com/aossie/social-street-smart/merge_requests/21)

* [MR 22 (open): WIP: Hate speech frontend ](https://gitlab.com/aossie/social-street-smart/merge_requests/22)

* [MR 25 (open) : News Origin API ](https://gitlab.com/aossie/social-street-smart/merge_requests/25)

* [MR 28 (open) : Origin frontend ](https://gitlab.com/aossie/social-street-smart/merge_requests/28)

* [MR 29 (open) : Feature to White List the Websites ](https://gitlab.com/aossie/social-street-smart/merge_requests/29)

* [MR 31 (open) : Utsav's final report GSoC '19 (and some final changes) ](https://gitlab.com/aossie/social-street-smart/merge_requests/29)


<br>

### Future work and improvements
* Extend to different languages.

* Integrate the functionality to detect the NSFW images.

* Functionality to display a condensed summary of a clickbait article.

* Extend the test coverage.

* Functionality for users to mark a post/article as clickbait or abusive.

* Youtube clickbait thumbnail detection.























