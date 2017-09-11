import { Component } from '@angular/core';
import { EmployerHomePage } from '../home/employer-home';
import { EmployerSettingPage } from '../setting/employer-setting';
import { EmployerPostJobPage } from '../postjob/employer-postjob';
import { EmployerActivityPage } from '../activity/employer-activity';
import { EmployerMessagePage } from '../message/employer-message';

@Component({
  templateUrl: 'employer-tabs.html'
})
export class EmployerTabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = EmployerHomePage;
  tab2Root: any = EmployerSettingPage;
  tab3Root: any = EmployerPostJobPage;
  tab4Root: any = EmployerActivityPage;
  tab5Root: any = EmployerMessagePage;

  constructor() {

  }
}
