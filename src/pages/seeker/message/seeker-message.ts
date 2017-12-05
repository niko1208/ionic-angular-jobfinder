import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { MessageService } from '../../../provider/message-service';
import { SeekerMessageroomPage } from '../messageroom/seeker-messageroom';

import * as $ from 'jquery';

@Component({
  selector: 'page-seeker-message',
  templateUrl: 'seeker-message.html'
})
export class SeekerMessagePage {

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
  timer = null;


  @ViewChild('fileInp') fileInput: ElementRef;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public messageService: MessageService,
    public loading: LoadingController) {
        
  }
  
  ionViewWillEnter() {
    this.user_info = JSON.parse(localStorage.getItem('user_info'));
    this.user_setting = JSON.parse(localStorage.getItem('user_setting'));

    this.loadData();

  }

  ionViewWillLeave() {
    clearTimeout(this.timer);
  }

  loadData() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"loader_type" : "seeker", "loader_id" : this.config.user_id};
    this.messageService.postData("loadroom", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result;
          for(let i =0;i <this.list.length; i++) {
            this.list[i]['mdate'] = new Date(this.list[i].timediff*1000);
          }
        }
    }, error => {
        loader.dismissAll();
        alert("Error");
    });
  }

  openMessage(item, i) {
    this.navCtrl.push(SeekerMessageroomPage, {item: item}, this.config.navOptions);
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
            mlist[i]['my_senderID'] = "seeker_"+this.config.user_id;
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
    let my_type = this.sitem.message_sender_type; my_type = "seeker";
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
    let my_type = this.sitem.message_sender_type; my_type = "seeker";
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
    this.timer = setTimeout(() => {
      self.loadBack();
    }, 5000);

    if(!(this.pending)) {
      this.loadNewMessage();
    }
  }

}
