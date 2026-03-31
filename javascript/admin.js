// import API_BASE_URL from "./config.js";

async function loadComplaints() {
  try {
    const res = await fetch(
      `${API_BASE_URL}/complaints`
    );
    const data = await res.json();

    const tableBody = document.getElementById("complaintsTableBody");
    tableBody.innerHTML = ""; // clear old rows

    // Calculate counts
    const total = data.length;
    const solved = data.filter((c) => c.status === "solved").length;
    const pending = total - solved; // Assuming anything not solved is active/pending

    // Update Dashboard
    document.getElementById("total-count").innerText = total;
    document.getElementById("solved-count").innerText = solved;
    document.getElementById("pending-count").innerText = pending;

    data.reverse().forEach((complaint) => {
      const row = document.createElement("tr");

      // Evidence Link logic
      const evidenceHtml = complaint.image_url ? `<a href="${complaint.image_url}" target="_blank" style="color:blue;text-decoration:underline">View Evidence</a>`: "No File";

      row.innerHTML = `
        <td>RPT${complaint.id}</td>
        <td>${complaint.category}</td>
        <td>${complaint.village}</td>
        <td>${complaint.incident_date}</td>
        <td>${evidenceHtml}</td>
        <td>
          <select id="status-${complaint.id}">
            <option value="Not approved" ${complaint.status === "Not approved" || !complaint.status ? "selected" : ""}>Not Approved</option>
            <option value="pending" ${complaint.status === "pending" || complaint.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="in_progress" ${complaint.status === "in_progress" ? "selected" : ""}>In Progress</option>
            <option value="solved" ${complaint.status === "solved" || complaint.status === "Solved" ? "selected" : ""}>Solved</option>
          </select>
          <button class="ed-but" onclick="updateComplaint(${complaint.id})">Update</button>
          <button class="del-but" onclick="deleteComplaint(${complaint.id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    alert("Failed to load complaints");
    console.error(error);
  }
}

async function updateComplaint(id) {
  const statusSelect = document.getElementById(`status-${id}`);
  const status = statusSelect.value;
  const adminDashboard = document.getElementById("admin-dashboard")


  const formData = new FormData();
  formData.append("status", status);
  try {
    // 1. Update the complaint status
    const res = await fetch(
      `${API_BASE_URL}/complaints/${id}/status`,
      {
        method: "PUT",
        body: formData,
      },
    );

    if (!res.ok) {
      alert("Update Failed");
      return;
    }

    // 2. Create an Action in the actions table
    const actionData = {
      status: status,
      remarks: `Status updated to ${status} from admin dashboard.`,
      complaint_id: id,
      collector_id: null
    };

    const actionRes = await fetch(`${API_BASE_URL}/actions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(actionData)
    });

    if (actionRes.ok) {


      const toasterDiv = document.createElement('div')
      toasterDiv.classList.add("appear-toaster")
      toasterDiv.style.backgroundColor = "#03c400"
      toasterDiv.innerHTML=`
      <p>Complaint <span style="font-weight: bold;">${id}</span> updated to <span style="font-weight: bold;">${status}</span> and action recorded</p>
      `
      adminDashboard.appendChild(toasterDiv)
      setTimeout(() => {
        toasterDiv.classList.remove("appear-toaster")
        toasterDiv.classList.add("disappear-toaster")
      }, 5000)



      loadComplaints(); // reload to reflect changes
    } else {
      alert("Action creation failed, but status was updated.");
    }
  } catch (error) {
    console.error(error);
      const toasterDiv = document.createElement('div')
      toasterDiv.classList.add("appear-toaster")
      toasterDiv.style.backgroundColor = "#c40000"
      toasterDiv.innerHTML=`
      <p>Complaint <span style="font-weight: bold;">${id}</span> updated to <span style="font-weight: bold;">${status}</span> and action recorded</p>
      `
      adminDashboard.appendChild(toasterDiv)
      setTimeout(() => {
        toasterDiv.classList.remove("appear-toaster")
        toasterDiv.classList.add("disappear-toaster")
      }, 5000)
  }
}




async function deleteComplaint(id) {
  if (!confirm("Are you sure you want to delete this complaint?")) return;

  try {
    const res = await fetch(
      `${API_BASE_URL}/complaints/${id}`,
      {
        method: "DELETE",
      },
    );

    if (res.ok) {
      alert("Complaint Deleted");
      loadComplaints(); // reload list
    } else {
      alert("Delete Failed");
    }
  } catch (error) {
    console.error(error);
    alert("Error Deleting");
  }
}

// load data when page opens
loadComplaints();
