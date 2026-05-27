import UploadForm from "../components/UploadForm";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchRecords();
  }, []);

  const refreshData = () => {
    fetchDashboard();
    fetchRecords();
  };

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/dashboard/"
      );

      setDashboard(response.data);
    } catch (error) {
      console.log("Dashboard error:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/records/"
      );

      setRecords(response.data);
    } catch (error) {
      console.log("Records error:", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Sustainability Dashboard</h1>

      <UploadForm refreshData={refreshData} />

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <Card title="Total" value={dashboard.total_records} />
        <Card title="Pending" value={dashboard.pending} />
        <Card title="Approved" value={dashboard.approved} />
        <Card title="Rejected" value={dashboard.rejected} />
        <Card title="Suspicious" value={dashboard.suspicious} />
      </div>

      <h2>Records</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Status</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Date</th>
            <th>Source</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.category}</td>
              <td>{record.status}</td>
              <td>{record.normalized_quantity}</td>
              <td>{record.normalized_unit}</td>
              <td>{record.normalized_date}</td>
              <td>{record.source_file}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        width: "180px",
      }}
    >
      <h3>{title}</h3>
      <h2>{value ?? 0}</h2>
    </div>
  );
}

export default Dashboard;