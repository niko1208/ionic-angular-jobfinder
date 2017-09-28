import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
declare var google;

@Component({
  selector: 'page-employer-editjob-location',
  templateUrl: 'employer-editjob-location.html'
})
export class EmployerEditjobLocationPage {

  list:any;
  data: any;
  lat: any;
  lng: any;
  address: any;
  @ViewChild('map3') mapElement: ElementRef;
  map: any;
  marker: any;
  infowindow: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public viewCtrl: ViewController,
    public loading: LoadingController,
    public navParams: NavParams) {
        
  }

  ionViewWillEnter() {
    this.loadData();
  }
  
  loadData() {
    this.data = this.navParams.get('data');
    let self = this;
    self.address = this.data.job_location_address;
    if(this.data.job_location_address == 'location_address') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            self.lat = position.coords.latitude;
            self.lng = position.coords.longitude;
            self.loadMap();
          }, function() {
            self.lat = 22.285831;
            self.lng = 114.1582283;
            alert('The Geolocation service failed');
            self.loadMap();
          });
        } else {
          self.lat = 22.285831;
          self.lng = 114.1582283;
          alert("Browser doesn't support Geolocation");
          self.loadMap();
        }
    } else {
      self.lat = this.data.job_location_lat;
      self.lng = this.data.job_location_lng;
      self.loadMap();
    }
  }

  loadMap(){
    console.log('loadmap');
    
    var self = this;

    let latLng = new google.maps.LatLng(this.lat, this.lng);
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

    this.infowindow = new google.maps.InfoWindow({
        map: this.map,
        position: latLng,
        content: self.address
    });
    this.infowindow.close();

    var geocoder = new google.maps.Geocoder();
    
    google.maps.event.addListener(this.marker, 'click', function() {
        self.infowindow.open(this.map, this);
    });

    google.maps.event.addListener(this.map, 'click', function(event) {
        self.marker.setPosition(event.latLng); 
        self.geocodePosition(geocoder, event.latLng);
        self.lat = event.latLng.lat(); 
        self.lng = event.latLng.lng();
    });

  }

  geocodePosition(geocoder, pos) {
    var self = this;
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            self.infowindow.setContent(responses[0].formatted_address);
            self.address = responses[0].formatted_address;
        } else {
            self.infowindow.setContent('Cannot determine address at this location.');
        }
    });
  }
  
  done() {
    this.data.job_location_address = this.address;
    this.data.job_location_lat = this.lat;
    this.data.job_location_lng = this.lng;
    console.log(this.lat+'----'+this.lng);
    this.viewCtrl.dismiss();
  }

  search(value) {
    
  }
}
