import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerEditaboutPage } from '../editabout/seeker-editabout';
import { SeekerEditcurworkPage } from '../editcurwork/seeker-editcurwork';
import { SeekerEditeducationPage } from '../editeducation/seeker-editeducation';
import { SeekerEditexperiencePage } from '../editexperience/seeker-editexperience';
import { SeekerEditlanguagePage } from '../editlanguage/seeker-editlanguage';
import { SeekerEditreferencePage } from '../editreference/seeker-editreference';
import * as $ from 'jquery';

@Component({
  selector: 'page-seeker-editprofile',
  templateUrl: 'seeker-editprofile.html'
})
export class SeekerEditProfilePage {

  file_image = null;

  data: any;
  userinfo: any;
  experience: any;
  curwork: any;
  education: any;
  language: any;
  reference: any;

  @ViewChild('fileInpsedit') fileInput: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        
            this.userinfo = this.config.userinfo['user_info'];
            this.experience = this.config.userinfo['user_experience'];
            this.curwork = this.config.userinfo['user_curwork'];
            this.education = this.config.userinfo['user_education'];
            this.language = this.config.userinfo['user_language'];
            this.reference = this.config.userinfo['user_reference'];
  }

  ionViewWillEnter() {
    this.file_image = null;
    this.loadData();
  }

  loadData() {
    let param = {"seeker_id" : this.config.user_id};
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("loadmyinfo", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.userinfo = data.resultUser;
            this.experience = data.resultExperience;
            this.curwork = data.resultCurWork;
            this.education = data.resultEducation;
            this.language = data.resultLanguage;
            this.reference = data.resultReference;
        } else {
          this.util.createAlert("Failed to Load!", data.result);
        }
    }, err => {
      loader.dismissAll();
      this.util.createAlert("Server Failed!", "");
    });
  }

  upload_image() {
    this.fileInput.nativeElement.click();
  }
  setFileImage(event) { 
    this.file_image = event.srcElement.files[0];
    var file    = this.file_image;
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      $('#image_emp').attr('src', reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  goAbout() {
      this.navCtrl.push(SeekerEditaboutPage, {data: this.userinfo}, this.config.navOptions);
  }

  goCurwork(item) {
    let edit = (item == null)? false : true;
      this.navCtrl.push(SeekerEditcurworkPage, {data: item, edit:edit}, this.config.navOptions);
  }
  goExp(item){
    let edit = (item == null)? false : true;
    this.navCtrl.push(SeekerEditexperiencePage, {data: item, edit:edit}, this.config.navOptions);
  }
  goEdu(item){
    let edit = (item == null)? false : true;
    this.navCtrl.push(SeekerEditeducationPage, {data: item, edit:edit}, this.config.navOptions);
  }
  goLang(item){
    let edit = (item == null)? false : true;
    this.navCtrl.push(SeekerEditlanguagePage, {data: item, edit:edit}, this.config.navOptions);
  }
  goRef(item){
    let edit = (item == null)? false : true;
    this.navCtrl.push(SeekerEditreferencePage, {data: item, edit:edit}, this.config.navOptions);
  }

  save() {
    if(!(this.file_image)) {
      this.util.createAlert("", "Please insert your avatar");
      return;
    }
    if(this.userinfo.user_name == "") {
      this.util.createAlert("", "Please insert your name");
      return;
    }

    let param = {"avatar" : this.file_image, "seeker_id" : this.config.user_id, "name" : this.userinfo.user_name};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.seekerService.postData("editprofile", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          let resultUser = JSON.stringify(data.resultUser);
          localStorage.setItem('user_info', resultUser);
        } else {
          this.util.createAlert("Failed", data.result)
        }
    })
    
  }

}
