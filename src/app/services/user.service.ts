import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position, User } from '@app/interfaces';
import * as link from '@app/apiLink';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUser() : Observable<User>{
    return this.http.get<User>(link.sep +'/api/user/getByToken')
  }

  getUserItems() : Observable<Position[]>{
    return this.http.get<Position[]>(link.sep + '/api/user/userItems')
  }

}
