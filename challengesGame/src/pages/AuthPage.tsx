import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

type AuthMode = "login" | "register";

const AuthPage: React.FC = () => {
  const history = useHistory();
  const { login, register, authError, clearAuthError } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeChange = (value: string | number | null | undefined): void => {
    if (value !== "login" && value !== "register") {
      return;
    }

    setMode(value);
    setFormError(null);
    clearAuthError();
  };

  const handleSubmit = async (): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      setFormError("Debes completar correo y contrasena.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const success =
      mode === "login"
        ? await login(email.trim(), password.trim())
        : await register(email.trim(), password.trim());

    setIsSubmitting(false);

    if (success) {
      history.replace("/misiones");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge Missions</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard style={{ marginTop: 24 }}>
          <IonCardHeader>
            <IonCardTitle>{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonSegment
              value={mode}
              onIonChange={(event) => handleModeChange(event.detail.value)}
            >
              <IonSegmentButton value="login">
                <IonLabel>Ingresar</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="register">
                <IonLabel>Registro</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <IonItem style={{ marginTop: 16 }}>
              <IonInput
                type="email"
                label="Correo"
                labelPlacement="stacked"
                placeholder="usuario@correo.com"
                value={email}
                onIonInput={(event) => setEmail(event.detail.value ?? "")}
              />
            </IonItem>

            <IonItem>
              <IonInput
                type="password"
                label="Contrasena"
                labelPlacement="stacked"
                placeholder="********"
                value={password}
                onIonInput={(event) => setPassword(event.detail.value ?? "")}
              />
            </IonItem>

            {(formError || authError) && (
              <IonText color="danger">
                <p>{formError ?? authError}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              style={{ marginTop: 16 }}
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : mode === "login" ? "Entrar" : "Registrarme"}
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;
