import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TaskApp from '../components/TaskApp';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <TaskApp />
    </IonPage>
  );
};

export default Home;
