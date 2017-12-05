import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { SeekerJobdetailPage } from '../jobdetail/seeker-jobdetail';

@Component({
  selector: 'page-seeker-saved',
  templateUrl: 'seeker-saved.html'
})
export class SeekerSavedPage {

  list: any;
  slist: any;
  jobSeekerID: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        
  }

  ionViewWillEnter() {
    this.loadLiked();
  }

  loadLiked() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"seeker_id" : this.config.user_id};
    this.seekerService.postData("likeload", param)
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

  goDetail(i) {
    let item = this.list[i];
    this.navCtrl.push(SeekerJobdetailPage, {data: item});
  }

  search(value) {
    this.slist = this.filterItems(value);
  }
  filterItems(searchTerm) {
    return this.list.filter((item) => {
      //for(var key in item) { 
        if(item['job_job_title'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
      //}
      return false;
    })
  }
}
