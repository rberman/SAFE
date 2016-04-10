angular.module('app.controllers', [])

//  Cite https://www.thepolyglotdeveloper.com/2014/10/implement-google-maps-using-ionicframework/
//  Cite http://ionicframework.com/docs/api/service/$ionicPopup/

.controller('reportCtrl', function($scope) {

})

.controller('safeCtrl', function($scope, $ionicLoading, Reports) {
  //$scope.$on( "$ionicView.enter", function() {
  //  google.maps.event.trigger( map, 'resize' );
  //});

  // Load report data from API
  Reports.query().$promise.then(function(data) {
    $scope.reports = data;
    console.log($scope.reports);
  });

  function displayMarkers() {
    // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
    for (var i = 0; i < $scope.reports.length; i++) {

      var latlng = new google.maps.LatLng($scope.reports[i].latitude, $scope.reports[i].longitude);
      var description = $scope.reports[i].description;
      var color = 'http://maps.google.com/mapfiles/ms/icons/purple.png'; //TODO add logic to determine color based on category
      createMarker(latlng, description, color);
    }
  }

  // This function creates each marker and sets their Info Window content
  function createMarker(latlng, description, color){

    var marker = new google.maps.Marker({
      map: $scope.map,
      position: latlng,
      title: description,
      icon: color
    });

    // This event expects a click on a marker
    // When this event is fired the infowindow content is created
    // and the infowindow is opened
    google.maps.event.addListener(marker, 'click', function() {
      $scope.infoWindow.setContent(description);
      $scope.infoWindow.open($scope.map, marker);
    });
  }


  // Google maps
  $scope.initMap = function() {
    //google.maps.event.addDomListener(window, 'load', function() {
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var infoWindow = new google.maps.InfoWindow();

      navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          title: "My Location"
        });
      });

      $scope.map = map;
      $scope.infoWindow = infoWindow;

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        google.maps.event.addListener($scope.map, 'click', function() {
          $scope.infoWindow.close();
        });

        displayMarkers();
      });
    //});
  }
})

.controller('reportCtrl', function($scope, $ionicPopup, Reports) {

  $scope.initReportMap = function() {
    //google.maps.event.addDomListener(window, 'load', function() {
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("report-map"), mapOptions);
      //$scope.myLocation = new google.maps.Marker();

      navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          title: "My Location",
          draggable: true
        });
      });

      $scope.map = map;
    //});
  };

  // Handles change of drop-down menu selection
  $scope.selectCategory = function(category) {
    console.log(category);
  };

  // A confirm dialog
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Call 911',
      template: 'Are you sure you want to call 911?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        document.location.href = 'tel:16504641779'
      } else {
        console.log('You are not sure');
      }
    });
  };


  // Submit report data
  $scope.submitReport = function(category, description) {
    var lat = $scope.myLocation.getPosition().lat();
    var lon = $scope.myLocation.getPosition().lng();
    var called_911 = false; //TODO haven't gotten actual value

    Reports.post({latitude: lat, longitude: lon, called_911: called_911, category_id: category, description: description});

    console.log("Posted successfully");
    document.location.href = '#/main';
  };
})


.controller('feedCtrl', function($scope, Reports) {

  Reports.query().$promise.then(function(data) {
    $scope.reports = data;
    console.log($scope.reports);
  });

  $scope.getColor = function(category_id) {
    if (category_id == 1) return "secondary-color"; // verbal
    if (category_id == 2) return "primary-color"; // physical
    if (category_id == 3) return "tertiary-color"; // other
  }

});
