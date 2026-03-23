import { useState } from 'react'
import { IonButton, IonGrid, IonRow, IonCol, IonInput, IonList, IonItem, IonLabel, IonButtons, IonIcon, IonText } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { create, trash } from 'ionicons/icons'
import useDexie from '../hooks/useDexie'

interface Fruit {
  id?: number
  nombre: string
  proveedor: string
  fechaCosecha: string
  createdAt?: string
}

function FruitApp() {
  const { liveResults, add, update, deleteItem, isPending, error } = useDexie<Fruit>('fruits')
  const history = useHistory()

  const [nombre, setNombre] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [fechaCosecha, setFechaCosecha] = useState('')

  const handleSave = async () => {
    if (!nombre.trim() || !proveedor.trim() || !fechaCosecha.trim()) return
    await add({ nombre, proveedor, fechaCosecha })

    setNombre('')
    setProveedor('')
    setFechaCosecha('')
  }

  const handleEdit = (fruit: Fruit) => {
    if (!fruit.id) return
    history.push(`/edit-fruit/${fruit.id}`, { fruit })
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    await deleteItem(id)
  }

  return (
    <>
      <IonGrid>
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
          <IonCol>
            <IonInput
              label="Proveedor"
              labelPlacement="stacked"
              value={proveedor}
              onIonInput={(e) => setProveedor(e.detail.value || '')}
              fill="outline"
            />
          </IonCol>
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
          <IonCol size="12" sizeMd="auto" className="ion-align-self-end">
            <IonButton onClick={handleSave} disabled={isPending || !nombre.trim() || !proveedor.trim() || !fechaCosecha.trim()}>
              Add
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}

      <IonList>
        {liveResults.length === 0 ? (
          <IonItem lines="none">
            <IonLabel color="medium">No fruits yet</IonLabel>
          </IonItem>
        ) : (
          liveResults.map((fruit) => (
            <IonItem key={fruit.id}>
              <IonLabel>
                <h2>{fruit.nombre}</h2>
                <p>Proveedor: {fruit.proveedor}</p>
                <p>Cosecha: {fruit.fechaCosecha}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton fill="clear" color="primary" onClick={() => handleEdit(fruit)}>
                  <IonIcon icon={create} />
                </IonButton>
                <IonButton fill="clear" color="danger" onClick={() => handleDelete(fruit.id)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))
        )}
      </IonList>
    </>
  )
}

export default FruitApp
