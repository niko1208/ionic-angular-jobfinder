import { Component  } from '@angular/core';
import { NavController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../../provider/config';
import { UtilService } from '../../../provider/util-service';
import { SeekerService } from '../../../provider/seeker-service';
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'page-seeker-editcertification',
  templateUrl: 'seeker-editcertification.html'
})
export class SeekerEditcertificationPage {
  
  data: any;
  edit: any;
  list: any;
  dataval: any;
  constructor(public navCtrl: NavController, 
    public config: Config,
    public util: UtilService,
    public seekerService: SeekerService,
    public loading: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private datePicker: DatePicker) {
        this.data = navParams.get('data');
        this.edit = navParams.get('edit');
        this.list = ["#Sijil Kemahiran Malaysia ( SKM 1 )", "#Sijil Kemahiran Malaysia ( SKM 2 )", "#Sijil Kemahiran Malaysia ( SKM 3)", "#Diploma Kemahiran Malaysia ( DKM )", "#Diploma Lanjutan Kemahiran Malaysia ( DLKM )", "#IEP/IELTS", "#Certification in Early Childhood Education", "#Certification in English", "#ESOL UK", "#PCIF", "#TEFL (LTTC) UK", "#Certificate in Outsourcing Professional ( COP )", "#Professional Engineer ( PE )", "#CEng", "#CSci", "#CEnv", "#CEng", "#CSDA", "#CSDP", "#WCET", "#CCP", "#IPPC", "#CQIF", "#IFP", "#CFP", "#ACCA", "#CPA", "#CFA", "#CIMA", "#ACA", "#CFE", "#CIA", "#CISA", "#Microsoft Professional Certification", "#Oracle Professional Certification", "#CISCO Professional Certification", "#CIPD Level 3", "#CIPD Level 5", "#CIPD Level 7", "#CHA", "#SCAE Barista Basic", "#SCAE Barista Intermediate", "#SCAE Barista Professional", "#Latte Art Basic", "#Latte Art Advanced", "#Mixologist", "CIDB Green Card"];
        if(this.data == null) {
            this.data = {'certification_id':'', 'certification_certification':''};
        }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    
  }

  save() {
    if(this.data.certification_certification == "") {
      this.util.createAlert("", "Please insert certification!");
      return;
    }
    
    let param = {"seeker_id" : this.config.user_id, "id" : this.data.certification_id, "certification" : this.data.certification_certification};
    
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    let url = "addcertificate";
    if(this.edit) url = "editcertificate";

    this.seekerService.postData(url, param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Profile Save Unsuccessful!", data.result)
        }
    })
  }

  delete() {
    let param = {"id" : this.data.certification_id};
      
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    this.seekerService.postData("deletecertificate", param)
    .subscribe(data => { 
        loader.dismissAll();
        if(data.status == "success") {
          this.navCtrl.pop();
        } else {
          this.util.createAlert("Profile Delete Failed", data.result)
        }
    })
  }

}
