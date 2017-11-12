import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Config } from '../provider/config';

import { SplashPage } from '../pages/splash/splash';
import { EmployerTabsPage } from '../pages/employer/tabs/employer-tabs';
import { SeekerTabsPage } from '../pages/seeker/tabs/seeker-tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public push: Push, public config: Config) {

    
    platform.ready().then(() => {
      if(platform.is('ios')) {
        this.config.platform = 'ios';
      } else if(platform.is('android')) {
        this.config.platform = 'android';
      } else {
        this.config.platform = 'other';
      }
      statusBar.styleDefault();
      splashScreen.hide();

      let user_id = localStorage.getItem('user_id');
      let user_type = localStorage.getItem('user_type');
      let user_state = localStorage.getItem('user_state');
      if(user_id != null && user_id != "") {
        this.config.user_id = user_id;
        this.config.user_type = user_type;
        if(user_state == '1') {
          if(user_type == 'employer') {
            this.rootPage = EmployerTabsPage;
          } else {
            let user_info = JSON.parse(localStorage.getItem('user_info'));
            let user_setting = JSON.parse(localStorage.getItem('user_setting'));
            this.config.userinfo['user_info'] = user_info;
            this.config.userinfo['user_setting'] = user_setting;
            
            this.rootPage = SeekerTabsPage;
          }
        } else {
          this.rootPage = SplashPage;
        }
      } else {
        this.rootPage = SplashPage;
      }
      
      this.initPushNotification();
    });
  }

  initPushNotification() { 
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: any = {
      android: {
        senderID: '395456395630'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    
    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      this.config.deviceToken = data.registrationId;
      //alert("Device : " + this.config.deviceToken);
    });

    pushObject.on('notification').subscribe((data: any) => {
      alert('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) { 
        
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }
  
}

