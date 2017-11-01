import { Component , ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides, AlertController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerSavedPage } from '../saved/employer-saved';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';
import { EmployerSettingPage } from '../setting/employer-setting';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerHomeMapPage } from '../home-map/employer-home-map';

@Component({
  selector: 'page-employer-home',
  templateUrl: 'employer-home.html'
})
export class EmployerHomePage {

  arrIndustry = [];
  arrCertification = [];
  arrInterest = [];
  queryIndustry = "";
  list: any;
  showSearch = false;

  queryExperienceCity = ""; 
  queryExperienceCountry = "";
  queryExperienceRole = "";
  queryCurWorkCity = "";
  queryCurWorkCountry = "";
  queryCurWorkRole = "";
  queryEducation = "";
  queryLanguage = "";
  queryCertificate = "";
  queryInterest = "";

  isexperience = false;
  iscurwork = false;
  isedu = false;
  islang = false;
  iscert = false;
  isinterest = false;

  ttime = 300;

  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public alertCtrl: AlertController,
    public loading: LoadingController) {
        
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];

        this.arrCertification = ["#Sijil Kemahiran Malaysia ( SKM 1 )", "#Sijil Kemahiran Malaysia ( SKM 2 )", "#Sijil Kemahiran Malaysia ( SKM 3)", "#Diploma Kemahiran Malaysia ( DKM )", "#Diploma Lanjutan Kemahiran Malaysia ( DLKM )", "#IEP/IELTS", "#Certification in Early Childhood Education", "#Certification in English", "#ESOL UK", "#PCIF", "#TEFL (LTTC) UK", "#Certificate in Outsourcing Professional ( COP )", "#Professional Engineer ( PE )", "#CEng", "#CSci", "#CEnv", "#CEng", "#CSDA", "#CSDP", "#WCET", "#CCP", "#IPPC", "#CQIF", "#IFP", "#CFP", "#ACCA", "#CPA", "#CFA", "#CIMA", "#ACA", "#CFE", "#CIA", "#CISA", "#Microsoft Professional Certification", "#Oracle Professional Certification", "#CISCO Professional Certification", "#CIPD Level 3", "#CIPD Level 5", "#CIPD Level 7", "#CHA", "#SCAE Barista Basic", "#SCAE Barista Intermediate", "#SCAE Barista Professional", "#Latte Art Basic", "#Latte Art Advanced", "#Mixologist", "CIDB Green Card"];

        this.arrInterest = ["#Reading", "#Travelling", "#Blogging", "#Collecting", "#Volunteer Work/Community", "#Cooking", "#Child Care", "#Sports", "#Music", "#Puzzles and Strategy games", "#Club memberships", "#Public speaking", "#Board games", "#Photography", "#Art & Cultural pursuits", "#Gardening", "#Others"];

  }

  clickExperience() {
    //this.isexperience = !(this.isexperience);
    setTimeout(() => {
      if(!(this.isexperience)) {
        this.queryEducation = ""; 
        this.queryExperienceCountry = "";
        this.queryExperienceRole = "";
      }
    }, this.ttime);
  }
  clickCurwork() {
    //this.iscurwork = !(this.iscurwork);
    setTimeout(() => {
      if(!(this.iscurwork)) {
        this.queryCurWorkCity = "";
        this.queryCurWorkCountry = "";
        this.queryCurWorkRole = "";
      }
    }, this.ttime);
  }
  clickEdu() {
    //this.isedu = !(this.isedu);
    setTimeout(() => {
      if(!(this.isedu)) {
        this.queryEducation = ""; 
      }
    }, this.ttime);
  }
  clickLang() {
    //this.islang = !(this.islang);
    setTimeout(() => {
      if(!(this.islang)) {
        this.queryLanguage = ""; 
      }
    }, this.ttime);
  }
  clickCert() {
    //this.iscert = !(this.iscert);
    setTimeout(() => {
      if(!(this.iscert)) {
        this.queryCertificate = ""; 
      }
    }, this.ttime);
  }
  clickInterest() {
    //this.isinterest = !(this.isinterest);
    setTimeout(() => {
      if(!(this.isinterest)) {
        this.queryInterest = ""; 
      }
    }, this.ttime);
  }

  ionViewWillLeave() {
    this.showSearch = false;
  }

  ionViewWillEnter() {
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    console.log(user_setting);
    if(user_setting == null || user_setting.setting_emp_location_lat == "") { 
      let alert = this.alertCtrl.create({
        title: "Alert!",
        message: "Please define your search parameters in Settings first",
        enableBackdropDismiss: false,
        buttons: [
          {
            text: "Go to Settings",
            handler: data => {
              this.navCtrl.parent.select(1); 
              //this.navCtrl.push(EmployerSettingPage, null, this.config.navOptions);
            }
          }
        ]
      });
      alert.present();
      return;
    }
    this.loadData();
    this.slides.lockSwipes(true);
  }

  loadData() {
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id, "industry" : this.queryIndustry, "experience_city" : this.queryExperienceCity, "experience_country" : this.queryExperienceCountry, "experience_role" : this.queryExperienceRole, "curwork_city" : this.queryCurWorkCity, "curwork_country" : this.queryCurWorkCountry, "curwork_role" : this.queryCurWorkRole, "education" : this.queryEducation, "language" : this.queryLanguage, "certificate" : this.queryCertificate, "interest" : this.queryInterest};

    this.employerService.loadMatchedJobSeekers(param)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status = "success") { 
          this.list = data.result;
          for(let i=0; i<this.list.length; i++) {
            let item = this.list[i];
            this.list[i]['distance'] = this.config.calcCrow(this.list[i].setting_location_lat, this.list[i].setting_location_lng, user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng);
          }
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
    let seekerID = this.list[i].user_id;
    let param = {"employer_id" : this.config.user_id, "seeker_id" : seekerID};
    this.employerService.likeJobSeeker(param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.util.createAlert("Success", "Liked!");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    }, error => {
        loader.dismissAll();
        alert("Error");
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

  invite(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerInvitePage, {seeker_id: seekerID});
  }

  readMore(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }

  change(value) {
    this.loadData();
  }

  goLiked() {
    this.navCtrl.push(EmployerSavedPage);
  }

  goMap() {
    this.navCtrl.push(EmployerHomeMapPage);
  }

  asearch() {
    this.showSearch = true;
  }
  cancel() {
    this.showSearch = false;
  }
  done() {
    this.showSearch = false;
    this.loadData();
  }
  search(value) {
    
  }
}
