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
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';

import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Events, Eventure } from '../../event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventsRef: CollectionReference<Eventure>;
  categoryFilter$: BehaviorSubject<string | null>;
  private CLOUD_FUNCTIONS_BASE: string;

  constructor(private firestore: Firestore) {
    this.categoryFilter$ = new BehaviorSubject(null);
    this.eventsRef = collection(
      firestore,
      Events.COLLECTION
    ) as CollectionReference<Eventure>;
    this.CLOUD_FUNCTIONS_BASE = `https://us-central1-eventure-c01c8.cloudfunctions.net/`;
  }

  /**
   * Complex compound queries in firebase V9
   * https://stackoverflow.com/a/69605613/4982169
   */
  get data$(): Observable<Eventure[]> {
    return this.categoryFilter$.pipe(
      switchMap((category) => {
        const conditions = [];

        if (category !== null) {
          conditions.push(where(Events.IndexField.CATEGORY, '==', category));
        }

        const filterQuery = query(this.eventsRef, ...conditions);

        return collectionData(filterQuery, { idField: 'id' });
      })
    );
  }

  filterByCategory(category: string): void {
    return this.categoryFilter$.next(category);
  }

  add(event: Eventure): Promise<DocumentReference<Eventure>> {
    return addDoc(this.eventsRef, event);
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

  generateInstagramPost(id: string): string {
    return `${this.CLOUD_FUNCTIONS_BASE}cgenerateInstagramPicture/?id=${id}`;
  }
}
