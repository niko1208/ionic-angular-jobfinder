import { Injectable} from '@angular/core';
import { ToastController, AlertController} from 'ionic-angular';

@Injectable()

export class UtilService {

    constructor(public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
    }

    creatToast(message, position = 'top', duration = 5000) {
        this.toastCtrl.create({message:message, position: position, cssClass: 'animated bounceInRight', duration: duration})
        .present();
    }

    createAlert(title, message) {
        let alert:any = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        alert.present();
    }
}