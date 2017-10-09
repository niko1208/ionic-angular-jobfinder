import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-jobdetail',
  templateUrl: 'seeker-jobdetail.html'
})
export class SeekerJobdetailPage {

  data: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
        this.data = navParams.get('data');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  like() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let job_id = this.data.job_id;
    let param = {"seeker_id" : this.config.user_id, "job_id" : job_id};
    this.seekerService.postData("likeadd", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.util.createAlert("Success", "Liked!");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    }, error => {
        loader.dismissAll();
        this.util.createAlert("Server error!", "");
    })
  }

  apply() {
    let user_info = JSON.parse(localStorage.getItem('user_info'));;
    let job_id = this.data.job_id;
    let employer_id = this.data.job_employer_id;
    let seeker_name = user_info.user_name;
    if(this.data.job_bot_state == '1') {
      let param = {"job_id" : job_id, "seeker_id" : this.config.user_id, "employer_id" : employer_id};
      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      this.seekerService.postData("applyjobbotchat", param)
      .subscribe(data => { 
          loader.dismissAll();
          if(data.status == "success") {
            
          } else {
            this.util.createAlert("Failed", data.result);
          }
      }, error => {
          loader.dismissAll();
          this.util.createAlert("Server error!", "");
      })
    } else {
      let param = {"job_id" : job_id, "seeker_id" : this.config.user_id, "seeker_name" : seeker_name, "employer_id" : employer_id};
      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      this.seekerService.postData("applyjob", param)
      .subscribe(data => { 
          loader.dismissAll();
          if(data.status == "success") {
            this.util.createAlert("Success", "Applied!");
          } else {
            this.util.createAlert("Failed", data.result);
          }
      }, error => {
          loader.dismissAll();
          this.util.createAlert("Server error!", "");
      })
    }
  }

}
