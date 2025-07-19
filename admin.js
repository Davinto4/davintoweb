// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-PRApFvWhcLidMbdX5OnWto7efFg_HHY",
  authDomain: "davintoweb-payments.firebaseapp.com",
  projectId: "davintoweb-payments",
  storageBucket: "davintoweb-payments.appspot.com",
  messagingSenderId: "504987647530",
  appId: "1:504987647530:web:7a12a5f33bbf8fa1c5e002",
  databaseURL: "https://davintoweb-payments-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard-section");
const userRoleDisplay = document.getElementById("user-role");

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    const userRef = ref(db, `roles/${user.uid}`);
    onValue(userRef, (snapshot) => {
      const role = snapshot.val()?.role || "viewer";
      if (role === "admin" || role === "editor" || role === "viewer") {
        authSection.classList.add("hidden");
        dashboard.classList.remove("hidden");
        userRoleDisplay.textContent = `Role: ${role}`;
        loadPayments(role);
        loadPortfolio(role);
      } else {
        alert("Access denied: Awaiting admin approval.");
        signOut(auth);
      }
    });
  } else {
    authSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
});

window.login = function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      if (!user.emailVerified) {
        alert("Please verify your email before accessing the dashboard.");
        sendEmailVerification(user);
        signOut(auth);
      }
    })
    .catch((error) => alert(error.message));
};

window.logout = function () {
  signOut(auth);
};

window.resendVerificationEmail = function () {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    sendEmailVerification(user).then(() => alert("Verification email sent."));
  }
};

function loadPayments(role) {
  const paymentsRef = ref(db, "payments");
  onValue(paymentsRef, (snapshot) => {
    const table = document.getElementById("payments-table");
    table.innerHTML = `<tr><th>Name</th><th>Email</th><th>Account</th><th>Message</th>${role === "admin" ? "<th>Action</th>" : ""}</tr>`;
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.account}</td>
        <td>${data.message}</td>
        ${role === "admin" ? `<td><button onclick="deleteEntry('payments', '${child.key}')">Delete</button></td>` : ""}
      `;
      table.appendChild(row);
    });
  });
}

function loadPortfolio(role) {
  const portfolioRef = ref(db, "portfolio");
  onValue(portfolioRef, (snapshot) => {
    const table = document.getElementById("portfolio-table");
    table.innerHTML = `<tr><th>Title</th><th>Link</th><th>Description</th>${role === "admin" ? "<th>Action</th>" : ""}</tr>`;
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.title}</td>
        <td><a href="${data.link}" target="_blank">Visit</a></td>
        <td>${data.description}</td>
        ${role === "admin" ? `<td><button onclick="deleteEntry('portfolio', '${child.key}')">Delete</button></td>` : ""}
      `;
      table.appendChild(row);
    });
  });

  document.getElementById("portfolio-form").onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById("project-title").value;
    const link = document.getElementById("project-link").value;
    const description = document.getElementById("project-description").value;
    push(portfolioRef, { title, link, description });
    e.target.reset();
  };
}

window.deleteEntry = function (type, key) {
  if (confirm("Delete this entry?")) {
    remove(ref(db, `${type}/${key}`));
  }
};

window.exportToCSV = function (section) {
  const refPath = section === "payments" ? "payments" : "portfolio";
  const exportRef = ref(db, refPath);
  onValue(exportRef, (snapshot) => {
    let csv = "";
    const rows = [];
    snapshot.forEach((child) => {
      const data = child.val();
      rows.push(Object.values(data));
    });
    if (rows.length > 0) {
      csv += Object.keys(snapshot.val()[Object.keys(snapshot.val())[0]]).join(",") + "\n";
      rows.forEach((row) => {
        csv += row.join(",") + "\n";
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${section}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No data available to export.");
    }
  }, { onlyOnce: true });
};
