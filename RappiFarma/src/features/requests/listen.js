// src/features/requests/listen.js
import { db } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function listenPendingRequests(cb) {
  const q = query(
    collection(db, "requests"),
    where("state", "==", "CREADA")
    // sin orderBy => no necesita índice compuesto
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(items);
  });
}
