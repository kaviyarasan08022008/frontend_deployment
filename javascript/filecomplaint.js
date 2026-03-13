import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.querySelector('input[name="incident_date"]');
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("max", today);
  }
});

document
  .getElementById("complaint-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = document.getElementById("complaint-form");
    const formData = new FormData(form);

    // Add people_id (you may need to get this from logged-in user)
    const people_id = localStorage.getItem("user_id") || 1;
    formData.append("people_id", people_id);

    // Convert checkbox value to boolean
    const is_anonymous = formData.get("is_anonymous") === "true";
    formData.set("is_anonymous", is_anonymous);

    try {
      const response = await fetch(
        `${API_BASE_URL}/complaints`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(
          `Complaint submitted successfully!\n\nYour Complaint ID: CRP${result.id}\n\nPlease save this ID to track your complaint status.`,
        );
        form.reset();
      } else {
        // Handle both validation errors and string errors
        let msg = "Unknown Error";
        if (result.detail) {
          msg = Array.isArray(result.detail)
            ? result.detail[0].msg
            : result.detail;
        }
        alert("Error: " + msg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection failed");
    }
  });
