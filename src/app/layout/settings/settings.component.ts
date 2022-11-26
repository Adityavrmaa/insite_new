import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../service/api/api.service";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { ThrowStmt } from "@angular/compiler";
import { error } from "util";

declare var $: any;

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  submitted = false;
  feedback;
  changePasswordForm: FormGroup;
  constructor(
    private api: ApiService,
    private toast: ToastrService,
    private Form: FormBuilder
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.Form.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      confirmPassword: ["", Validators.required],
    });
  }
  sendFeedback() {
    if (Boolean(this.feedback) == false) {
      this.toast.error("feedback is required");
      return;
    }

    this.api.sendUserFeedback({ feedback: this.feedback }).subscribe(
      (res) => {
        this.toast.success(res["message"]);
        this.feedback = "";
        $("#close-feedbackModal").click();
      },
      (error) => {
        this.toast.error(error.error.feedback);
      }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }
  changeUserPassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    if (
      this.changePasswordForm.value.newPassword !=
      this.changePasswordForm.value.confirmPassword
    ) {
      this.toast.error("Password does not match");
      return;
    }

    let dataToSend = {
      old_password: this.changePasswordForm.value.oldPassword,
      new_password: this.changePasswordForm.value.newPassword,
    };
    this.api.changePassword(dataToSend).subscribe(
      (res) => {
        this.toast.success(res["message"]);
        $("#cancel").click();
      },
      (error) => {
        this.toast.error(error.error.message);
      }
    );
  }

  clearForm() {
    this.changePasswordForm.reset();
  }
}
