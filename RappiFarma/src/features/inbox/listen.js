import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

let unsubscribe = null;
let interval = null;

export function listenInboxRequests(uidFarmacia, cb) {
  if (!uidFarmacia) {
    console.error("listenInboxRequests: uidFarmacia indefinido.");
    return () => {};
  }

  function start() {
    const now = Timestamp.now();
    const col = collection(db, "inbox", uidFarmacia, "requests");
    const q = query(
      col,
      where("expiresAt", ">", now)
    );

    unsubscribe = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        cb(rows);
      },
      (error) => {
        console.error("Error en snapshot listener de inbox:", error);
        cb([]);
      }
    );
  }

  // iniciar primera vez
  start();

  // reiniciar cada N segundos
  interval = setInterval(() => {
    if (unsubscribe) unsubscribe();
    start();
  }, 5 * 1000);

  // cleanup
  return () => {
    if (unsubscribe) unsubscribe();
    if (interval) clearInterval(interval);
  };
}

export default listenInboxRequests;
