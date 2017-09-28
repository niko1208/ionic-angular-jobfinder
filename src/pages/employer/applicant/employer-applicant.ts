import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerInviteListPage } from '../invite-list/employer-invite-list';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';
import { EmployerChatbotPage } from '../chatbot/employer-chatbot';

@Component({
  selector: 'page-employer-applicant',
  templateUrl: 'employer-applicant.html'
})
export class EmployerApplicantPage {

  list: any;
  data: any;
  isshowAlert = false;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.data = navParams.get('data');
  }
  ionViewWillEnter() {
    this.isshowAlert = true;
    this.loadData();
  }

  ok() {
    this.isshowAlert = false;
  }

  loadData() {
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"job_id" : this.data.job_id};
    this.employerService.postData("loadjobapplicants", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.list = data.result;
            for(let i=0; i<this.list.length; i++) {
              this.list[i]['applied_date'] = this.config.getDiffDateString(this.list[i].timediff);
              this.list[i]['dis'] = this.config.calcCrow(this.list[i].setting_location_lat, this.list[i].setting_location_lng, user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng);
            }
        }
    })
  }
  getDate(date) {
      return new Date(date+' UTC');
  }

  goApplied() {
      this.navCtrl.push(EmployerInviteListPage, {data: this.data}, this.config.navOptions);
  }

  add(i) {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"job_id" : this.data.job_id, "seeker_id" : this.list[i].user_id, "employer_id" : this.config.user_id, "first_message" : "Congratulations, you have been shortlisted!"};
    this.employerService.postData("shortlistseeker", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.list = data.result;
        }
    })
  }
  delete(i) {
    if(confirm("Are you sure?")) {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"job_id" : this.data.job_id, "seeker_id" : this.list[i].user_id};
    this.employerService.postData("declinejobapplicant", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.list = data.result;
        }
    })
    }
  }

  view(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }

  openbot(i) {
    let seekerID = this.list[i].user_id;
    let avatar_url = this.list[i].user_avatar_url;
    let user_name = this.list[i].user_name;
    this.navCtrl.push(EmployerChatbotPage, {seeker_id: seekerID, job_id: this.data.job_id, avatar:avatar_url, user_name: user_name});
  }

}