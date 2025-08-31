import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    otp: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Generate OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({ ...prev, otp }));
    setOtpGenerated(true);
    alert(`Your OTP is: ${otp}`);
  };

  // Validate form fields
  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First Name is required';
    if (!formData.lastName) errors.lastName = 'Last Name is required';

    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm Password is required';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    if (!formData.phoneNumber) errors.phoneNumber = 'Phone Number is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.otp && otpGenerated) errors.otp = 'Please generate OTP';

    return errors;
  };


  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const contentType = response.headers.get('content-type');
        const responseData = contentType && contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        if (response.ok) {
          setMessage(responseData.message || 'Registration successful.');
          setIsSubmitted(true);
          setFormErrors({});
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            address: '',
            otp: '',
          });
          navigate('/login');
        } else {
          setMessage(responseData || 'Registration failed.');
        }
      } catch {
        setMessage('Network error. Please try again later.');
      }
    } else {
      setFormErrors(errors);
      setIsSubmitted(false);
    }
  };

  // Close success modal
  const closeModal = () => setIsSubmitted(false);

  return (
    <div className="container">
      <div className="registration-form">
        <h1>Registration</h1>
        <form onSubmit={handleSubmit} noValidate>
          {['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'address', 'otp'].map(field => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
              {field === 'otp' ? (
                <div className="otp-container">
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData.otp}
                    readOnly
                    className="inputField"
                  />
                  <button type="button" onClick={generateOtp}>
                    Generate OTP
                  </button>
                </div>
              ) : field === 'address' ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              ) : field === 'password' || field === 'confirmPassword' ? (
                <input
                  type="password"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              )}
              {formErrors[field] && (
                <div className="error-message">{formErrors[field]}</div>
              )}
            </div>
          ))}

          <button type="submit">Register</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
        I already have an account{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </p>
        {isSubmitted && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <p>{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
