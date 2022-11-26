import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // constructor(@Inject(GetprofileserviceService) adminData) {

  //   adminData.getAdminData().subscribe((response: any) => {
  //      
  //     if (response.response) {
  //       this.data = response.response
  //       console.log(this.data)
  //     } else {
  //       alert('Something went wrong');
  //     }
  //   },
  //     error => {
  //       if (error) {
  //         // this.error_message = error.error.message
  //         alert("asdkjaksda")
  //       }
  //     })

  // }
  constructor() {
  }

  // data = JSON.parse(localStorage.getItem('rippleadmindata'))
  private DataSource = new BehaviorSubject("s");
  currentData = this.DataSource.asObservable();


  changeData(data) {
    this.DataSource.next(data)
  }
}
