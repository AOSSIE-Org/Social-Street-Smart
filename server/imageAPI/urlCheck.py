import json
import re

f = open('corpus.json')
data = json.load(f)

src = []

for i in data:
    src.append(i['source_url'])

f.close()

f = open('sampleRes.json')
udata = json.load(f)

urls = []

for i in udata:
    urls.append(i['url'])
rx = [];
for i in urls:
    r = re.search("^(?:http:\/\/|www\.|https:\/\/)([^\/]+)", i)
    r = r.group()
    rx.append(r)

for i in rx:
    if i in data:
            print(i, data)
            print("true")
