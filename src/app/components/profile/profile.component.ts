import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Position, Types, User } from '@app/interfaces';
import { PaymentService } from '@app/services/payment.service';
import { PositionService } from '@app/services/position.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user:  User
  positions: Position[] = []
  constructor(private userServ: UserService, private posServ: PositionService, private payS: PaymentService) {
   }
  ngAfterViewInit(): void {
    for(let i = 0; i < this.user.items.length; i++) {
      this.posServ.fetchOne(this.user.items[i]).subscribe(respone => {
        this.positions.push(respone)
      })
    }
  }

  ngOnInit(): void {
    this.userServ.getUser().subscribe( response => {
      this.user = response;
    }) 
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