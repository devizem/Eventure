import * as admin from 'firebase-admin';

const db = admin.firestore();
const collection = 'events';

/**
 * It is recommend to use multiple exports (vs single class of static methods)
 * https://stackoverflow.com/questions/29893591/es6-modules-export-single-class-of-static-methods-or-multiple-individual-method
 * Note: Default-exporting objects is usually an anti-pattern (lose tree-shaking)
 */

export function getById(
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot> {
  return db.collection(collection).doc(id).get();
}
