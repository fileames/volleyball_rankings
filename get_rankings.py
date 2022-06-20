import requests
from bs4 import BeautifulSoup
import json


URL = "https://www.hypercube.nl/FIVB_ranking/ranking.php?gender=women"
r = requests.get(URL)
soup = BeautifulSoup(r.content, 'html.parser')
table = soup.find('table', attrs={'class': 'ranking_table'})

countries = dict()
for i, row in enumerate(table.findAll('tr')):
    if i == 0:
        continue

    country = row.findAll('td')[3].text
    point = int(row.findAll('td')[4].text)
    countries[country] = point

with open('data/ranking_data.json', 'w') as fp:
    json.dump(countries, fp)
