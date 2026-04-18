import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useGame } from "../Hooks/useGame";
import { db } from "../firebase/firebase";

type RankingEntry = {
  uid: string;
  email: string;
  points: number;
};

const LEADERBOARD_COLLECTION = "leaderboard";

const RankingPage: React.FC = () => {
  const { user } = useAuth();
  const { points } = useGame();

  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const topQuery = query(
        collection(db, LEADERBOARD_COLLECTION),
        orderBy("points", "desc"),
        limit(5)
      );
      const topSnapshot = await getDocs(topQuery);

      const topEntries: RankingEntry[] = topSnapshot.docs.map((snapshot) => {
        const data = snapshot.data() as { email?: string; points?: number };

        return {
          uid: snapshot.id,
          email: data.email ?? "Usuario",
          points: Number(data.points ?? 0),
        };
      });

      setEntries(topEntries);

      const currentDoc = await getDoc(doc(db, LEADERBOARD_COLLECTION, user.uid));
      const currentPoints = currentDoc.exists()
        ? Number((currentDoc.data() as { points?: number }).points ?? 0)
        : points;

      const higherScoresQuery = query(
        collection(db, LEADERBOARD_COLLECTION),
        where("points", ">", currentPoints)
      );
      const higherScoresSnapshot = await getDocs(higherScoresQuery);

      setPosition(higherScoresSnapshot.size + 1);
    } catch {
      setError("No se pudo cargar el ranking.");
    } finally {
      setLoading(false);
    }
  }, [points, user]);

  useEffect(() => {
    void fetchRanking();
  }, [fetchRanking]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ranking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Top 5 usuarios</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading && <p>Cargando ranking...</p>}
            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            {!loading && entries.length === 0 && <p>No hay usuarios en el ranking.</p>}

            <IonList>
              {entries.map((entry, index) => {
                const isCurrentUser = entry.uid === user?.uid;

                return (
                  <IonItem key={entry.uid} color={isCurrentUser ? "light" : undefined}>
                    <IonLabel>
                      <h2>
                        {index + 1}. {entry.email}
                      </h2>
                      <p>{entry.points} puntos</p>
                    </IonLabel>
                    {isCurrentUser && (
                      <IonNote slot="end" color="primary">
                        Tu posicion
                      </IonNote>
                    )}
                  </IonItem>
                );
              })}
            </IonList>

            {position !== null && (
              <p style={{ marginTop: 12 }}>Tu posicion actual en el ranking: #{position}</p>
            )}

            <IonButton expand="block" onClick={() => void fetchRanking()}>
              Actualizar ranking
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" routerLink="/misiones">
          Volver a misiones
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RankingPage;
