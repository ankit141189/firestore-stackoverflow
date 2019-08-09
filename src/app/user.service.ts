import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

export interface User {
  id: string
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: User;

  constructor(private afAuth: AngularFireAuth) {
    var that = this;
    this.afAuth.user.subscribe({
      next(user) {
        if (user) {
          that.currentUser = {
            id: user.uid,
            email: user.email
          }
        } else {
          that.currentUser = undefined;
        }
      }
    })
   }

  login(email: string, password: string) {
    var that = this;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(res =>  {
      console.log(res)
    });
  }

  register(email: string, password: string) {
    var that = this;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(res =>  {
      console.log("User successfully logged in");
      return res;
    });
  }

  logout() {
    return this.afAuth.auth.signOut().then(res => console.log("User logged out"));
  }
}
