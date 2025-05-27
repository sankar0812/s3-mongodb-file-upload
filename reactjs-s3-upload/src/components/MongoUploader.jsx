import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from './api';
import './MongoUploader.css';

function MongoUploader() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/mongo-upload`);
      setFiles(res.data);
    } catch (err) {
      toast.error('Failed to fetch files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/mongo-upload`, formData);
      toast.success("File uploaded successfully");
      setFile(null);
      fetchFiles();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleDownload = (id) => {
    window.open(`${API_BASE_URL}/mongo-upload/${id}`, "_blank");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/mongo-upload/${id}`);
      toast.success("File deleted");
      fetchFiles();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="mongo-uploader">
      <h2>MongoDB File Upload</h2>

      <div className="upload-section">
        <label htmlFor="file-upload" className="custom-file-upload">
          <input id="file-upload" type="file" onChange={handleFileChange} />
          📂 Choose File
        </label>

        {file && <div className="file-preview">{file.name}</div>}

        <button className="upload-button" onClick={handleUpload}>🚀 Upload</button>
      </div>

      <h3>Uploaded Files</h3>
      <ul className="file-list">
        {files.map((f) => (
          <li key={f._id} className="file-item">
            <span className="file-name">📄 {f.filename}</span>
            <div className="file-actions">
              <button onClick={() => handleDownload(f._id)} className="action-button download">Download</button>
              <button onClick={() => handleDelete(f._id)} className="action-button delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MongoUploader;
