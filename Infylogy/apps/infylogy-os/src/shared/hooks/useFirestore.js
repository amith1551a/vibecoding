import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';

export const useCollection = (collectionName, queryConstraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(results);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  return { data, loading, error };
};

export const firestoreService = {
  add: (collectionName, data) => {
    return addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },
  update: (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },
  delete: (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    return deleteDoc(docRef);
  }
};
