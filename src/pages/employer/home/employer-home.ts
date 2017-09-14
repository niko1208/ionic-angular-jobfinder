import { Component  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { EmployerInvitePage } from '../invite/employer-invite';
import { EmployerSavedPage } from '../saved/employer-saved';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';
import { UtilService } from '../../../provider/util-service';
import { EmployerService } from '../../../provider/employer-service';

@Component({
  selector: 'page-employer-home',
  templateUrl: 'employer-home.html'
})
export class EmployerHomePage {

  arrIndustry = [];
  queryIndustry = "";
  list: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public employerService: EmployerService,
    public loading: LoadingController) {
        
        this.arrIndustry = ["#hospitality", "#entertainment", "#fastfood", "#construction", "#sales", "#retail", "#notforprofit", "#logistics", "#administration", "#agedcare", "#banking", "#callcentre", "#childcare", "#consumergoods", "#creative", "#defence", "#education", "#entrepreneur", "#financialservices", "#government", "#healthcare", "#hr", "#legal", "#manufacturing", "#marketing", "#media", "#mining", "#officesupport", "#professionalservices", "#property", "#recreation", "#recruitment", "#selfemployed", "#software", "#sports", "#technicalsupport", "#technology", "#telecommunications", "#tourism", "#trades", "#transport", "#cleaning", "#fashion", "#hairandbeauty", "#services"];

  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id, "industry" : this.queryIndustry};
    this.employerService.loadMatchedJobSeekers(param)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status = "success") {
          this.list = data.result;
        }
    })
  }

  like(i) {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let seekerID = this.list[i].user_id;
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

  invite(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerInvitePage, {seeker_id: seekerID});
  }

  readMore(i) {
    let seekerID = this.list[i].user_id;
    this.navCtrl.push(EmployerSeekerDetailPage, {seeker_id: seekerID});
  }

  change(value) {
    this.loadData();
  }

  goLiked() {
    this.navCtrl.push(EmployerSavedPage);
  }

  search(value) {
    
  }
}
