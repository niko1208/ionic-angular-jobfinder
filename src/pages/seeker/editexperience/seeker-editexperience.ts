import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-editexperience',
  templateUrl: 'seeker-editexperience.html'
})
export class SeekerEditexperiencePage {
  
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
            this.data = {'experience_id':'', experience_company:'', experience_city: '', 
            experience_country: '', experience_role: '', experience_period: '', experience_though:'',experience_description:''};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  save() {
    if(this.data.experience_company == "") {
      this.util.createAlert("", "Please insert the company name!");
      return;
    }
    if(this.data.experience_city == "") {
      this.util.createAlert("", "Please insert the city!");
      return;
    }
    if(this.data.experience_country == "") {
      this.util.createAlert("", "Please insert the country!");
      return;
    }
    if(this.data.experience_role == "") {
      this.util.createAlert("", "Please insert the title!");
      return;
    }
    if(this.data.experience_period == "") {
      this.util.createAlert("", "Please insert commencement date!");
      return;
    }
    if(this.data.experience_though == "") {
      this.util.createAlert("", "Please insert completion date!");
      return;
    }
    if(this.data.curwork_description == "") {
      this.util.createAlert("", "Please insert the description!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.experience_id, "company" : this.data.experience_company, "city" : this.data.experience_city, "country" : this.data.experience_country, "role" : this.data.experience_role, "period" : this.data.experience_period, "though" : this.data.experience_though, "description" : this.data.experience_description};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addexperience";
    if(this.edit) url = "editexperience";

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
    let param = {"id" : this.data.experience_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deleteexperience", param)
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
