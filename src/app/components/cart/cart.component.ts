import { AfterViewInit, Component, DoCheck, OnInit, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Position, User } from '@app/interfaces';
import { PaymentService } from '@app/services/payment.service';
import { PositionService } from '@app/services/position.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit, DoCheck{

  user:  User
  positions: Position[] = []
  startPositions: Position [] = []
  img: any[] = [];
  totalCost: number = 0;
  loaded: boolean = false;
  public search: string
  constructor(private userServ: UserService, private posServ: PositionService, private payserv: PaymentService,
    private sanitizer: DomSanitizer) {
   }
  ngDoCheck(): void {
    this.totalCost = 0
    for(let i = 0; i < this.positions.length; i++){
      this.totalCost = this.totalCost + this.positions[i].cost 
    }
  }

   ngAfterViewInit(): void {
     if(this.user.cart.length != 0){
      for(let i = 0; i < this.user.cart.length; i++) {
        this.posServ.fetchOne(this.user.cart[i]).subscribe(respone => {
          this.positions[i] = respone
          this.startPositions[i] = respone
          this.totalCost += respone.cost
          this.posServ.download(respone.img).subscribe((respone: any)=> {
            let imageUrl = URL.createObjectURL(respone);
            this.img[i] = this.sanitizer.bypassSecurityTrustUrl(imageUrl)
            this.loaded = true;
          })
        }, error => {
          this.loaded = true;
        })
      }
      console.log(this.img)
  }else{
    this.loaded = true;
  }
  }

  ngOnInit(): void {
    this.userServ.getUser().subscribe( response => {
      this.user = response;
    }) 
  }

  pay(assetId: string): void{
    this.payserv.getSessionId(assetId).subscribe( response => {
      this.payserv.pay(response.message)
    })
  }

  payAll(): void{
    this.payserv.getSessionIdAll(this.user.cart).subscribe( response => {
      this.payserv.pay(response.message)
    })
  }

  delete(assetId: string): void{
    this.user.cart.forEach( (item, index) => {
      if(item === assetId) this.user.cart.splice(index,1);
    });
    this.positions.forEach( (item, index) => {
      if(item.id === assetId) this.positions.splice(index,1);
    });
    this.userServ.updateCart(this.user).subscribe(response => {
  })
  }
}
