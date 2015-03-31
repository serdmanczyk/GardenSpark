GardenSpark
==============

Source code for my 'GardenSpark' project.  

Live website: [http://gardenspark-evargreen.rhcloud.com/][gardenspark]

This is a personal IoT (Internet of Things) project to read the following plant environment data and then store/visualize/analyze it in the cloud:

- Air Temperature
- Soil Temperature
- Humidity
- Soil Moisture
- Light levels

Sensor code is firmware written for the [Spark Core][spark], a WiFi enabled microcontroller.  Firmware simply takes a reading from all sensors every ten seconds and then posts it as an event to the spark cloud servers.

Server code is written in [node.js][nodejs] using [express js][express] specifically for an [OpenShift][openshift] environment.  Server code listens to events from the core on the Spark cloud servers via a webhook which posts the data to /readings whenever it is published from the Spark Core.  Server provides web page to watch live data as well as view graphed historical data.  Subsequently the server provides an api to subscribe to data in [SSE][sse] format as well as query historical data in JSON format.

## Future plans:

- ~~Smooth large data queries for plotting~~
- ~~Create plots myself with [n3-charts](https://github.com/n3-charts/line-chart) angularjs library~~
- Power the spark via solar power
- Integrate automated watering system
- Create custom PCB for GardenSpark sensor unit

More details on implementation can be found on my blog [serdmanczyk.github.io/gardenspark][blog]

[express]: http://expressjs.com/
[gardenspark]: http://gardenspark-evargreen.rhcloud.com/
[spark]: http://www.spark.io/
[plotly]: http://plot.ly/
[openshift]: http://www.openshift.com/
[nodejs]: http://nodejs.org/
[blog]: http://serdmanczyk.github.io/gardenspark/
[d3]: http://d3js.org/
[n3charts]: https://github.com/n3-charts/line-chart
[sse]: https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events