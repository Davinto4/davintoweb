import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBz7fdasuQLxIFLq2TJzPAQrDTJq6h_YT8",
  authDomain: "davintoweb-payments.firebaseapp.com",
  databaseURL: "https://davintoweb-payments-default-rtdb.firebaseio.com",
  projectId: "davintoweb-payments",
  storageBucket: "davintoweb-payments.appspot.com",
  messagingSenderId: "667742200333",
  appId: "1:667742200333:web:cf75f6cef6798eed432b44"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM elements
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const resendVerification = document.getElementById("resend-verification");
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout");
const portfolioForm = document.getElementById("portfolio-form");

// CSV Export
document.getElementById("export-payments").addEventListener("click", exportPaymentsCSV);
document.getElementById("export-portfolio").addEventListener("click", exportPortfolioCSV);

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        alert("Please verify your email before proceeding.");
        resendVerification.style.display = "block";
        dashboardSection.style.display = "none";
      }
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Email verification resend
resendVerification.addEventListener("click", () => {
  const user = auth.currentUser;
  if (user) {
    sendEmailVerification(user)
      .then(() => {
        alert("Verification email sent to " + user.email);
      })
      .catch((error) => {
        alert("Error sending verification: " + error.message);
      });
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    location.reload();
  });
});

// On Auth state changed
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    checkUserRole(user.uid);
  } else {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
  }
});

// Role-based access check
function checkUserRole(uid) {
  const roleRef = ref(db, `roles/${uid}`);
  onValue(roleRef, (snapshot) => {
    const roleData = snapshot.val();
    if (roleData) {
      const role = roleData.role;
      if (role === "admin" || role === "viewer" || role === "editor") {
        initDashboard(role);
      } else {
        alert("Access denied. You must be approved by the admin.");
        signOut(auth);
      }
    } else {
      alert("Waiting for approval...");
      signOut(auth);
    }
  });
}

// Load dashboard
function initDashboard(role) {
  loginSection.style.display = "none";
  dashboardSection.style.display = "block";

  // Enable form for admins/editors only
  if (role === "admin" || role === "editor") {
    portfolioForm.style.display = "block";
  }

  loadPayments(role);
  loadPortfolio(role);
}

// Load Payments
function loadPayments(role) {
  const paymentsRef = ref(db, "payments");
  onValue(paymentsRef, (snapshot) => {
    const table = document.getElementById("payments-table");
    table.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.account}</td>
        <td>${data.service}</td>
        <td>${data.message}</td>
        ${role === "admin" ? `<td><button onclick="deletePayment('${child.key}')">Delete</button></td>` : ""}
      `;
      table.appendChild(row);
    });
  });
}

window.deletePayment = function (id) {
  remove(ref(db, "payments/" + id)).then(() => alert("Deleted"));
};

// Load Portfolio
function loadPortfolio(role) {
  const portRef = ref(db, "portfolio");
  onValue(portRef, (snapshot) => {
    const table = document.getElementById("portfolio-table");
    table.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.title}</td>
        <td>${data.description}</td>
        <td><a href="${data.link}" target="_blank">Visit</a></td>
        ${(role === "admin" || role === "editor") ? `<td>
          <button onclick="deletePortfolio('${child.key}')">Delete</button>
        </td>` : ""}
      `;
      table.appendChild(row);
    });
  });
}

window.deletePortfolio = function (id) {
  remove(ref(db, "portfolio/" + id)).then(() => alert("Deleted"));
};

// Post new portfolio
portfolioForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = portfolioForm.title.value;
  const description = portfolioForm.description.value;
  const link = portfolioForm.link.value;

  const portRef = ref(db, "portfolio");
  const newPost = push(portRef);
  set(newPost, { title, description, link }).then(() => {
    alert("Project added!");
    portfolioForm.reset();
  });
});

// Export Payments CSV
function exportPaymentsCSV() {
  const refPayments = ref(db, "payments");
  onValue(refPayments, (snapshot) => {
    const rows = [["Name", "Email", "Account", "Service", "Message"]];
    snapshot.forEach((child) => {
      const d = child.val();
      rows.push([d.name, d.email, d.account, d.service, d.message]);
    });
    downloadCSV(rows, "payments.csv");
  });
}

// Export Portfolio CSV
function exportPortfolioCSV() {
  const refPortfolio = ref(db, "portfolio");
  onValue(refPortfolio, (snapshot) => {
    const rows = [["Title", "Description", "Link"]];
    snapshot.forEach((child) => {
      const d = child.val();
      rows.push([d.title, d.description, d.link]);
    });
    downloadCSV(rows, "portfolio.csv");
  });
}

// CSV Downloader
function downloadCSV(data, filename) {
  const csvContent = data.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
