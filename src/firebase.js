import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBZjsSy8HUgyyBVLGdczRZuUd10gaCvovI",
    authDomain: "staffingdataui.firebaseapp.com",
    projectId: "staffingdataui",
    storageBucket: "staffingdataui.firebasestorage.app",
    messagingSenderId: "843896022161",
    appId: "1:843896022161:web:39208bbdea1c7909a98b30"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };