import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';

@Component({
  selector: 'page-employer-help',
  templateUrl: 'employer-help.html'
})
export class EmployerHelpPage {

  sections = [];
  constructor(public navCtrl: NavController, 
    public config: Config,
    public loading: LoadingController,
    public navParams: NavParams) {
        
  }
  ionViewWillEnter() {
    this.loadData();
  }

  clickSection(item) {
      item.expand = !(item.expand);
  }
  loadData() {
    this.sections = [
        {title : "HOW DOES JOBFINDER WORK?",
                      contents : "Simply login and set up your Settings and then proceed to update your Employer Profile.  Start viewing candidates by swiping or by using Map view.  Tap on the avatars of candidates near you to start your hiring. You start chatting with your potential future employee once your shortlisted candidate responds to your chat message. You can also shortlist or reject applicants all from the smartphone.", expand:false},
        {title : "HOW DO I SEARCH FOR JOBSEEKERS?",
                      contents : "Jobfinder uses geo tagging technology to locate talent based on the search radius settings defined in the Settings menu. ( Maximum Distance slider ). You are always in control.  You can view jobseekers  by List or Map view by tapping on the icons on the top left of the Jobs screen. ( Menu tab: Jobs )", expand:false},
        {title : "HOW DOES INVITE OR LIKE WORK?",
                      contents : "You can invite an applicant if you think his / her qualities closely match what you are looking for. Once an Invitation is sent, it is up to the Jobseeker to apply or decline your job invitation. \n Tap on the heart shaped icon on the top right of the Profile screen ( Menu: Home ) to  manage your list of Liked applicants. From here, you can choose to Invite or Delete an applicant from the list.", expand:false},
        {title : "IS PROFILE CREATION IMPORTANT?",
                      contents : "Yes, yes and yes! Please remember to be as thorough as possible and complete all the fields so that you can attract the best talent out there. A detailed picture of your company will help applicants decide very quickly if they would want to work for you.", expand:false},
        {title : "MY MESSAGES ARE NOT GOING THROUGH",
                      contents : "This may be temporary and try again later. Please ensure you have a strong Internet connection. If the issue persists, try reinstalling the app. This won’t delete your matches and chats.", expand:false},
        {title : "CAN I DELETE MY CHATS?",
                      contents : "You can permanently delete your chat by swiping left from the chat list.", expand:false},
    ]
  }

}
