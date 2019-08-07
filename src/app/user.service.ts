import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: string;

  constructor(private afAuth: AngularFireAuth) { }

  login(email: string, password: string) {
    var that = this;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(res =>  {
      console.log(res);
      that.currentUser = res.user.email 
    });
  }

  register(email: string, password: string) {
    var that = this;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(res =>  {
      console.log(res);
      that.currentUser = res.user.email 
    });
  }
}
