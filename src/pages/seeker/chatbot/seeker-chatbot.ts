import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { Auth } from '../../../provider/auth';
import { SeekerService } from '../../../provider/seeker-service';
import { MessageService } from '../../../provider/message-service';
import * as $ from 'jquery';

@Component({
  selector: 'page-seeker-chatbot',
  templateUrl: 'seeker-chatbot.html'
})
export class SeekerChatbotPage {

  list: any;
  seeker_id: any;
  job_id: any;
  avatar: any;
  user_name: any;
  emp_id: any;
  resScore = 0;
  aryAnswer = [];
  sendText = "";
  data: any;
  sum_answered_question = 0;
  answer_point = 0;
  matched = 0;
  loader: any;
  end = false;

  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public auth: Auth,
    public seekerService: SeekerService,
    public messageService: MessageService,
    public loading: LoadingController,
    public navParams: NavParams) {
        this.job_id = navParams.get('job_id');
        this.emp_id = navParams.get('emp_id');
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
    
    let param = {"seeker_id" : this.config.user_id, "job_id" : this.job_id};
    this.messageService.postData("botloadmessages", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.list = data.result; console.log(data);
          this.data = data;
          
          let dictSelectedAnswersIndex = [];
          for(let i =0;i <this.list.length; i++) {
            this.list[i]['mdate'] = this.list[i].message_bot_date;//this.config.getDiffDateString(this.list[i].timediff);
            let message_bot_answer_correct =this.list[i].message_bot_answer_correct;
            this.sum_answered_question = this.sum_answered_question + eval(message_bot_answer_correct);
            
            if (message_bot_answer_correct == 1)
            {
                let bot_answer_point = this.list[i]["message_bot_answer_weight"];
                dictSelectedAnswersIndex.push(bot_answer_point);
            }
          }
          this.aryAnswer = [];
          //if(sum_answered_question == 0) {
          if(this.list.length == 1) {
            this.aryAnswer.push({'bot_answer_text':"next"});
          } else {
            let bot_question_id = data.resultQuestion[this.sum_answered_question].bot_question_id;
            for(let i=0;i <data.resultAnswer.length; i++) {
              if(data.resultAnswer[i].bot_answer_question_id == bot_question_id) {
                this.aryAnswer.push(data.resultAnswer[i]);
              }
            }
            if(this.aryAnswer.length == 0) {
              this.aryAnswer.push({'bot_answer_text':"next"});
            }
          }
          console.log(this.aryAnswer);
        
          setTimeout(() => {
            $('.chat_room').scrollTop($('.chat_room').prop("scrollHeight"));
          }, 1000);
        }
    })
  }
  getDate(date) {
      return new Date(date+' UTC');
  }

  answerScrollInit() {

  }

  clickAnswer(item) {
    this.answer_point = 0;
    this.checkCorrect(item);
    this.sendAnswerText('seeker', item);
  }

  send() {
    this.checkCorrect(this.sendText);
    this.sendAnswerText('seeker', this.sendText);
  }

  checkCorrect(text) {
    let matchCount = -1;
    let data = this.data;
    if(this.aryAnswer.length == 0 ) {
      this.answer_point = 100;
      this.matched = 1;
      return true;
    }
    for(let i=0;i <this.aryAnswer.length; i++) { 
      if(this.aryAnswer[i].bot_answer_text == text) {
        this.answer_point = this.aryAnswer[i].bot_answer_point;
        this.matched = 1;
        return true;
      }
    }
    this.answer_point = 0;
    this.matched = 0;
    return false;
  }

  retFunc() {
    console.log(this.list);
  }

  sendAnswerText(senderType, text) {
    let job_bot_question_weight = this.data.resultQuestion[this.sum_answered_question].job_bot_question_weight;

    let param = {"job_id" : this.job_id, "sender_type" : senderType, "seeker_id" : this.config.user_id, "message_text" : text, "question_weight" : job_bot_question_weight, "answer_weight" : this.answer_point, "answer_correct" : this.matched};

    this.loader = this.loading.create({
      content: 'Loading...',
    });
    this.loader.present();

    this.messageService.postData("botsendtext", param)
    .subscribe(data => { console.log(data);
      if(data.status == "success") { 
        if(senderType == 'seeker') {
          if(this.checkCorrect(text)) {
            this.sum_answered_question ++;
            if(this.sum_answered_question == 5) {
              this.sendBotText("Cool. Thanks for your answers, the hiring manager will review them and get back to you shortly.");
            } else {
              let bot_question_id = this.data.resultQuestion[this.sum_answered_question].bot_question_id;
              let bot_question_text = this.data.resultQuestion[this.sum_answered_question].bot_question_text;
              this.aryAnswer = [];
              for(let i=0;i <this.data.resultAnswer.length; i++) {
                if(this.data.resultAnswer[i].bot_answer_question_id == bot_question_id) {
                  this.aryAnswer.push(this.data.resultAnswer[i]);
                }
              }
              this.sendBotText(bot_question_text);
            }
          } else {
            this.sendBotText('Please answer the previous question first');
          }
        }
      } else {
        this.loader.dismiss();
        this.util.createAlert("Failed", data.result);
      }        
    }, error => {

    });
    
  }
  sendBotText(text, callback=null) {
    let param = {"job_id" : this.job_id, "sender_type" : 'bot', "seeker_id" : this.config.user_id, "message_text" : text, "question_weight" : 0, "answer_weight" : 0, "answer_correct" : 0};
    this.messageService.postData("botsendtext", param)
    .subscribe(data => { 
      if(data.status == "success") {
        this.loader.dismiss();
        this.loadMessage(callback);
      } else {
        this.loader.dismiss();
        this.util.createAlert("Failed", data.result);
      } 
    }, error => {
      this.loader.dismiss();
    });
  }

  loadMessage(callback=null) {
     let param = {"seeker_id" : this.config.user_id, "job_id" : this.job_id};
    this.messageService.postData("botloadmessages", param)
    .subscribe(data => { console.log(data);
        if(data.status == "success") {
          this.list = data.result;
          for(let i =0;i <this.list.length; i++) {
            this.list[i]['mdate'] = this.list[i].message_bot_date;//this.config.getDiffDateString(this.list[i].timediff);
          }
          if(this.sum_answered_question == 5) {
            //==================================
            let dictSelectedAnswersIndex = []; console.log(this.list);
            for(let i =0;i <this.list.length; i++) {
              let message_bot_answer_correct =this.list[i].message_bot_answer_correct;
              if (message_bot_answer_correct == 1)
              {
                  let bot_answer_point = this.list[i]["message_bot_answer_weight"];
                  dictSelectedAnswersIndex.push(bot_answer_point);
              }
            }
            let arrayQuestions = this.data.resultQuestion; console.log(dictSelectedAnswersIndex);
            let totalWeight = 0;
            let sum = 0; console.log(arrayQuestions);
            for(let iIndex = 0; iIndex<arrayQuestions.length; iIndex++)
              {
                  let answer_point = dictSelectedAnswersIndex[iIndex]; console.log(answer_point);
                  if(answer_point != "-1")
                  {
                      let dictQuestions = arrayQuestions[iIndex]; console.log(dictQuestions);

                      let job_bot_question_weight = dictQuestions.job_bot_question_weight;
                      totalWeight = totalWeight + eval(job_bot_question_weight);
                      
                      sum = sum + answer_point * eval(job_bot_question_weight);
                  }
              }
              console.log(totalWeight); console.log(sum);
              this.resScore = sum / totalWeight;
              this.resScore = parseFloat(this.resScore.toFixed(2));
              if(this.resScore >= 40) {
                this.applyJob();
              } else {
                this.declineJob();
              }
              //======================================================
          }
        }
        if(callback) callback();
    });
  }

  applyJob() {
    let param = {"job_id" : this.job_id, "seeker_id" : this.config.user_id, "seeker_name" : this.user_name, "employer_id" : this.emp_id};
    this.seekerService.postData("applyjobbotpass", param)
    .subscribe(data => { 
        if(data.status == "success") {
          this.end = true;
        } else {
          this.util.createAlert("Failed", data.result);
        }
    }, err =>{

    });
  }

  declineJob() {
    let param = {"job_id" : this.job_id, "seeker_id" : this.config.user_id, "seeker_name" : this.user_name, "employer_id" : this.emp_id};
    this.seekerService.postData("applyjobbotdecline", param)
    .subscribe(data => { 
        if(data.status == "success") {
          this.util.createAlert("Application Declined", "You have failed to meet the minimum score desired by the hiring manager.");
          this.end = true;
        } else {
          this.util.createAlert("Failed", data.result);
        }
    }, err =>{

    });
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
