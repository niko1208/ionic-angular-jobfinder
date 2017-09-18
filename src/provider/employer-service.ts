import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Config } from '../provider/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()

export class EmployerService {
    constructor(public http: Http, public config:Config) {
        
    }

    loadMatchedJobSeekers(item) {
        let url = this.config.getAPIURL();
        url = `${url}/employer/loadmatchseekers.php`;
        item = this.config.getFormData(item);
        return this.http.post(url, item).map((response:Response)=>
            response.json());
    }
    
    likeJobSeeker(item) {
        let url = this.config.getAPIURL();
        url = `${url}/employer/likeadd.php`;
        item = this.config.getFormData(item);
        return this.http.post(url, item).map(response=>
            response.json());
    }
    
    postData(surl, item) {
        let url = this.config.getAPIURL();
        url = `${url}/employer/${surl}.php`;
        item = this.config.getFormData(item);
        return this.http.post(url, item).map(response=>
            response.json());
    }
    PostData_raw(surl, item) {
        let url = this.config.getAPIURL();
        url = `${url}/employer/${surl}.php`;
        return this.http.post(url, item).map(response=>
            response.json());
    }
}