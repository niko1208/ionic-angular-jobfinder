import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'page-seeker-editcurwork',
  templateUrl: 'seeker-editcurwork.html'
})
export class SeekerEditcurworkPage {
  
  data: any;
  edit: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private datePicker: DatePicker) {
        this.data = navParams.get('data');
        this.edit = navParams.get('edit');
        if(this.data == null) {
            this.data = {'curwork_city':'', curwork_company:'', curwork_country: '', 
            curwork_description: '', curwork_id: '', curwork_period: '', curwork_role:'',curwork_seeker_id:''};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  delete() {
    let param = {"id" : this.data.curwork_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deletecurwork", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Profile Delete Failed", data.result)
        }
    })
  }

  save() {
    if(this.data.curwork_company == "") {
      this.util.createAlert("", "Please insert the company name!");
      return;
    }
    if(this.data.curwork_city == "") {
      this.util.createAlert("", "Please insert the city!");
      return;
    }
    if(this.data.curwork_country == "") {
      this.util.createAlert("", "Please insert the country!");
      return;
    }
    if(this.data.curwork_role == "") {
      this.util.createAlert("", "Please insert the title!");
      return;
    }
    if(this.data.curwork_period == "") {
      this.util.createAlert("", "Please insert the period date!");
      return;
    }
    if(this.data.curwork_description == "") {
      this.util.createAlert("", "Please insert the description!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.curwork_id, "company" : this.data.curwork_company, "city" : this.data.curwork_city, "country" : this.data.curwork_country, "role" : this.data.curwork_role, "period" : this.data.curwork_period, "description" : this.data.curwork_description};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addcurwork";
    if(this.edit) url = "editcurwork";

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

  showDate() {
    let cdate = new Date(this.data.curwork_period);
    if(this.data.curwork_period == "") cdate = new Date();
    this.datePicker.show({
      date: cdate,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.data.curwork_period = this.config.formatDate(date);
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

}
