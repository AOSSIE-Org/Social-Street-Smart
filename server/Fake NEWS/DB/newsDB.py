class authenticNews(db.Model):
    __tablename__= 'authNewsTable'
    link= db.Column(db.String(), primary_key=True)
    source= db.Column(db.String())
    dateTime= db.Column(db.String()) # make this in time 
    content= db.Column(db.String())
    def __init__(self, link, source,dateTime, content):
        self.link = link
        self.source = source
        self.dateTime= dateTime
        self.content= content


    def __repr__(self):
        return '<authNews %r>' % self.content
    
    def serialize(self):
        return{
            'link': self.link,
            'source': self.source,
            'dateTime': self.dateTime,
            'content': self.content
        }

class allnewsDB(db.Model):
    __tablename__='allNewsDBtable'
    link= db.Column(db.String(), primary_key=True)
    source= db.Column(db.String())
    dateTime= db.Column(db.String()) # make this in time 
    content= db.Column(db.String())
    def __init__(self, link, source,dateTime, content):
        self.link = link
        self.source = source
        self.dateTime= dateTime
        self.content= content

    def __repr__(self):
        return '<allNewsDB %r>' % self.content

    def serialize(self):
        return{
            'link': self.link,
            'source': self.source,req= request.json
    reqURL= req['url']
    newsPost= getNews(reqURL)
    r=jsonify({'result':newsPost})
    r.headers.add('Access-Control-Allow-Origin', '*')           #to solve cross origin request problem, modify this in future
    return r
            'dateTime': self.dateTime,
            'content': self.content
        }
