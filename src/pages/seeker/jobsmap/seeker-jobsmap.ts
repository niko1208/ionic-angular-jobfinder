import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Slides, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerJobdetailPage } from '../jobdetail/seeker-jobdetail';
import { SeekerSavedPage } from '../saved/seeker-saved';
import { SeekerAppliedPage } from '../applied/seeker-applied';
import $ from 'jquery';
declare var google;

@Component({
  selector: 'page-seeker-jobsmap',
  templateUrl: 'seeker-jobsmap.html'
})
export class SeekerJobsmapPage {

  arrIndustry = [];
  queryIndustry = "";
  list: any;
  @ViewChild('slides') slides: Slides;
  @ViewChild('mapsjob') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public viewCtrl: ViewController,
    public seekerService: SeekerService,
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
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"seeker_id" : this.config.user_id, "industry" : this.queryIndustry, "seeker_lat" : user_setting.setting_location_lat, "seeker_lng" : user_setting.setting_location_lng, "seeker_distance" : user_setting.setting_distance};
    this.seekerService.postData("loadmatchjobs", param)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status = "success") { console.log(data); 
          this.list = data.result;
          for(let i=0; i<this.list.length; i++) {
            let item = this.list[i];
            this.list[i]['timeago'] = this.config.getDiffDateString(this.list[i].timediff);
            this.list[i]['distance'] = this.config.calcCrow(this.list[i].job_location_lat, this.list[i].job_location_lng, user_setting.setting_location_lat, user_setting.setting_location_lng);
          }
          this.loadMap();
        } else {
          this.util.createAlert("Failed"!, data.result);
        }
    }, error => {
        loader.dismissAll();
        alert("Error");
    })
  }

  loadMap(){
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    console.log(user_setting);
    let latLng = new google.maps.LatLng(user_setting.setting_location_lat, user_setting.setting_location_lng);
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
                content: user_setting.setting_location_address
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
        let im = item.job_job_avatar_url;
        var icon = {
            url: im, // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        ll[i] = new google.maps.LatLng(item.job_location_lat, item.job_location_lng);
        mark[i] = new google.maps.Marker({
            map: this.map,
            position: ll[i],
            icon: icon
        });
        ct[i] = item.job_company_name;
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
                    content: "<div class='div_info' id='div_"+i+"'>"+ct[i]+"<br/><small>"+self.config.calcCrow(self.list[i].job_location_lat, self.list[i].job_location_lng, user_setting.setting_location_lat, user_setting.setting_location_lng)+"</small><div>"
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
    let item = this.list[i];
    this.navCtrl.push(SeekerJobdetailPage, {data: item});
  }

  goList() {
      this.viewCtrl.dismiss();
  }

  goLiked() {
    this.navCtrl.push(SeekerSavedPage);
  }

  goApplied() {
    this.navCtrl.push(SeekerAppliedPage);
  }

  search(value) {
    
  }
}
