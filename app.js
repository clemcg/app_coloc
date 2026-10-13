// Configuration Firebase (à personnaliser)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Référence à la collection des colocataires
const roommatesRef = db.collection("roommates");
const guestsRef = db.collection("guests");

// Liste des colocataires (à personnaliser avec les noms réels)
const roommates = [
    { id: "clement", name: "Clément", avatar: "C" },
    { id: "alice", name: "Alice", avatar: "A" },
    { id: "bob", name: "Bob", avatar: "B" },
    { id: "charlie", name: "Charlie", avatar: "Ch" },
    { id: "david", name: "David", avatar: "D" }
];

// Couleurs pour les avatars
const avatarColors = [
    "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6",
    "#1abc9c", "#d35400", "#34495e", "#16a085", "#27ae60"
];

// Initialiser les données des colocataires dans Firestore
async function initializeRoommates() {
    const snapshot = await roommatesRef.get();
    
    if (snapshot.empty) {
        // Si la collection est vide, créer les documents
        roommates.forEach(async (roommate, index) => {
            await roommatesRef.doc(roommate.id).set({
                name: roommate.name,
                avatar: roommate.avatar,
                present: false,
                guests: "",
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
    }
}

// Mettre à jour l'interface avec les données de Firestore
function updateUI() {
    const roommatesList = document.getElementById("roommatesList");
    roommatesList.innerHTML = '<div class="loading"><div class="spinner"></div>Chargement...</div>';
    
    roommatesRef.orderBy("name").onSnapshot((snapshot) => {
        roommatesList.innerHTML = "";
        
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified") {
                const roommate = change.doc.data();
                roommate.id = change.doc.id;
                renderRoommate(roommate);
            }
        });
        
        // Afficher les invités
        renderGuests();
    }, (error) => {
        console.error("Erreur Firestore:", error);
        roommatesList.innerHTML = '<div class="loading">Erreur de chargement. Veuillez rafraîchir.</div>';
    });
}

// Rendre un colocataire dans l'interface
function renderRoommate(roommate) {
    const roommatesList = document.getElementById("roommatesList");
    
    const card = document.createElement("div");
    card.className = "roommate-card";
    card.id = `roommate-${roommate.id}`;
    
    // Déterminer la couleur de l'avatar
    const colorIndex = roommates.findIndex(r => r.id === roommate.id);
    const color = avatarColors[colorIndex % avatarColors.length];
    
    card.innerHTML = `
        <div class="roommate-avatar" style="background-color: ${color}">
            ${roommate.avatar}
        </div>
        <div class="roommate-info">
            <div class="roommate-name">${roommate.name}</div>
            <div class="roommate-status">
                <span class="status-indicator ${roommate.present ? 'status-present' : 'status-absent'}"></span>
                <span>${roommate.present ? 'Présent' : 'Absent'}</span>
                <button class="status-toggle" data-id="${roommate.id}" data-present="${roommate.present}">
                    Basculer
                </button>
            </div>
            ${roommate.guests ? `<div class="roommate-guests">+ ${roommate.guests}</div>` : ''}
        </div>
    `;
    
    roommatesList.appendChild(card);
    
    // Ajouter l'événement de basculement
    const toggleBtn = card.querySelector(".status-toggle");
    toggleBtn.addEventListener("click", () => {
        togglePresence(roommate.id, !roommate.present);
    });
}

// Basculer la présence d'un colocataire
async function togglePresence(roommateId, present) {
    try {
        await roommatesRef.doc(roommateId).update({
            present: present,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Animation de mise à jour
        const card = document.getElementById(`roommate-${roommateId}`);
        if (card) {
            card.classList.add("updated");
            setTimeout(() => card.classList.remove("updated"), 300);
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
    }
}

// Rendre les invités dans l'interface
function renderGuests() {
    guestsRef.orderBy("addedAt", "desc").onSnapshot((snapshot) => {
        const addGuestSection = document.querySelector(".add-guest");
        const existingGuests = addGuestSection.querySelectorAll(".guest-card");
        existingGuests.forEach(g => g.remove());
        
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const guest = change.doc.data();
                guest.id = change.doc.id;
                renderGuest(guest);
            }
        });
    });
}

// Rendre un invité dans l'interface
function renderGuest(guest) {
    const addGuestSection = document.querySelector(".add-guest");
    
    const card = document.createElement("div");
    card.className = "guest-card";
    card.id = `guest-${guest.id}`;
    
    // Couleur aléatoire pour l'avatar
    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const initial = guest.name.charAt(0).toUpperCase();
    
    card.innerHTML = `
        <div class="guest-avatar" style="background-color: ${color}">
            ${initial}
        </div>
        <div>
            <div class="guest-name">${guest.name}</div>
            ${guest.addedBy ? `<div class="guest-added-by">Ajouté par: ${guest.addedBy}</div>` : ''}
        </div>
    `;
    
    addGuestSection.appendChild(card);
}

// Ajouter un invité
async function addGuest() {
    const nameInput = document.getElementById("guestName");
    const addedByInput = document.getElementById("guestAddedBy");
    
    const name = nameInput.value.trim();
    const addedBy = addedByInput.value.trim();
    
    if (!name) {
        alert("Veuillez entrer un nom pour l'invité");
        return;
    }
    
    try {
        await guestsRef.add({
            name: name,
            addedBy: addedBy || null,
            addedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Réinitialiser les champs
        nameInput.value = "";
        addedByInput.value = "";
        
        // Animation de succès
        const addBtn = document.getElementById("addGuestBtn");
        addBtn.textContent = "✓ Ajouté !";
        addBtn.style.backgroundColor = "#27ae60";
        setTimeout(() => {
            addBtn.textContent = "Ajouter";
            addBtn.style.backgroundColor = "";
        }, 1000);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'invité:", error);
        alert("Erreur lors de l'ajout de l'invité");
    }
}

// Initialiser l'application
document.addEventListener("DOMContentLoaded", () => {
    // Initialiser Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Initialiser les données
    initializeRoommates();
    
    // Mettre à jour l'interface
    updateUI();
    
    // Événement pour ajouter un invité
    const addGuestBtn = document.getElementById("addGuestBtn");
    addGuestBtn.addEventListener("click", addGuest);
    
    // Événement pour rafraîchir
    const refreshBtn = document.getElementById("refreshBtn");
    refreshBtn.addEventListener("click", () => {
        location.reload();
    });
    
    // Permettre d'ajouter un invité avec la touche Entrée
    const guestInputs = [
        document.getElementById("guestName"),
        document.getElementById("guestAddedBy")
    ];
    
    guestInputs.forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addGuest();
            }
        });
    });
});
