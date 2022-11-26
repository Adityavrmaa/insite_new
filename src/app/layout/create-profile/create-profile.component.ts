import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../service/api/api.service";
import { FormControl, FormGroup} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css'],
  providers: [ApiService, ToastrService],

})
export class CreateProfileComponent implements OnInit {
  email : any = ''
  editForm: FormGroup

  constructor(private router : Router, private service : ApiService, private Form: FormBuilder,    private toast: ToastrService,

    ) { }

  ngOnInit() {
    this.email = localStorage.getItem('email')
    console.log(this.email)
      
    this.editForm = this.Form.group({
        name : ['',],
        email: [this.email,],
        username : [this.email,],
        password : ['',],
        country_code : ['',],
        mobile_number : ['',],
        profession : [1,],
        account_type: [1,'',],
        company_name : ['',],
        profile_type:['1',],
        address_line1 : ['',],
        address_line2 : ['',],
        address_line3:['',],
        bussiness_area:['test',],
        description:['',],
        year_of_foundation:['',],
        device_token: ['123',],
        device_type: ['1',],
        is_more_than_5 : [true,],
        lat:[0,],
        lon:[0,],
        social_id : ['no',]
      })
    }
    editProfile(){
      console.log(this.editForm.value)
      this.service.guest_signup(this.editForm.value).subscribe(res =>{
        console.log(res)
        this.toast.success("Your account has created successfully please login.")
        this.router.navigate(['/'])
      }, error =>{
        this.toast.error(error.message)
        console.log(error)
      })
    }

}
