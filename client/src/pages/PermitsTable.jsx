import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Card,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PermitForm from "./AddPermitForm";
import { getAllPermits, deletePermit } from "../helpers/user-api";
import toast, { Toaster } from "react-hot-toast";

const getStatusBadge = (status) => (
  <Badge bg={status === "Active" ? "success" : "danger"}>{status}</Badge>
);

const PermitsTable = () => {
  const [permits, setPermits] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOption, setSortOption] = useState("serial");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const navigate = useNavigate();

  const fetchPermits = async () => {
    try {
      setLoading(true);
      const response = await getAllPermits();
      setPermits(response.permits);
      setSortedData(response.permits);
    } catch (err) {
      setError(err.message || "Failed to fetch permits");
      toast.error(err.message || "Failed to fetch permits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const handleSearchClick = () => navigate("/search");
  const handleAddPermitClick = () => navigate("/add-permit");

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    if (option === "active") {
      setSortedData([
        ...permits.filter((p) => p.permitStatus === "Active"),
        ...permits.filter((p) => p.permitStatus !== "Active"),
      ]);
    } else if (option === "expired") {
      setSortedData([
        ...permits.filter((p) => p.permitStatus === "Expired"),
        ...permits.filter((p) => p.permitStatus !== "Expired"),
      ]);
    } else {
      setSortedData([...permits]);
    }
  };

  const handleEditClick = (permit) => {
    setSelectedPermit({
      ...permit,
      _id: permit._id, // Ensure _id is properly passed
      issueDate: new Date(permit.issueDate),
      expiryDate: new Date(permit.expiryDate),
    });
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedPermit(null);
  };

  const handlePermitUpdated = async () => {
    await fetchPermits();
    handleModalClose();
    toast.success("Permit updated successfully!");
  };

  const handleDeleteClick = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this permit?"
    );
    if (!confirm) return;

    try {
      setDeleting(id);
      await deletePermit(id);
      await fetchPermits();
      toast.success("Permit deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete permit");
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="text-center my-5">
        {error}
      </Alert>
    );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="shadow-sm p-4 bg-light border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-dark" onClick={handleSearchClick}>
            🔍 Search
          </Button>
          <div className="d-flex align-items-center">
            <Form.Select
              value={sortOption}
              onChange={handleSortChange}
              className="me-2"
              style={{ minWidth: "180px" }}
            >
              <option value="serial">Sort: As Given (Serial)</option>
              <option value="active">Sort: Active First</option>
              <option value="expired">Sort: Expired First</option>
            </Form.Select>
            <Button variant="primary" onClick={handleAddPermitClick}>
              + Add New Permit
            </Button>
          </div>
        </div>

        <Table
          responsive
          bordered
          hover
          className="bg-white text-center align-middle"
        >
          <thead className="table-light">
            <tr>
              <th>Status</th>
              <th>Permit No.</th>
              <th>Type</th>
              <th>Issue Date</th>
              <th>Expiration Date</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((permit, idx) => (
              <tr key={permit._id || idx}>
                <td>{getStatusBadge(permit.permitStatus)}</td>
                <td>
                  <div className="fw-semibold">{permit.poNumber}</div>
                  <div className="text-muted small">{permit.location}</div>
                </td>
                <td>{permit.permitType}</td>
                <td>{new Date(permit.issueDate).toLocaleString()}</td>
                <td>{new Date(permit.expiryDate).toLocaleString()}</td>
                <td>{permit.employeeName}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(permit)}
                  >
                    <FiEdit2 />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(permit._id)}
                    disabled={deleting === permit._id}
                  >
                    {deleting === permit._id ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FiTrash2 />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showEditModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Permit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PermitForm
            defaultValues={selectedPermit}
            onClose={handleModalClose}
            onPermitUpdated={handlePermitUpdated}
            isEdit={true}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PermitsTable;
