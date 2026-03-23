import { useState } from "react";
import { firestoreDb } from "../firebase/config";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

// Tipo para filtros
type Filter = [string, any, any];

const useCollection = <T = DocumentData>(table: string) => {
  const [results, setResults] = useState<T[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener documentos
  const getAll = async (filters: Filter[] = []): Promise<T[]> => {
    setIsPending(true);
    setError(null);

    try {
      let q: any = query(collection(firestoreDb, table));

      for (const [field, op, value] of filters) {
        q = query(q, where(field, op, value));
      }

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Record<string, unknown>),
      })) as T[];

      setResults(docs);
      setIsPending(false);
      return docs;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return [];
    }
  };

  // Agregar documento
  const add = async (data: Partial<T>): Promise<DocumentReference | null> => {
    setIsPending(true);
    setError(null);

    try {
      const ref = await addDoc(collection(firestoreDb, table), {
        ...data,
        createdAt: serverTimestamp(),
      });

      setIsPending(false);
      return ref;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return null;
    }
  };

  // Actualizar documento
  const update = async (id: string, data: Partial<T>): Promise<boolean> => {
    setIsPending(true);
    setError(null);

    try {
      await updateDoc(doc(firestoreDb, table, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });

      setIsPending(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return false;
    }
  };

  // Eliminar documento
  const remove = async (id: string): Promise<boolean> => {
    setIsPending(true);
    setError(null);

    try {
      await deleteDoc(doc(firestoreDb, table, id));
      setIsPending(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return false;
    }
  };

  return { results, isPending, error, getAll, add, update, remove };
};

export default useCollection;