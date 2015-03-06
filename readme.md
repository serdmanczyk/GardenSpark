GardenSpark
==============

Source code for my 'GardenSpark' project.  

This is a personal IoT (Internet of Things) project to read plant environment data from Air Temperature / Humidity / Lux / Soil Temperature / Moisture sensors and then store/visualize/analyze it in the cloud!

Node code is formware written for the [Spark Core][spark], a WiFi enabled microcontroller.  Firmware simply takes a reading from all sensors every ten seconds and then posts it as an event to the spark cloud servers.

Server code is written in [node.js][nodejs] specifically for an [OpenShift][openshift] environment.  Server code subscribes to events from the core on the Spark cloud servers to consume data sent from the chip, and then saves it to a database and plots it to a streaming plot on plot.ly.  Server also provides a web page interface to quickly read / query information either via a web page or JSON.

Future plans:

	- Create plots myself with D3 library
	- Power the spark via solar power
	- Integrate automated watering system
	- Create custom PCB for GardenSpark sensor unit

More details on implementation can be found on my blog [serdmanczyk.github.io/gardenspark][blog]

[spark]: http://www.spark.io/
[plotly]: http://plot.ly/
[openshift]: http://www.openshift.com/
[nodejs]: http://nodejs.org/
[blog]: http://serdmanczyk.github.io/gardenspark/
[d3]: http://d3js.org/
