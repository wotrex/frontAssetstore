import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from '@app/interfaces';
import { Observable } from 'rxjs';
import * as link from '@app/apiLink';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  constructor(private http: HttpClient) { }
  fetch() : Observable<Position[]>{
    return this.http.get<Position[]>(link +'/api/assets/all')
  }
  download(fileId: string) : Observable<any>{
    return this.http.get(link +'/api/assets/download/{fileId}'.replace('{fileId}', fileId), {responseType: 'blob'});
  }
  
}
