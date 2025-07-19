<!-- Make sure Firebase scripts are included -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signOut
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import {
    getDatabase,
    ref,
    set,
    get,
    child
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

  const loginForm = document.getElementById("login-form");
  const adminPanel = document.getElementById("admin-panel");
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const errorBox = document.getElementById("login-error");

  // Super Admin Credentials
  const SUPER_ADMIN_EMAIL = "macdinodavinto@gmail.com";
  const SUPER_ADMIN_PASSWORD = "08022664487@Mac";

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailField.value;
    const password = passwordField.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (email === SUPER_ADMIN_EMAIL) {
        // Super Admin skips all checks
        set(ref(db, 'roles/' + user.uid), { role: "superadmin" });
        showAdminPanel();
      } else {
        // Others must verify email first
        if (!user.emailVerified) {
          await sendEmailVerification(user);
          alert("Verification email sent. Please check your inbox.");
          await signOut(auth);
          return;
        }

        const roleRef = ref(db, 'roles/' + user.uid);
        const roleSnap = await get(roleRef);

        if (!roleSnap.exists()) {
          // Not yet approved
          await set(roleRef, { role: "pending" });
          alert("Waiting for super admin approval. Try again later.");
          await signOut(auth);
        } else {
          const role = roleSnap.val().role;
          if (role === "viewer" || role === "editor" || role === "admin") {
            showAdminPanel();
          } else {
            alert("Access denied. Role: " + role);
            await signOut(auth);
          }
        }
      }
    } catch (err) {
      console.error(err);
      errorBox.innerText = err.message;
    }
  });

  // Helper: Display Admin Panel
  function showAdminPanel() {
    loginForm.style.display = "none";
    adminPanel.style.display = "block";
  }

  // Auto login if session persists
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (user.email === SUPER_ADMIN_EMAIL) {
        showAdminPanel();
      } else if (user.emailVerified) {
        const roleSnap = await get(ref(db, 'roles/' + user.uid));
        if (roleSnap.exists()) {
          const role = roleSnap.val().role;
          if (role === "viewer" || role === "editor" || role === "admin") {
            showAdminPanel();
          }
        }
      }
    }
  });
</script>h