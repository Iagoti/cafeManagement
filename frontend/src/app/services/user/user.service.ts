import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  signup(data: any) {
    return this.httpClient.post(`${this.apiUrl}/user/signup`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  login(data: any){
    return this.httpClient.post(`${this.apiUrl}/user/login`, data,{
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  checkToken(){
    return this.httpClient.get(this.apiUrl + "/user/checkToken");
  }
}
