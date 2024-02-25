import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService
  ) {}

  uploadImage(event: any, user: User) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Image is being uploaded...',
          success: 'Image uploaded!',
          error: 'There was an error in uploading',
        }),
        concatMap((photoUrl) =>
          this.userService.updateUser({ uid: user.uid, photoUrl: photoUrl })
        )
      )
      .subscribe();
  }
}
