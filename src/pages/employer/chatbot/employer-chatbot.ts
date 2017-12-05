import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { MessageService } from '../../../provider/message-service';
import * as $ from 'jquery';

@Component({
  selector: 'page-employer-chatbot',
  templateUrl: 'employer-chatbot.html'
})
export class EmployerChatbotPage {

  list: any;
  seeker_id: any;
  job_id: any;
  avatar: any;
  user_name: any;
  resScore = 0;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public messageService: MessageService,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.seeker_id = navParams.get('seeker_id');
        this.job_id = navParams.get('job_id');
        this.avatar = navParams.get('avatar');
        this.user_name = navParams.get('user_name');
  }
  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    
    let param = {"seeker_id" : this.seeker_id, "job_id" : this.job_id};
    this.messageService.postData("botloadmessages", param)
    .subscribe(data => { console.log(data);
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result; 
          let sum_answered_question = 0;
          let dictSelectedAnswersIndex = [];
          for(let i =0;i <this.list.length; i++) {
            this.list[i]['mdate'] = this.list[i].message_bot_date;
            let message_bot_answer_correct =this.list[i].message_bot_answer_correct;
            sum_answered_question = sum_answered_question + message_bot_answer_correct;
            
            if (message_bot_answer_correct == 1)
            {
                let bot_answer_point = this.list[i]["message_bot_answer_weight"];
                dictSelectedAnswersIndex.push(bot_answer_point);
            }
          }
          console.log(dictSelectedAnswersIndex);
          let arrayQuestions = data.resultQuestion;
          let totalWeight = 0;
          let sum = 0;
          for(let iIndex = 0; iIndex<arrayQuestions.length; iIndex++)
            {
                let answer_point = dictSelectedAnswersIndex[iIndex];
                if(answer_point != "-1")
                {
                    let dictQuestions = arrayQuestions[iIndex];
                    
                    let job_bot_question_weight = dictQuestions.job_bot_question_weight;
                    totalWeight = totalWeight + eval(job_bot_question_weight);
                    
                    sum = sum + answer_point * eval(job_bot_question_weight);
                }
            }
            this.resScore = sum / totalWeight;
            if(totalWeight == 0) this.resScore = 0;
            console.log(this.resScore);

          setTimeout(() => {
            $('.chat_room').scrollTop($('.chat_room').prop("scrollHeight"));
          }, 1000);
        }
    })
  }
  getDate(date) {
      return new Date(date+' UTC');
  }



}
