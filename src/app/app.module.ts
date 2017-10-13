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
import { ResetEmployerPage } from '../pages/reset-employer/reset-employer';
import { LoginSeekerPage } from '../pages/login-seeker/login-seeker';
import { SignupPage } from '../pages/signup/signup';
import { SignupVerifyPage } from '../pages/signup-verify/signup-verify';
import { TermsPage } from '../pages/terms/terms';
import { EmployerTabsPage } from '../pages/employer/tabs/employer-tabs';

import { EmployerHomePage } from '../pages/employer/home/employer-home';
import { EmployerHomeMapPage } from '../pages/employer/home-map/employer-home-map';
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
import { EmployerCurLocationPage } from '../pages/employer/curlocation/employer-curlocation';
import { EmployerChatbotPage } from '../pages/employer/chatbot/employer-chatbot';
import { EmployerAddbotPage } from '../pages/employer/addbot/employer-addbot';
import { EmployerBotweightPage } from '../pages/employer/botweight/employer-botweight';

import { EmployerSettingPage } from '../pages/employer/setting/employer-setting';
import { EmployerPostJobPage } from '../pages/employer/postjob/employer-postjob';
import { EmployerPostJobEditPage } from '../pages/employer/postjob-edit/employer-postjob-edit';
import { EmployerActivityPage } from '../pages/employer/activity/employer-activity';
import { EmployerMessagePage } from '../pages/employer/message/employer-message';
import { EmployerMessageroomPage } from '../pages/employer/messageroom/employer-messageroom';
import { EmployerHelpPage } from '../pages/employer/help/employer-help';
import { EmployerPostjobLocationPage } from '../pages/employer/postjob-location/employer-postjob-location';
import { EmployerEditjobLocationPage } from '../pages/employer/editjob-location/employer-editjob-location';



import { SeekerTabsPage } from '../pages/seeker/tabs/seeker-tabs';
import { SeekerHomePage } from '../pages/seeker/home/seeker-home';
import { SeekerSettingPage } from '../pages/seeker/setting/seeker-setting';
import { SeekerProfilePage } from '../pages/seeker/profile/seeker-profile';
import { SeekerJobsPage } from '../pages/seeker/jobs/seeker-jobs';
import { SeekerMessagePage } from '../pages/seeker/message/seeker-message';

import { SeekerAdsPage } from '../pages/seeker/ads/seeker-ads';
import { SeekerIndustryPage } from '../pages/seeker/industry/seeker-industry';
import { SeekerCurLocationPage } from '../pages/seeker/curlocation/seeker-curlocation';
import { SeekerEditProfilePage } from '../pages/seeker/editprofile/seeker-editprofile';
import { SeekerJobdetailPage } from '../pages/seeker/jobdetail/seeker-jobdetail';
import { SeekerSavedPage } from '../pages/seeker/saved/seeker-saved';
import { SeekerAppliedPage } from '../pages/seeker/applied/seeker-applied';
import { SeekerEditaboutPage } from '../pages/seeker/editabout/seeker-editabout';
import { SeekerEditcurworkPage } from '../pages/seeker/editcurwork/seeker-editcurwork';
import { SeekerEditeducationPage } from '../pages/seeker/editeducation/seeker-editeducation';
import { SeekerEditexperiencePage } from '../pages/seeker/editexperience/seeker-editexperience';
import { SeekerEditlanguagePage } from '../pages/seeker/editlanguage/seeker-editlanguage';
import { SeekerEditreferencePage } from '../pages/seeker/editreference/seeker-editreference';
import { SeekerMessageroomPage } from '../pages/seeker/messageroom/seeker-messageroom';
import { SeekerJobsmapPage } from '../pages/seeker/jobsmap/seeker-jobsmap';
import { SeekerHelpPage } from '../pages/seeker/help/seeker-help';
import { SeekerChatbotPage } from '../pages/seeker/chatbot/seeker-chatbot';


import { Camera } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { DatePicker } from '@ionic-native/date-picker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

import { HttpModule } from '@angular/http';
import { Push } from '@ionic-native/push';

import { Config } from '../provider/config';
import { UtilService } from '../provider/util-service';
import { Auth } from '../provider/auth';
import { EmployerService } from '../provider/employer-service';
import { SeekerService } from '../provider/seeker-service';
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
    EmployerAdsPage,
    EmployerHomeMapPage,
    EmployerCurLocationPage,
    EmployerChatbotPage,
    EmployerHelpPage,
    EmployerPostjobLocationPage,
    EmployerEditjobLocationPage,
    ResetEmployerPage,
    EmployerAddbotPage,
    EmployerBotweightPage,
    EmployerMessageroomPage,

    SeekerTabsPage,
    SeekerHomePage,
    SeekerSettingPage,
    SeekerJobsPage,
    SeekerProfilePage,
    SeekerMessagePage,
    SeekerAdsPage,
    SeekerIndustryPage,
    SeekerCurLocationPage,
    SeekerEditProfilePage,
    SeekerJobdetailPage,
    SeekerSavedPage,
    SeekerAppliedPage,
    SeekerEditaboutPage,
    SeekerEditcurworkPage,
    SeekerEditeducationPage,
    SeekerEditexperiencePage,
    SeekerEditlanguagePage,
    SeekerEditreferencePage,
    SeekerMessageroomPage,
    SeekerJobsmapPage,
    SeekerHelpPage,
    SeekerChatbotPage
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
    EmployerAdsPage,
    EmployerHomeMapPage,
    EmployerCurLocationPage,
    EmployerChatbotPage,
    EmployerHelpPage,
    EmployerPostjobLocationPage,
    EmployerEditjobLocationPage,
    ResetEmployerPage,
    EmployerAddbotPage,
    EmployerBotweightPage,
    EmployerMessageroomPage,

    SeekerTabsPage,
    SeekerHomePage,
    SeekerSettingPage,
    SeekerJobsPage,
    SeekerProfilePage,
    SeekerMessagePage,
    SeekerAdsPage,
    SeekerIndustryPage,
    SeekerCurLocationPage,
    SeekerEditProfilePage,
    SeekerJobdetailPage,
    SeekerSavedPage,
    SeekerAppliedPage,
    SeekerEditaboutPage,
    SeekerEditcurworkPage,
    SeekerEditeducationPage,
    SeekerEditexperiencePage,
    SeekerEditlanguagePage,
    SeekerEditreferencePage,
    SeekerMessageroomPage,
    SeekerJobsmapPage,
    SeekerHelpPage,
    SeekerChatbotPage
  ],
  providers: [
    StatusBar,
    Camera,
    MediaCapture,
    DatePicker,
    SocialSharing,
    Facebook,
    GooglePlus,
    NativeStorage,
    SplashScreen,
    Config,
    UtilService,
    Auth,
    Push,
    EmployerService,
    SeekerService,
    MessageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
