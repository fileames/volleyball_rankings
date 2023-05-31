import requests
from bs4 import BeautifulSoup
import json
import time
from requests_html import HTMLSession


URLS = ["https://en.volleyballworld.com/volleyball/world-ranking/women",
        "https://en.volleyballworld.com/volleyball/world-ranking/men"]
session = HTMLSession()


for i, j in enumerate(["women", "men"]):

    resp = session.get(URLS[i])
    #resp.html.render()
    #print("load-more-btn" in resp.html.html)
    script = """
       () => {
                const item = document.getElementsByClassName("load-more-btn")[0];
                if(item) {
                    item.click()
                }    
        }
         """
    resp.html.render(sleep=10, script=script)

    html = resp.html.html

    soup = BeautifulSoup(html, 'html.parser')
    table = soup.findAll('tbody', attrs={'class': 'vbw-ranking-page-table-body'})

    countries = []
    for i, row in enumerate(table):    

        item = dict()

        country = row.find("div", {"class": "vbw-mu__team__name-fed"}).text
        point = row.find("td", {"class": "vbw-o-table__cell points"}).text
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
