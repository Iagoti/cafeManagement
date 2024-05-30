import { SnackbarService } from './../../services/snackbar/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/services/user/user.service';
import { GlobalContants } from 'src/app/shared/global-components';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: any = FormGroup;
  reponseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      contactNumber: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.reponseMessage = response?.message;
      this.snackbarService.openSnackBar(this.reponseMessage, "");
      this.router.navigate(['/']);
      }, (error) =>{
        this.ngxService.stop();
        if(error.error?.menssage){
          this.reponseMessage = error.error?.menssage;
        }else{
          this.reponseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackBar(this.reponseMessage, GlobalContants.error);
      }
    );
  }
}
