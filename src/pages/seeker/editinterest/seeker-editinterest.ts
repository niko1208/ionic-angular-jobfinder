import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'page-seeker-editinterest',
  templateUrl: 'seeker-editinterest.html'
})
export class SeekerEditinterestPage {
  
  data: any;
  edit: any;
  list: any;
  dataval: any;
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
        this.list = ["#Reading", "#Travelling", "#Blogging", "#Collecting", "#Volunteer Work/Community", "#Cooking", "#Child Care", "#Sports", "#Music", "#Puzzles and Strategy games", "#Club memberships", "#Public speaking", "#Board games", "#Photography", "#Art & Cultural pursuits", "#Gardening", "#Others"];
        if(this.data == null) {
            this.data = {'interest_interest':'', "interest_id" : ""};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  save() {
    if(this.data.interest_interest == "") {
      this.util.createAlert("", "Please insert the interest!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.interest_id, "interest" : this.data.interest_interest};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addinterest";
    if(this.edit) url = "editinterest";

    this.seekerService.postData(url, param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Profile Save Unsuccessful!", data.result)
        }
    })
  }

  delete() {
    let param = {"id" : this.data.interest_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deleteinterest", param)
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
