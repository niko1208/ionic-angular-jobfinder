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

  search(value) {
    
  }
}
