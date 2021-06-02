import { Component, OnInit } from '@angular/core';
import { Position, Types, User } from '@app/interfaces';
import { PaymentService } from '@app/services/payment.service';
import { PositionService } from '@app/services/position.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})

export class AssetsComponent implements OnInit {
  user:  User
  positions: Position[]
  cart: string[]
  loaded: boolean = false;
  constructor(private pos: PositionService, private payserv: PaymentService, private userServ: UserService) { 
  }

  ngOnInit(): void {
    this.pos.fetch().subscribe(positions => {
      this.positions = positions
      this.loaded = true;
    })
    this.userServ.getUser().subscribe( (response:any) => {
      this.user = response;
    })
    this.payserv.successPayment().subscribe(() => {
    })
  }
  download(fileId: string, fileName: string, fileType: Types): void{
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
  }


  addToCart(itemid: string): void{
    this.user.cart.push(itemid);
    this.userServ.updateCart(this.user).subscribe(response => {
  })
  }
}
