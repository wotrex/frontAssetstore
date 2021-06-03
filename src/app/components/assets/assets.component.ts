import { Component, DoCheck, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Categories, Position, Types, User } from '@app/interfaces';
import { AuthService } from '@app/services/auth.service';
import { PaymentService } from '@app/services/payment.service';
import { PositionService } from '@app/services/position.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
})

export class AssetsComponent implements OnInit, DoCheck {
  user:  User
  positions: Position[];
  cart: string[]
  loaded: boolean = false;
  img: any[] = [];
  cat: Categories[]
  currentCategories: Categories[]
  public search: string
  constructor(private pos: PositionService, private payserv: PaymentService, 
    private userServ: UserService, private sanitizer: DomSanitizer, private router: Router, private auth: AuthService) { 
  }
  ngDoCheck(): void {
    if(this.img.length == this.positions.length){
      this.loaded = true;
    }
  }

  ngOnInit(): void {
    this.pos.getCategories().subscribe(categories => {
      this.cat = categories
      this.currentCategories = categories
    })
    this.pos.fetch().subscribe(positions => {
      this.positions = positions
      for(let i = 0; i < this.positions.length; i++){
        this.pos.download(this.positions[i].img).subscribe((respone: any) => {
          let imageUrl = URL.createObjectURL(respone);
          this.img[i] = this.sanitizer.bypassSecurityTrustUrl(imageUrl)
        })
      }
    })
    if(this.auth.isAuthenticated()){
    this.userServ.getUser().subscribe( (response:any) => {
      this.user = response;
    })
  }else{
    this.user = {items: [""], cart: [""], username: "", id: "", password:"", email: ""}
  }
  }
  /* download(fileId: string, fileName: string, fileType: Types): void{
    this.pos.download(fileId).subscribe((response: any) => {
      const blob = new Blob([response], { type: fileType.content }); // you can change the type
      const anchor = document.createElement('a');
      anchor.download = fileName + '.' + fileType.name;
      anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
      anchor.dataset.downloadurl = [fileType.content, anchor.download, anchor.href].join(':');
      anchor.click();
    })
  
  }

  pay(assetId: string): void{
    this.payserv.getSessionId(assetId).subscribe( response => {
      this.payserv.pay(response.message)
    })
  } */


  addToCart(itemid: string): void{
    if(this.user.id != ""){
      this.user.cart.push(itemid);
      this.userServ.updateCart(this.user).subscribe(response => {
      })
    }else{
      this.router.navigate(["/login"])
    }
  }
  sortCategory(category: Categories): void{
    console.log(this.currentCategories)
    if(this.currentCategories.includes(category)){
      this.currentCategories = this.currentCategories.filter(obj => obj !== category);
    }else{
      this.currentCategories.push(category)
    }

  }
  allCategory(): void{
    if(this.currentCategories.length != 0){
      this.currentCategories = []
    }else{
      this.currentCategories = this.cat
    }
  }

  contains(categories: Categories[]): any{
    let result = this.currentCategories.filter(v => {
      return categories.some(v2 => {
        return v.id == v2.id;
      })
    })
    console.log(result)
    return result;
}
}
