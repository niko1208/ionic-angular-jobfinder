import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { MessageService } from '../../../provider/message-service';

import { Camera, MediaCapture, File, Transfer, FilePath, MediaFile } from 'ionic-native';
//import { VideoEditor } from '@ionic-native/video-editor';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import * as $ from 'jquery';
declare var cordova : any;
@Component({
  selector: 'page-employer-messageroom',
  templateUrl: 'employer-messageroom.html'
})
export class EmployerMessageroomPage {

  user_info: any;
  user_setting: any;
  user_profile: any;

  list: any;
  mlist: any;
  sitem: any;
  avatar_url: any;

  sendText: any;
  file_image = null;
  isLoading = false;

  pending = true;

  image: any;
  video: any;
  isphoto: any;

  @ViewChild('fileInp') fileInput: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public messageService: MessageService,
    public loading: LoadingController,
    public navParams: NavParams,
  	public platform: Platform,
    //private videoEditor: VideoEditor,
    //private transfer: FileTransfer,
    //private file: File,
    public actionSheetCtrl: ActionSheetController) {
        this.sitem = navParams.get('item');
  }
  
  ionViewWillEnter() {
    this.user_info = JSON.parse(localStorage.getItem('user_info'));
    this.user_setting = JSON.parse(localStorage.getItem('user_setting'));
    this.user_profile = JSON.parse(localStorage.getItem('user_profile'));

    this.openMessage(this.sitem);

  }

  presentActionSheet() {
   const actionSheet = this.actionSheetCtrl.create({
     title: '',
     buttons: [
       {
         text: 'Send Photo',
         handler: () => {
           this.isphoto = true;
           this.takePicture();
         }
       },
       {
         text: 'Take Video',
         handler: () => {
           this.isphoto = false;
           this.takeVideo();
         }
       },
       {
         text: 'Get Video',
         handler: () => {
           this.isphoto = false;
           this.getVideo();
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

  takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        mediaType: Camera.MediaType.PICTURE
    }).then((imageData) => {
        this.isLoading = true;
      // imageData is a base64 encoded string
        this.image = "data:image/jpeg;base64," + imageData;
        this.pending = true;
        let room_id = this.sitem.message_room_id;
        let my_type = this.sitem.message_sender_type; my_type = "employer";
        let other_id = this.sitem.user_id;
        let send_type = "sendphoto1";
        var param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : this.config.user_id, "message_text" : this.sendText, "message_type" : "photo", "other_id" : other_id, "photo": this.image};
        this.messageService.postData(send_type, param)
        .subscribe(data => { 
          this.isLoading = false;
            if(data.status == "success") {
              this.loadNewMessage();
              this.image = null;
            } else {
              this.util.createAlert("Failed", data.result);
            }
            this.image = null;
            this.pending = false;
        }, error => {
            this.isLoading = false;
            this.image = null;
            this.pending = false;
            this.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
        });
    }, (err) => {
        console.log(err);
    });
  }
  public pathForImage(video) {
    if (video === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + video;
    }
  }
  getVideo() {
    var tt = this;
    var options = {
      sourceType: 2,
      mediaType: 1
    };
 
    Camera.getPicture(options).then((data) => {
      var ary = data.split('/');
      data = "file://" + data;
      /*
      tt.videoEditor.createThumbnail({
        fileUri: data,
        outputFileName: 'abc.jpg'
      })
      .then((fileUri: string) => console.log('video transcode success', fileUri))
      .catch((error: any) => console.log('video transcode error', error));
      if(1) return;
      */
      this.isLoading = true;
      let room_id = this.sitem.message_room_id;
      let my_type = this.sitem.message_sender_type; my_type = "employer";
      let other_id = this.sitem.user_id;
      let send_type = "sendvideo1";
      let self = this;

      var targetPath = data;
      var filename = ary[ary.length-1];
      //var targetPath = this.pathForImage(filename); alert(targetPath);

      self.pending = true;
      var param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : self.config.user_id, "message_text" : self.sendText, "message_type" : "video", "other_id" : other_id,  "videoThumb": ""};
      
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "video/mp4",
        params : param
      };
      
      const fileTransfer = new Transfer();
      let url = this.config.getAPIURL() + "/message/sendvideo1.php";
      fileTransfer.upload(targetPath, url, options).then((data: any) => {
        self.isLoading = false;
        data = JSON.parse(data.response);
        console.log(data);
        self.loadNewMessage();
      }, err => {
        console.log(JSON.stringify(err));
        self.isLoading = false;
        alert('Error while uploading file.');
      });
    })
  }
  takeVideo(){ 
    //[{"name":"VID_20171110_111504.mp4","localURL":"cdvfile://localhost/sdcard/DCIM/Camera/VID_20171110_111504.mp4","type":"video/mp4","lastModified":null,"lastModifiedDate":1510283706000,"size":333454,"start":0,"end":0,"fullPath":"file:///storage/sdcard/DCIM/Camera/VID_20171110_111504.mp4"}]
    
    
    MediaCapture.captureVideo().then((videodata) => {
      console.log(JSON.stringify(videodata));
      this.isLoading = true;
      let room_id = this.sitem.message_room_id;
      let my_type = this.sitem.message_sender_type; my_type = "employer";
      let other_id = this.sitem.user_id;
      let send_type = "sendvideo1";
      let self = this;

      this.video = videodata.toString();
      videodata = videodata[0];
      var targetPath = videodata['fullPath'];
      var filename = videodata['name'];
      //var targetPath = this.pathForImage(filename); alert(targetPath);

      self.pending = true;
      var param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : self.config.user_id, "message_text" : self.sendText, "message_type" : "video", "other_id" : other_id,  "videoThumb": ""};
      
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "video/mp4",
        params : param
      };
      
      const fileTransfer = new Transfer();
      let url = this.config.getAPIURL() + "/message/sendvideo1.php";
      fileTransfer.upload(targetPath, url, options).then((data: any) => {
        self.isLoading = false;
        data = JSON.parse(data.response);
        console.log(data);
        self.loadNewMessage();
      }, err => {
        console.log(JSON.stringify(err));
        self.isLoading = false;
        alert('Error while uploading file.');
      });
      
    })
  }

  openMessage(item) {
    this.loadBack();
    
    this.pending = true;

    this.sitem = item;

    this.sendText = "";
    this.file_image = null;

    let room_id = item.room_id;
    let otherType = "seeker";
    let otherID = item.user_id;
    let param = {"room_id" : room_id, "other_type" : otherType, "other_id" : otherID};
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.avatar_url = item.user_avatar_url;
    //let my_name = this.user_info.user_name;
    //let my_avatar_url = this.user_info.user_avatar_url;

    this.messageService.postData("loadmessages", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.mlist = data.result;
          for(let i =0;i <this.mlist.length; i++) {
            this.mlist[i]['mdate'] = new Date(this.mlist[i].timediff*1000);
            this.mlist[i]['senderID'] = this.mlist[i]['message_sender_type']+"_"+this.mlist[i]['message_sender_id'];
            this.mlist[i]['my_senderID'] = "employer_"+this.config.user_id;
            this.mlist[i]['img_url'] = this.avatar_url;
          }
          setTimeout(() => {
            $('.chat_room').scrollTop($('.chat_room').prop("scrollHeight"));
          }, 1000);
        }
        this.pending = false;
    }, error => {
        this.pending = false;
        loader.dismissAll();
        alert("Error");
    });
  }

  loadNewMessage() {
    this.pending = true;
    let room_id = this.sitem.room_id;
    let otherType = "seeker";
    let otherID = this.sitem.user_id;
    let param = {"room_id" : room_id, "other_type" : otherType, "other_id" : otherID};
    this.messageService.postData("loadmessages", param)
    .subscribe(data => { console.log(data);
        if(data.status == "success") {
          let mlist = data.result;
          for(let i =0;i <mlist.length; i++) {
            mlist[i]['mdate'] = new Date(mlist[i].timediff*1000);
            mlist[i]['senderID'] = mlist[i]['message_sender_type']+"_"+mlist[i]['message_sender_id'];
            mlist[i]['my_senderID'] = "employer_"+this.config.user_id;
            mlist[i]['img_url'] = this.avatar_url;
          }
          this.mlist = mlist;
        }
        this.pending = false;
    }, error => {
        this.pending = false;
        //alert("Error");
    });
  }
  getDate(date) {
    var da = new Date(date); 
    return da;
  }

  
  upload_image() {
    this.fileInput.nativeElement.click();
  }
  setFileImage(event) { 
    this.isLoading = true;
    this.file_image = event.srcElement.files[0];
    let room_id = this.sitem.message_room_id;
    let my_type = this.sitem.message_sender_type; my_type = "employer";
    let other_id = this.sitem.user_id;
    var fullPath = $("#file_image").val();    
    var filename = fullPath.replace(/^.*[\\\/]/, '');
    var file_ext = filename.split('.');
    file_ext = file_ext[file_ext.length-1];
    var send_type = "";
    if(file_ext == "jpg" || file_ext == "png") {
      send_type = "sendphoto";
    } else if(file_ext == "mp4" || file_ext == "mpg" || file_ext == "mov" || file_ext == "avi") {
      send_type = "sendvideo";
    } else {
      send_type = "sendother";
    }
    if(send_type == 'sendother') {
      alert("Not support non-image or non-video file.");
      return;
    }

    if(send_type == 'sendvideo') {
      let self = this;
      let url = window.URL.createObjectURL(event.target.files[0]); 
      let $video = $('#videop');
      $video.attr('src', "");
      var step_2_events_fired = 0;
      $video.one('loadedmetadata loadeddata suspend', function() {
          if (++step_2_events_fired == 3) {
            /*
              var canvas = document.getElementById('canvas');
              canvas.height = this.videoHeight;
              canvas.width = this.videoWidth;
              var video = document.getElementById('videop');
              canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
              video_thumb = canvas.toDataURL(); 
              $video.attr('src', '');
              $('.img_video').attr('src', video_thumb);
              */
              self.pending = true;
              var param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : self.config.user_id, "message_text" : self.sendText, "message_type" : "video", "other_id" : other_id, "video": self.file_image, "videoThumb": ""};
              self.messageService.postData(send_type, param)
              .subscribe(data => { 
                self.isLoading = false;
                  if(data.status == "success") {
                    self.loadNewMessage();
                    self.file_image = null;
                  } else {
                    self.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
                  }
                  self.file_image = null;
                  self.pending = false;
              }, error => {
                  self.isLoading = false;
                  self.file_image = null;
                  self.pending = false;
                  self.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
              });
              
          }
      }).prop('src', url);
    } else {
      this.pending = true;
      var param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : this.config.user_id, "message_text" : this.sendText, "message_type" : "photo", "other_id" : other_id, "photo": this.file_image};
      this.messageService.postData(send_type, param)
      .subscribe(data => { 
        this.isLoading = false;
          if(data.status == "success") {
            this.loadNewMessage();
            this.file_image = null;
          } else {
            this.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
          }
          this.file_image = null;
          this.pending = false;
      }, error => {
          this.isLoading = false;
          this.file_image = null;
          this.pending = false;
          this.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
      });
    }
    
    
  }

  send() {
    this.isLoading = true;
    let room_id = this.sitem.message_room_id;
    let my_type = this.sitem.message_sender_type; my_type = "employer";
    let other_id = this.sitem.user_id;
    let param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : this.config.user_id, "message_text" : this.sendText, "message_type" : "text", "other_id" : other_id};

    this.messageService.postData("sendtext", param)
    .subscribe(data => { 
      this.isLoading = false;
        if(data.status == "success") { 
          this.loadNewMessage();
          this.sendText = "";
        } else {
          this.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
        }
    }, error => {
      this.isLoading = false;
      this.util.createAlert("Internet connection failed", "Please check your internet connection and try again.");
    });
  }

  loadBack() {
    let self = this;
    setTimeout(() => {
      self.loadBack();
    }, 5000);

    if(!(this.pending)) {
      this.loadNewMessage();
    }
  }

}
