import { useState, useEffect } from "react";
import { realtimeDb } from "../firebase/config";
import { ref, get, push, set, remove, onValue } from "firebase/database";

type DataType = Record<string, any> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

const useRealtimeCollection = (table: string) => {
  const [results, setResults] = useState<DataType[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsPending(true);

    const dbRef = ref(realtimeDb, table);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.entries(snapshot.val()).map(
            ([id, value]) => ({
              id,
              ...(value as object),
            })
          );

          setResults(data);
        } else {
          setResults([]);
        }

        setIsPending(false);
      },
      (err) => {
        setError(err.message);
        setIsPending(false);
      }
    );

    return () => unsubscribe();
  }, [table]);

  
  const getAll = async (): Promise<DataType[]> => {
    setIsPending(true);
    setError(null);

    try {
      const snapshot = await get(ref(realtimeDb, table));

      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(
          ([id, value]) => ({
            id,
            ...(value as object),
          })
        );

        setResults(data);
        return data;
      } else {
        setResults([]);
        return [];
      }
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsPending(false);
    }
  };

  
  const add = async (data: DataType) => {
    setIsPending(true);
    setError(null);

    try {
      const newRef = await push(ref(realtimeDb, table), {
        ...data,
        createdAt: new Date().toISOString(),
      });

      setIsPending(false);
      return newRef;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return null;
    }
  };

  
  const update = async (id: string, data: DataType) => {
    setIsPending(true);
    setError(null);

    try {
      await set(ref(realtimeDb, `${table}/${id}`), {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      setIsPending(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return false;
    }
  };

  
  const deleteDoc = async (id: string) => {
    setIsPending(true);
    setError(null);

    try {
      await remove(ref(realtimeDb, `${table}/${id}`));
      setIsPending(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
      return false;
    }
  };

  return { results, isPending, error, getAll, add, update, deleteDoc };
};

export default useRealtimeCollection;