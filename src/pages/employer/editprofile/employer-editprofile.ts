import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { Camera, File, Transfer, FilePath  } from 'ionic-native';
import * as $ from 'jquery';

@Component({
  selector: 'page-employer-editprofile',
  templateUrl: 'employer-editprofile.html'
})
export class EmployerEditProfilePage {

  arrIndustry = [];
  arrPosition = [];

  file_image = null;

  data: any;
  userinfo: any;

  public image = null;

  @ViewChild('fileInp') fileInput: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];
        this.arrPosition = ["Full Time", "Part Time", "Casual", "Contract", "Internship"];
        this.data = navParams.get('data');
        this.userinfo = navParams.get('userinfo');

  }
  presentActionSheet() {
   const actionSheet = this.actionSheetCtrl.create({
     title: '',
     buttons: [
       {
         text: 'Camera',
         handler: () => {
           //this.clickCamera = true;
           this.takePicture(Camera.PictureSourceType.CAMERA);
         }
       },
       {
         text: 'Libaray',
         handler: () => {
           //this.clickCamera = true;
           this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
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
  
   takePicture(opt){
     var options = {
      quality: 50,
      //allow: true,
      sourceType: opt,
      destinationType: Camera.DestinationType.DATA_URL,
      //saveToPhotoAlbum: false,
      //encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000
    };
    Camera.getPicture(options).then((imagePath) => {
      // imageData is a base64 encoded string
        this.image = "data:image/jpeg;base64," + imagePath;
        $('#image_emp').attr('src', this.image);
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
      this.image = null;
        console.log(err);
    });
  }

  ionViewWillEnter() {
    this.file_image = null;
    console.log(this.userinfo);
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
    if(!(this.image)) {
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
    
    let param = {"avatar" : this.image, "employer_id" : this.config.user_id, "name" : this.userinfo.user_name, "about" : this.data.profile_emp_about, "founded" : this.data.profile_emp_founded, "info_tech" : this.data.profile_emp_tech, "bus_size_title" : this.data.profile_emp_bus_size_title, "bus_size_min" : strBusSizeMin, "bus_size_max" : strBusSizeMax};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.employerService.postData("editprofile_web", param)
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
