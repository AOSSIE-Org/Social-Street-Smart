from application import db

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

