import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Slides, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerSavedPage } from '../saved/employer-saved';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import $ from 'jquery';
declare var google;

@Component({
  selector: 'page-employer-home-map',
  templateUrl: 'employer-home-map.html'
})
export class EmployerHomeMapPage {

  arrIndustry = [];
  queryIndustry = "";
  list: any;
  @ViewChild('slides') slides: Slides;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public viewCtrl: ViewController,
    public loading: LoadingController) {
        
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];

  }

  ionViewWillEnter() {
    this.loadData();
  }
  
  change(value) {
    this.loadData();
  }

  loadData() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id, "industry" : this.queryIndustry};
    this.employerService.loadMatchedJobSeekers(param)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status = "success") {
          this.list = data.result; console.log(this.list);
          this.loadMap();
        }
    })
  }

  loadMap(){
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    
    let latLng = new google.maps.LatLng(user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var marker = new google.maps.Marker({
        map: this.map,
        position: latLng
    });

    var infowindow = null;
    
    google.maps.event.addListener(marker, 'click', function() {
        if(infowindow == null) {
            infowindow = new google.maps.InfoWindow({
                map: this.map,
                position: latLng,
                content: user_setting.setting_emp_location_address
            });
        }
        infowindow.open(this.map, this);
    });
    //console.log(user_setting);
    let rd = user_setting.setting_emp_distance; 
    rd = rd*0.621371*1609.3; 
    var circle = new google.maps.Circle({
        map: this.map,
        radius: rd,    // 
        fillColor: '#3ac7f3',
        strokeColor: '#3ac7f3'
    });
    circle.bindTo('center', marker, 'position');
    
    //========================
    let list = this.list;
    var mark = [];
    var ll = [];
    var ct = [];
    for(let i=0; i<list.length; i++) {
        let item = list[i];
        let im = item.user_avatar_url;
        var icon = {
            url: im, // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        ll[i] = new google.maps.LatLng(item.setting_location_lat, item.setting_location_lng);
        mark[i] = new google.maps.Marker({
            map: this.map,
            position: ll[i],
            icon: icon
        });
        ct[i] = item.user_name;
    }
    var infow = [];
    var self = this;
    for(let i=0; i<list.length; i++) {
        infow[i] = null
        google.maps.event.addListener(mark[i], 'click', function() {
            if(infow[i] == null) {
                infow[i] = new google.maps.InfoWindow({
                    map: this.map,
                    position: ll[i],
                    content: "<div class='div_info' id='div_"+i+"'>"+ct[i]+"<br/><small>"+self.config.calcCrow(self.list[i].setting_location_lat, self.list[i].setting_location_lng, user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng)+"</small><div>"
                });
            }
            infow[i].open(this.map, this);
            google.maps.event.addListener(infow[i], 'domready', function() {
                $('#div_'+i).click(function(){
                    self.goSeeker(i);
                })
            });
        });
        
    }
  }

  goSeeker(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }

  goList() {
      this.viewCtrl.dismiss();
  }

  search(value) {
    
  }
}
