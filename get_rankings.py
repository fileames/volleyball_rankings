import requests
import json
import time


URLS = [["https://en.volleyballworld.com/api/v1/worldranking/volleyball/0/0/50","https://en.volleyballworld.com/api/v1/worldranking/volleyball/0/1/50"],
        ["https://en.volleyballworld.com/api/v1/worldranking/volleyball/1/0/50","https://en.volleyballworld.com/api/v1/worldranking/volleyball/1/1/50"]]



for i, j in enumerate(["women", "men"]):

    countries = []
    for url in URLS[i]:

        table = requests.get(url, 
                    headers={'Accept': 'application/json'}).json()["teams"]
        
        
        for i, row in enumerate(table):    

            item = dict()

            country = row["federationName"]
            point = row["decimalPoints"]
            if point == '':
                continue
            
            point = float(point)

            item["country"] = country
            item["point"] = point
            
         
            countries.append(item)

    with open(f'volleyball_rankings/src/data/{j}_ranking_data.json', 'w') as fp:
        json.dump(countries, fp)

with open('volleyball_rankings/src/data/last_time.json', 'w') as fp:
    last_checked = {"last_checked": time.time()}
    json.dump(last_checked, fp)
