import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  hide = true;

  private loginSub: Subscription = new Subscription();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage() {
    if (this.email?.hasError('required')) {
      return 'Email is required';
    }

    return this.email?.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    return this.password?.hasError('required') ? 'Password is required' : '';
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    if (email && password)
      this.loginSub.add(
        this.authService
          .login(email, password)
          .pipe(
            this.toast.observe({
              success: 'Logged in successfully',
              loading: 'Logging in...',
              error: ({ message }) => `${message}`,
            })
          )
          .subscribe(() => {
            this.router.navigate(['/home']);
          })
      );
  }

  ngOnDestroy(): void {
    if (this.loginSub) this.loginSub.unsubscribe();
  }
}
