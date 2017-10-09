import { Component } from '@angular/core';
import { SeekerHomePage } from '../home/seeker-home';
import { SeekerSettingPage } from '../setting/seeker-setting';
import { SeekerProfilePage } from '../profile/seeker-profile';
import { SeekerEditProfilePage } from '../editprofile/seeker-editprofile';
import { SeekerJobsPage } from '../jobs/seeker-jobs';
import { SeekerMessagePage } from '..//message/seeker-message';

@Component({
  templateUrl: 'seeker-tabs.html'
})
export class SeekerTabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = SeekerHomePage;
  tab2Root: any = SeekerSettingPage;
  tab3Root: any = SeekerEditProfilePage;
  tab4Root: any = SeekerJobsPage;
  tab5Root: any = SeekerMessagePage;

  constructor() {

  }
}
