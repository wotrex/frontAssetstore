import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@app/interfaces';
import * as link from '@app/apiLink';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUser() : Observable<User>{
    return this.http.get<User>(link.sep +'/api/user/getByToken')
  }

  getUserById(userId: string) : Observable<User>{
    return this.http.get<User>(link.sep +'/api/user/getById/{userId}'.replace('{userId}', userId))
  }

  updateCart(user : User) : Observable<any>{
    return this.http.patch<any>(link.sep + "/api/user/update/0", {"cart": user.cart})
  }

}
