import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "./db";

const useDexie = <T = any>(table: string, filterFn: ((item: T) => boolean) | null = null) => {
  const [manualResults, setManualResults] = useState<T[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const liveResults = useLiveQuery(() => {
    const tableRef = (db as any)[table];
    if (filterFn) {
      return tableRef.filter(filterFn).toArray();
    }
    return tableRef.toArray();
  }, [table]) ?? [];

  // --- Lectura manual - getAll ---
  const getAll = async () => {
    setIsPending(true);
    setError(null);
    try {
      let data: T[];
      const tableRef = (db as any)[table];
      if (filterFn) {
        data = await tableRef.filter(filterFn).toArray();
      } else {
        data = await tableRef.toArray();
      }
      setManualResults(data);
      setIsPending(false);
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
    }
  };

  // --- Agregar ---
  const add = async (data: Omit<T, "id" | "createdAt"> | any) => {
    setIsPending(true);
    setError(null);
    try {
      await (db as any)[table].add({
        ...data,
        createdAt: new Date().toISOString(),
      });
      setIsPending(false);
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
    }
  };

  // --- Actualizar ---
  const update = async (id: number | string, data: Partial<T>) => {
    setIsPending(true);
    setError(null);
    try {
      await (db as any)[table].update(id, data);
      setIsPending(false);
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
    }
  };

  // --- Eliminar ---
  const deleteItem = async (id: number | string) => {
    setIsPending(true);
    setError(null);
    try {
      await (db as any)[table].delete(id);
      setIsPending(false);
    } catch (err: any) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return {
    manualResults,
    isPending,
    error,
    liveResults: liveResults as T[],
    getAll,
    add,
    update,
    deleteItem,
  };
};

export default useDexie;