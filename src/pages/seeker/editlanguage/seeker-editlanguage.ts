import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-editlanguage',
  templateUrl: 'seeker-editlanguage.html'
})
export class SeekerEditlanguagePage {
  
  data: any;
  edit: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
        this.data = navParams.get('data');
        this.edit = navParams.get('edit');
        if(this.data == null) {
            this.data = {'language_id':'', language_language:'', language_proficiency: ''};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  save() {
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.language_id, "language" : this.data.language_language, "proficiency" : this.data.language_proficiency};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addlanguage";
    if(this.edit) url = "editlanguage";

    this.seekerService.postData(url, param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Failed", data.result)
        }
    })
  }

  delete() {
    let param = {"id" : this.data.language_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deletelanguage", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Profile Delete Failed", data.result)
        }
    })
  }

}
