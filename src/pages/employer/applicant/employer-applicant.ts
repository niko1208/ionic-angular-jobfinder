import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerInviteListPage } from '../invite-list/employer-invite-list';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';

@Component({
  selector: 'page-employer-applicant',
  templateUrl: 'employer-applicant.html'
})
export class EmployerApplicantPage {

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
    this.employerService.postData("loadjobapplicants", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
            this.list = data.result;
            for(let i=0; i<this.list.length; i++) {
              //this.list[i]['applied_date'] = new Date(this.list[i].timediff*1000);
              //console.log(this.list[i].timediff + '======' + this.list[i].applied_date);
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



}
