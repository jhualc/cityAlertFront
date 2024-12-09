import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';


@Injectable({
  providedIn: 'root'
})
export class PersonaDataService {

  constructor(private http: HttpClient) { }

  setPersonaDataAuthorization(data:any){

    console.log("LADATA:::", data);
    
    let url = URL_SERVICIOS +"/personaDataAuthorization";
        return this.http.post(url, data);


  }

  getUser(id: any) {
    console.log("usuario", id);
    let url = `${URL_SERVICIOS}/getUser/${id}`;
    return     this.http.get(url); 
  }

  
}
