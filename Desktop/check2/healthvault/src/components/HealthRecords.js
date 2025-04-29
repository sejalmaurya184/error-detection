import React, { useState, useEffect } from "react";

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ name: "", date: "", type: "", content: null });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set user details
    }
    const dummyRecords = [
      {
        id: 1,
        name: "Blood Test Report.pdf",
        type: "application/pdf",
        file: new File(["%PDF-1.4 Dummy PDF content"], "BloodTestReport.pdf", {
          type: "application/pdf",
        }),
        date: "2025-04-06",
        previewType: "file",
      },
      {
        id: 2,
        name: "Xray Result.png",
        type: "image/png",
        file: new File([""], "XrayResult.png", { type: "image/png" }),
        date: "2025-04-05",
        previewType: "file",
      },
      {
        id: 3,
        name: "Doctor Notes (Text)",
        type: "text/plain",
        content: "Patient recovering well. Continue medication for 5 days.",
        date: "2025-04-04",
        previewType: "text",
      },
    ];

    const sorted = dummyRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecords(sorted);
  }, []);

  const handleDelete = (id) => {
    setRecords(records.filter((rec) => rec.id !== id));
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setFormData({
      name: record.name,
      date: record.date,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updated = records.map((rec) =>
      rec.id === editingRecord.id ? { ...rec, ...formData } : rec
    );
    const sorted = updated.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecords(sorted);
    setShowEditModal(false);
    setEditingRecord(null);
  };

  const handleAddNewRecord = () => {
    if (!formData.name || !formData.date || !formData.type) {
      alert("Please fill all required fields");
      return;
    }

    // Prevent future dates
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    if (selectedDate > today+1) {
      alert("Cannot select a future date for health records.");
      return;
    }


    const newRecord = {
      id: Date.now(),
      name: formData.name,
      date: formData.date,
      type: formData.type,
      previewType: formData.type === "text/plain" ? "text" : "file",
    };

    if (formData.type === "text/plain") {
      newRecord.content = formData.content;
    } else {
      newRecord.file = formData.content;
    }

    const updated = [newRecord, ...records].sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecords(updated);
    setFormData({ name: "", date: "", type: "", content: null });
    setShowNewModal(false);
  };

  const renderPreview = (record) => {
    if (record.previewType === "text") {
      return (
        <div className="mt-3 p-3 bg-light border rounded shadow-sm" style={{
          whiteSpace: "pre-wrap",
          fontSize: "0.95rem",
          fontFamily: "'Segoe UI', sans-serif",
          lineHeight: "1.6",
          maxHeight: "150px",
          overflowY: "auto"
        }}>
          {record.content}
        </div>
      );
    } else if (record.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(record.file)}
          alt="record"
          className="img-fluid rounded mt-2"
          style={{ maxHeight: "150px" }}
        />
      );
    } else if (record.type === "application/pdf") {
      return (
        <a
          href={URL.createObjectURL(record.file)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-danger btn-sm mt-2"
        >
          📄 View PDF
        </a>
      );
    } else {
      return <span>Unsupported file type</span>;
    }
  };
  

  return (
    <div className="container py-5">
  <div className="bg-white border-start border-4 border-primary rounded shadow-sm px-4 py-3 mb-4">
    <h2 className="fw-bold mb-0 text-primary">
      <i className="bi bi-journal-medical me-2" />Health Records
    </h2>
    <p className="text-muted">Hello, {user ? user.name : "Loading..."} 👋 Here’s your health data overview</p>
  </div>

  <div className="d-flex justify-content-end mb-3">
    <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
      ➕ Add New Record
    </button>
  </div>

      <div className="row">
        {records.map((record) => (
          <div key={record.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow rounded-4 h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title fw-semibold text-truncate" title={record.name}>
                  {record.name}
                </h5>
                <span className="badge bg-secondary">{record.date}</span>
              </div>
        
              <div className="flex-grow-1">{renderPreview(record)}</div>
        
              <div className="mt-3 d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditClick(record)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(record.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Record</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Document name"
                  className="form-control mb-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Record Modal */}
      {showNewModal && (
        <div className="modal show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add New Record</h5>
                <button className="btn-close" onClick={() => setShowNewModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Document name"
                  className="form-control mb-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <select
                  className="form-select mb-2"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, content: null })}
                >
                  <option value="">Select file type</option>
                  <option value="application/pdf">PDF</option>
                  <option value="image/png">Image (PNG)</option>
                  <option value="image/jpeg">Image (JPEG)</option>
                  <option value="text/plain">Text Note</option>
                </select>

                {formData.type === "text/plain" ? (
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter text note..."
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                ) : (
                  <input
                    type="file"
                    className="form-control"
                    accept={formData.type}
                    onChange={(e) => setFormData({ ...formData, content: e.target.files[0] })}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleAddNewRecord}>
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
