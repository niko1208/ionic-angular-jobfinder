import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { Camera, MediaCapture, File, Transfer, FilePath, MediaFile } from 'ionic-native';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { DatePicker } from '@ionic-native/date-picker';
import { VideoEditor } from '@ionic-native/video-editor';
import { Base64 } from '@ionic-native/base64';
//import { VideoPlayer } from '@ionic-native/video-player';
import { VideoPage } from "../video/video";

import * as $ from 'jquery';

@Component({
  selector: 'page-seeker-editabout',
  templateUrl: 'seeker-editabout.html'
})
export class SeekerEditaboutPage {

  @ViewChild('fileInpsabout') fileInpsabout: ElementRef;
  data: any;
  video: any;
  thumb: any;
  thumb1: any;
  targetPath: any;
  filename: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private videoEditor: VideoEditor,
    private base64: Base64,
    public actionSheetCtrl: ActionSheetController,
    //private videoPlayer: VideoPlayer,
    private datePicker: DatePicker) {
        this.data = navParams.get('data');
        this.targetPath = this.data.user_video_url;
        this.thumb1 = this.data.user_video_thumb_url;
  }

  goPlayer() {
    this.navCtrl.push(VideoPage, {data:this.targetPath});
    /*
    this.videoPlayer.play(this.targetPath).then(() => {
      alert('video completed');
    }).catch(err => {
      alert("Error" + JSON.stringify(err));
    });*/
  }

  ionViewWillEnter() {
    //this.data = this.navParams.get('data');
    this.loadData();
  }

  loadData() {
    console.log(this.data);
    this.video = this.data.user_video_url;
  }

  presentActionSheet() {
   const actionSheet = this.actionSheetCtrl.create({
     title: '',
     buttons: [
       {
         text: 'Get Video',
         handler: () => {
           this.upload_video1();
         }
       },
       {
         text: 'Take Video',
         handler: () => {
           this.upload_video();
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

  upload_video1() {
    var ffname = new Date().getTime();
    var fname = ffname.toString(); 
    var tt = this;
    
    var options = {
      sourceType: 2,
      mediaType: 1
    };
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    Camera.getPicture(options).then((data) => {
      var ary = data.split('/');
      data = "file://" + data;
      tt.video = data;
      tt.targetPath = data;
      tt.filename = ary[ary.length-1];
      //$('#video').attr('src', tt.targetPath);

      tt.videoEditor.createThumbnail({
        fileUri: data,
        outputFileName: fname,
        atTime: 1,
        quality: 100
      })
      .then((data) => {
        var ary1 = data.split('/'); 
        data = "file://" + data; tt.thumb1 = data;
        tt.base64.encodeFile(data).then((base64File) => {
          loader.dismiss();
          var ary1 = base64File.split(','); 
          tt.thumb = "data:image/jpeg;base64," + ary1[1];
        }, err=> {
          loader.dismiss();
        });
      }, err=> {
        loader.dismiss();
      });
    }, err=> {
      loader.dismiss();
    });
  }

  upload_video() {
    var ffname = new Date().getTime();
    var fname = ffname.toString();
    var tt = this;
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    MediaCapture.captureVideo().then((videodata) => {
      console.log(JSON.stringify(videodata));
      this.video = videodata[0];
      tt.targetPath = this.video['fullPath'];
      tt.filename = this.video['name'];
      //$('#video').attr('src', tt.targetPath);
      //alert(tt.targetPath);
      tt.videoEditor.createThumbnail({
        fileUri: tt.targetPath,
        outputFileName: fname,
        atTime: 1,
        quality: 100
      })
      .then((data) => {
        var ary1 = data.split('/'); 
        data = "file://" + data; tt.thumb1 = data;
        tt.base64.encodeFile(data).then((base64File) => {
          loader.dismiss();
          var ary1 = base64File.split(','); 
          tt.thumb = "data:image/jpeg;base64," + ary1[1];
        }, err=>{
          loader.dismiss();
          alert("error: base64");
        });
      }, err=> {
        loader.dismiss();
      });
    }, err=>{
      loader.dismiss();
    });
  }

  save() {
    
    if(this.data.user_mobile == "") {
      this.util.createAlert("", "Please insert your Mobile Number!");
      return;
    }
    if(this.data.user_email == "") {
      this.util.createAlert("", "Please insert your email!");
      return;
    }
    if(!(this.config.validateEmail(this.data.user_email))) {
      this.util.createAlert("", "Please insert a valid email!");
      return;
    }
    if(this.data.user_gender == "") {
      this.util.createAlert("", "Please select your gender!");
      return;
    }
    if(this.data.user_birthday == "") {
      this.util.createAlert("", "Please select your birthday!");
      return;
    }
    if(this.data.user_about == "") {
      this.util.createAlert("", "Please tell us more about you!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "mobile" : this.data.user_mobile, "email" : this.data.user_email, "gender" : this.data.user_gender, "birthday" : this.data.user_birthday, "about" : this.data.user_about, "videoThumb": this.thumb};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    var tt = this;
    if(this.video && this.video != this.data.user_video_url) {
      

      var options = {
        fileKey: "file",
        fileName: tt.filename,
        chunkedMode: false,
        mimeType: "video/mp4",
        params : param
      };
      
      const fileTransfer = new Transfer();
      let url = this.config.getAPIURL() + "/jobseeker/editseekeraboutvideo1.php";
      fileTransfer.upload(tt.targetPath, url, options).then((data: any) => {
        loader.dismiss();
        data = JSON.parse(data.response);
        console.log(data);
        if(data.status == "success") {
          tt.navCtrl.pop();
        } else {
          tt.util.createAlert("Failed", data.result)
        }
      }, err => {
        console.log(JSON.stringify(err));
        loader.dismiss();
        alert('Error while uploading file.');
      });
      
    } else {
      this.seekerService.postData("editseekerabout", param)
      .subscribe(data => { 
          loader.dismissAll();
          if(data.status == "success") {
            this.navCtrl.pop();
          } else {
            this.util.createAlert("Failed", data.result)
          }
      })
    }
  }

  showDate() {
    let cdate = new Date(this.data.user_birthday);
    if(this.data.user_birthday == "") cdate = new Date();
    this.datePicker.show({
      date: cdate,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.data.user_birthday = this.config.formatDate(date);
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

}
