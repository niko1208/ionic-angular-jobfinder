import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { MessageService } from '../../../provider/message-service';

@Component({
  selector: 'page-seeker-notification',
  templateUrl: 'seeker-notification.html'
})
export class SeekerNotificationPage {

  list: any;
  slist: any;
  jobSeekerID: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public messageService: MessageService,
    public loading: LoadingController,
    public navParams: NavParams) {
        
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"receiver_type" : "seeker", "receiver_id" : this.config.user_id};
    this.messageService.postData("loadnotifications", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result;
          for(let i =0;i <this.list.length; i++) {
              let noti_type = this.list[i].notification_type;
              this.list[i]['date'] = this.config.getDiffDateString(this.list[i].timediff);
              if(noti_type == "message_text" || noti_type == "message_photo" || noti_type == "message_video") {
                  this.list[i]['msg'] = "You have received a notification in messaging";
              } else {
                  this.list[i]['msg'] = "You have received a notification in Applied Jobs";
              }
          }
          this.search("");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  goPage(item) {
    let noti_type = item.notification_type;
    if(noti_type == "message_text" || noti_type == "message_photo" || noti_type == "message_video") {
        this.navCtrl.parent.select(4); 
    } else {
        this.navCtrl.parent.select(3); 
    }
  }
  delete() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"receiver_type" : "employer", "receiver_id" : this.config.user_id};
    this.messageService.postData("deletenotifications", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.list = [];
          this.search("");
          this.util.createAlert("", data.result);
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  search(value) {
    this.slist = this.filterItems(value);
  }
  filterItems(searchTerm) {
    return this.list.filter((item) => {
      for(var key in item) { 
        if(item[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
      }
      return false;
    })
  }
}
