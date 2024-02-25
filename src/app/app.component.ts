import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'chat-app';

  user$ = this.userService.currentUserProfile$;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
