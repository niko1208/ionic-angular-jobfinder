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
        }
    })
  }
  getDate(date) {
      return new Date(date+' UTC');
  }

  delete(i) {

  }

  view(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }


}
