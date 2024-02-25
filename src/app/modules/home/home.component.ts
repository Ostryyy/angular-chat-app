import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  user$ = this.authService.currentUser$;
  searchControl: FormControl = new FormControl('');

  users$ = combineLatest([
    this.userService.allUsers$,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, user, searchString]) =>
      users.filter(
        (u) =>
          u.displayName?.toLowerCase().includes(searchString.toLowerCase()) &&
          u.uid !== user?.uid
      )
    )
  );

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
}
