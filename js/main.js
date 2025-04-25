// main.js
import { database } from './config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.getElementById("submitBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const region = document.getElementById("region").value.trim();
  const district = document.getElementById("district").value.trim();

  if (!name || !gender || !region || !district) {
    alert("Fadlan buuxi dhammaan meelaha!");
    return;
  }

  const user = {
    name,
    gender,
    region,
    district,
    hasVoted: false
  };

  localStorage.setItem("currentUser", JSON.stringify(user));

  set(ref(database, "voters/" + name.replace(/\s+/g, "_")), user)
    .then(() => {
      window.location.href = "vote.html";
    })
    .catch((error) => {
      console.error("Error writing to database:", error);
      alert("Error saving info.");
    });
});
