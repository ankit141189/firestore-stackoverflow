import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';

export interface Question {
  id: string
  title: string
  description: string
  tags: string[]
  createdByUser: string
  lastUpdateTimestamp: number 
}

interface QuestionDoc {
  title: string
  description: string
  tags: string[]
  createdByUser: string
  lastUpdateTimestamp: number 
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private userService: UserService, private aFirestore: AngularFirestore) { }

  submit(question: Question): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      if (!this.userService.currentUser) {
        reject(new Error("No logged in user"));
      }
      const qDoc = {} as QuestionDoc
      qDoc.title = question.title
      qDoc.description = question.description
      qDoc.tags = question.tags
      qDoc.createdByUser = this.userService.currentUser.id;
      qDoc.lastUpdateTimestamp = Date.now()
      this.aFirestore.collection('questions').add(qDoc)
          .then(result => resolve(result.id))
    });
  }

  get(id: string): Promise<Question> {
    return this.aFirestore.doc('questions/' + id).get().toPromise()
        .then(doc => {
          const q = doc.data() as Question
          q.id = id
          return q
        });
  }

  listQuestionsCreatedByCurrentUser(): Promise<Question[]> {
    if (!this.userService.currentUser) {
      return Promise.reject("No logged in user");
    }
    return this.aFirestore.collection('questions').ref
        .where('createdByUser', '==', this.userService.currentUser.id)
        .orderBy('lastUpdateTimestamp', 'desc')
        .limit(20)
        .get()
        .then(res => res.docs.map(doc => {
          const q = doc.data() as Question;
          q.id = doc.id;
          return q;
        }));
  }

  update(question: Question): Promise<void> {
    const qDoc = {} as QuestionDoc;
    qDoc.title = question.title;
    qDoc.description = question.description;
    qDoc.tags = question.tags;
    qDoc.lastUpdateTimestamp = Date.now();
    return this.aFirestore.doc('questions/' + question.id).update(qDoc);
  }
}
