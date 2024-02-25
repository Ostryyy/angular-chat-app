import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import {
  query,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
  collectionData,
  collection,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { ProfileUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  get allUsers$(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);

    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  constructor(private firestore: Firestore, private authService: AuthService) {}
}
