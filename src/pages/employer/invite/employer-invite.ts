import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';

@Component({
  selector: 'page-employer-invite',
  templateUrl: 'employer-invite.html'
})
export class EmployerInvitePage {

  list: any;
  slist: any;
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
    this.loadInviteJobs();
  }

  loadInviteJobs() {
      let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id, "seeker_id" : this.jobSeekerID};
    this.employerService.postData("loadinvitejobs", param)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status == "success") { console.log(data.result);
          this.list = data.result;
          this.search("");
        }
    })
  }

  invite(i) {
    let loader = this.loading.create({
        content: 'Loading...',
    });
    loader.present();
    let job_id = this.list[i].job_id;
    let param = {"job_id" : job_id, "seeker_id" : this.jobSeekerID};
    this.employerService.postData("inviteseeker", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.list.splice(i, 1);
          this.search("");
        }
    })
  }

  getDate(date) {
    var da = new Date(date+' UTC'); 
    //var da_utc = new Date(da.getUTCFullYear(), da.getUTCMonth(), da.getUTCDate(),  da.getUTCHours(), da.getUTCMinutes(), da.getUTCSeconds());
    return da;
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
