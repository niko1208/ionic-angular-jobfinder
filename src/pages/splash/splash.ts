import { Component, ViewChild  } from '@angular/core';
import { NavController,  } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { SignupVerifyPage } from '../signup-verify/signup-verify';
import { Config } from '../../provider/config';
import $ from 'jquery';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public config: Config) {
    let user_id = localStorage.getItem('user_id');
    let user_state = localStorage.getItem('user_state');
    if(user_id != null && user_id != "" && user_state != '1') {
      this.navCtrl.push(SignupVerifyPage, {email: localStorage.getItem('user_email')}, this.config.navOptions);
    }
  }

  ngAfterViewInit() {
    //let w = document.querySelector('#slides').clientWidth;
    //let h = w * 1063 / 750;
    //document.getElementById('slides').style.height = h + 'px';
    
  }

  onResize() {
    let user_id = localStorage.getItem('user_id');
    if(user_id != null && user_id != "") {
      return;
    }
    /*
    let w = document.querySelector('#img').clientWidth;
    let ww = document.querySelector('.scroll-content').clientWidth;
    w = (ww - w) / 2;
    w = w + 10;
    $('.arrow_prev').css('left', w+'px');
    $('.arrow_next').css('right', w+'px');
    $('#img').css('left', w+"px")*/
  }

  ionViewDidLoad() {
    let self = this;
    setTimeout(() => {
      self.onResize();
    }, 1000);
  }

  prev() {
    //this.slides.lockSwipes(false);
    this.slides.slidePrev();
    //this.slides.lockSwipes(true);
  }

  next() {
    //this.slides.lockSwipes(false);
    this.slides.slideNext();
    //this.slides.lockSwipes(true);
  }

  goSignup() {
    this.navCtrl.push(SignupPage, null, this.config.navOptions);
  }

  goLogin() {
    this.navCtrl.push(LoginPage, null, this.config.navOptions);
  }

}
