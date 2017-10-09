import { Component , ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides, AlertController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerJobdetailPage } from '../jobdetail/seeker-jobdetail';
import { SeekerSavedPage } from '../saved/seeker-saved';

@Component({
  selector: 'page-seeker-jobs',
  templateUrl: 'seeker-jobs.html'
})
export class SeekerJobsPage {

  arrIndustry = [];
  queryIndustry = "";
  list: any;
  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public seekerService: SeekerService,
    public alertCtrl: AlertController,
    public loading: LoadingController) {
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];
  }

  ionViewWillEnter() {
    
    this.loadData();
    this.slides.lockSwipes(true);
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
        } else {
          this.util.createAlert("Failed"!, data.result);
        }
    }, error => {
        loader.dismissAll();
        alert("Error");
    })
  }

  like(i) {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let job_id = this.list[i].job_id;
    let param = {"seeker_id" : this.config.user_id, "job_id" : job_id};
    this.seekerService.postData("likeadd", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.util.createAlert("Success", "Liked!");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    }, error => {
        loader.dismissAll();
        this.util.createAlert("Server error!", "");
    })
  }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  apply(i) {
    let user_info = JSON.parse(localStorage.getItem('user_info'));;
    let job_id = this.list[i].job_id;
    let employer_id = this.like[i].job_employer_id;
    let seeker_name = user_info.user_name;
    if(this.list[i].job_bot_state == '1') {
      let param = {"job_id" : job_id, "seeker_id" : this.config.user_id, "employer_id" : employer_id};
      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      this.seekerService.postData("applyjobbotchat", param)
      .subscribe(data => { 
          loader.dismissAll();
          if(data.status == "success") {
            
          } else {
            this.util.createAlert("Failed", data.result);
          }
      }, error => {
          loader.dismissAll();
          this.util.createAlert("Server error!", "");
      })
    } else {
      let param = {"job_id" : job_id, "seeker_id" : this.config.user_id, "seeker_name" : seeker_name, "employer_id" : employer_id};
      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      this.seekerService.postData("applyjob", param)
      .subscribe(data => { 
          loader.dismissAll();
          if(data.status == "success") {
            this.util.createAlert("Success", "Applied!");
          } else {
            this.util.createAlert("Failed", data.result);
          }
      }, error => {
          loader.dismissAll();
          this.util.createAlert("Server error!", "");
      })
    }
  }

  readMore(i) {
    let item = this.list[i];
    this.navCtrl.push(SeekerJobdetailPage, {data: item});
  }

  change(value) {
    this.loadData();
  }

  goLiked() {
    this.navCtrl.push(SeekerSavedPage);
  }

  goMap() {
    //this.navCtrl.push(EmployerHomeMapPage);
  }

  search(value) {
    
  }
}
