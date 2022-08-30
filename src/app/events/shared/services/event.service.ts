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

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Events, Eventure } from '../../event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventsRef: CollectionReference<Eventure>;
  categoryFilter$: BehaviorSubject<string | null>;
  tagsFilter$: BehaviorSubject<string[] | string>;

  constructor(private firestore: Firestore) {
    this.categoryFilter$ = new BehaviorSubject(null);
    this.tagsFilter$ = new BehaviorSubject([]);

    this.eventsRef = collection(
      firestore,
      Events.COLLECTION
    ) as CollectionReference<Eventure>;
  }

  /**
   * Complex compound queries in firebase V9
   * https://stackoverflow.com/a/69605613/4982169
   */
  get data$(): Observable<Eventure[]> {
    return combineLatest([this.categoryFilter$, this.tagsFilter$]).pipe(
      switchMap(([category, tags]) => {
        const conditions = [];

        if (category !== null) {
          conditions.push(where(Events.IndexField.CATEGORY, '==', category));
        }

        if (Array.isArray(tags) && !!tags.length) {
          for (const tag of tags) {
            conditions.push(
              where(`${Events.IndexField.TAG}.${tag}`, '==', true)
            );
          }
        }

        if (typeof tags === 'string' && tags !== '') {
          const slugTag = tags.toLowerCase();
          conditions.push(
            where(`${Events.IndexField.TAG}.${slugTag}`, '==', true)
          );
        }

        const filterQuery = query(this.eventsRef, ...conditions);

        return collectionData(filterQuery, { idField: 'id' });
      })
    );
  }

  filterByCategory(category: string): void {
    return this.categoryFilter$.next(category);
  }

  filterByTags(tags: string[] | string): void {
    return this.tagsFilter$.next(tags);
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
}
