import { Injectable} from '@angular/core';

@Injectable()

export class Config {
    public navOptions: any;
    public navOptionsBack: any;
    public platform: any;
    public deviceToken: any;
    public user_type: any;
    public user_id: any;
    public user_state: any;


    public queryExperienceCity = ""; 
    public queryExperienceCountry = "";
    public queryExperienceRole = "";
    public queryCurWorkCity = "";
    public queryCurWorkCountry = "";
    public queryCurWorkRole = "";
    public queryEducation = "";
    public queryLanguage = "";
    public queryCertificate = "";
    public queryInterest = "";

    public isexperience = false;
    public iscurwork = false;
    public isedu = false;
    public islang = false;
    public iscert = false;
    public isinterest = false;

    public queryIndustry = "";
    public searchValue ="";
    
    constructor() {
        this.navOptions = {
            animation: 'ios-transition'
        };
        this.navOptionsBack = {
            animation: 'ios-transition',
            direction: 'back'
        };
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return re.test(email);
    }

    getAPIURL() {
        return "https://jobfinder.cloud/jobfinder";
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

    
    getDiffDateString(timeDiff)
    {
        //Less than 1min <60
        //Less than 1hour <3600
        //Less than 1day <86400
        //Less than 1month <2592000
        //Less than 1year < 946080000
        var strDiffDate : String = "";
        var divDiffRest = 0;
        if( timeDiff > 946080000) {
            divDiffRest = timeDiff / 946080000;
            divDiffRest = Math.floor(divDiffRest);
            if( divDiffRest == 1)
            {
                strDiffDate = ""+divDiffRest+" year ago";
            }
            else
            {
                strDiffDate = ""+divDiffRest+" year ago";
            }
        }
        else if( timeDiff > 2592000 && timeDiff <= 946080000)
        {
            divDiffRest = timeDiff / 2592000;
            divDiffRest = Math.floor(divDiffRest);
            if (divDiffRest == 1)
            {
                strDiffDate = ""+divDiffRest+" month ago";
            }
            else
            {
                strDiffDate = ""+divDiffRest+" months ago";
            }
        }
        else if (timeDiff > 86400 && timeDiff <= 2592000)
        {
            divDiffRest = timeDiff / 86400;
            divDiffRest = Math.floor(divDiffRest);
            if (divDiffRest == 1)
            {
                strDiffDate = ""+divDiffRest+" day ago";
            }
            else
            {
                strDiffDate = ""+divDiffRest+" days ago";
            }
        }
        else if (timeDiff > 3600 && timeDiff <= 86400)
        {
            divDiffRest = timeDiff / 3600;
            divDiffRest = Math.floor(divDiffRest);
            if (divDiffRest == 1)
            {
                strDiffDate = ""+divDiffRest+" hour ago";
            }
            else
            {
                strDiffDate = ""+divDiffRest+" hours ago";
            }
        }
        else if (timeDiff > 60 && timeDiff <= 3600)
        {
            divDiffRest = timeDiff / 60;
            divDiffRest = Math.floor(divDiffRest);
            if (divDiffRest == 1)
            {
                strDiffDate = ""+divDiffRest+" min ago";
            }
            else
            {
                strDiffDate = "("+divDiffRest+") mins ago";
            }
        }
        else
        {
            strDiffDate = "less than 1 min";
        }
        
        return strDiffDate
    }
    
}