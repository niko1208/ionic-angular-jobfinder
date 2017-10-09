import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { SeekerService } from '../../../provider/seeker-service';
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

  @ViewChild('file_image_seditprofile') fileInput: ElementRef;

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
    console.log(this.userinfo);
    console.log(this.experience);
    console.log(this.curwork);
    console.log(this.education);
    console.log(this.language);
    console.log(this.reference);
  }

  ionViewWillEnter() {
    this.file_image = null;
    this.loadData();
  }

  loadData() {
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

  save() {
    if(!(this.file_image)) {
      this.util.createAlert("", "Please insert your avatar");
      return;
    }
    if(this.userinfo.user_name == "") {
      this.util.createAlert("", "Please insert your name");
      return;
    }
    if(this.data.profile_emp_about == "" || this.data.profile_emp_about == "Please select Founded Date") {
      this.util.createAlert("", "Please insert your description");
      return;
    }
    if(this.data.profile_emp_founded == "") {
      this.util.createAlert("", "When was your company founded? Please select date");
      return;
    }

    var strBusSizeMin = '1';
    var strBusSizeMax = '50';
    if (this.data.profile_emp_bus_size_title == "Small")
    {
        strBusSizeMin = "1";
        strBusSizeMax = "50";
    }
    else if (this.data.profile_emp_bus_size_title == "Medium")
    {
        strBusSizeMin = "50";
        strBusSizeMax = "500";
    }
    else if (this.data.profile_emp_bus_size_title == "Large")
    {
        strBusSizeMin = "500";
        strBusSizeMax = "2000";
    }
    else if (this.data.profile_emp_bus_size_title == "Enterprise")
    {
        strBusSizeMin = "2000";
        strBusSizeMax = "5000";
    }
    
    let param = {"avatar" : this.file_image, "employer_id" : this.config.user_id, "name" : this.userinfo.user_name, "about" : this.data.profile_emp_about, "founded" : this.data.profile_emp_founded, "info_tech" : this.data.profile_emp_tech, "bus_size_title" : this.data.profile_emp_bus_size_title, "bus_size_min" : strBusSizeMin, "bus_size_max" : strBusSizeMax};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.seekerService.postData("editprofile_web", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          let resultUser = JSON.stringify(data.resultUser);
          let resultProfile = JSON.stringify(data.resultProfile);
          localStorage.setItem('user_info', resultUser);
          localStorage.setItem('user_profile', resultProfile);
          this.util.createAlert("", "SUCCESS!")
        } else {
          this.util.createAlert("Failed", data.result)
        }
    })
    
  }

}
