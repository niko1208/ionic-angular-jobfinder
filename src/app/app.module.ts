import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MomentModule } from 'angular2-moment';
import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { LoginEmployerPage } from '../pages/login-employer/login-employer';
import { LoginSeekerPage } from '../pages/login-seeker/login-seeker';
import { SignupPage } from '../pages/signup/signup';
import { SignupVerifyPage } from '../pages/signup-verify/signup-verify';
import { TermsPage } from '../pages/terms/terms';
import { EmployerTabsPage } from '../pages/employer/tabs/employer-tabs';

import { EmployerHomePage } from '../pages/employer/home/employer-home';
import { EmployerInvitePage } from '../pages/employer/invite/employer-invite';
import { EmployerSavedPage } from '../pages/employer/saved/employer-saved';
import { EmployerSeekerDetailPage } from '../pages/employer/detail/employer-seeker-detail';
import { EmployerAboutPage } from '../pages/employer/about/employer-about';
import { EmployerExperiencePage } from '../pages/employer/experience/employer-experience';
import { EmployerWorkPage } from '../pages/employer/work/employer-work';
import { EmployerApplicantPage } from '../pages/employer/applicant/employer-applicant';
import { EmployerInviteListPage } from '../pages/employer/invite-list/employer-invite-list';
import { EmployerEditProfilePage } from '../pages/employer/editprofile/employer-editprofile';
import { EmployerAdsPage } from '../pages/employer/ads/employer-ads';

import { EmployerSettingPage } from '../pages/employer/setting/employer-setting';
import { EmployerPostJobPage } from '../pages/employer/postjob/employer-postjob';
import { EmployerPostJobEditPage } from '../pages/employer/postjob-edit/employer-postjob-edit';
import { EmployerActivityPage } from '../pages/employer/activity/employer-activity';
import { EmployerMessagePage } from '../pages/employer/message/employer-message';

import { HttpModule } from '@angular/http';
import { Push } from '@ionic-native/push';

import { Config } from '../provider/config';
import { UtilService } from '../provider/util-service';
import { Auth } from '../provider/auth';
import { EmployerService } from '../provider/employer-service';
import { MessageService } from '../provider/message-service';

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    LoginPage,
    LoginEmployerPage,
    LoginSeekerPage,
    SignupPage,
    SignupVerifyPage,
    TermsPage,

    EmployerTabsPage,
    EmployerHomePage,
    EmployerSettingPage,
    EmployerPostJobPage,
    EmployerPostJobEditPage,
    EmployerActivityPage,
    EmployerMessagePage,
    EmployerInvitePage,
    EmployerSavedPage,
    EmployerSeekerDetailPage,
    EmployerAboutPage,
    EmployerExperiencePage,
    EmployerWorkPage,
    EmployerApplicantPage,
    EmployerInviteListPage,
    EmployerEditProfilePage,
    EmployerAdsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MomentModule,
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
    SignupVerifyPage,
    TermsPage,

    EmployerTabsPage,
    EmployerHomePage,
    EmployerSettingPage,
    EmployerPostJobPage,
    EmployerPostJobEditPage,
    EmployerActivityPage,
    EmployerMessagePage,
    EmployerInvitePage,
    EmployerSavedPage,
    EmployerSeekerDetailPage,
    EmployerAboutPage,
    EmployerExperiencePage,
    EmployerWorkPage,
    EmployerApplicantPage,
    EmployerInviteListPage,
    EmployerEditProfilePage,
    EmployerAdsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Config,
    UtilService,
    Auth,
    Push,
    EmployerService,
    MessageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
