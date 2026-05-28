import API_BASE from "../api";
import { useState } from "react";
import axios from "axios";

function UploadForm({ refreshData }) {
  const [file, setFile] =
    useState(null);

  const [sourceType,
    setSourceType] =
    useState("sap");

  const [loading,
    setLoading] =
    useState(false);

  const handleUpload =
    async () => {

    if (!file) {
      alert(
        "Please choose a file"
      );
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "source_type",
      sourceType
    );

    try {

      setLoading(true);

      const response =
        await axios.post(
          `${API_BASE}/api/upload/`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        response.data
      );

      alert(
        "CSV uploaded successfully"
      );

      setFile(null);

      refreshData();

    } catch (error) {

      console.log(
        "Upload error:",
        error.response?.data ||
        error.message
      );

      alert(
        JSON.stringify(
          error.response?.data ||
          error.message,
          null,
          2
        )
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border:
          "1px solid #ddd",
        padding:
          "20px",
        marginBottom:
          "30px",
      }}
    >
      <h2>
        Upload CSV
      </h2>

      <select
        value={
          sourceType
        }
        onChange={(e) =>
          setSourceType(
            e.target.value
          )
        }
      >
        <option value="sap">
          SAP
        </option>

        <option value="electricity">
          Electricity
        </option>

        <option value="travel">
          Travel
        </option>
      </select>

      <br />
      <br />

      <input
        type="file"
        accept=".csv"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <br />
      <br />

      <button
        onClick={
          handleUpload
        }
        disabled={
          loading
        }
      >
        {loading
          ? "Uploading..."
          : "Upload"}
      </button>
    </div>
  );
}

export default UploadForm;