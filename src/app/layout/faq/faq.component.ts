import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../service/api/api.service"

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqdata: any;

  constructor(private api: ApiService) { }

  ngOnInit() {

    // this.api.faq().subscribe(x => {
    //   this.htmlString = x.data['data'].content;
    //   console.log(this.htmlString)
    // }, err => {
    //   console.log(err);
    // });


    this.api.faq().subscribe((x) => {
      console.log(x["data"])

      this.faqdata = x.data;
    });


  }

}