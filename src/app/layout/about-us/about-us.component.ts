import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../service/api/api.service"



@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  htmlString: any;

  constructor(private api: ApiService) { }

  ngOnInit() {

    this.api.a().subscribe(x => {
      this.htmlString = x.data[0].content;
      // console.log(this.htmlString)
    }, err => {
      console.log(err);
    });
  }

}