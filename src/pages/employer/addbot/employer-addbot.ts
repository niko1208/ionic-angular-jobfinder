import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerBotweightPage } from '../botweight/employer-botweight';

@Component({
  selector: 'page-employer-addbot',
  templateUrl: 'employer-addbot.html'
})
export class EmployerAddbotPage {

  list: any;
  param : any;
  postview: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
        this.param = navParams.get('param');
        this.postview = navParams.get('view');
        this.loadData();
  }
  ionViewWillEnter() {
    
  }

  loadData() {
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"employer_id" : this.config.user_id};
    this.employerService.postData("loadbotquestions", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        this.util.createAlert("", "Please select 5 compulsory questions that are essential for your hiring and configure the importance settins accordingly");
        if(data.status == "success") {
            this.list = data.result;
            for(let i=0; i<this.list.length; i++) {
                this.list[i]['check'] = false;
            }
        }
    })
  }

  sel(idx, item) { 
      let count = 0;
      for(let i=0; i<this.list.length; i++) {
          if(this.list[i]['check']) count++;
      }
      
      if(count > 5) {
          this.util.createAlert("", "You have selected 5 questions already");
          setTimeout(() => {
              this.list[idx]['check'] = false;
          }, 500);
      }
  }

  goNext() {
      
      let data = [];
      for(let i=0; i<this.list.length; i++) {
          if(this.list[i]['check']) {
              data.push(this.list[i]);
          }
      }
      if(data.length != 5) {
          this.util.createAlert("", "Please select 5 Bot Questions!");
          return;
      }
      this.navCtrl.push(EmployerBotweightPage, {data:data, param: this.param, postview:this.postview, view:this.viewCtrl});
  }
}
