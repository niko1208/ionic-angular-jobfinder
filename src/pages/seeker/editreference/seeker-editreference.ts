import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-editreference',
  templateUrl: 'seeker-editreference.html'
})
export class SeekerEditreferencePage {
  
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
            this.data = {'reference_id':'', reference_name:'', reference_company: '', 
            reference_position: '', reference_email: '', reference_mobile: ''};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  save() {
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.reference_id, "name" : this.data.reference_name, "company" : this.data.reference_company, "position" : this.data.reference_position, "email" : this.data.reference_email, "mobile" : this.data.reference_mobile};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addreference";
    if(this.edit) url = "editreference";
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
    let param = {"id" : this.data.reference_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deletereference", param)
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
