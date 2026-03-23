import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonContent, IonInput, IonGrid, IonRow, IonCol, IonIcon, IonBackButton, IonButtons, IonText } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { checkmark, logOut } from 'ionicons/icons'
import { useAuthContext } from '../context/AuthContext'
import useDexie from '../hooks/useDexie'

interface Fruit {
  id?: number
  nombre: string
  proveedor: string
  fechaCosecha: string
  createdAt?: string
}

interface RouteParams {
  id: string
}

interface LocationState {
  fruit?: Fruit
}

const EditFruit: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const location = useLocation<LocationState>()
  const history = useHistory()
  const { logout } = useAuthContext()
  const { liveResults, update, isPending } = useDexie<Fruit>('fruits')

  const [nombre, setNombre] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [fechaCosecha, setFechaCosecha] = useState('')

  useEffect(() => {
    const fruitId = Number(id)
    const fruitFromState = location.state?.fruit
    const fruitFromResults = (liveResults ?? []).find((fruit) => fruit.id === fruitId)
    const current = fruitFromState ?? fruitFromResults

    if (current) {
      setNombre(current.nombre)
      setProveedor(current.proveedor)
      setFechaCosecha(current.fechaCosecha)
    }
  }, [id, location.state, liveResults])

  const handleSave = async () => {
    if (!nombre.trim() || !proveedor.trim() || !fechaCosecha.trim()) return

    await update(Number(id), {
      nombre: nombre.trim(),
      proveedor: proveedor.trim(),
      fechaCosecha: fechaCosecha.trim()
    })

    history.push('/fruits')
  }

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/fruits"></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Fruit</IonTitle>
          <IonButton slot="end" onClick={handleLogout} color="danger">
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText color="medium">
          <p>Fruits usa Dexie local, funciona online y offline.</p>
        </IonText>

        <IonGrid style={{ marginTop: '2rem' }}>
          <IonRow>
            <IonCol>
              <IonInput
                label="Nombre"
                labelPlacement="stacked"
                value={nombre}
                onIonInput={(e) => setNombre(e.detail.value || '')}
                fill="outline"
              />
            </IonCol>
          </IonRow>

          <IonRow style={{ marginTop: '1rem' }}>
            <IonCol>
              <IonInput
                label="Proveedor"
                labelPlacement="stacked"
                value={proveedor}
                onIonInput={(e) => setProveedor(e.detail.value || '')}
                fill="outline"
              />
            </IonCol>
          </IonRow>

          <IonRow style={{ marginTop: '1rem' }}>
            <IonCol>
              <IonInput
                label="Fecha Cosecha"
                labelPlacement="stacked"
                type="date"
                value={fechaCosecha}
                onIonInput={(e) => setFechaCosecha(e.detail.value || '')}
                fill="outline"
              />
            </IonCol>
          </IonRow>

          <IonRow style={{ marginTop: '2rem' }}>
            <IonCol>
              <IonButton expand="block" onClick={handleSave} color="primary" disabled={isPending || !nombre.trim() || !proveedor.trim() || !fechaCosecha.trim()}>
                <IonIcon icon={checkmark} slot="start" />
                Save Fruit
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default EditFruit
