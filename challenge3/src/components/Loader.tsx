import { IonContent, IonSpinner, IonText } from '@ionic/react'

function Loader() {  //Tiro reciclaje del loading que teníamos de la otra vez para usar un effec 
  return (
    <IonContent className="ion-padding ion-text-center">
      <IonSpinner name="crescent" />
      <IonText color="medium">
        Loading tasks...
      </IonText>
    </IonContent>
  )
}

export default Loader
