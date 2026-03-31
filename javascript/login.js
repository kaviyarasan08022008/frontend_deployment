// import API_BASE_URL from "./config.js";

const adminBtn = document.getElementById("adminBtn");
const userBtn = document.getElementById("userBtn");
const loginForm = document.getElementById("loginForm");
const loginTitle = document.getElementById("loginTitle");

let selectedRole = "";

adminBtn.onclick = () => {
  loginTitle.textContent = "Collector Login";
  selectedRole = "collector";
};

userBtn.onclick = () => {
  loginTitle.textContent = "People Login";
  selectedRole = "user";
};

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedRole) {
    alert("Please select login type");
    return;
  }

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(
      `${API_BASE_URL}/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: username,
          password: password,
          user_role: selectedRole,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      alert((data.detail || "Login failed"));
      return;
    }

    localStorage.setItem("user_id", data.id);
    localStorage.setItem("user_name", data.user_name);
    localStorage.setItem("user_role", data.user_role);

    window.location.href = data.user_role === "collector" ? "admin.html" : "filecomplaint.html";} 
    catch (err) {
    alert("Network error");
  }
});
