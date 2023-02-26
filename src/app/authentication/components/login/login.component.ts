import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  loading = false
  form!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    if(form.valid) {
      this.loading = true
      const username = form.value.username
      const password = form.value.password
      this.authService.login(username, password)
      .pipe(first())
      .subscribe({
        next: (response) => {
          if(response) {
            setTimeout(() => {
              this.loading = false
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigateByUrl(returnUrl);
            }, 100);
          }
        },
        error: (error) => {
          this.loading = false
          this.messageService.add({
            severity: 'error',
            summary: 'Authentication Failed',
            detail: error,
          })
        }
      })
    }
  }

  get getUsernameValue() {
    return this.form.get('username')?.invalid && (this.form.get('username')?.dirty || this.form.get('username')?.touched)
  }

  get getPasswordValue() {
    return this.form.get('password')?.invalid && (this.form.get('password')?.dirty || this.form.get('password')?.touched)
  }
}
