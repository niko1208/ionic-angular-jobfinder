import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Config } from '../provider/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()

export class SeekerService {
    constructor(public http: Http, public config:Config) {
        
    }

    
    postData(surl, item) {
        let url = this.config.getAPIURL();
        url = `${url}/jobseeker/${surl}.php`;
        item = this.config.getFormData(item);
        return this.http.post(url, item).map(response=>
            response.json());
    }
    PostData_raw(surl, item) {
        let url = this.config.getAPIURL();
        url = `${url}/jobseeker/${surl}.php`;
        return this.http.post(url, item).map(response=>
            response.json());
    }

    
    getDataExternal(surl) {
        let url = surl;
        return this.http.get(url).map(response=>
            response.json());
    }
}