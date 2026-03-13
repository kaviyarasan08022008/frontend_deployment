// import API_BASE_URL from "./config.js";

// 1.Phone: Numbers only, max 10 digits
document.getElementById("phone_number").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
});

// 2.Username: Letters & Underscore only (NO Numbers, NO Special chars)
document.getElementById("user_name").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^a-zA-Z_]/g, "");
});

//3.firstname and last name:
document.getElementById("first_name").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^a-zA-Z_]/g, "");
});
document.getElementById("last_name").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^a-zA-Z_]/g, "");
});

//Password Toggle
document.getElementById("togglePassword").onclick = function () {
  const p = document.getElementById("password");
  const isPass = p.type === "password";
  p.type = isPass ? "text" : "password";
  this.textContent = isPass ? "👁️" : "🙈";
};

//Form Validations
document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const msg = document.getElementById("register-message");
    msg.textContent = "";
    msg.style.color = "red";

    const email = form.email.value.trim();
    const user = form.user_name.value.trim();
    const phone = form.phone_number.value.trim();

    // Validation Logic
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return (msg.textContent = "Invalid email address.");
    if (user.length < 3)
      return (msg.textContent = "Username too short (min 3 chars).");
    if (!/^[a-zA-Z_]+$/.test(user))
      return (msg.textContent = "Username: Letters & _ only (No numbers).");
    if (!/^\d{10}$/.test(phone))
      return (msg.textContent = "Phone must be 10 digits.");

    // Collector Email Validation
    const role = form.user_role.value;
    if (role === "collector" && !email.endsWith("@tn.gov.in")) {
      alert("Use official government email for collector role");
      return;
    }

    // Send Data
    try {
      const res = await fetch(
        `${API_BASE_URL}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            email,
            user_name: user,
            password: form.password.value,
            state: form.state.value,
            district: form.district.value,
            village_town: form.village_town.value,
            phone_number: phone,
            user_role: form.user_role.value,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user_id", String(data.id));
        alert(`Account created successfully! Please login.`);
        window.location.href = "login.html";
      } else {
        const err = await res.json();
        alert("Error: " + (err.detail || JSON.stringify(err)));
      }
    } catch (err) {
      alert(`Network error failed to create account.`);
    }
  });
