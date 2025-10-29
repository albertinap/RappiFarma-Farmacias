import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Registro de farmacia con email y contraseña
export async function signUpPharmacy(email, password, nombreFarmacia, telefono, direccion) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", user.uid), {
    role: "farmacia",
    email,
    nombreFarmacia,
    telefono,
    direccion,
    habilitada: false,       // podrás activarla luego
    createdAt: serverTimestamp(),
  });
  return user;
}

// Login con email y contraseña
export async function loginWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}
