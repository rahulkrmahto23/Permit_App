import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { createPermit, updatePermit } from "../helpers/user-api";

const AddPermitForm = ({ defaultValues, onClose = () => {}, onPermitUpdated }) => {
  const [formData, setFormData] = useState({
    permitNumber: "",
    poNumber: "",
    employeeName: "",
    permitType: "",
    permitStatus: "Pending",
    location: "",
    remarks: "",
    issueDate: new Date(),
    expiryDate: new Date(),
  });

  useEffect(() => {
    if (defaultValues) {
      setFormData({
        permitNumber: defaultValues.permitNumber || "",
        poNumber: defaultValues.poNumber || "",
        employeeName: defaultValues.employeeName || "",
        permitType: defaultValues.permitType || "",
        permitStatus: defaultValues.permitStatus || "Pending",
        location: defaultValues.location || "",
        remarks: defaultValues.remarks || "",
        issueDate: new Date(defaultValues.issueDate || new Date()),
        expiryDate: new Date(defaultValues.expiryDate || new Date()),
      });
    }
  }, [defaultValues]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (defaultValues) {
        // Update existing permit
        const { _id, ...updateData } = formData;
        const response = await updatePermit(defaultValues._id, updateData);
        toast.success("Permit updated successfully!");
        if (onPermitUpdated) onPermitUpdated();
      } else {
        // Create new permit
        const response = await createPermit(formData);
        toast.success("Permit created successfully!");
      }
      onClose();
      setTimeout(() => {
        window.location.reload(); // Refresh the page after a short delay
      }, 1000);
    } catch (error) {
      console.error("Error submitting permit:", error);
      toast.error(error.message || "Failed to submit permit. Please try again.");
    }
  };

  return (
    <Container className="py-3">
      <Card className="shadow p-4 border-0 rounded-4">
        <h4 className="mb-4 fw-bold text-primary">
          {defaultValues ? "✏️ Edit Permit" : "➕ Add New Work Permit"}
        </h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Permit Number</Form.Label>
                <Form.Control
                  type="text"
                  name="permitNumber"
                  value={formData.permitNumber}
                  onChange={handleChange}
                  placeholder="Enter Permit Number"
                  required
                  disabled={!!defaultValues}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>PO Number</Form.Label>
                <Form.Control
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  placeholder="Enter PO Number"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter Employee Name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Permit Type</Form.Label>
                <Form.Select
                  name="permitType"
                  value={formData.permitType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="General">General Work Permit</option>
                  <option value="Height">Height Work Permit</option>
                  <option value="Confined">Confined Space Work Permit</option>
                  <option value="Excavation">Excavation Work Permit</option>
                  <option value="Civil">Civil Work Permit</option>
                  <option value="Hot">Hot Work Permit</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Permit Status</Form.Label>
                <Form.Select
                  name="permitStatus"
                  value={formData.permitStatus}
                  onChange={handleChange}
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Location / Work Site</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter Work Site Location"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Issue Date</Form.Label>
                <DatePicker
                  selected={formData.issueDate}
                  onChange={(date) => handleDateChange(date, "issueDate")}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Expiry Date</Form.Label>
                <DatePicker
                  selected={formData.expiryDate}
                  onChange={(date) => handleDateChange(date, "expiryDate")}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any additional notes or remarks..."
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" variant="primary" className="px-4 rounded-3">
              {defaultValues ? "Update Permit" : "Submit Permit"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddPermitForm;
