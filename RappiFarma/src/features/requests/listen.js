import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";

export function listenPendingRequests(cb) {
  const now = Timestamp.now();

  const q = query(
    collection(db, "requests"),
    where("expiresAt", ">", now),
    //where("rechazada", "==", false) //las solicitudes que fueron rechazadas no se muestran
  );

  return onSnapshot(q, async (snap) => {
    const requests = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();

        // Busco el usuario correspondiente si existe userId
        let userData = null;
        if (data.userId) {
          try {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userData = userSnap.data();
            }
          } catch (err) {
            console.error("Error al obtener usuario:", err);
          }
        }

        return {
          id: d.id,
          ...data,
          user: userData, 
        };
      })
    );

    cb(requests);
  });
}