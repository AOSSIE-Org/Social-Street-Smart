from newsplease import NewsPlease
def getNews(url):
    article = NewsPlease.from_url(url)
    news= {}
    print(article.date_download)
    news["authors"]= article.authors
    news["date_download"]= article.date_download
    news["date_modify"]=article.date_modify
    news["date_publish"]=article.date_publish
    news["description"]=article.description
    news["language"]=article.language
    news["source_domain"]=article.source_domain
    news["text"]=article.text
    news["title"]=article.title
    news["url"]=article.url
    return news
    
