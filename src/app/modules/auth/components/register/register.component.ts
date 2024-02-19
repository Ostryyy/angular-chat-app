import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDontMatch: true,
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  hide = true;

  private registerSub: Subscription = new Subscription();

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {}

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    const { name, surname, email, password } = this.registerForm.value;

    if (name && surname && email && password)
      this.registerSub.add(
        this.authService
          .signUp(name, surname, email, password)
          .pipe(
            this.toast.observe({
              success: 'Register successfully',
              loading: 'Registering...',
              error: 'There was an error',
            })
          )
          .subscribe(() => {
            this.router.navigate(['/auth/login']);
          })
      );
  }

  getNameErrorMessage() {
    return 'Name is required';
  }
  getSurnameErrorMessage() {
    return 'Surname is required';
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

  getConfirmPasswordErrorMessage() {
    return this.confirmPassword?.hasError('required')
      ? 'Confirmation of password is required'
      : '';
  }

  ngOnDestroy(): void {
    if (this.registerSub) this.registerSub.unsubscribe();
  }
}
