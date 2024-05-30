import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(private httpCliente: HttpClient) { }

  signup(data: any){
    return this.httpCliente.post(`${this.url}/user/signup`, data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  login(data: any){
    return this.httpCliente.post(`${this.url}/user/signup`, data,{
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  checkToken(){
    return this.httpCliente.get(this.url + "/user/checkToken");
  }
}
