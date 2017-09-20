import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { MessageService } from '../../../provider/message-service';
import * as $ from 'jquery';

@Component({
  selector: 'page-employer-message',
  templateUrl: 'employer-message.html'
})
export class EmployerMessagePage {

  user_info: any;
  user_setting: any;
  user_profile: any;

  list: any;
  mlist: any;
  sitem: any;

  sendText: any;
  file_image = null;
  isLoading = false;

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
    this.user_profile = JSON.parse(localStorage.getItem('user_profile'));

    this.loadData();
  }

  loadData() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"loader_type" : "employer", "loader_id" : this.config.user_id};
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
    this.sitem = item;

    $('.item').removeClass('sel');
    $('#item_'+i).addClass('sel');
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

    let avatar_url = item.user_avatar_url;
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
            this.mlist[i]['img_url'] = avatar_url;
          }
          setTimeout(() => {
            $('.chat_room').scrollTop($('.chat_room').prop("scrollHeight"));
          }, 1000);
        }
    }, error => {
        loader.dismissAll();
        alert("Error");
    });
  }

  loadNewMessage() {
    let room_id = this.sitem.room_id;
    let otherType = "seeker";
    let otherID = this.sitem.user_id;
    let param = {"room_id" : room_id, "other_type" : otherType, "other_id" : otherID};
    this.messageService.postData("loadmessages", param)
    .subscribe(data => { 
        if(data.status == "success") {
          let mlist = data.result;
          for(let i =0;i <mlist.length; i++) {
            mlist[i]['mdate'] = new Date(mlist[i].timediff*1000);
            mlist[i]['senderID'] = mlist[i]['message_sender_type']+"_"+mlist[i]['message_sender_id'];
            mlist[i]['my_senderID'] = "employer_"+this.config.user_id;
          }
          this.mlist = mlist;
        }
    }, error => {
        alert("Error");
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
    let my_type = this.sitem.message_sender_type;
    let other_id = this.sitem.user_id;
    var param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : this.config.user_id, "message_text" : this.sendText, "message_type" : "photo", "other_id" : other_id, "photo": this.file_image};
    this.messageService.postData("sendphoto", param)
    .subscribe(data => { 
      this.isLoading = false;
        if(data.status == "success") {
          this.loadNewMessage();
          this.file_image = null;
        }
        this.file_image = null;
    }, error => {
      this.isLoading = false;
        this.file_image = null;
        alert("Error");
    });
  }

  send() {
    this.isLoading = true;
    let room_id = this.sitem.message_room_id;
    let my_type = this.sitem.message_sender_type;
    let other_id = this.sitem.user_id;
    let param = {"room_id" : room_id, "sender_type" : my_type, "sender_id" : this.config.user_id, "message_text" : this.sendText, "message_type" : "text", "other_id" : other_id};

    this.messageService.postData("sendtext", param)
    .subscribe(data => { 
      this.isLoading = false;
        if(data.status == "success") { 
          this.loadNewMessage();
          this.sendText = "";
        }
    }, error => {
      this.isLoading = false;
        alert("Error");
    });
  }

}
