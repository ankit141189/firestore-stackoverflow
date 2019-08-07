import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Question } from './question';
import {AngularFirestore} from 'angularfire2/firestore'
import { firestore } from 'firebase';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {

  formControl: FormGroup

  constructor(
    formBuilder: FormBuilder,
    private firestore: AngularFirestore) {
    this.formControl = formBuilder.group({
      title: [''],
      desc: [''] 
    })
   }

  ngOnInit() {
  }

  submit() {
    console.log(this.formControl.value)
    return new Promise<any>((resolve, reject) => {
      this.firestore.collection("questions").add(this.formControl.value).then(
      res => {
        console.log(res)
        resolve(res)
      }
    );
    });
  }
}
