import requests
from bs4 import BeautifulSoup
import json


URL = "https://www.hypercube.nl/FIVB_ranking/ranking.php?gender=women"
r = requests.get(URL)
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

with open('volleyball_rankings/src/data/ranking_data.json', 'w') as fp:
    json.dump(countries, fp)
