// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8Qg4KA4PVcVPosRHygyobl6XobYK0a8Q",
  authDomain: "mapamundipintar.firebaseapp.com",
  databaseURL: "https://mapamundipintar-default-rtdb.firebaseio.com",
  projectId: "mapamundipintar",
  storageBucket: "mapamundipintar.firebasestorage.app",
  messagingSenderId: "930014631774",
  appId: "1:930014631774:web:ac7dd2b709ed9826d721cf",
  measurementId: "G-PN8J84HY7E"
};

// Importa Firebase (via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Carrega o SVG da Europa
fetch("mapa.svg")
  .then(r => r.text())
  .then(svg => {
    // Adiciona o "mar" azul atrás
    svg = svg.replace('<svg', '<svg><rect id="mar" x="0" y="0" width="100%" height="100%" />');

    document.getElementById("mapa").innerHTML = svg;

    const picker = document.getElementById("colorPicker");

    // Para cada país (<path> com id no SVG)
    document.querySelectorAll("#mapa path").forEach(pais => {
      pais.addEventListener("click", () => {
        set(ref(db, "mapa/" + pais.id), picker.value);
      });

      const paisRef = ref(db, "mapa/" + pais.id);
      onValue(paisRef, snapshot => {
        if (snapshot.exists()) {
          pais.setAttribute("fill", snapshot.val());
        }
      });
    });
  });
