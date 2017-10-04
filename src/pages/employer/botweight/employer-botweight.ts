import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { EmployerService } from '../../../provider/employer-service';
import { EmployerInviteListPage } from '../invite-list/employer-invite-list';
import { EmployerSeekerDetailPage } from '../detail/employer-seeker-detail';
import { EmployerChatbotPage } from '../chatbot/employer-chatbot';

@Component({
  selector: 'page-employer-botweight',
  templateUrl: 'employer-botweight.html'
})
export class EmployerBotweightPage {

  list: any;
  param: any;
  postview: any;
  botview: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public employerService: EmployerService,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.list = navParams.get('data');
        this.param = navParams.get('param');
        this.postview = navParams.get('postview');
        this.botview = navParams.get('botview');
  }
  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    for(let i=0; i<this.list.length; i++) {
      if(this.list[i].bot_question_answer_count == '0')
        this.list[i]['weight'] = 0;
      else
        this.list[i]['weight'] = 1;
    }
  }

  add(i){
    if(this.list[i].bot_question_answer_count == '0') {
      this.util.createAlert("", "This value is locked as default");
      return;
    }
    if(eval(this.list[i].weight) < 10)
      this.list[i].weight = eval(this.list[i].weight) + 1;
  }
  remove(i) {
    if(this.list[i].bot_question_answer_count == '0') {
      this.util.createAlert("", "This value is locked as default");
      return;
    }
    if(eval(this.list[i].weight) > 1)
      this.list[i].weight = eval(this.list[i].weight) - 1;
  }

  done() {
    let param = this.param;

    for(let i=0; i<this.list.length; i++) {
        param['bot_question_id_'+i] = this.list[i].bot_question_id;
        param['bot_question_weight_'+i] = this.list[i].weight;
    }
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.employerService.postData("createjobbot", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
            this.util.createAlert("Congratulations", "Job has been created successfully!");
            this.navCtrl.pop();
        }
    }, err => {
      loader.dismissAll();
      alert("error");
    })
  }
}
