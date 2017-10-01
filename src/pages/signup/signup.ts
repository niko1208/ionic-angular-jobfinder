import { Component  } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupVerifyPage } from '../signup-verify/signup-verify';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';
import { TermsPage } from '../terms/terms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public name = "";
  public email = "";
  public phone = "";
  public type = "employer";
  public password = "";
  public isterms = false;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public loading: LoadingController) {

  }

  goLogin() {
      this.navCtrl.push(LoginPage, null, this.config.navOptions).then(()=> {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
      });
  }

  goback() {
      this.navCtrl.pop();
  }

  signup() {
    if(this.name == "") {
        this.util.createAlert("Error", "Please insert Name!");
        return;
    }
    if(this.phone == "") {
        this.util.createAlert("Error", "Please insert Phone!");
        return;
    }
    if(this.email == "") {
        this.util.createAlert("Error", "Please insert Email!");
        return;
    }
    if(this.type == "") {
        this.util.createAlert("Error", "Please select your User Type!");
        return;
    }
    if(this.password == "") {
        this.util.createAlert("Error", "Please insert Password!");
        return;
    }
    if(!this.isterms) {
        this.util.createAlert("Error", "Please read and accept our Terms of Service!");
        return;
    }
    
    let vcode = Math.floor(Math.random() * (9999-1000))+1000;
    let param = {"name" : this.name, "email" : this.email, "phone" : this.phone, "password" : this.phone, "verify_code" : vcode};
  
    let loader = this.loading.create({
    content: 'Loading...',
    });
    loader.present();
    this.auth.signup(param, this.type)
    .subscribe(data => {
        loader.dismissAll();
        if(data.status = "success") {
          this.config.user_id = data.resultUser.user_id;
          this.config.user_type = this.type;
          this.navCtrl.push(SignupVerifyPage, null, this.config.navOptions);
        } else {
          this.util.createAlert("Registration Failed", data.result);
        }
    }, err => {
        loader.dismissAll();
        this.util.createAlert("Registration Failed", "");
    })
    
  }
  goTerms() {
      this.navCtrl.push(TermsPage, null, this.config.navOptions);
  }
  clickTerm() {
      if(this.isterms) {
          this.goTerms();
      }
  }

}
