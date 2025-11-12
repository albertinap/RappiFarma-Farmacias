// features/inbox/listen.js
import { db } from "../../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function listenInboxRequests(uidFarmacia, cb) {
  if (!uidFarmacia) {
    console.error("listenInboxRequests: uidFarmacia indefinido.");
    return () => {};
  }
  const col = collection(db, "inbox", uidFarmacia, "requests");
  const q = query(col, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => {
        const x = d.data();
        return {
          id: d.id,
          requestId: x.requestId ?? d.id,
          createdAt: x.createdAt ?? null,
          thumb: x.thumb ?? null,
          userName: x.userName ?? "Cliente",
          direccion: x.direccion ?? "Sin dirección",
        };
      });
      cb(rows);
    },
    (error) => {
      console.error("Error en snapshot listener de inbox:", error);
      cb([]);
    }
  );
}

// opcional: también exportá por defecto para evitar confusiones
export default listenInboxRequests;
