import { useState } from "react";
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useFilesystem } from "../Hooks/useFilesystem";

const FilesystemPage: React.FC = () => {
  const { loading, error, writeFile, readFile, deleteFile, listFiles } = useFilesystem();
  const [fileName, setFileName] = useState("prueba.json");
  const [content, setContent] = useState("Hola desde Capacitor");
  const [readResult, setReadResult] = useState<unknown | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const handleWrite = async () => {
    await writeFile({
      path: fileName,
      data: { content },
      isJson: true,
    });
  };

  const handleRead = async () => {
    const data = await readFile({
      path: fileName,
      isJson: true,
    });
    setReadResult(data);
  };

  const handleDelete = async () => {
    await deleteFile({ path: fileName });
    setReadResult(null);
  };

  const handleList = async () => {
    const listed = await listFiles({ path: "" });
    const names = listed.map((item) => (typeof item === "string" ? item : item.name));
    setFiles(names);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Filesystem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonInput
            label="Nombre de archivo"
            labelPlacement="stacked"
            value={fileName}
            onIonInput={(e) => setFileName(e.detail.value ?? "prueba.json")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Contenido"
            labelPlacement="stacked"
            value={content}
            onIonInput={(e) => setContent(e.detail.value ?? "")}
          />
        </IonItem>

        <IonButton expand="block" onClick={() => void handleWrite()} style={{ margin: "12px" }}>
          Guardar archivo
        </IonButton>
        <IonButton expand="block" onClick={() => void handleRead()} style={{ margin: "12px" }}>
          Leer archivo
        </IonButton>
        <IonButton expand="block" onClick={() => void handleList()} style={{ margin: "12px" }}>
          Listar archivos
        </IonButton>
        <IonButton expand="block" color="danger" onClick={() => void handleDelete()} style={{ margin: "12px" }}>
          Eliminar archivo
        </IonButton>

        {loading && (
          <IonText>
            <p style={{ margin: "12px" }}>Procesando...</p>
          </IonText>
        )}

        {error && (
          <IonText color="danger">
            <p style={{ margin: "12px" }}>Error en operación de filesystem.</p>
          </IonText>
        )}

        <IonText>
          <p style={{ margin: "12px" }}>Resultado lectura: {JSON.stringify(readResult)}</p>
        </IonText>

        <IonList>
          {files.map((file) => (
            <IonItem key={file}>
              <IonLabel>{file}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FilesystemPage;