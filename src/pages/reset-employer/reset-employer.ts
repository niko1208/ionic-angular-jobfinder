import { Component  } from '@angular/core';
import { NavController, LoadingController, ViewController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';

@Component({
  selector: 'page-reset-employer',
  templateUrl: 'reset-employer.html'
})
export class ResetEmployerPage {

    public email = "";

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public viewCtrl: ViewController,
    public loading: LoadingController) {

  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }

  reset() {
      if(this.email == "") {
          this.util.createAlert("Error", "Please insert Email!");
          return;
      }
      if(!(this.config.validateEmail(this.email))) {
        this.util.createAlert("Error", "Please insert a valid email!");
        return;
      }

      let loader = this.loading.create({
        content: 'Loading...',
      });
      loader.present();
      let user_type = "employer";
      let param = {"email" : this.email, "type" : user_type};
      this.auth.reset(param)
      .subscribe(data => {
          loader.dismissAll();
          if(data.status == "success") {
            this.viewCtrl.dismiss();
          } else {
            this.util.createAlert("Failed", "Please insert correct email!");
          }
      }, err => {
          loader.dismissAll();
          this.util.createAlert("Failed", "Please insert correct email!");
      })
  }

}
