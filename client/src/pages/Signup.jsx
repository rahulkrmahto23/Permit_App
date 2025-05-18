import React, { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { signupUser } from '../helpers/user-api';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';  // <-- import toast and Toaster

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { name, email, password } = formData;
      const res = await signupUser(name, email, password);
      toast.success(res.message || "Signup successful!");
      setTimeout(() => {
        navigate('/permit');
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
    }
  };

  const backgroundStyle = {
    minHeight: '90vh',
    backgroundImage: 'url("/background.jpg")',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const formBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  };

  return (
    <div style={backgroundStyle}>
      {/* Place the Toaster once in your app */}
      <Toaster position="top-center" reverseOrder={false} />

      <div style={formBoxStyle}>
        <div style={{ fontSize: '40px', color: '#0d6efd', marginBottom: '10px' }}>
          <FaUser />
        </div>
        <h4 className="mb-4">SIGN UP</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="signupUsername">
            <InputGroup>
              <InputGroup.Text><FaUser /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupEmail">
            <InputGroup>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="signupPassword">
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4" controlId="signupConfirmPassword">
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Sign Up
          </Button>

          <div style={{ fontSize: '0.9rem' }}>
            Already have an account? <a href="/login">Login</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
