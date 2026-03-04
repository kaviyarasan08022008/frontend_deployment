async function trackComplaints() {
  const inputVal = document.getElementById("people-id").value.trim();
  if (!inputVal) {
    alert("Please enter Complaint ID");
    return;
  }

  // Extract numeric ID from "RPT123" or just "123"
  let complaintId = inputVal.toUpperCase().replace("RPT", "");

  if (isNaN(complaintId) || complaintId === "") {
    alert(
      "Invalid Complaint ID format. Please use format like RPT5 or just 5.",
    );
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/complaints/${complaintId}`,
    );

    const resultsArea = document.getElementById("results-area");
    const list = document.getElementById("complaints-list");
    list.innerHTML = "";

    if (!res.ok) {
      if (res.status === 404) {
        list.innerHTML = "<p>Complaint not found.</p>";
        resultsArea.style.display = "block";
      } else {
        throw new Error("API Error");
      }
      return;
    }

    const c = await res.json();

    const item = document.createElement("div");
    item.className = "details";
    item.style.marginBottom = "20px";
    item.style.borderBottom = "1px solid #ccc";
    item.style.paddingBottom = "10px";

    let statusColor = "orange";  
    if (c.status === "solved") statusColor = "green";
    if (c.status === "not-approved") statusColor = "red";

    item.innerHTML = `
                    <p><b>Complaint ID:</b> RPT${c.id}</p>
                    <p><b>Category:</b> ${c.category}</p>
                    <p><b>Village:</b> ${c.village}</p>
                    <p><b>Date:</b> ${c.incident_date}</p>
                    <p><b>Status:</b> <span style="color:${statusColor};font-weight:bold;text-transform:uppercase">${c.status || "Pending"}</span></p>
                `;
    list.appendChild(item);

    resultsArea.style.display = "block";
  } catch (error) {
    console.error(error);
    alert("Error fetching data");
  }
}
