import { ref, runTransaction } from "firebase/database";
import { database } from "./firebase";

export function incrementViewCount(photoId) {
  const viewRef = ref(database, `photos/${photoId}/views`);
  return runTransaction(viewRef, (currentViews) => (currentViews || 0) + 1);
}
