app.controller('readingsController', function ($scope, $http, tempHumOptions, moistLightOptions) {
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


   $scope.airhumoptions = tempHumOptions;
   $scope.moistlightoptions = moistLightOptions;
   
   $scope.refresh = function() {
     $http({
         method: 'GET',
         url: '/readings',
         params : {
            'smooth': 'true',
            'start' : $scope.startDate.toISOString(),
            'end' : $scope.endDate.toISOString()
         },
         data:''
     }).success(function(data){
        data.forEach(function (val) {
          val.timestamp = new Date(val.timestamp);
        });
        $scope.readings = data;
     });
   };

   $scope.refresh();
 });

app.controller('latestController', function ($scope, $http, EventSource){
  $scope.reading = {};
  
  if (typeof(EventSource) !== "undefined") {
    var dataEvent = new EventSource('/latest');

    dataEvent.addEventListener('newdata', function(event) {
      $scope.reading = JSON.parse(event.data);
    }, false);
  }
  else {
     $http({
           method: 'GET',
           url: '/latest',
           params : {
              'one': 'true',
           },
           data:''
     }).success(function(data){
        $scope.reading = data;
     });
  }
});
