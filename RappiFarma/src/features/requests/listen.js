import { db } from "../../lib/firebase";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";

export function listenPendingRequests(cb) {
  const now = Timestamp.now(); // reloj del servidor (UTC)
  const q = query(
    collection(db, "requests"),
    where("state", "==", "CREADA"),
    where("expiresAt", ">", now)
  );

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items);
  });
}