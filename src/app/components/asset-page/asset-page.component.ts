import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Position, Types, User } from '@app/interfaces';
import { AuthService } from '@app/services/auth.service';
import { PaymentService } from '@app/services/payment.service';
import { PositionService } from '@app/services/position.service';
import { UserService } from '@app/services/user.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-asset-page',
  templateUrl: './asset-page.component.html',
  styleUrls: ['./asset-page.component.css']
})
export class AssetPageComponent implements OnInit, OnDestroy {
  position: Position
  currentUser: User
  id: string
  sub: Subscription;
  loaded: boolean = false;
  img: any;
  constructor(private userServ: UserService, private posServ: PositionService, 
    private payS: PaymentService, private activatedRoute: ActivatedRoute, 
    private sanitizer: DomSanitizer, private auth: AuthService, private router: Router) { }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.posServ.fetchOne(this.id).subscribe(item => {
        this.position = item
        this.posServ.download(item.img).subscribe((respone: any) => {
          let imageUrl = URL.createObjectURL(respone);
          this.img = this.sanitizer.bypassSecurityTrustUrl(imageUrl)
          this.loaded = true;
        })
      }) 
      if(this.auth.isAuthenticated()){
      this.userServ.getUser().subscribe(resp => {
        this.currentUser = resp
      }) 
    }else{
      this.currentUser = {items: [""], cart: [""], username: "", id: "", password:"", email: ""}
    } 
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

  pay(assetId: string): void{
    if(this.currentUser.id != ""){
    this.payS.getSessionId(assetId).subscribe( response => {
      this.payS.pay(response.message)
    })
  }else{
    this.router.navigate(["/login"])
  }
  }


  addToCart(itemid: string): void{
    if(this.currentUser.id != ""){
      this.currentUser.cart.push(itemid);
      this.userServ.updateCart(this.currentUser).subscribe(response => {
    })
  }else{
    this.router.navigate(["/login"])
  }
  }

}
