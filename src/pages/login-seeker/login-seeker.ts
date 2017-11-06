import { Component  } from '@angular/core';
import { NavController, LoadingController, ViewController, Platform } from 'ionic-angular';
import { Config } from '../../provider/config';
import { UtilService } from '../../provider/util-service';
import { Auth } from '../../provider/auth';
import { SeekerService } from '../../provider/seeker-service';
import { SignupVerifyPage } from '../signup-verify/signup-verify';
import { ResetEmployerPage } from '../reset-employer/reset-employer';
import { SeekerTabsPage } from '../seeker/tabs/seeker-tabs';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-login-seeker',
  templateUrl: 'login-seeker.html'
})
export class LoginSeekerPage {
    FB_APP_ID: number = 1421989254537239;
    public email: any;
    public password: any;
    public sresponse = "";
    public suser = "";
    public serror1 = "";
    public serror2 = "";

  constructor(
    public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public seekerService: SeekerService,
  	public platform: Platform,
    public facebook: Facebook,
  	public gp: GooglePlus,
  	public nativeStorage: NativeStorage,
    public auth: Auth
  ) {
        this.email = "";// "test5@mail.com";
        this.password = "";//"test5";

        //this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  goback() {
      this.navCtrl.pop(this.config.navOptionsBack);
  }

  doFbLogin(){
    //1968148010124162 - my
    //1421989254537239 - markhan
    let env = this;
    let permissions = ['public_profile', 'email'];
    this.platform.ready().then(() => {
      this.facebook.login(permissions).then((res) => {
        console.log(res);
        let userId = res.authResponse.userID;
        let params = new Array<string>();
        env.facebook.api("/me?fields=name,gender,email", params)
        .then(function(user) {
          console.log(user);
          var picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
          env.socialLogin(user.name, user.email, user.name, picture, 'facebook');
        });
      });
    });
    /*
    let permissions = new Array<string>();
    let nav = this.navCtrl;
	  let env = this;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile", "email"];

    // this.fb.login(permissions)
    // .then(function(response){
    //   console.log(response);
    //   this.sresponse = JSON.stringify(response);
    //   let userId = response.authResponse.userID;
    //   let params = new Array<string>();

      //Getting name and gender properties
      env.fb.api("/me?fields=name,gender", params)
      .then(function(user) {
        console.log(user);
        this.suser = JSON.stringify(user);
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        env.nativeStorage.setItem('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(function(){
          alert('success');
          this.socialLogin(user.name, user.email, user.first_name, user.picture, 'facebook');
        }, function (error) {
          this.serror1 = JSON.stringify(error);
        })
      })
    }, function(error){
      this.serror2 = JSON.stringify(error);
    });
    */
  }

  doFbLogout(){
    this.platform.ready().then(() => {
     this.facebook.logout();
    });
    /*
		var nav = this.navCtrl;
		let env = this;
		this.fb.logout()
		.then(function(response) {
			//user logged out so we will remove him from the NativeStorage
			env.nativeStorage.remove('user');
		}, function(error){
			console.log(error);
		});
    */
	}

  doGoogleLogin(){
    //SHA-1 : 69:7B:D1:DD:35:2E:3B:51:0F:84:FF:0A:A6:A7:EB:86:01:F7:BE:1F
    let nav = this.navCtrl;
    let env = this;
    let loading = this.loading.create({
      content: 'Please wait...'
    });
    loading.present();
    this.gp.login({
      'scopes': '',
      'webClientId': '204579564006-5n2efqh7ikjn7cd9680fpj8khvgust8j.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
      })
    .then( (user) => {
      console.log(user);
      loading.dismiss();
      this.socialLogin(user.displayName, user.email, user.displayName, user.imageUrl, 'google');
      
    }, (error) => {
      console.log(error);
      loading.dismiss();
    });
  }

  doGoogleLogout(){
    let nav = this.navCtrl;
    this.gp.logout()
    .then( (response) => {
      this.nativeStorage.remove('user');

    }, (error) => {
      console.log(error);
    })
  }

  socialLogin(user, email, pass, avatar_url, social) {
    let loader = this.loading.create({
      content: 'Login...',
    });
    loader.present();
    let vcode = Math.floor(Math.random() * (9999-1000))+1000;
    let param = {"social" : "", "login_mode" : "seeker", "name" : name, "email" : email, "phone" : "", "password" : pass, "avatar_url" : avatar_url, "verify_code" : vcode, "device" : this.config.platform, "token" : this.config.deviceToken};
    this.seekerService.postData("sociallogin", param)
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
            let resultSetting = JSON.stringify(data.resultSetting);

            localStorage.setItem('user_info', resultUser);
            localStorage.setItem('user_setting', resultSetting);

            this.config.userinfo['user_info'] = data.resultUser;
            this.config.userinfo['user_setting'] = data.resultSetting;
              
            if(this.config.user_state == '1') {
                this.navCtrl.push(SeekerTabsPage, null, this.config.navOptions).then(()=> {
                  const index = this.viewCtrl.index;
                  this.navCtrl.remove(index);
              });
            } else {
                this.navCtrl.push(SignupVerifyPage, {email: email}, this.config.navOptions);
            }
            
        } else {
            this.util.createAlert("SignIn Failed", data.result);
        }
    }, err => {
        this.util.createAlert("SignIn Failed", "Server error!");
    })
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
          if(data.status == "success") { console.log(data);
              this.config.user_type = "seeker";
              this.config.user_id = data.resultUser.user_id;
              this.config.user_state = data.resultUser.user_state;

                localStorage.setItem('user_id', this.config.user_id);
                localStorage.setItem('user_state', this.config.user_state);
                localStorage.setItem('user_type', this.config.user_type);

                let resultUser = JSON.stringify(data.resultUser);
                let resultSetting = JSON.stringify(data.resultSetting);
                let resultEducation = JSON.stringify(data.resultEducation);
                let resultCurwork = JSON.stringify(data.resultCurWork);

                localStorage.setItem('user_info', resultUser);
                localStorage.setItem('user_setting', resultSetting);
                localStorage.setItem('user_education', resultEducation);
                localStorage.setItem('user_curwork', resultCurwork);

                this.config.userinfo['user_info'] = data.resultUser;
                this.config.userinfo['user_setting'] = data.resultSetting;
                
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

  goReset() {
      this.navCtrl.push(ResetEmployerPage, {userType: "seeker"}, this.config.navOptions);
  }

  login_fb() {
      this.doFbLogin();
  }
  login_g() {
      this.doGoogleLogin();
  }
}