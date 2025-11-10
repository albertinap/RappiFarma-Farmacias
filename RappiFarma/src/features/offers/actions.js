import { auth, db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc,  deleteDoc} from "firebase/firestore";
import Toast from "react-native-toast-message";

//esta función crea la oferta a partir de la información de la cotización, y elimina la request base
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
    envioState: "Pendiente",
    timeStamp: serverTimestamp(),
  };

   try {
    // Crear la oferta
    const ref = await addDoc(collection(db, "offers"), payload);
    console.log("✅ Oferta creada con ID:", ref.id);

    // ELIMINAR LA REQUEST
    const reqRef = doc(db, "requests", requestId);
    await deleteDoc(reqRef);
    console.log("🗑️ Request eliminada:", requestId);
    Toast.show({
      type: "success",
      text1: "Cotización enviada",
      text2: `Monto total: $ ${cotizacionData.montoTotal.toFixed(2)}`,
      position: "top",
    });                  
    return { offerId: ref.id };
  } catch (error) {
    console.error("Error en createOffer:", error);
    Toast.show({
      type: "error",
      text1: "Error al enviar cotización",
      text2: error.message || "Intentá nuevamente.",
    });
    throw error;
  }
}

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

export async function cambiarEnvioState(offerId, nuevoEstado) {
  const user = auth.currentUser;
  if (!user) throw new Error("NO_AUTENTICADO");
  if (!offerId) throw new Error("FALTA_OFFER_ID");

  await updateDoc(doc(db, "offers", offerId), {
    envioState: nuevoEstado,
    envioStateUpdatedAt: serverTimestamp(),
  });
}