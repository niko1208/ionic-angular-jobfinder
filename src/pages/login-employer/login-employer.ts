import { Component  } from '@angular/core';
import { NavController, LoadingController, ViewController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';
import { EmployerTabsPage } from '../employer/tabs/employer-tabs';

@Component({
  selector: 'page-login-employer',
  templateUrl: 'login-employer.html'
})
export class LoginEmployerPage {

    public email: any = "markhan0321@gmail.com";
    public password: any = "123123";

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

  login() {
      if(this.email == "") {
          this.util.createAlert("Error", "Please insert Email!");
          return;
      }
      if(this.password == "") {
          this.util.createAlert("Error", "Please insert Password!");
          return;
      }
      
      let loader = this.loading.create({
        content: 'Login...',
      });
      loader.present();

      let param = {"email" : this.email, "password" : this.password, "device" : this.config.platform, "token" : this.config.deviceToken};
      this.auth.login(param, "employer")
      .subscribe(data => {
          loader.dismissAll();
          this.navCtrl.push(EmployerTabsPage, null, this.config.navOptions).then(()=> {
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
        });
      })
  }

}
