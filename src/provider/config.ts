import { Injectable} from '@angular/core';

@Injectable()

export class Config {
    public navOptions: any;
    public navOptionsBack: any;
    public platform: any;
    public deviceToken: any;
    public user_type: any;
    public user_id: any;

    constructor() {
        this.navOptions = {
            animation: 'ios-transition'
        };
        this.navOptionsBack = {
            animation: 'ios-transition',
            direction: 'back'
        };
    }

    getAPIURL() {
        return "http://jobfinder.cloud/jobfinder";
    }
    
    getFormData(item) {
        var form_data = new FormData();
        for ( var key in item ) {
            form_data.append(key, item[key]);
        }
        return form_data;
    }
}