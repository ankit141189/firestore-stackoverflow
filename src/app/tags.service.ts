import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore'
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface TopicTag {
  id: string
  tagName: string
  questionsCount: number
  subscribers: string[]
}

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private aFirestore: AngularFirestore, private userService: UserService) { }

  getAllTags(): Promise<TopicTag[]> {
    return this.aFirestore.collection('tags').get().toPromise()
        .then(querySnapshot => querySnapshot.docs.map(tag => {
          const topicTag = tag.data() as TopicTag
          topicTag.id = tag.id
          return topicTag
         }));
  }

  get(id: string): Promise<TopicTag> {
    return this.aFirestore.collection('tags').doc(id).get().toPromise().then(
      tagDoc => {
        const topicTag = tagDoc.data() as TopicTag
        topicTag.id = tagDoc.id
        return topicTag
      }
    )
  }

  updateSubscribers(subscriptions: Map<string, boolean>):Promise<void> {
    const writeBatch = this.aFirestore.firestore.batch()
    subscriptions.forEach((selected, id) => 
          writeBatch.update(this.aFirestore.collection('tags').doc(id).ref, {
            subscribers: selected 
              ? firebase.firestore.FieldValue.arrayUnion(this.userService.currentUser.email)
              : firebase.firestore.FieldValue.arrayRemove(this.userService.currentUser.email)
          })
        )
    return writeBatch.commit();
  }
}
