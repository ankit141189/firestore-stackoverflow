import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private aFirestore: AngularFirestore) { }

  getAllTags(): Promise<string[]> {
    return this.aFirestore.collection('tags').get().toPromise()
        .then(querySnapshot => querySnapshot.docs.map(tag => tag.data().tagName));
  }
}
