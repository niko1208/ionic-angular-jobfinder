import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { LoginEmployerPage } from '../pages/login-employer/login-employer';
import { LoginSeekerPage } from '../pages/login-seeker/login-seeker';
import { SignupPage } from '../pages/signup/signup';
import { TermsPage } from '../pages/terms/terms';

import { HttpModule } from '@angular/http';

import { Config } from '../provider/config';
import { UtilService } from '../provider/util-service';
import { Auth } from '../provider/auth';

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    LoginPage,
    LoginEmployerPage,
    LoginSeekerPage,
    SignupPage,
    TermsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    LoginPage,
    LoginEmployerPage,
    LoginSeekerPage,
    SignupPage,
    TermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Config,
    UtilService,
    Auth,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
