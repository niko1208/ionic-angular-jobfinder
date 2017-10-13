import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';

@Component({
  selector: 'page-seeker-help',
  templateUrl: 'seeker-help.html'
})
export class SeekerHelpPage {

  sections = [];
  helptext = "";
  constructor(public navCtrl: NavController, 
    public config: Config,
    public loading: LoadingController,
    public navParams: NavParams,
    public util: UtilService,
    public seekerService: SeekerService) {
        
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
                      contents : ["Simply login and set up your Settings preferences and then proceed to update your Profile.  Start viewing jobs by swiping or by using Map view. Tap on the avatars of jobs near you to start your application. You start your chats with potential future employer once he as viewed your profile and initiated a shortlist on his end."],
        expanded : false},
        {title : "WILL I LOSE MY JOB MATCHES IF DELETE THE APP?",
                      contents : ["No, you will never lose your matches and chats if you don’t delete your Jobfinder account"],
                      expanded : false},
        {title : "HOW DO I EDIT MY PROFILE DETAILS?",
                      contents : ["Select Profile in the Menu tabs. Proceed to edit your profile details. Tap ‘Done’ at the top right corner of the screen to save changes."],
                      expanded : false},
        {title : "DO I NEED TO UPLOAD MY CV/RÉSUMÉ?",
                      contents : ["No. That’s the beauty of using Jobfinder’s in-app digital CV. Create your profile once and use it forever! Recruiters and Employers see your key details from the app and in most cases, are able to decide fairly quickly if you are the right candidate or not."],
                      expanded : false},
        {title : "HOW DO I ADD/CHANGE A PROFILE PHOTO?",
                      contents : ["Simple! Just tap on the circled avatar window, and you can upload any photo from your library or take a current snapshot. Remember, no Snapchat photos please. Try to keep photos professional and headshots are usually the best."],
                      expanded : false},
        {title : "WHAT TYPE OF JOBS IS AVAILABLE ON JOBFINDER?",
                      contents : ["Fulltime, Part time, Casual, Internships and Contract  jobs are available."],
                      expanded : false},
        {title : "WHAT DOES “LIKING” A JOB DO?",
                      contents : ["Sometimes a job interests you but you are undecided. By tapping “Like”, the job is bookmarked for you for future action.  Just tap on the heart shaped icon at the top right corner of the Jobs screen to view your bookmarked jobs.  You can delete your bookmarked list anytime."],
                      expanded : false},
        {title : "HOW DO I SEARCH FOR JOBS?",
                      contents : ["Jobfinder locates jobs for you based on your search radius settings that that you define in the Settings menu. (Maximum Distance slider). You are always in control.  You can view jobs by List or Map view by tapping on the icons on the top left of the Jobs screen. ( Menu tab: Jobs )"],
                      expanded : false},
        {title : "WHAT HAPPENS AFTER I APPLY?",
                      contents : ["All your applications can be viewed by tapping the Briefcase icon at the top left of the Jobs screen. Here, you can manage all your applications and view the status of the applications. (Viewed, Not Viewed, Shortlisted or Declined) Shortlisted applicants automatically receive an incoming chat \n Notification. You can commence chatting with the hirer. Declined applications statuses will be greyed out. Know exactly where you stand in your applications. No more 'I wonder what happened to that job I applied for?'"],
                      expanded : false},
        {title : "MY JOBS ARE NOT LOADING",
                      contents : ["This may be temporary and try again later. Please ensure you have a strong Internet connection. If the issue persists, try reinstalling the app. This won’t delete your matches and chats."],
                      expanded : false},
        {title : "CAN I VIEW MY APPLICATION?",
                      contents : ["Yes of course! Remember, the Jobfinder app puts you in control at all times. Simply tap on the Briefcase icon (Applied Jobs screen) to view all your applications."],
                      expanded : false},
        {title : "WHY AM I INVITED AND WHAT SHALL I DO?",
                      contents : ["This is a great compliment to you! An employer may think you have all the right attributes that they are looking for.  You can view all invites in the Applied Jobs screen (Briefcase icon).  You may tap Apply or politely decline the job with an email to the hirer if you so choose."],
        expanded : false}
    ]
  }

  send() {
    let user_info = this.config.userinfo['user_info'];
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let param = {"user_id" : this.config.user_id, "fullname" : user_info.user_name, "email" : user_info.user_email, "question" : this.helptext};
    this.seekerService.postData("sendhelpmessage", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.util.createAlert("", "Your question has been sent successfully!");
        } else {
          this.util.createAlert("Failed", data.result);
        }
    })
  }
}
