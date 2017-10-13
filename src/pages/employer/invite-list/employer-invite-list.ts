import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';

@Component({
  selector: 'page-employer-invite-list',
  templateUrl: 'employer-invite-list.html'
})
export class EmployerInviteListPage {

  list: any;
  data: any;
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
    this.loadData();
  }

  loadData() {
    let user_setting = JSON.parse(localStorage.getItem('user_setting'));
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"job_id" : this.data.job_id};
    this.employerService.postData("loadjobinvites", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result;
          for(let i=0; i<this.list.length; i++) {
            let item = this.list[i];
            this.list[i].time = this.config.getDiffDateString(this.list[i].timediff);
            this.list[i]['distance'] = this.config.calcCrow(this.list[i].setting_location_lat, this.list[i].setting_location_lng, user_setting.setting_emp_location_lat, user_setting.setting_emp_location_lng);
          }
        }
    })
  }
  getDate(date) {
      return new Date(date+' UTC');
  }

  delete(i) {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let seekerID = this.list[i].user_id;
    let param = {"job_id" : this.data.job_id, "seeker_id" : seekerID};
    this.employerService.postData("deletejobapplicant", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list.slice(i, 1);
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  view(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }


}
