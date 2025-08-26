import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// === Troque pelos dados do seu projeto Firebase ===
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

// Carrega o mapa da Europa
fetch("mapa.svg").then(r => r.text()).then(svg => {
  document.getElementById("mapa").innerHTML = svg;

  const picker = document.getElementById("colorPicker");

  // Para cada país
  document.querySelectorAll("#mapa path").forEach(pais => {
    // Quando clicar → salva cor no Firebase
    pais.addEventListener("click", () => {
      set(ref(db, "mapa/" + pais.id), picker.value);
    });

    // Atualiza em tempo real quando mudar no banco
    const paisRef = ref(db, "mapa/" + pais.id);
    onValue(paisRef, snapshot => {
      if (snapshot.exists()) {
        pais.setAttribute("fill", snapshot.val());
      }
    });
  });
});
