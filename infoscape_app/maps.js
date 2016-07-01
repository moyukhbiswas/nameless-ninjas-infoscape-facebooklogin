var map;
function initialize() {
  var globalData = {};
  var getInfo = function()
  {
    $.ajax({
      type:"GET",
      url: "http://10.86.60.106:8011/get_info",
      cache: false,
      // dataType: "jsonp",
      success: function(html){
        globalData = JSON.parse(html);
        callBack();
      },
      error: function(err){
      //console.log(err);
      }
    });
  };

  var userLogin = function(email,pwd)
  {
    $.ajax({
      type:"POST",
      url: "http://10.86.60.106:8011/login",
      data : {
        email: email,
        pwd: pwd
      },
      success: function(data){
        // console.log("Success - Login");
        // console.log(data);
      },
      error: function(err){
        // console.log("Error - Login ");
        // console.log(err);
      }
    
    });
  }



 var userRegister = function(name,email,pwd)
  {
    $.ajax({
      type:"POST",
      url: "http://10.86.60.106:8011/register",
      data : {
        email: email,
        pwd: pwd,
        name:name
      },
      success: function(data){
        // console.log("Successful registration");
        // console.log(data);
      },
      error: function(err){
        // console.log("Error registration ");
        // console.log(err);
      }
    
    });
  }


  var addVote = function(id,email,vote)
  {
    $.ajax({
      type:"POST",
      url: "http://10.86.60.106:8011/add_vote",
      data : {
        iD: id,
        email: email,
        vote : vote
      },
      success: function(data){
        // console.log("Successful vote");
        // console.log(data);
      },
      error: function(err){
        // console.log("Error vote ");
        // console.log(err);
      }
    
    });
  }


  var addMsg = function(cat,lat,longitude,email,subCat = "",msg = "")
  {
    $.ajax({
      type:"POST",
      url: "http://10.86.60.106:8011/add_msg",
      data : {
        category: cat,
        sub_cat: subCat,
        email: email,
        msg: msg ,
        lat: lat,
        long: longitude
      },
      success: function(data){
        // console.log("Successful addMsg");
        // console.log(data);
      },
      error: function(err){
        // console.log("Error addMsg ");
        // console.log(err);
      }
    
    });
  }

  getInfo();

  function callBack() {
    // Map Setup
    var latLng = new google.maps.LatLng(17.4024771, 78.4878983);  
    var mapOptions = {
      zoom: 10,
      center: latLng
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var loadNavigations =  function(){
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = google.maps.TravelMode.WALKING;

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);

        var origin_input = document.getElementById('origin-input');
        var destination_input = document.getElementById('destination-input');
        var modes = document.getElementById('mode-selector');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete =
            new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, mode) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            travel_mode = mode;
          });
        }
        setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
        setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
        setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

        function expandViewportToFitPlace(map, place) {
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
        }

        origin_autocomplete.addListener('place_changed', function() {
          var place = origin_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          origin_place_id = place.place_id;
          route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
        });

        destination_autocomplete.addListener('place_changed', function() {
          var place = destination_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination_place_id = place.place_id;
          route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
        });

        function route(origin_place_id, destination_place_id, travel_mode,
                       directionsService, directionsDisplay) {
          if (!origin_place_id || !destination_place_id) {
            return;
          }
          var counter = 0;
          directionsService.route({
            origin: {'placeId': origin_place_id},
            destination: {'placeId': destination_place_id},
            travelMode: travel_mode
          }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              var pointsArray = [];
             //console.log(response.routes);
              for (var route in response.routes) {
                
                  for (var leg in response.routes[route].legs) {
                   //console.log(leg);
                      for (var step in response.routes[route].legs[leg].steps) {
                          for (var latlng in response.routes[route].legs[leg].steps[step].path) {
                              // if(counter%20==0)
                                pointsArray.push(response.routes[route].legs[leg].steps[step].path[latlng]);
                              counter++;
                              //console.log(counter);
                          }
                      }
                  }
              }

              google.maps.Circle.prototype.contains = function(latLng) {
                return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
              }        
                    
              // var marker = new google.maps.Marker({
              //   position: pointsArray[0],
              //   map: map,
              //   title: 'Hello World!'
              // });

               var circle = new google.maps.Circle({
                  center: pointsArray[0],
                  map: map,
                  radius: 1000,          // IN METERS.
                  fillColor: '#FF6600',
                  fillOpacity: 0.3,
                  strokeColor: "#FFF",
                  strokeWeight: 0,         // DON'T SHOW CIRCLE BORDER.
                  clickable:true,
                  editable:true
              });

              directionsDisplay.setDirections(response);
             
              var i = 1;                     //  set your counter to 1
              var delayTime = 10000;
              function myLoop () {           //  create a loop function
                 setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                    //marker.setPosition(pointsArray[i]);          //  your code here
                    circle.setCenter(pointsArray[i]);
                    i++;                     //  increment the counter
                    if(i==2)
                      delayTime = 100;
                    if (i < pointsArray.length) {            //  if the counter < 10, call the loop function
                      for (var j=0; j<markersArray.length; j++)
                      {
                        if(circle.contains(markersArray[j].getPosition()))
                          markersArray[j].setAnimation(google.maps.Animation.BOUNCE);
                        else
                          markersArray[j].setAnimation(null);
                      }
                      myLoop();             //  ..  again which will trigger another 
                    }                        //  ..  setTimeout()
                    else{
                      circle.setMap(null);                      
                      for (var j=0; j<markersArray.length; j++)
                      {
                          markersArray[j].setAnimation(null);
                      }                      
                    }
                 }, delayTime)
              }

            google.maps.event.addListener(circle, "dblclick", function (e) { 
                           circle.setMap(null);
                        });
              
            myLoop();

            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
      }

    // Sample JSON Data
    var staticData = {
       "Hazard": {
          "Radioactivity": {
             "17.4410614443$78.4976577759": [
                [
                   "Uranium found",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Pollution": {
             "17.3829140573$78.6368751526": [
                [
                   "Ahh that smell",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       },
       "Events": {
          "Standup": {
             "17.4089598229$78.4698486328": [
                [
                   "",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Music": {
             "17.4384411154$78.3638048172": [
                [
                   "",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Sports": {
             "17.4068304342$78.5524177551": [
                [
                   "inda vs pak match",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       },
       "Offers": {
          "Food": {
             "17.4575195239$78.3725166321": [
                [
                   "On Street food.",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Lifestyle": {
             "17.415020255$78.4362030029": [
                [
                   "",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Clothes": {
             "17.5370050088$78.2389640808": [
                [
                   "Save Money",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       },
       "Safety": {
          "Unsafe for Women": {
             "17.5108138395$78.4467601776": [
                [
                   "Goons",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       },
       "Roads": {
          "Repair/Construction": {
             "17.4001554587$78.5609579086": [
                [
                   "Metro Work.",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Accident": {
             "17.4354932004$78.3467459679": [
                [
                   "",
                   0,
                   0,
                   "admin"
                ]
             ],
             "17.4354932004$78.3459091187": [
                [
                   "Near wipro circle",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Water Logging": {
             "17.5500991752$78.2065200806": [
                [
                   "",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       },
       "Crowds": {
          "Major": {
             "17.4001554587$78.5609579086": [
                [
                   "12345689",
                   0,
                   0,
                   "admin"
                ],
                [
                   "asdfrghj",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Minor": {
             "17.4338554493$78.4753417969": [
                [
                   "Crowd near the indian flag",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       },
       "PublicServices": {
          "Delay": {
             "17.4918228791$78.2942390442": [
                [
                   "Buses are delayed",
                   0,
                   0,
                   "admin"
                ]
             ],
             "17.4446233935$78.3531618118": [
                [
                   "Public buses delay",
                   0,
                   0,
                   "admin"
                ]
             ]
          },
          "Strike": {
             "17.4145288761$78.5220336914": [
                [
                   "Telangana strike",
                   0,
                   0,
                   "admin"
                ]
             ]
          }
       }
     }
   

    var subcatImage = {
      "Accident" : "./pin_icons/accident.png",
      "Construction" : "./pin_icons/construction.png",
      "Crowds" : "./pin_icons/crowd.png",
      "Delay" : "./pin_icons/delay.png",
      "Electricity" : "./pin_icons/electricity.png",
      "Events" : "./pin_icons/events.png",
      "Hazard" : "./pin_icons/hazards.png",
      "Music" : "./pin_icons/music.png",
      "Offers" : "./pin_icons/offers.png",
      "PublicServices" : "./pin_icons/public.png",
      "Road blocked" : "./pin_icons/road_blocked.png",
      "Roads" : "./pin_icons/road.png",
      "Safety" : "./pin_icons/safety.png",
      "Thief" : "./pin_icons/thief.png"

    };
    
    
    var markersArray = [];

    // global infowindow 
    var infowindow = new google.maps.InfoWindow();
    window.mapbuttonclick = function(targetelement, plusorminus, inverseelement, commentid) {
      var innhtml = document.getElementById(targetelement).innerHTML;
      inhtml = innhtml.substring(1);
      var count = parseInt(inhtml);
      if (plusorminus === 1) {
        count++;
        document.getElementById(targetelement).innerHTML = '+' + count;
        addVote(commentid,"srinath4test@gmail.com", 1);
      }else {
        count++;
        document.getElementById(targetelement).innerHTML = '-' + count;
        addVote(commentid,"srinath4test@gmail.com", -1);
      }
      document.getElementById(targetelement).style.backgroundColor = 'green';
      document.getElementById(targetelement).disabled = true;
      document.getElementById(inverseelement).disabled = true;
    };
    var defaultCategories  = ["Crowds", "Hazard", "Events", "Offers", "PublicServices", "Roads", "Safety"];
    //markers for the data
    var pointingMarkers = function(categories,data){
      for(cat in data)
      {
        if (categories.indexOf(cat)!=-1)
        {
          for(subcat in data[cat])
          {
            for (latlng in data[cat][subcat])
            {
              
              var latLngArray = data[cat][subcat][latlng];

              var preContentString="";
              preContentString += "<div style = \"font-family:Helvetica; font-size: 14px;width: 400px; max-height: 200px; overflow-y: auto;\">";
              preContentString += "<div style =\"font-weight:bold;width: 100%; float: left;margin-top: 3px; margin-bottom:3px; font-size:16px;\">" +  cat + "<\/div>";
              preContentString += "<div style = \"width: 100%;float: left;\">" + subcat + "<\/div>";
              preContentString += "<table>";   

              var rowString="";

              var postContentString="";
              postContentString += "<\/table>";
              postContentString += "<\/div>";   

              for(var i=0;i<latLngArray.length;i++)
              { 
                rowString += "<tr>";
                rowString += "<td><div style = \"margin-bottom: 5px;font-size: 13px; margin-top: 3px;color: #aaa; width: 250px;float: left;\">" + latLngArray[i][0] + "<\/div>";
                rowString += "<\/td><td><button onclick = \"window.mapbuttonclick('map-button-"+i+"-"+1+"',1, 'map-button-"+i+"-"+2+"',"+latLngArray[i][4]+");\" id = \"map-button-"+i+"-"+1+"\" style = \"border-radius: 3px;margin-left: 10px;cursor:pointer; color: white;background: #f44336 ; border: none; ;float:right; width: 40px; height: 20px;\">+" + latLngArray[i][1] + "<\/button>";
                rowString += "<button onclick = \"window.mapbuttonclick('map-button-"+i+"-"+2+"',2,'map-button-"+i+"-"+1+"',"+latLngArray[i][4]+");\" id = \"map-button-"+i+"-"+2+"\" style = \"border-radius: 3px;margin-left: 10px;cursor:pointer; color: white;background: #f44336 ; border: none; ;float:right; width: 40px; height: 20px;\">-" + latLngArray[i][2] + "<\/button>";
                rowString += "<\/td>";
                rowString += "<\/tr>";          
              }  

              // final contentString
              var contentString = preContentString + rowString + postContentString;

              // separating the lat lng
              var temp = latlng.split('$');
            
              // putting the marker over the lat lng
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(temp[0], temp[1]),
                map: map
              });

              markersArray.push(marker);

              if (subcat in subcatImage)
                marker.setIcon(subcatImage[subcat]);
              else
                marker.setIcon(subcatImage[cat]);


              google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
                  return function() {
                      infowindow.setContent(contentString);
                      infowindow.open(map,marker);
                  };
              })(marker,contentString,infowindow));                   
            }
          }
        }
      }
    }
    
    // printing default categories markers on the map
    pointingMarkers(defaultCategories,globalData);

    var clearOverlays = function(){
      for (var i=0; i < markersArray.length; i++)
        markersArray[i].setMap(null);
      markersArray.length = 0;
    }
    
    // Filtering
    window.filterPins = function(categories){
    //console.log("inside window.filterPins");
      clearOverlays();
    //console.log(categories);
      pointingMarkers(categories,globalData);
    }

    // adding the new Single Pin, needs to be edited
    window.addNewPin = function(category, lat, lng, email, subcategory, message){
      $.ajax({
        type:"GET",
        url: "http://10.86.60.106:8011/get_info",
        cache: false,
        // dataType: "jsonp",
        success: function(html){
          globalData = JSON.parse(html);
          clearOverlays();
          pointingMarkers(defaultCategories,globalData);         
        },
        error: function(err){
        //console.log(err);
        }
      });
    }    

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
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
      map.fitBounds(bounds);

    });
          
          var prevMarker = null;

          // This event listener calls addMarker() when the map is clicked.
          google.maps.event.addListener(map, 'click', function(event) {
            addMarker(event.latLng, map);
          });

        var geocoder = new google.maps.Geocoder;
    

        // Adds a marker to the map.
        function addMarker(location, map) {
          // Add the marker at the clicked location, and add the next-available label
          // from the array of alphabetical characters.
          if(prevMarker == null){
            var marker = new google.maps.Marker({
              position: location,
              map: map
            });
            geocodeLatLng(location, map, marker);
            prevMarker = marker;
        }
        else{
          prevMarker.setMap(null);
          prevMarker = null;
        }
        }

        // geocode the marker location to information
        function geocodeLatLng(location, map, marker)
        {
         var latlng = {lat:location.lat(), lng : location.lng()};
         geocoder.geocode({'location' : latlng}, function(results, status){
          if(status == google.maps.GeocoderStatus.OK){
            if(results[1]){
              //console.log(results[1]);
                var formatted_address = results[1].formatted_address;
                var length = results[1].address_components.length;
                var lat = location.lat().toFixed(3);
                var lng = location.lng().toFixed(3);
                var name = results[1].address_components[1].long_name;
                var state = results[1].address_components[length-3].long_name;
                var contentString="";
                contentString += "<div style = \"font-family:Arial; font-size: 14px;width: 250px; height: 60px;\">";
                contentString += "<div style =\"font-weight:bold;width: 250px; float: left;margin-top: 3px; margin-bottom:3px; font-size:16px;\"> "+ formatted_address + "<\/div>";
                contentString += "<div style = \"font-size: 12px; margin-top: 3px;color: #aaa; width: 150px;float: left;\"> " + lat + "," + lng + "<\/div>";
                contentString += "";
                // contentString += "<button style = \"margin-top: -35px;cursor:pointer; color: white;background: #f44336 ; border: none; border-radius: 30px;float:right; width: 50px; height: 50px;\">+<\/button>";
                contentString += "<button onClick = \"window.showAddDialog("+location.lat()+","+location.lng()+")\" style = \"margin-top: -29px;cursor:pointer; color: white;background: #f44336 ; border: none; border-radius: 30px;float:right; width: 50px; height: 50px;\">+<\/button>";
                contentString += "<\/div>";
                infowindow.setContent(contentString);
                infowindow.open(map, marker);             
            }
          }
         })       
        }     

    loadNavigations();

   // Adding circle

    //  var circle = new google.maps.Circle({
    //     center: latLng,
    //     map: map,
    //     radius: 10000,          // IN METERS.
    //     fillColor: '#FF6600',
    //     fillOpacity: 0.3,
    //     strokeColor: "#FFF",
    //     strokeWeight: 0,         // DON'T SHOW CIRCLE BORDER.
    //     editable:true,
    //     clickable:true
    // });

     var drawingManager = new google.maps.drawing.DrawingManager({
      // drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE
        ]
      },
      circleOptions: {
        // radius: 10000,          // IN METERS.
        fillColor: '#FF6600',
        fillOpacity: 0.3,
        strokeColor: "#FFF",
        strokeWeight: 0,         // DON'T SHOW CIRCLE BORDER.
        editable:true,
        clickable:false
      }
    });
    drawingManager.setMap(map);
  }

}