import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';

declare var google;

@Component({
  selector: 'page-employer-curlocation',
  templateUrl: 'employer-curlocation.html'
})
export class EmployerCurLocationPage {

  @ViewChild('map1') mapElement: ElementRef;
  map: any;
  marker: any;
  infowindow: any;
  user_setting: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public viewCtrl: ViewController,
    public loading: LoadingController) {
        
  }

  ionViewWillEnter() {
    this.loadMap();
  }
  
  loadMap(){
    this.user_setting = JSON.parse(localStorage.getItem('user_setting'));
    
    let latLng = new google.maps.LatLng(this.user_setting.setting_emp_location_lat, this.user_setting.setting_emp_location_lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.marker = new google.maps.Marker({
        map: this.map,
        position: latLng
    });

    var self = this;
    this.infowindow = new google.maps.InfoWindow({
        map: this.map,
        position: latLng,
        content: self.user_setting.setting_emp_location_address
    });
    this.infowindow.close();

    var geocoder = new google.maps.Geocoder();
    
    google.maps.event.addListener(this.marker, 'click', function() {
        self.infowindow.open(this.map, this);
    });

    google.maps.event.addListener(this.map, 'click', function(event) {
        self.marker.setPosition(event.latLng); 
        self.geocodePosition(geocoder, event.latLng);
        //this.map.setCenter(event.latLng);
        self.user_setting.setting_emp_location_lat = event.latLng.lat(); self.user_setting.setting_emp_location_lng = event.latLng.lng();
    });
    

  }

  geocodePosition(geocoder, pos) {
    var self = this;
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            self.infowindow.setContent(responses[0].formatted_address);
            self.user_setting.setting_emp_location_address = responses[0].formatted_address;
        } else {
            self.infowindow.setContent('Cannot determine address at this location.');
        }
    });
  }
  
  done() {
    let userSetting = JSON.stringify(this.user_setting);
    localStorage.setItem('user_setting', userSetting);
    this.viewCtrl.dismiss();
  }

  initAutocomplete() {
    
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', function() {
      searchBox.setBounds(this.map.getBounds());
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
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: this.map,
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
      this.map.fitBounds(bounds);
    });
  }

  search(value) {
    
  }
}
