import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Geli Button
document.getElementById("submitBtn").addEventListener("click", function () {
  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const region = document.getElementById("region").value;
  const district = document.getElementById("district").value;

  if (name && gender && region && district) {
    // Save voter data to local storage or session (optional)
    sessionStorage.setItem("voterName", name);

    window.location.href = "vote.html";
  } else {
    alert("Fadlan buuxi dhammaan meelaha.");
  }
});
