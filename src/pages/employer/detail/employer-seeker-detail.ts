import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerSavedPage } from '../saved/employer-saved';

@Component({
  selector: 'page-employer-seeker-detail',
  templateUrl: 'employer-seeker-detail.html'
})
export class EmployerSeekerDetailPage {

  list: any;
  jobSeekerID: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.jobSeekerID = navParams.get("seeker_id");
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
      let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"seeker_id" : this.jobSeekerID};
    this.employerService.postData("loadjobseekerinfo", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data;
        }
    })
  }

  invite() {
    this.navCtrl.push(EmployerInvitePage, {seeker_id: this.jobSeekerID});
  }

  liked() {
    this.navCtrl.push(EmployerSavedPage, {seeker_id: this.jobSeekerID});
  }

}
