import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-editeducation',
  templateUrl: 'seeker-editeducation.html'
})
export class SeekerEditeducationPage {
  
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
            this.data = {'education_school':'', education_from:'', education_to: '', 
            education_level: '', education_id: '', education_area: ''};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  save() {
    if(this.data.education_school == "") {
      this.util.createAlert("", "Please insert your school!");
      return;
    }
    if(this.data.education_from == "") {
      this.util.createAlert("", "Please insert date studied From!");
      return;
    }
    if(this.data.education_to == "") {
      this.util.createAlert("", "Please insert date studied To!");
      return;
    }
    if(this.data.education_level == "") {
      this.util.createAlert("", "Please select the Highest level attained!");
      return;
    }
    if(this.data.education_area == "") {
      this.util.createAlert("", "Please insert the Area of Study!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.education_id, "school" : this.data.education_school, "from" : this.data.education_from, "to" : this.data.education_to, "level" : this.data.education_level, "area" : this.data.education_area};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addeducation";
    if(this.edit) url = "editeducation";

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
    let param = {"id" : this.data.education_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deleteeducation", param)
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
