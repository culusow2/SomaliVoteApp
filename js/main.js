// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAouJWrr6MA60Lfp_3jZaLfRgsWFpunddo",
  authDomain: "somalielection2026-2086f.firebaseapp.com",
  databaseURL: "https://somalielection2026-2086f-default-rtdb.firebaseio.com",
  projectId: "somalielection2026-2086f",
  storageBucket: "somalielection2026-2086f.appspot.com",
  messagingSenderId: "118367125204",
  appId: "1:118367125204:web:683ff14c39fb1d18488541"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function login() {
  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const district = document.getElementById("district").value;

  if (!name || !gender || !district) {
    alert("Please fill in all fields.");
    return;
  }

  sessionStorage.setItem("user", name);
  window.location.href = "vote.html";
}

function submitVote() {
  const candidate = document.getElementById("candidate").value;
  const ref = db.ref("votes/" + candidate);
  ref.transaction(current => (current || 0) + 1);
  alert("✅ Vote submitted successfully!");
  window.location.href = "result.html";
}

function showResults() {
  db.ref("votes/Farmaajo").on("value", snapshot => {
    document.getElementById("farmaajoCount").textContent = snapshot.val() || 0;
  });
  db.ref("votes/Hassan").on("value", snapshot => {
    document.getElementById("hassanCount").textContent = snapshot.val() || 0;
  });
  db.ref("votes/Khaire").on("value", snapshot => {
    document.getElementById("khaireCount").textContent = snapshot.val() || 0;
  });
}

function updateCandidateImage() {
  const selected = document.getElementById("candidate").value;
  const img = document.getElementById("candidate-img");

  if (selected === "Farmaajo") img.src = "img/farmaajo.png";
  if (selected === "Hassan") img.src = "img/hassan.png";
  if (selected === "Khaire") img.src = "img/khaire.png";
}
