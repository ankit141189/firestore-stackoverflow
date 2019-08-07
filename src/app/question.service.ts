import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private afAuth: AngularFireAuth) { }
}
