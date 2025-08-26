import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// === Substitua pelos dados do seu Firebase ===
const firebaseConfig = {
  apiKey: "SUA-API-KEY",
  authDomain: "mapamundipintar.firebaseapp.com",
  databaseURL: "https://mapamundipintar.firebaseio.com",
  projectId: "mapamundipintar",
  storageBucket: "mapamundipintar.appspot.com",
  messagingSenderId: "XXX",
  appId: "1:XXX:web:XXX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Carrega o SVG da Europa
fetch("https://upload.wikimedia.org/wikipedia/commons/0/05/Blank_map_of_Europe_(without_disputed_regions).svg")
  .then(r => r.text())
  .then(svg => {
    // Adiciona o "mar" azul atrás
    svg = svg.replace('<svg', '<svg><rect id="mar" x="0" y="0" width="100%" height="100%" />');

    document.getElementById("mapa").innerHTML = svg;

    const picker = document.getElementById("colorPicker");

    // Para cada país (assumindo que cada país é um <path> com id)
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
