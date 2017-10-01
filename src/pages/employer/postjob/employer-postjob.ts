import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerPostjobLocationPage } from '../postjob-location/employer-postjob-location';
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

  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileInp1') fileInput1: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams) {
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
  getDataUri(url, callback) {
      var image = new Image();
      image.crossOrigin="anonymous";

      image.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size

          canvas.getContext('2d').drawImage(image, 0, 0);

          var dataURL = canvas.toDataURL("image/png");
          dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          callback(dataURL);
          /*
          // Get raw image data
          callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

          // ... or get as Data URI
          callback(canvas.toDataURL('image/png'));
          */
      };

      image.src = url;
  }
  convBase64ToFile(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], { type: 'image/jpeg' });
    var file = new File([blob], "image.jpg");
    return file;
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
      if(this.file_image == null) {
        this.util.createAlert("Error", "Please insert your company image!");
        return;
      }
      if(this.file_image_back == null) {
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

    let user_info = JSON.parse(localStorage.getItem('user_info'));
    let user_name = user_info.user_name;
    let job_id = "";
    if(this.bedit) {
      job_id = this.data.job_id;
    }
    let param = {"avatar" : this.file_image, "background" : this.file_image_back, "employer_id" : this.config.user_id, "employer_name" : user_name, "company_name" : this.company_name, "job_title" : this.job_title, "job_description" : this.job_desc, "job_requirement" : this.job_req, "time_available" : this.job_time, "industry" : this.job_industry, "location_address" : this.data.job_location_address, "location_lat" : this.data.job_location_lat, "location_lng" : this.data.job_location_lng, "job_id" : job_id};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    if(this.bedit) {
      this.employerService.postData("editjob_web", param)
      .subscribe(data => { console.log(data);
          loader.dismissAll();
          if(data.status == "success") {
            
          }
      })
    } else {
      this.employerService.postData("createjob", param)
      .subscribe(data => { console.log(data);
          loader.dismissAll();
          if(data.status == "success") {
            this.util.createAlert("Success", "Job has been successfully Posted!");
            this.cleanField();
          }
      })
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
