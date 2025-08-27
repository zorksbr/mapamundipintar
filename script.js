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

// Importa Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Carrega o SVG do mapa
fetch("mapa.svg")
  .then(r => r.text())
  .then(svg => {
    // Mar azul fixo
    svg = svg.replace(
      '<svg',
      '<svg><rect id="mar" x="0" y="0" width="100%" height="100%" fill="#87CEEB"/>'
    );

    document.getElementById("mapa").innerHTML = svg;

    const picker = document.getElementById("colorPicker");

    // Salva a cor original de cada país
    document.querySelectorAll("#mapa path").forEach(pais => {
      // usa getComputedStyle para pegar cor inicial do CSS
      const corInicial = getComputedStyle(pais).fill;
      pais.dataset.originalFill = corInicial || "#ccc";

      pais.addEventListener("click", () => {
        const corAtual = getComputedStyle(pais).fill;
        const novaCor =
          corAtual === picker.value
            ? pais.dataset.originalFill
            : picker.value;

        // atualiza Firebase
        set(ref(db, "mapa/" + pais.id), novaCor);
      });
    });

    // Listener único para todo o mapa
    const mapaRef = ref(db, "mapa");
    onValue(mapaRef, snapshot => {
      const dados = snapshot.val();
      if (dados) {
        Object.entries(dados).forEach(([id, cor]) => {
          const pais = document.getElementById(id);
          if (pais) {
            pais.setAttribute("fill", cor);
          }
        });
      }
    });
  });
