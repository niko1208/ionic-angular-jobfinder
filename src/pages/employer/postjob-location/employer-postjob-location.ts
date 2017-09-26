import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import $ from 'jquery';
declare var google;

@Component({
  selector: 'page-employer-postjob-location',
  templateUrl: 'employer-postjob-location.html'
})
export class EmployerPostjobLocationPage {

  list:any;
  data: any;
  @ViewChild('map2') mapElement: ElementRef;
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
    if(this.data.job_location_address == 'location_address') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            self.data.job_location_lat = position.coords.latitude;
            self.data.job_location_lng = position.coords.longitude;
            self.loadMap();
          }, function() {
            alert('The Geolocation service failed');
            self.loadMap();
          });
        } else {
          alert("Browser doesn't support Geolocation");
          self.loadMap();
        }
    } else {
        self.data.job_location_lat = -34.397;
        self.data.job_location_lng = 150.644;
        self.loadMap();
    }
  }

  loadMap(){
    console.log('loadmap');
    
    let latLng = new google.maps.LatLng(this.data.job_location_lat, this.data.job_location_lng);
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
        content: self.data.job_location_address
    });
    this.infowindow.close();

    var geocoder = new google.maps.Geocoder();
    
    google.maps.event.addListener(this.marker, 'click', function() {
        self.infowindow.open(this.map, this);
    });

    google.maps.event.addListener(this.map, 'click', function(event) {
        self.marker.setPosition(event.latLng); 
        self.geocodePosition(geocoder, event.latLng);
        self.data.job_location_lat = event.latLng.lat(); 
        self.data.job_location_lng = event.latLng.lng();
    });

  }

  geocodePosition(geocoder, pos) {
    var self = this;
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            self.infowindow.setContent(responses[0].formatted_address);
            self.data.job_location_address = responses[0].formatted_address;
        } else {
            self.infowindow.setContent('Cannot determine address at this location.');
        }
    });
  }
  
  done() {
    
    this.viewCtrl.dismiss();
  }

  search(value) {
    
  }
}
