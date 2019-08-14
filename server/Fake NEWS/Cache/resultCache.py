from application import db

#Cache DB for facebook

class fbCache(db.Model):
    __tablename__= 'fbCacheTable'
    fbID= db.Column(db.String(), primary_key=True)
    sourcePage= db.Column(db.String())
    dateTime= db.Column(db.String())
    result=db.Column(db.String())
    def __init__(self, fbID, sourcePage, dateTime, result):
        self.fbID = fbID
        self.sourcePage = sourcePage
        self.dateTime = dateTime
        self.result=result

    def __repr__(self):
        return '<fbCache %r>' % self.fbID

    def serialize(self):
        return{
            'fbID': self.fbID,
            'sourcePage': self.sourcePage,
            'dateTime': self.dateTime,
            'result': self.result
        }

#Cache DB for Twitter post's Result

class tweetCache(db.Model):
    __tablename__='tweetCacheTable'
    tweetID= db.Column(db.String(),primary_key= True)
    sourceHandle= db.Column(db.String())
    dateTime= db.Column(db.String())
    result= db.Column(db.String())
    def __init__(self,tweetID,sourceHandle,dateTime, result):
        self.tweetID = tweetID
        self.sourceHandle = sourceHandle
        self.dateTime = dateTime
        self.result = result
    
    def __repr__(self):
        return '<tweetCache %r>' % self.tweetID

    def serialize(self):
        return{
            'tweetID': self.tweetID,
            'sourceHandle': self.sourceHandle,
            'dateTime': self.dateTime,
            'result': self.result
        }

#Cache DB for news websites



