import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { confirmedValidator } from 'src/app/common/helpers/validators';
import { User } from '../../../common/models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false
  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: confirmedValidator('password', 'confirmPassword')
    });
  }

  onSubmit(form: FormGroup) {
    //login and register successfully implemented, handle touch ups.
    if(form.valid) {
      const user: User = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      }
      this.authService.register(user)
      .subscribe({
        next: (response: any) => {
          if(response) {
            this.loading = false
            const message = `${response.message}, You will be redirected to login.`
            this.messageService.add({
              severity: 'success',
              summary: 'Registration Success',
              detail: message,
            })
            setTimeout(() => {
              this.router.navigateByUrl(`login`);
            }, 3000);
          }
        },
        error: (error) => {
          this.loading = false
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: error,
          })
        }
      })
    }
  }

  get getFirstNameValue() {
    return this.form.get('firstName')?.invalid && (this.form.get('firstName')?.dirty || this.form.get('firstName')?.touched)
  }

  get getLastNameValue() {
    return this.form.get('lastName')?.invalid && (this.form.get('lastName')?.dirty || this.form.get('lastName')?.touched)
  }

  get getEmailValue() {
    return this.form.get('email')?.invalid && (this.form.get('email')?.dirty || this.form.get('email')?.touched)
  }

  get getPasswordValue() {
    return this.form.get('password')?.invalid && (this.form.get('password')?.dirty || this.form.get('password')?.touched)
  }

  get getUserNameValue() {
    return this.form.get('username')?.invalid && (this.form.get('username')?.dirty || this.form.get('username')?.touched)
  }

  get getConfirmPasswordValue() {
    return this.form.get('confirmPassword')?.invalid && (this.form.get('confirmPassword')?.dirty || this.form.get('confirmPassword')?.touched)
  }
}
