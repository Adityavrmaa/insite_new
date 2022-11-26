import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../service/api/api.service"

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {

  constructor(private api: ApiService) { }
  htmlString: any;

  ngOnInit() {
    this.api.t().subscribe(x => {
      this.htmlString = x.data[0].content;
      console.log(this.htmlString)
    }, err => {
      console.log(err);
    });
  }

}