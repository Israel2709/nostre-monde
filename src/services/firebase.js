import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCxAwxzNDTS4Fx0ge9XFqcycGFLdlHd6IY",
  authDomain: "photo-gallery-980d8.firebaseapp.com",
  databaseURL: "https://photo-gallery-980d8-default-rtdb.firebaseio.com",
  projectId: "photo-gallery-980d8",
  storageBucket: "photo-gallery-980d8.firebasestorage.app",
  messagingSenderId: "952077192776",
  appId: "1:952077192776:web:5c46424ace04c253d8d27d",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
