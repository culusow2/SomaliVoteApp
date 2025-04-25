// config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAouJWrr6MA60Lfp_3jZaLfRgsWFpunddo",
  authDomain: "somalielection2026-2086f.firebaseapp.com",
  databaseURL: "https://somalielection2026-2086f-default-rtdb.firebaseio.com",
  projectId: "somalielection2026-2086f",
  storageBucket: "somalielection2026-2086f.appspot.com",
  messagingSenderId: "118367125204",
  appId: "1:118367125204:web:683ff14c39fb1d18488541",
  measurementId: "G-LXDNTMSVP1"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
