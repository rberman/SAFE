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

  function getColor(category_id) {
    if (category_id == 1) return '11c1f3'; // verbal calm
    if (category_id == 2) return 'ffc900'; // physical energized
    if (category_id == 3) return '886aea'; // systemic royal
    if (category_id == 4) return '387ef5'; // other positive
  }

  // Display the markers on the map (used in initMap)
  function displayMarkers() {
    // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
    for (var i = 0; i < $scope.reports.length; i++) {
      var latlng = new google.maps.LatLng($scope.reports[i].latitude, $scope.reports[i].longitude);
      var description = $scope.reports[i].description;
      var icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + getColor($scope.reports[i].category_id);
      createMarker(latlng, description, icon);
    }
  }

  // Creates each marker and sets info window content (used in displayMarkers)
  function createMarker(latlng, description, color){
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: latlng,
      title: description,
      icon: color
    });

    // Open an infoWindow when a marker is clicked
    google.maps.event.addListener(marker, 'click', function() {
      var contentString = "<strong>Incident</strong>: " + description;
      $scope.infoWindow.setContent(contentString);
      $scope.infoWindow.open($scope.map, marker);
    });
  }

  // Google Map Search Box with Autocomplete
  function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('searchBox');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    $scope.map.addListener('bounds_changed', function () {
      searchBox.setBounds($scope.map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: $scope.map,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      $scope.map.fitBounds(bounds);
      $scope.map.setZoom(16);
    });
  }

  // Google maps map initiation function, uses displayMarkers, createMarker, and initAutocomplete
  $scope.initMap = function() {
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var infoWindow = new google.maps.InfoWindow();

      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: $scope.map,
          title: "My Location"
        });
      });

      initAutocomplete(); //can init once map scope variable is defined

      $scope.infoWindow = infoWindow;

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        displayMarkers();
        google.maps.event.addListener($scope.map, 'click', function() {
          $scope.infoWindow.close();
        });
      });
  };

  $scope.disableTap = function(){ //to enable clicking on results of search
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
    angular.element(container).on("click", function(){
      document.getElementById('searchBox').blur();
    });
  }
})

.controller('reportCtrl', function($scope, $ionicPopup, Reports) {
  $scope.called_911 = false;

  // Google Map Search Box with Autocomplete
  function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('searchBox');
    var searchBox = new google.maps.places.SearchBox(input);
    //$scope.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input); //puts search bar in map window

    // Bias the SearchBox results towards current map's viewport.
    $scope.map.addListener('bounds_changed', function () {
      searchBox.setBounds($scope.map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: $scope.map,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      $scope.map.fitBounds(bounds);
      $scope.map.setZoom(16);
    });
  }

  $scope.initReportMap = function() {
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
      initAutocomplete();
  };


  // A confirm dialog for call button
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Call 911',
      template: 'Are you sure you want to call 911?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.called_911 = true;
        document.location.href = 'tel:16504641779';
      } else {
        console.log('You are not sure');
      }
    });
  };


  // Submit report data
  $scope.submitReport = function(description) {
    var lat = $scope.myLocation.getPosition().lat();
    var lon = $scope.myLocation.getPosition().lng();

    Reports.post({latitude: lat, longitude: lon, called_911: $scope.called_911, category_id: $scope.selected, description: description});
    console.log("Posted successfully");
    document.location.href = '#/main';
  };

  ////////////////////////////////////////////////////////
  // LOGIC TO CONTROL THE CATEGORY BUTTON SELECTION:
  // Initialized button states
  $scope.verbal = "button-stable";
  $scope.physical = "button-stable";
  $scope.systemic = "button-stable";
  $scope.other = "button-stable";
  $scope.selected = '0';

  // Given a category, returns the button color
  $scope.getCatButtonState = function(category) {
    if (category == 'verbal') return $scope.verbal;
    if (category == 'physical') return $scope.physical;
    if (category == 'systemic') return $scope.systemic;
    if (category == 'other') return $scope.other;
  };

  // Selects a button; only allows one category to be selected at a time
  // Updates button colors and selected variable
  $scope.selectCategory = function(category) {
    $scope.resetCategories();
    if (category == 'verbal') {
      $scope.verbal = 'button-calm';
      $scope.selected = '1';
    }
    else if (category == 'physical') {
      $scope.physical = 'button-energized';
      $scope.selected = '2';
    }
    else if (category == 'systemic') {
      $scope.systemic = 'button-royal';
      $scope.selected = '3'
    }
    else if (category == 'other') {
      $scope.other = 'button-positive';
      // TODO: Update database value
      $scope.selected = '3';
    }
  };

  // Helper method that resets all buttons to unselected
  $scope.resetCategories = function() {
    $scope.verbal = 'button-stable';
    $scope.physical = 'button-stable';
    $scope.systemic = 'button-stable';
    $scope.other = 'button-stable';
  };
  ////////////////////////////////////////////////////////
})


.controller('feedCtrl', function($scope, $window, $ionicPopup, Reports, Comment) {

  Reports.query().$promise.then(function(data) {
    $scope.reports = data;
    console.log($scope.reports);
  });

  $scope.getColor = function(category_id) {
    if (category_id == 1) return "calm"; // verbal
    if (category_id == 2) return "energized"; // physical
    if (category_id == 3) return "royal"; // systemic
    if (category_id == 4) return "positive"; // other
  };

  $scope.submitComment = function(id, text) {
    Comment.post({report_id: id, content: text});
    Reports.query().$promise.then(function(data) {
      $scope.reports = data;
      console.log("reloaded reports");
    });
  };

  $scope.getUpVotes = function() {
    return Math.ceil(Math.random() * 9);
  }

});
