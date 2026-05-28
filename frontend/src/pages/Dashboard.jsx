import UploadForm from "../components/UploadForm";
import API_BASE from "../api";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [dashboard, setDashboard] =
    useState({});

  const [records, setRecords] =
    useState([]);

  const [selectedFilter,
    setSelectedFilter] =
    useState("all");

  const [searchTerm,
    setSearchTerm] =
    useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    fetchDashboard();
    fetchRecords();
  };

  const fetchDashboard =
    async () => {

    try {

      const response =
        await axios.get(
          `${API_BASE}/api/dashboard/`
        );

      setDashboard(
        response.data
      );

    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecords =
    async () => {

    try {

      const response =
        await axios.get(
          `${API_BASE}/api/records/`
        );

      setRecords(
        response.data
      );

    } catch (error) {
      console.log(error);
    }
  };

  const handleAction =
    async (
      id,
      action
    ) => {

    try {

      await axios.patch(
        `${API_BASE}/api/record/${id}/${action}/`
      );

      refreshData();

    } catch (error) {

      alert(
        error.response?.data
          ?.error ||
        "Action failed"
      );

      console.log(error);
    }
  };

  const filteredRecords =
    records.filter(
      (record) => {

        const matchesFilter =
          selectedFilter ===
            "all" ||
          record.status ===
            selectedFilter;

        const search =
          searchTerm
            .toLowerCase();

        const matchesSearch =
          (
            record.category ||
            ""
          )
            .toLowerCase()
            .includes(search)

          ||

          (
            record.status ||
            ""
          )
            .toLowerCase()
            .includes(search)

          ||

          (
            record.source_file ||
            ""
          )
            .toLowerCase()
            .includes(search)

          ||

          (
            record
              .suspicious_reason ||
            ""
          )
            .toLowerCase()
            .includes(search);

        return (
          matchesFilter &&
          matchesSearch
        );
      }
    );

  const getRowColor =
    (status) => {

    switch (status) {

      case "approved":
        return "#4CAF50";

      case "pending":
        return "#FFD54F";

      case "suspicious":
        return "#F44336";

      case "rejected":
        return "#BDBDBD";

      default:
        return "#ffffff";
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1400px",
        margin: "auto",
      }}
    >
      <h1
        style={{
          textAlign:
            "center",
          marginBottom:
            "40px",
          fontSize:
            "42px",
        }}
      >
        Sustainability Dashboard
      </h1>

      <UploadForm
        refreshData={
          refreshData
        }
      />

      <div
        style={{
          display:
            "flex",
          gap:
            "20px",
          flexWrap:
            "wrap",
          marginBottom:
            "40px",
          justifyContent:
            "center",
        }}
      >
        <Card
          title="Total"
          value={
            dashboard.total_records
          }
        />

        <Card
          title="Pending"
          value={
            dashboard.pending
          }
        />

        <Card
          title="Approved"
          value={
            dashboard.approved
          }
        />

        <Card
          title="Rejected"
          value={
            dashboard.rejected
          }
        />

        <Card
          title="Suspicious"
          value={
            dashboard.suspicious
          }
        />
      </div>

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "20px",
          flexWrap:
            "wrap",
          gap:
            "15px",
        }}
      >
        <h2>
          Records
        </h2>

        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          style={{
            padding:
              "10px 14px",
            borderRadius:
              "10px",
            border:
              "1px solid #ccc",
            width:
              "260px",
            fontSize:
              "15px",
          }}
        />

        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            flexWrap:
              "wrap",
          }}
        >
          {[
            "all",
            "pending",
            "approved",
            "rejected",
            "suspicious"
          ].map(
            (
              filter
            ) => (
              <button
                key={
                  filter
                }
                onClick={() =>
                  setSelectedFilter(
                    filter
                  )
                }
                style={{
                  border:
                    "none",
                  padding:
                    "10px 18px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                  textTransform:
                    "capitalize",
                  background:
                    selectedFilter ===
                    filter
                      ? "#2563eb"
                      : "#374151",
                  color:
                    "white",
                }}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      <div
        style={{
          overflowX:
            "auto",
          borderRadius:
            "12px",
        }}
      >
        <table
          style={{
            width:
              "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "#111827",
              }}
            >
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map(
              (record) => (
                <tr
                  key={record.id}
                  style={{
                    backgroundColor:
                      getRowColor(
                        record.status
                      ),
                    color: "#000",
                    fontWeight:
                      "600",
                  }}
                >
                  <td style={tdStyle}>
                    {record.id}
                  </td>

                  <td style={tdStyle}>
                    {
                      record.category
                    }
                  </td>

                  <td style={tdStyle}>
                    <div>
                      {
                        record.status
                      }
                    </div>

                    {record.suspicious_reason && (
                      <small>
                        ⚠{" "}
                        {
                          record
                            .suspicious_reason
                        }
                      </small>
                    )}

                    {record.is_locked && (
                      <div
                        style={{
                          marginTop:
                            "8px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        🔒 Locked
                      </div>
                    )}
                  </td>

                  <td style={tdStyle}>
                    {record.normalized_quantity ?? "-"}
                  </td>

                  <td style={tdStyle}>
                    {record.normalized_unit ?? "-"}
                  </td>

                  <td style={tdStyle}>
                    {record.normalized_date ?? "-"}
                  </td>

                  <td style={tdStyle}>
                    {
                      record.source_file
                    }
                  </td>

                  <td style={tdStyle}>
                    <button
                      style={{
                        ...buttonStyle,
                        background:
                          "#16a34a",
                        opacity:
                          record.is_locked
                            ? 0.5
                            : 1,
                      }}
                      disabled={
                        record.is_locked
                      }
                      onClick={() =>
                        handleAction(
                          record.id,
                          "approve"
                        )
                      }
                    >
                      ✔ Approve
                    </button>

                    <button
                      style={{
                        ...buttonStyle,
                        background:
                          "#dc2626",
                        opacity:
                          record.is_locked
                            ? 0.5
                            : 1,
                      }}
                      disabled={
                        record.is_locked
                      }
                      onClick={() =>
                        handleAction(
                          record.id,
                          "reject"
                        )
                      }
                    >
                      ✖ Reject
                    </button>
                  </td>
                </tr>
              )
            )}

            {filteredRecords.length ===
              0 && (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "30px",
                    fontWeight:
                      "bold",
                    background:
                      "#1f2937",
                    color:
                      "white",
                  }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "18px",
  color: "white",
  textAlign: "left",
};

const tdStyle = {
  padding: "18px",
};

const buttonStyle = {
  border: "none",
  padding: "10px 16px",
  color: "white",
  borderRadius: "8px",
  marginRight: "10px",
  fontWeight: "bold",
};

function Card({
  title,
  value
}) {
  return (
    <div
      style={{
        background:
          "#111827",
        color:
          "white",
        padding:
          "30px",
        borderRadius:
          "16px",
        width:
          "180px",
        textAlign:
          "center",
        boxShadow:
          "0 5px 20px rgba(0,0,0,0.2)",
      }}
    >
      <h3>
        {title}
      </h3>

      <h1>
        {value ?? 0}
      </h1>
    </div>
  );
}

export default Dashboard;