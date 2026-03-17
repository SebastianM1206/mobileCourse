import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

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
const analytics = getAnalytics(app)
const auth = getAuth(app)

export { auth, app, analytics }

