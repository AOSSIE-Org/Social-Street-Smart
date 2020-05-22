from newsplease import NewsPlease
def getNews(url):
    article = NewsPlease.from_url(url)
    news= {}
    # print(article.date_download)
    news["authors"]= article.authors  or ""
    news["date_download"]= article.date_download or ""
    news["date_modify"]=article.date_modify or ""
    news["date_publish"]=article.date_publish or ""
    news["description"]= article.description or ""
    news["language"]=article.language or ""
    news["source_domain"]=article.source_domain or ""
    news["text"]=article.text or ""
    news["title"]=article.title or ""
    news["url"]=article.url or ""
    return news
    
