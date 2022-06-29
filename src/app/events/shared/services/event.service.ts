import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Eventure } from '../../event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  data$: Observable<Eventure[]>;
  eventsCollection: CollectionReference<Eventure>;

  constructor(private firestore: Firestore) {
    this.eventsCollection = collection(
      firestore,
      'events'
    ) as CollectionReference<Eventure>;
    this.data$ = collectionData(this.eventsCollection, { idField: 'id' });
  }

  add(event: Eventure): Promise<DocumentReference<Eventure>> {
    return addDoc(this.eventsCollection, event);
  }

  set(event: Eventure, docRef: DocumentReference): Promise<void> {
    return setDoc(docRef, event);
  }

  getById(id: string): Observable<Eventure> {
    const eventDocRef = doc(this.firestore, `events/${id}`);

    return docData(eventDocRef, { idField: 'id' }) as Observable<Eventure>;
  }

  update(id: string, data: Partial<Eventure>): Promise<void> {
    const eventDocRef = doc(this.firestore, `events/${id}`);

    return updateDoc(eventDocRef, data);
  }

  delete(id: string): Promise<void> {
    const eventDocRef = doc(this.firestore, `events/${id}`);

    return deleteDoc(eventDocRef);
  }
}
