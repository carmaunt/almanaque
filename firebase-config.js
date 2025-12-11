// firebase-config.js
// Arquivo responsável por inicializar o Firebase e expor a instância de auth

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// TODO: substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDMbUXo0B1RYKCwHhUhlyrkmlkQQTJMTuo",
    authDomain: "tech-platform-login.firebaseapp.com",
    projectId: "tech-platform-login",
    storageBucket: "tech-platform-login.firebasestorage.app",
    messagingSenderId: "972052993592",
    appId: "1:972052993592:web:c5794b20539617ecd6b8cd"
  };

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Cria a instância de autenticação
const auth = getAuth(app);
const db = getFirestore(app);      // Firestore para salvar os dados (nome, alcunha, facção, histórico, URL da foto)
const storage = getStorage(app);   // Storage para salvar a imagem do criminoso

// Exporta para uso em outros módulos (ex: script.js)
export { app, auth, db, storage };
