import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { User } from '@app/interfaces';
import { AuthService } from '@app/services/auth.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, DoCheck {
  
  user: User

  reglog : boolean
  constructor(private auth: AuthService, private userServ: UserService) {
    
   }

  ngDoCheck(){
    this.reglog = this.auth.isAuthenticated();
  }
  ngOnInit(): void { this.userServ.getUser().subscribe( response => {
    this.user = response;
  }) 
  }

}
