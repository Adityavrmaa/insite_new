import { Component, OnInit } from '@angular/core';
import { log } from 'util';

@Component({
  selector: 'app-notifications-setting',
  templateUrl: './notifications-setting.component.html',
  styleUrls: ['./notifications-setting.component.css']
})

export class NotificationsSettingComponent implements OnInit {
  changeNotification
  NotificationToken
  constructor() { }
  
  ngOnInit() {

  this.NotificationToken = localStorage.getItem("NToken")
  console.log(this.NotificationToken,"nn");
  
  }
  notificationOff($event){
    if($event.target.checked == false){
      localStorage.setItem("Notification",  'false')
    } if($event.target.checked == true){
      localStorage.setItem("Notification",  'true')
    }
    console.log($event.target.checked);
     
    
  }
  
}
