import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerAboutPage } from '../about/employer-about';
import { EmployerExperiencePage } from '../experience/employer-experience';
import { EmployerWorkPage } from '../work/employer-work';

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
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data;
        }
    })
  }

  goInvite() {
    this.navCtrl.push(EmployerInvitePage, {seeker_id: this.jobSeekerID});
  }

  goLiked() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let seekerID = this.jobSeekerID;
    let param = {"employer_id" : this.config.user_id, "seeker_id" : seekerID};
    this.employerService.likeJobSeeker(param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.util.createAlert("Success", "Liked!");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  goAbout(item) {
    this.navCtrl.push(EmployerAboutPage, {data: item});
  }

  goExperience(item) {
    this.navCtrl.push(EmployerExperiencePage, {data: item});
  }

  goCurWork(item) {
    this.navCtrl.push(EmployerWorkPage, {data: item});
  }


}
