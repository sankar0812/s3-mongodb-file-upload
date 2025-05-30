import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://s3-mongodb-file-upload.onrender.com/file";

const S3Uploader = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [bucketName, setBucketName] = useState("s3-devops");
  const [folderPath, setFolderPath] = useState("uploads");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !bucketName || !folderPath) {
      toast.error("Please provide all inputs!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucketFolderName", bucketName);
    formData.append("folderPath", folderPath);

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully!");
      setFile(null);
      fetchFiles();
    } catch (error) {
      toast.error(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    if (!bucketName || !folderPath) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/list-objects/${bucketName}/`, {
        headers: { prefix: folderPath },
      });
      setFiles(res.data || []);
    } catch (error) {
      toast.error(`Failed to load files: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url) => {
    if (!url) {
      toast.error("Missing file URL.");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/delete-asset`, {
        params: { url },
      });
      toast.success("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      toast.error(`Deletion failed: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [bucketName, folderPath]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>AWS S3 File Uploader</h2>

      <div style={styles.inputGroup}>
        <label htmlFor="bucket-name">Bucket Name:</label>
        <input
          id="bucket-name"
          type="text"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="folder-path">Folder Path:</label>
        <input
          id="folder-path"
          type="text"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="file-upload" style={styles.uploadLabel}>
        📂 Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <span>{file ? file.name : "No file chosen"}</span>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={loading ? { ...styles.uploadBtn, opacity: 0.6 } : styles.uploadBtn}
      >
        {loading ? "Uploading..." : "Upload to S3"}
      </button>

      <h3 style={{ marginTop: "30px" }}>Uploaded Files</h3>
      <ul>
        {files.length === 0 && <li>No files found.</li>}
        {files.map((file) => (
          <li key={file.key} style={{ marginBottom: "10px" }}>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: "10px" }}
            >
              {file.key}
            </a>
            <button
              onClick={() => handleDelete(file.url)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#222",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  uploadLabel: {
    backgroundColor: "#4F46E5",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "inline-block",
    marginRight: "10px",
  },
  uploadBtn: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "10px 25px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default S3Uploader;
