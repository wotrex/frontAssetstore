import { Component,OnDestroy, OnInit } from '@angular/core';
import { Position, Types, User } from '@app/interfaces';
import { PaymentService } from '@app/services/payment.service';
import { PositionService } from '@app/services/position.service';
import { UserService } from '@app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy{
  user:  User
  currentUser: User
  positions: Position[] = []
  cart: string[]
  loaded: boolean = false;
  img: any[] = [];
  id: string
  sub: Subscription;
  public search: string
  constructor(private userServ: UserService, private posServ: PositionService,
     private payS: PaymentService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer) {
   }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.userServ.getUser().subscribe( response => {
      this.currentUser = response;
    }, error => {
    }) 
    this.userServ.getUserById(this.id).subscribe( response => {
      this.user = response;
      this.loaded = true;
      this.positions.splice(0,this.positions.length)
      for(let i = 0; i < this.user.items.length; i++) {
        this.posServ.fetchOne(this.user.items[i]).subscribe(respone => {
          this.positions.push(respone)
          this.posServ.download(respone.img).subscribe((respone: any)=> {
            let imageUrl = URL.createObjectURL(respone);
            this.img[i] = this.sanitizer.bypassSecurityTrustUrl(imageUrl)
          })
        })
      }
    }, error => {
    })
      });
    this.payS.successPayment().subscribe(() => {
    })
  }
  
  download(fileId: string, fileName: string, fileType: Types): void{
    this.posServ.download(fileId).subscribe((response: any) => {
      const blob = new Blob([response], { type: fileType.content }); // you can change the type
      const anchor = document.createElement('a');
      anchor.download = fileName + '.' + fileType.name;
      anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
      anchor.dataset.downloadurl = [fileType.content, anchor.download, anchor.href].join(':');
      anchor.click();
    })
  
  }

}