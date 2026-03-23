import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDtBgKut7ZDZryRUi35CTDGTL7rrjbEhqg',
  authDomain: 'loginmobilecourse.firebaseapp.com',
  projectId: 'loginmobilecourse',
  storageBucket: 'loginmobilecourse.firebasestorage.app',
  messagingSenderId: '69745706709',
  appId: '1:69745706709:web:b7f079f5362a00372e045c',
  measurementId: 'G-X88KYPCVBB',
}

const app = initializeApp(firebaseConfig)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
const auth = getAuth(app)
const firebaseStorage = getStorage(app)
const firestoreDb = getFirestore(app)
const realtimeDb = getDatabase(app)

export { auth, app, analytics, firebaseStorage, firestoreDb, realtimeDb }

