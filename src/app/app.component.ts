import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'My Site';
  constructor(private auth: AuthService){

  }
  ngOnInit(){
    const potentialToken = localStorage.getItem('auth-token')
    if (potentialToken != null) {
      this.auth.setToken(potentialToken)
    }
  }
}
