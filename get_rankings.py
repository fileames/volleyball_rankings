import requests
from bs4 import BeautifulSoup
import json
import time

URLS = ["https://www.hypercube.nl/FIVB_ranking/ranking.php?gender=women",
        "https://www.hypercube.nl/FIVB_ranking/ranking.php?gender=men"]

for i, j in enumerate(["women", "men"]):

    r = requests.get(URLS[i])
    soup = BeautifulSoup(r.content, 'html.parser')
    table = soup.find('table', attrs={'class': 'ranking_table'})

    countries = []
    for i, row in enumerate(table.findAll('tr')):
        if i == 0:
            continue

        item = dict()

        country = row.findAll('td')[3].text
        point = int(row.findAll('td')[4].text)
        item["country"] = country
        item["point"] = point
        countries.append(item)

    with open(f'volleyball_rankings/src/data/{j}_ranking_data.json', 'w') as fp:
        json.dump(countries, fp)

with open('volleyball_rankings/src/data/last_time.json', 'w') as fp:
    last_checked = {"last_checked": time.time()}
    json.dump(last_checked, fp)
