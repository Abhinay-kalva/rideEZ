import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB69HwiyRVnFiCxe5Ey8wmLHa6scwKLGCk",
    authDomain: "bike-pooling-f082d.firebaseapp.com",
    projectId: "bike-pooling-f082d",
    storageBucket: "bike-pooling-f082d.firebasestorage.app",
    messagingSenderId: "119955706109",
    appId: "1:119955706109:web:ab876d9733befdb9286e94"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
