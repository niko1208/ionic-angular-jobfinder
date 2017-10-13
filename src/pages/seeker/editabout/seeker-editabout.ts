import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { DatePicker } from '@ionic-native/date-picker';


@Component({
  selector: 'page-seeker-editabout',
  templateUrl: 'seeker-editabout.html'
})
export class SeekerEditaboutPage {
  
  @ViewChild('fileInpsabout') fileInpsabout: ElementRef;
  data: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private datePicker: DatePicker) {
        this.data = navParams.get('data');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  upload_photo(){

  }

  save() {
    
    if(this.data.user_mobile == "") {
      this.util.createAlert("", "Please insert your Mobile Number!");
      return;
    }
    if(this.data.user_email == "") {
      this.util.createAlert("", "Please insert your email!");
      return;
    }
    if(!(this.config.validateEmail(this.data.user_email))) {
      this.util.createAlert("", "Please insert a valid email!");
      return;
    }
    if(this.data.user_gender == "") {
      this.util.createAlert("", "Please select your gender!");
      return;
    }
    if(this.data.user_birthday == "") {
      this.util.createAlert("", "Please select your birthday!");
      return;
    }
    if(this.data.user_about == "") {
      this.util.createAlert("", "Please tell us more about you!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "mobile" : this.data.user_mobile, "email" : this.data.user_email, "gender" : this.data.user_gender, "birthday" : this.data.user_birthday, "about" : this.data.user_about};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();

    this.seekerService.postData("editseekerabout", param)
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
    this.datePicker.show({
      date: new Date(this.data.user_birthday),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.data.user_birthday = this.config.formatDate(date);
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

}
