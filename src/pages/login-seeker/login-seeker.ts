import { Component  } from '@angular/core';
import { NavController, LoadingController, ViewController } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';
import { SignupVerifyPage } from '../signup-verify/signup-verify';
import { SeekerTabsPage } from '../seeker/tabs/seeker-tabs';

@Component({
  selector: 'page-login-seeker',
  templateUrl: 'login-seeker.html'
})
export class LoginSeekerPage {

    public email: any;
    public password: any;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public auth: Auth) {
        this.email = "test5@mail.com";
        this.password = "test5";
  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }
  
  login() {
      if(this.email == "") {
          this.util.createAlert("", "Please insert Email!");
          return;
      }
      if(!(this.config.validateEmail(this.email))) {
        this.util.createAlert("", "Please insert a valid email!");
        return;
      }
      if(this.password == "") {
          this.util.createAlert("", "Please insert Password!");
          return;
      }

      let loader = this.loading.create({
        content: 'Login...',
      });
      loader.present();
      let param = {"email" : this.email, "password" : this.password, "device" : this.config.platform, "token" : this.config.deviceToken};
      this.auth.login(param, 'jobseeker')
      .subscribe(data => { console.log(data);
          loader.dismissAll();
          if(data.status == "success") {
              this.config.user_type = "seeker";
              this.config.user_id = data.resultUser.user_id;
              this.config.user_state = data.resultUser.user_state;

                localStorage.setItem('user_id', this.config.user_id);
                localStorage.setItem('user_state', this.config.user_state);
                localStorage.setItem('user_type', this.config.user_type);

              let resultUser = JSON.stringify(data.resultUser);
                let resultCurWork = JSON.stringify(data.resultCurWork);
                let resultEducation = JSON.stringify(data.resultEducation);
                let resultExperience = JSON.stringify(data.resultExperience);
                let resultLanguage = JSON.stringify(data.resultLanguage);
                let resultReference = JSON.stringify(data.resultReference);
                let resultSetting = JSON.stringify(data.resultSetting);

                localStorage.setItem('user_info', resultUser);
                localStorage.setItem('user_curwork', resultCurWork);
                localStorage.setItem('user_education', resultEducation);
                localStorage.setItem('user_experience', resultExperience);
                localStorage.setItem('user_language', resultLanguage);
                localStorage.setItem('user_reference', resultReference);
                localStorage.setItem('user_setting', resultSetting);
                
              if(this.config.user_state == '1') {
                  this.navCtrl.push(SeekerTabsPage, null, this.config.navOptions).then(()=> {
                    const index = this.viewCtrl.index;
                    this.navCtrl.remove(index);
                });
              } else {
                  this.navCtrl.push(SignupVerifyPage, {email: this.email}, this.config.navOptions);
              }
              
          } else {
              this.util.createAlert("SignIn Failed", data.result);
          }
      }, err => {
          this.util.createAlert("SignIn Failed", "Server error!");
      })
  }
}