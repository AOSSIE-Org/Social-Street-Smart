<<<<<<< HEAD
import pandas as pd

## Code used to clean the raw csv ##

#df=pd.read_csv("source_data2 - source_data.csv")
#df = df.drop([df.columns[2], df.columns[3], df.columns[4] , df.columns[5], df.columns[6] , df.columns[7]] ,  axis='columns')
#df.to_csv('news_websites.csv')

## END ##

## CSV TO JSON ##

df=pd.read_csv("news_websites.csv")
df = df.drop([df.columns[0] ],  axis='columns')
print df.head()
#df.to_csv('news_websites.csv')
df.to_json('../lib/common/news_websites.json')

## END ##
||||||| merged common ancestors
import pandas as pd

## Code used to clean the raw csv ##

#df=pd.read_csv("source_data2 - source_data.csv")
#df = df.drop([df.columns[2], df.columns[3], df.columns[4] , df.columns[5], df.columns[6] , df.columns[7]] ,  axis='columns')
#df.to_csv('news_websites.csv')

## END ##

## CSV TO JSON ##

df=pd.read_csv("news_websites.csv")
df = df.drop([df.columns[0] ],  axis='columns')
print df.head()
#df.to_csv('news_websites.csv')
df.to_json('../lib/common/news_websites.json')

## END ##
=======
import pandas as pd

## Code used to clean the raw csv ##

#df=pd.read_csv("source_data2 - source_data.csv")
#df = df.drop([df.columns[2], df.columns[3], df.columns[4] , df.columns[5], df.columns[6] , df.columns[7]] ,  axis='columns')
#df.to_csv('news_websites.csv')

## END ##

## CSV TO JSON ##

df=pd.read_csv("news_websites.csv")
df = df.drop([df.columns[0] ],  axis='columns')
print df.head()
print(df.dtypes)
df.to_csv('news_websites.csv')
df.to_json('../lib/common/news_websites.json')

## END ##
>>>>>>> master
