// src/features/offers/actions.js
import { auth, db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

export async function createOffer(cotizacionData) {
  const user = auth.currentUser;
  if (!user) throw new Error("NO_AUTENTICADO");

  const { medicamentos, montoTotal, tiempoEspera, requestId } = cotizacionData || {};

  // obtener userId del pedido
  let userId = null;
  try {
    if (requestId) {
      const reqSnap = await getDoc(doc(db, "requests", requestId));
      if (reqSnap.exists()) userId = reqSnap.data()?.userId ?? null;
    }
  } catch (_) {}

  // obtener datos de la farmacia
  let farmaciaNombre = null;
  let farmaciaDireccion = null;
  try {
    const perfilSnap = await getDoc(doc(db, "users", user.uid));
    if (perfilSnap.exists()) {
      const p = perfilSnap.data() || {};
      farmaciaNombre = p.nombreFarmacia ?? p.nombre ?? null;
      farmaciaDireccion = p.direccion ?? null;
    }
  } catch (_) {}

  const payload = {
    // datos del formulario
    medicamentos,            // array tal cual llega
    preciototal: montoTotal, // número total
    tiempoEspera,            // minutos

    // datos derivados
    userId,                  // dueño del pedido
    farmacia: farmaciaNombre,
    direccion: farmaciaDireccion,

    // estado y timestamp
    state: "Pendiente",
    timeStamp: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "offers"), payload);
  return { offerId: ref.id };
}
