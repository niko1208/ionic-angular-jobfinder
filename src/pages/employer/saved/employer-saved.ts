import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';

@Component({
  selector: 'page-employer-saved',
  templateUrl: 'employer-saved.html'
})
export class EmployerSavedPage {

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
    this.loadLiked();
  }

  loadLiked() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id};
    this.employerService.postData("likeload", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result;
          this.search("");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }

  invite(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerInvitePage, {seeker_id: seekerID});
  }
  delete(i) {
      let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let seekerID = this.list[i].user_id;
    let param = {"employer_id" : this.config.user_id, "seeker_id" : seekerID};
    this.employerService.postData("likedelete", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.list.splice(i, 1);
          this.search("");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }
  goProfile(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }

  search(value) {
    this.slist = this.filterItems(value);
  }
  filterItems(searchTerm) {
    return this.list.filter((item) => {
      //for(var key in item) { 
        if(item['user_name'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
      //}
      return false;
    })
  }
}
