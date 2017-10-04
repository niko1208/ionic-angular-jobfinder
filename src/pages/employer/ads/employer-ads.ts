import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import * as $ from 'jquery';

@Component({
  selector: 'page-employer-ads',
  templateUrl: 'employer-ads.html'
})
export class EmployerAdsPage {

  file_image = null;
  file_photo = null;

  list: any;
  photolist: any;
  general: any;
  desc = "";

  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileInp1') fileInput1: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams) {

  }

  ionViewWillEnter() {
    let param = {"employer_id" : this.config.user_id};
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.employerService.postData("adsloadmine", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.general = data.resultGeneral; 
            this.list = data.resultMyJobs; 
            this.photolist = data.resultPhotos;
            if(this.general != null)
              this.desc = this.general.tbl_ads_description;
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  upload_image() {
    this.fileInput.nativeElement.click();
  }
  setFileImage(event) { 
    this.file_image = event.srcElement.files[0];
    var file    = this.file_image;
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      $('#image_ads').attr('src', reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  upload_photo() {
    this.fileInput1.nativeElement.click();
  }
  setFilePhoto(event) { 
    this.file_photo = event.srcElement.files[0];

    let param = {"photo" : this.file_photo, "employer_id" : this.config.user_id, "photo_title" : ""};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.employerService.postData("adsuploadphoto", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.photolist = data.resultPhotos; 
        }
    })
  }

  done() {
    let param = {"avatar" : this.file_image, "employer_id" : this.config.user_id, "description" : this.desc};

    if(this.desc == "") {
       this.util.createAlert("Failed", "Please add Description for your Ads!");
    }
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.employerService.postData("adsgeneral_web", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.general = data.resultGeneral; 
        }
    })
  }

}
