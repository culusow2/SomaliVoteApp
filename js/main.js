import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get, update, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    if (window.location.pathname.includes("vote.html")) {
        loadUserInfo();
    }

    if (window.location.pathname.includes("results.html")) {
        showResults();
    }

    if (window.location.pathname.includes("admin.html")) {
        showAdminVoters();
        showAdminVotes();
    }
});

function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value;
    const region = document.getElementById("region").value.trim();
    const district = document.getElementById("district").value.trim();

    if (!name || !gender || !region || !district) {
        alert("Fadlan buuxi foomka si sax ah.");
        return;
    }

    const user = { name, gender, region, district, hasVoted: false };
    localStorage.setItem("currentUser", JSON.stringify(user));

    const usersRef = ref(db, "users");
    push(usersRef, user);

    window.location.href = "vote.html";
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) window.location.href = "index.html";

    document.getElementById("displayName").textContent = user.name;
    document.getElementById("displayDistrict").textContent = user.district;
    document.getElementById("displayRegion").textContent = user.region;
}

let selectedCandidate = null;

window.selectCandidate = (candidate) => {
    selectedCandidate = candidate;
    document.getElementById("selectedCandidateName").textContent = getFullName(candidate);
    document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = () => {
    selectedCandidate = null;
    document.getElementById("confirmation").classList.add("hidden");
};

function getFullName(shortName) {
    const names = {
        Farmaajo: "Mohamed Abdullahi Farmaajo",
        Hassan: "Hassan Sheikh Mohamud",
        Khaire: "Hassan Ali Khaire",
        Sharif: "Sharif Sheikh Ahmed",
        Roble: "Mohamed Hussein Roble",
        Shirdon: "Abdi Farah Shirdon"
    };
    return names[shortName] || shortName;
}

window.submitVote = async () => {
    if (!selectedCandidate) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.hasVoted) return alert("You have already voted!");

    const voteRef = ref(db, `votes/${selectedCandidate}`);
    const voteSnapshot = await get(voteRef);
    const currentVotes = voteSnapshot.exists() ? voteSnapshot.val() : 0;

    await set(voteRef, currentVotes + 1);

    user.hasVoted = true;
    localStorage.setItem("currentUser", JSON.stringify(user));
    
    const usersRef = ref(db, "users");
    push(usersRef, user);

    window.location.href = "results.html";
};

function showResults() {
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];
    candidates.forEach(candidate => {
        const candidateRef = ref(db, `votes/${candidate}`);
        onValue(candidateRef, (snapshot) => {
            const votes = snapshot.val() || 0;
            document.getElementById(`${candidate.toLowerCase()}Count`).textContent = votes;
            const progress = document.getElementById(`${candidate.toLowerCase()}Progress`);
            if (progress) {
                progress.style.width = `${Math.min(votes * 10, 100)}%`;
            }
        });
    });
}

function showAdminVoters() {
    const tableBody = document.getElementById("voterTableBody");
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
        tableBody.innerHTML = "";
        snapshot.forEach(child => {
            const user = child.val();
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.region}</td>
                <td>${user.district}</td>
                <td>${user.hasVoted ? "Yes" : "No"}</td>
            `;
            tableBody.appendChild(tr);
        });
    });
}

function showAdminVotes() {
    const voteSection = document.getElementById("adminVotes");
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];

    candidates.forEach(candidate => {
        const candidateRef = ref(db, `votes/${candidate}`);
        onValue(candidateRef, (snapshot) => {
            const votes = snapshot.val() || 0;
            const p = document.createElement("p");
            p.innerHTML = `<strong>${getFullName(candidate)}:</strong> ${votes} votes`;
            voteSection.appendChild(p);
        });
    });
}
