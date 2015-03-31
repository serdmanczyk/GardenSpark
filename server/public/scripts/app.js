var app = angular.module('gardenSpark', ['n3-line-chart']);

app.constant('tempHumOptions', {
  series: [
    {
      y: "airtemp",
      label: "Air Temperature",
      color: "#0099FF",
      axis: "y",
      type: "line",
      thickness: "1px",
      dotSize: 2,
      id: "airtemp"
    },
    {
      y: "soiltemp",
      axis: "y",
      label: "Soil Temperature",
      color: "#009999",
      type: "line",
      thickness: "1px",
      dotSize: 2,
      id: "soiltemp"
    },
    {
      y: "humidity",
      axis: "y2",
      label: "Humidity",
      color: "#6666FF",
      type: "line",
      thickness: "1px",
      dotSize: 2,
      id: "humidity"
    }
  ],
  stacks: [],
  axes: {
    x: {type: "date", key: "timestamp"},
    y: {type: "linear", min: 14, max: 25},
    y2: {type: "linear", min: 0, max:100}
  },
  lineMode: "monotone",
  tension: 0.7,
  tooltip: {mode: "scrubber",interpolate:true},
  drawLegend: true,
  drawDots: false,
  columnsHGap: 5
});

app.constant('moistLightOptions', {
  series: [
    {
      y: "soilmoist",
      label: "Soil Moisture",
      color: "#996633",
      axis: "y",
      type: "line",
      thickness: "1px",
      dotSize: 2,
      id: "soilmoist"
    },
    {
      y: "light",
      axis: "y2",
      label: "Light",
      color: "#B28F00",
      type: "line",
      thickness: "1px",
      dotSize: 2,
      id: "light"
    }
  ],
  stacks: [],
  axes: {
    x: {type: "date", key: "timestamp"},
    y: {type: "linear", min: 1, max: 2},
    y2: {type: "linear", min: 0, max: 400}
  },
  lineMode: "cardinal-open",
  tension: 0.7,
  tooltip: {mode: "scrubber"},
  drawLegend: true,
  drawDots: false,
  columnsHGap: 5
});

app.factory("EventSource", EventSourceNg);

function EventSourceNg($rootScope) {
  function EventSourceNg(url) {
    this._source = new EventSource(url);
  }
  EventSourceNg.prototype = {
    addEventListener: function(x, fn) {
      this._source.addEventListener(x, function(event) {
        $rootScope.$apply(fn.bind(null, event));
      });
    }
  }
  return EventSourceNg;
}
