# zway-http-bridge
Z-Way app to publish all 'change:metrics:level' events of chosen devices to a HTTP-Server using POST. Can be used to build bridges to other ecosystems.

## App Options in Z-Way
Option | Description
--- | ---
URL to POST to | The URL which wil be called for each event of selected devices. The URL is called with HTTP POST verb.
Devices | List of devices that events will be postet. Non-selected devices will be ignored.

## Data Format
The data that will be send is a simple JSON
```
{
    timestamp: <Timestamp of event>
    level: <Level of device>,
    id: <ID of device>,
    type: <Type of device>,
    name: <Name of device>,
    metrics: <Full object of metrics of device>
}
```

## Bridge Example
Probably most simple bridge example without any security and checks. Puts all incoming events directly into a MongoDB.

_(Example requires Python, PyMongo, Bottle and, of course, a running MongoDB instance.)_

```python
from bottle import request, route, run
from pymongo import MongoClient
from datetime import datetime

@route('/events', method='post')
def postEventToDatabase():
    json = request.json

    if (json is not None):
        if (json["timestamp"] is not None):
            json["timestamp"] = datetime.fromtimestamp(json["timestamp"] / 1000)

        client = MongoClient('localhost', 27017)
        db = client.myDatabase
        collection = db.events

        collection.insert_one(json)

run(host='localhost', port=1234)
```
