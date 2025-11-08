import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setUserData({ uid: user.uid, ...snap.data() });
          } else {
            console.log("No existe el documento del usuario");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Limpia el listener al desmontar
  }, []);

  if (loading) return null; 

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
