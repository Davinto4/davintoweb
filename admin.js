// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "davintoweb-payments.firebaseapp.com",
  databaseURL: "https://davintoweb-payments-default-rtdb.firebaseio.com",
  projectId: "davintoweb-payments",
  storageBucket: "davintoweb-payments.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const loginForm = document.getElementById('login-form');
const adminPanel = document.getElementById('admin-panel');
const resendBtn = document.getElementById('resend-verification');
const logoutBtn = document.getElementById('logoutBtn');

// Show/hide dashboard based on login
auth.onAuthStateChanged(async (user) => {
  if (user) {
    await user.reload();
    if (!user.emailVerified) {
      document.getElementById('verify-message').style.display = 'block';
      resendBtn.style.display = 'inline-block';
      loginForm.style.display = 'none';
      adminPanel.style.display = 'none';
    } else {
      // Check role from database
      const roleRef = db.ref(`roles/${user.uid}/role`);
      roleRef.once('value', (snapshot) => {
        const role = snapshot.val();
        if (role === 'admin' || role === 'editor' || role === 'viewer') {
          loginForm.style.display = 'none';
          adminPanel.style.display = 'block';
          loadPayments();
          loadPortfolio();
        } else {
          alert('Access denied: Awaiting super admin approval');
          auth.signOut();
        }
      });
    }
  } else {
    loginForm.style.display = 'block';
    adminPanel.style.display = 'none';
  }
});

// Login logic
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;

  auth.signInWithEmailAndPassword(email, password)
    .then((cred) => {
      if (!cred.user.emailVerified) {
        alert("Please verify your email.");
        resendBtn.style.display = 'inline-block';
      }
    })
    .catch((err) => alert(err.message));
});

// Resend email verification
resendBtn.addEventListener('click', () => {
  const user = auth.currentUser;
  if (user) {
    user.sendEmailVerification().then(() => {
      alert("Verification email sent!");
    }).catch((error) => {
      alert("Failed to send: " + error.message);
    });
  }
});

// Logout button
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Load payments table
function loadPayments() {
  const table = document.getElementById("payments-table-body");
  db.ref("payments").on("value", (snapshot) => {
    table.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const row = `
        <tr>
          <td>${data.name}</td>
          <td>${data.email}</td>
          <td>${data.account}</td>
          <td>${data.message}</td>
        </tr>`;
      table.innerHTML += row;
    });
  });
}

// Load portfolio table
function loadPortfolio() {
  const table = document.getElementById("portfolio-table-body");
  db.ref("portfolio").on("value", (snapshot) => {
    table.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const key = child.key;
      const row = `
        <tr>
          <td>${data.title}</td>
          <td>${data.description}</td>
          <td><img src="${data.image}" width="100"/></td>
          <td>
            <button onclick="editProject('${key}')">Edit</button>
            <button onclick="deleteProject('${key}')">Delete</button>
          </td>
        </tr>`;
      table.innerHTML += row;
    });
  });
}

// Post project
document.getElementById("post-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const desc = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  const newRef = db.ref("portfolio").push();
  newRef.set({ title, description: desc, image }).then(() => {
    alert("Project added!");
    document.getElementById("post-form").reset();
  });
});

// Edit project
function editProject(key) {
  const title = prompt("New title:");
  const desc = prompt("New description:");
  const image = prompt("New image URL:");

  if (title && desc && image) {
    db.ref("portfolio/" + key).set({ title, description: desc, image });
  }
}

// Delete project
function deleteProject(key) {
  if (confirm("Delete this project?")) {
    db.ref("portfolio/" + key).remove();
  }
}

// Export CSV
function exportCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  let csv = '';
  const rows = table.querySelectorAll("tr");

  rows.forEach((row) => {
    const cols = row.querySelectorAll("td, th");
    const rowData = [];
    cols.forEach((col) => rowData.push(col.innerText));
    csv += rowData.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

document.getElementById("export-payments").addEventListener("click", () => {
  exportCSV("payments-table", "payments.csv");
});

document.getElementById("export-portfolio").addEventListener("click", () => {
  exportCSV("portfolio-table", "portfolio.csv");
});