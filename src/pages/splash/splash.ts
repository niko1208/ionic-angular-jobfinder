import { Component, ViewChild  } from '@angular/core';
import { NavController,  } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Config } from '../../provider/config';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})
export class SplashPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public config: Config) {

  }

  ngAfterViewInit() {
    let w = document.querySelector('#slides').clientWidth;
    let h = w * 1063 / 750;
    document.getElementById('slides').style.height = h + 'px';
  }

  ionViewWillEnter() {

  }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  goSignup() {
    this.navCtrl.push(SignupPage, null, this.config.navOptions);
  }

  goLogin() {
    this.navCtrl.push(LoginPage, null, this.config.navOptions);
  }

}
