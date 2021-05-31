import { AfterViewInit, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  totalCost: number = 0;
  constructor(private userServ: UserService, private posServ: PositionService, private payserv: PaymentService) {
   }
  ngDoCheck(): void {
    this.totalCost = 0
    for(let i = 0; i < this.positions.length; i++){
      this.totalCost = this.totalCost + this.positions[i].cost 
    }
  }

   ngAfterViewInit(): void {
    for(let i = 0; i < this.user.cart.length; i++) {
      this.posServ.fetchOne(this.user.cart[i]).subscribe(respone => {
        this.positions.push(respone)
        this.totalCost += respone.cost
      })
    }
    this.startPositions = this.positions
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
