import { Component } from '@angular/core';
import { MessagingService } from "./../app/service/messaging.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'insite';
  message

  constructor() { }

//   ngOnInit() {

//    let userData =  localStorage.getItem('userData')
// console.log(userData, "userDataCon");

//     const userId = userData['id'];
//     this.messagingService.requestPermission(userId)
//     this.messagingService.receiveMessage()
//     this.message = this.messagingService.currentMessage
//   }

}
