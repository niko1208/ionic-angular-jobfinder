import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController, ViewController, ActionSheetController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerPostjobLocationPage } from '../postjob-location/employer-postjob-location';
import { EmployerAddbotPage } from '../addbot/employer-addbot';
import { Camera, File, Transfer, FilePath  } from 'ionic-native';
import * as $ from 'jquery';

@Component({
  selector: 'page-employer-postjob',
  templateUrl: 'employer-postjob.html'
})
export class EmployerPostJobPage {

  arrIndustry = [];
  arrPosition = [];

  company_name = "";
  job_title = "";
  job_desc = "";
  job_req = "";
  job_industry = "#alljobs";
  job_time = "Full Time";
  job_location = "";

  file_image_back = null;
  file_image = null;

  bedit = false;
  data: any;

  backimage = null;
  image = null;
  opt = 0;

  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileInp1') fileInput1: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController) {
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];
        this.arrPosition = ["Full Time", "Part Time", "Casual", "Contract", "Internship"];

        this.cleanField();
  }

  ionViewWillEnter() {
    this.job_location = this.data.job_location_address;
    
    /*this.bedit = this.navParams.get('bedit');
    this.data = this.navParams.get('data');
    if(this.bedit) { console.log(this.data);
      $('#back_img').css('background-image', 'url('+this.data.job_job_background_url+')');
      $('#image').attr('src', this.data.job_job_avatar_url);
      this.company_name = this.data.job_company_name;
      this.job_title = this.data.job_job_title;
      this.job_desc = this.data.job_job_description;
      this.job_req = this.data.job_job_requirement;
      this.job_industry = this.data.job_job_industry;
      this.job_time = this.data.job_time_available;
    }*/
  }
  
  presentActionSheet(opt) {
    this.opt = opt;
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            //this.clickCamera = true;
            this.takePicture(opt, Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Library',
          handler: () => {
            //this.clickCamera = true;
            this.takePicture(opt, Camera.PictureSourceType.PHOTOLIBRARY);
            //this.upload_image();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
  
   takePicture(opt, sourceType){
     var options = {
      quality: 50,
      //allow: true,
      sourceType: sourceType,
      destinationType: Camera.DestinationType.DATA_URL,
      //saveToPhotoAlbum: false,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000
    };
    Camera.getPicture(options).then((imagePath) => {
      // imageData is a base64 encoded string
       
        if(this.opt == 0) {
          this.backimage = "data:image/jpeg;base64," + imagePath;
          $('#back_img').css('background-image', 'url('+this.backimage+')');
        } else {
          this.image = "data:image/jpeg;base64," + imagePath;
          $('#imagee').attr('src', this.image);
        }
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
       if(this.opt == 0) {
         this.backimage = null;
       } else {
         this.image = null;
       }
      console.log(err);
    });
  }

  upload_back() {
    this.fileInput.nativeElement.click();
  }
  setFileBack(event) { 
    this.file_image_back = event.srcElement.files[0];
    var file    = this.file_image_back;
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      $('#back_img').css('background-image', 'url('+reader.result+')');
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  upload_image() {
    this.fileInput1.nativeElement.click();
  }
  setFileImage(event) { 
    this.file_image = event.srcElement.files[0];
    var file    = this.file_image;
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      $('#image').attr('src', reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  post() {
    
    if(!(this.bedit)) {
      if(this.image == null) {
        this.util.createAlert("Error", "Please insert your company image!");
        return;
      }
      if(this.backimage == null) {
        this.util.createAlert("Error", "Please insert your background image!");
        return;
      }
    }
    if(this.company_name == "") {
      this.util.createAlert("Error", "Please insert your Company name!");
      return;
    }
    if(this.job_title == "") {
      this.util.createAlert("Error", "Please insert your Job title!");
      return;
    }
    if(this.job_desc == "") {
      this.util.createAlert("Error", "Please insert your Job description!");
      return;
    }
    if(this.job_req == "") {
      this.util.createAlert("Error", "Please insert your Job  requirement!");
      return;
    }
    if(this.job_location == "") {
      this.util.createAlert("Error", "Please insert Job Location!");
      return;
    }

    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let user_name = user_info.user_name;
    let job_id = "";
    if(this.bedit) {
      job_id = this.data.job_id;
    }
    let param = {"avatar" : this.image, "background" : this.backimage, "employer_id" : this.config.user_id, "employer_name" : user_name, "company_name" : this.company_name, "job_title" : this.job_title, "job_description" : this.job_desc, "job_requirement" : this.job_req, "time_available" : this.job_time, "industry" : this.job_industry, "location_address" : this.data.job_location_address, "location_lat" : this.data.job_location_lat, "location_lng" : this.data.job_location_lng, "job_id" : job_id, "job_bot_state":"0"};

    if(user_info.user_membership == 'basic') {
      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      this.employerService.postData("createjob1", param)
      .subscribe(data => { console.log(data);
          loader.dismissAll();
          if(data.status == "success") {
            this.util.createAlert("Congratulations", "Job has been created successfully!");
            this.cleanField();
            //this.navCtrl.pop();
          } else {
            this.util.createAlert("Failed", data.result);
          }
      }, err => {
        loader.dismissAll();
        this.util.createAlert("Failed", "Server error");
      })
    } else {
      let alert = this.alertCtrl.create({
        title: "Alert!",
        message: "Dear Premium Member. Would you like to automate your candidate pre-screening process with AVA, our intelligent Chat Bot?",
        enableBackdropDismiss: false,
        buttons: [
          {
            text: "Sure! Add Bot",
            handler: data => {
              param['job_bot_state'] = "1";
              this.navCtrl.push(EmployerAddbotPage, {param: param, view: this.viewCtrl}, this.config.navOptions);
            }
          }, 
          {
            text: "No, Thanks",
            role: 'cancel',
            handler: data => {
              let loader = this.loading.create({
                content: 'Loading...',
              });
              loader.present();
              this.employerService.postData("createjob1", param)
              .subscribe(data => { console.log(data);
                  loader.dismissAll();
                  if(data.status == "success") {
                    this.util.createAlert("Congratulations", "Job has been created successfully!");
                    this.cleanField();
                    //this.navCtrl.pop();
                  } else {
                    this.util.createAlert("Failed", data.result);
                  }
              }, err => {
                loader.dismissAll();
                this.util.createAlert("Failed", "Server error");
              })
            }
          }
        ]
      });
      alert.present();
    }
  }

  cleanField() {
    this.data = {'job_location_address':'', 'job_location_lat':'', 'job_location_lng':''};
    this.file_image_back = null;
    this.file_image = null;
    $('#back_img').css('background-image', '');
    $('#image').attr('src', '');
    this.company_name = "";
    this.job_title = "";
    this.job_desc = "";
    this.job_req = "";
    this.job_industry = "#alljobs";
    this.job_time = "Full Time";
    this.job_location = this.data.job_location_address;
  }

  jobLocation() {
    this.navCtrl.push(EmployerPostjobLocationPage, {data: this.data});
  }

}
