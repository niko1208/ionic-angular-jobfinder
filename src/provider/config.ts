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

    calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = this.toRad(lat2-lat1);
      var dLon = this.toRad(lon2-lon1);
      var lat11 = this.toRad(lat1);
      var lat22 = this.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat11) * Math.cos(lat22); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      var dd = Number(d).toFixed(2) + ' km away';
      return dd;
    }

    // Converts numeric degrees to radians
    toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
}