import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Config } from '../provider/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()

export class Auth {
    constructor(public http: Http, public config:Config) {
        
    }

    login_employer(item) {
        let url = this.config.getAPIURL();
        url = `${url}/employer/signin.php`;
        item = this.config.getFormData(item);
        return this.http.post(url, item).map((response:Response)=>
            response.json());
    }
    login_seeker(item) {
        let url = this.config.getAPIURL();
        url = `${url}/seeker/signin.php`;
        item = this.config.getFormData(item);
        return this.http.post(url, item).map((response:Response)=>
            response.json());
    }
}