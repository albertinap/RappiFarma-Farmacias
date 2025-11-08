import { auth, db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, deleteDoc} from "firebase/firestore";

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

//función de aceptar solicitud y enviar cotización. Muevo oferta de solicitudes-->pedidos
export const aceptarSolicitud = async (request, cotizacionData, nombreFarmacia) => {
  try {
    const requestId = request.id;

    // Crear documento en "offers"
    await setDoc(doc(db, "offers", requestId), {
      ...request,
      estado: "Pendiente",
      cotizacion: cotizacionData,
      farmacia: nombreFarmacia ?? "",
      fechaCotizacion: new Date(),
    });

    // Eliminar de "pendingRequests"
    await deleteDoc(doc(db, "pendingRequests", requestId));

    return true;
  } catch (error) {
    console.error("Error al aceptar solicitud:", error);
    throw error;
  }
};

export async function rechazarSolicitud(request, nombreFarmacia, motivo) {
  if (!request?.id) throw new Error("Solicitud inválida");

  //Guarda un registro del rechazo en 'offers' (el detalle es el motivo de rechazo")
  await addDoc(collection(db, "offers"), {
    requestId: request.id,
    userId: request.userId,
    farmacia: nombreFarmacia || "Farmacia desconocida",
    detalle: motivo,
    state: "Rechazada",
    createdAt: serverTimestamp(),
  });

  //Elimino la solicitud original de 'requests'
  await deleteDoc(doc(db, "requests", request.id));
}
