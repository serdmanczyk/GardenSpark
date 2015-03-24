app.controller('readingsController', function ($scope, $http) {
   $scope.readings = [];
   $scope.endDate = moment()
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();
   $scope.startDate = moment()
      .subtract(1, 'day')
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();

   $scope.refresh = function() {
     $http({
         method: 'GET',
         url: '/readings',
         params : {
            'smooth': 'true',
            'start' : $scope.startDate.toISOString(),
            'end' : $scope.endDate.toISOString()
         },
         headers: {
           'Content-Type': 'application/json'
         },
         data:''
     }).success(function(data){
        data.forEach(function (val) {
          val.timestamp = new Date(val.timestamp);
        });
        $scope.readings = data;
     });     
   };

   $scope.airhumoptions = {
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
      drawDots: true,
      columnsHGap: 5
    };

    $scope.moistlightoptions = {
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
      drawDots: true,
      columnsHGap: 5
    };

   $scope.refresh();
});

app.controller('indexController', function ($scope, $http){
  $scope.reading = {};

   $scope.refresh = function() {
    $http({
       method: 'GET',
       url: '/',
       headers: {
         'Content-Type': 'application/json'
       },
       data:''
    }).success(function(data){
      $scope.reading = data;
    });
  };
  
   $scope.refresh();
});
