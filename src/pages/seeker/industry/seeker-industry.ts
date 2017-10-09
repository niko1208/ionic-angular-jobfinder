import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-industry',
  templateUrl: 'seeker-industry.html'
})
export class SeekerIndustryPage {

  aryIndustry = [];
  aryTime = [];
  dd: any;
  
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
        this.dd = navParams.get('dd');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
      this.aryTime = this.config.arrPosition;
    for(let i=0; i<this.config.arrIndustry.length; i++) {
        let sel = false;
        if(this.config.arrIndustry[i] == this.dd.industry) {
            sel = true;
        }
        let cc = {'text':this.config.arrIndustry[i], 'check':sel};
        this.aryIndustry.push(cc);
    }
  }

  sel(idx, item) { 
    setTimeout(() => {
        for(let i=0; i<this.aryIndustry.length; i++) {
          this.aryIndustry[i]['check'] = false;
        }
        this.aryIndustry[idx]['check'] = true;    
        this.dd.industry = this.aryIndustry[idx]['text'];
    }, 200);

  }

  seltime(i) {
      this.dd.time = this.aryTime[i];
  }

  done() {
      this.config.userinfo['user_setting'].setting_industry = this.dd.industry;
      this.config.userinfo['user_setting'].setting_time_available = this.dd.time;

      this.viewCtrl.dismiss();
  }
  search(val) {
      
  }
}
