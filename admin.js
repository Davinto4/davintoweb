import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase, ref, onValue, push, set, update, remove, get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB9DLWrJMuQ5fGj5rFo1qi4yGxKvUvK3ho",
  authDomain: "davintoweb-payments.firebaseapp.com",
  projectId: "davintoweb-payments",
  storageBucket: "davintoweb-payments.appspot.com",
  messagingSenderId: "282092477404",
  appId: "1:282092477404:web:5b1e4ad3f2a788d1ce3c5d",
  databaseURL: "https://davintoweb-payments-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const superAdminEmail = "macdinodavinto@gmail.com";

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        sendEmailVerification(user);
        logout();
        return;
      }
      checkApproval(user.uid, user.email);
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

function logout() {
  signOut(auth);
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");
}

function resendVerificationEmail() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      if (!user.emailVerified) {
        sendEmailVerification(user).then(() => {
          alert("Verification email sent!");
        });
      } else {
        alert("Email already verified.");
      }
      logout();
    })
    .catch((error) => alert("Error: " + error.message));
}

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    checkApproval(user.uid, user.email);
  }
});

function checkApproval(uid, email) {
  const roleRef = ref(db, `roles/${uid}`);
  onValue(roleRef, (snapshot) => {
    const roleData = snapshot.val();
    if (!roleData) {
      if (email === superAdminEmail) {
        set(roleRef, { role: "admin" });
        loadDashboard("admin");
      } else {
        alert("Access pending. Waiting for admin approval.");
        logout();
      }
    } else {
      loadDashboard(roleData.role);
    }
  });
}

function loadDashboard(role) {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");
  document.getElementById("user-role").textContent = `Role: ${role}`;

  loadPayments(role);
  loadPortfolio(role);

  document.getElementById("portfolio-form").onsubmit = (e) => {
    e.preventDefault();
    if (role !== "admin" && role !== "editor") return alert("Access denied");
    const title = document.getElementById("project-title").value;
    const link = document.getElementById("project-link").value;
    const desc = document.getElementById("project-description").value;
    push(ref(db, "portfolio"), { title, link, desc });
    e.target.reset();
  };
}

function loadPayments(role) {
  const table = document.getElementById("payments-table");
  table.innerHTML = "<tr><th>Name</th><th>Email</th><th>Account</th><th>Message</th><th>Actions</th></tr>";
  onValue(ref(db, "payments"), (snapshot) => {
    table.innerHTML = "<tr><th>Name</th><th>Email</th><th>Account</th><th>Message</th><th>Actions</th></tr>";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name}</td><td>${data.email}</td><td>${data.account}</td><td>${data.message}</td>
        <td>
          <button onclick="editEntry('${child.key}', 'payments')">Edit</button>
          ${role === "admin" ? `<button onclick="deleteEntry('${child.key}', 'payments')">Delete</button>` : ""}
        </td>`;
      table.appendChild(row);
    });
  });
}

function loadPortfolio(role) {
  const table = document.getElementById("portfolio-table");
  table.innerHTML = "<tr><th>Title</th><th>Link</th><th>Description</th><th>Actions</th></tr>";
  onValue(ref(db, "portfolio"), (snapshot) => {
    table.innerHTML = "<tr><th>Title</th><th>Link</th><th>Description</th><th>Actions</th></tr>";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.title}</td><td><a href="${data.link}" target="_blank">Visit</a></td><td>${data.desc}</td>
        <td>
          <button onclick="editEntry('${child.key}', 'portfolio')">Edit</button>
          ${role === "admin" ? `<button onclick="deleteEntry('${child.key}', 'portfolio')">Delete</button>` : ""}
        </td>`;
      table.appendChild(row);
    });
  });
}

window.editEntry = (id, type) => {
  const form = document.getElementById("edit-form");
  form.innerHTML = '';
  const entryRef = ref(db, `${type}/${id}`);
  get(entryRef).then((snap) => {
    const data = snap.val();
    for (const key in data) {
      const input = document.createElement("input");
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
      form.appendChild(document.createElement("br"));
    }
    form.setAttribute("data-id", id);
    form.setAttribute("data-type", type);
    document.getElementById("edit-modal").classList.remove("hidden");
  });
};

window.saveEdit = () => {
  const form = document.getElementById("edit-form");
  const id = form.getAttribute("data-id");
  const type = form.getAttribute("data-type");
  const updates = {};
  Array.from(form.elements).forEach((el) => {
    if (el.name) updates[el.name] = el.value;
  });
  update(ref(db, `${type}/${id}`), updates);
  closeModal();
};

window.closeModal = () => {
  document.getElementById("edit-modal").classList.add("hidden");
};

window.deleteEntry = (id, type) => {
  if (confirm("Are you sure you want to delete this entry?")) {
    remove(ref(db, `${type}/${id}`));
  }
};

window.exportToCSV = (type) => {
  get(ref(db, type)).then((snapshot) => {
    const rows = [];
    snapshot.forEach((child) => {
      rows.push(child.val());
    });

    if (rows.length === 0) return alert("No data to export.");
    const keys = Object.keys(rows[0]);
    const csv = [
      keys.join(","),
      ...rows.map((row) => keys.map((k) => `"${row[k] || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${type}_data.csv`;
    a.click();
  });
};
