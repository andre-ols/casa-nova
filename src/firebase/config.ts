import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBekr5ibTv19Z6Zk7rZ8OAoIP77mw_JTJs",
  authDomain: "casa-nova-a3901.firebaseapp.com",
  databaseURL: "https://casa-nova-a3901-default-rtdb.firebaseio.com",
  projectId: "casa-nova-a3901",
  storageBucket: "casa-nova-a3901.appspot.com",
  messagingSenderId: "752839740001",
  appId: "1:752839740001:web:1b6334e7e09872a823f820",
  measurementId: "G-0XHPDQ6BBD",
};

const firebaseapp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseapp);

export const storage = getStorage(firebaseapp);
