import requests
from time import sleep
from datetime import datetime

date_format = "%H:%M:%S %d/%m/%Y"
date_object = datetime.now()
date_object = date_object.strftime(date_format)
url = "https:///panelLogs"

while 1:
    date_format = "%H:%M:%S %d/%m/%Y"
    date_object = datetime.now()
    date_object = date_object.strftime(date_format)
    print("Panel Indret")
    data = {"index": 0,
            "name": "Indret",
            "state": False,
            "door_1": False,
            "door_2": False,
            "online": False,
            "temperature": 29.482,
            "screen": True,
            "date": date_object,
            "__v": 0}

    response = requests.post(url, json=data)

    print(response.status_code)
    print(response.json())


    print("Panel Aval")
    data = {"index": 1,
            "name": "Aval",
            "status": False,
            "door_1": False,
            "door_2": False,
            "online": False,
            "temperature": 29.482,
            "screen": True,
            "date": date_object,
            "__v": 0}

    response = requests.post(url, json=data)

    print(response.status_code)
    print(response.json())


    print("Panel Amont")
    data = {"index": 2,
            "name": "Amont",
            "status": False,
            "door_1": False,
            "door_2": False,
            "online": False,
            "temperature": 29.482,
            "screen": True,
            "date": date_object,
            "__v": 0}

    response = requests.post(url, json=data)

    print(response.status_code)
    print(response.json())

    sleep(600)
