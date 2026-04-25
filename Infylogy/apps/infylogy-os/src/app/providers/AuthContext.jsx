import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const ROLES = {
  EMPLOYEE: 'Employee',
  RECRUITER: 'Recruiter',
  HR: 'HR',
  IMMIGRATION: 'Immigration',
  SUPERVISOR: 'Supervisor',
  ACCOUNTING: 'Accounting',
  CLIENT: 'Client',
  ADMIN: 'Admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Admin for local testing
  const useMock = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'placeholder';

  useEffect(() => {
    if (useMock) {
      console.log('Using Mock Auth Profile (Admin)');
      setUser({ email: 'amith@infylogy.com', displayName: 'Admin' });
      setRole(ROLES.ADMIN);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
        setUser(user);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [useMock]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
