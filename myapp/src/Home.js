import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './Home.css';
import crudImage from './crud.png'; // Make sure crud.png is in your src or public folder

const Home = () => {
  const [numPages, setNumPages] = useState(null);

  const onFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setNumPages(pdfDoc.getPageCount());
    };
    fileReader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="home-container">
      <div className="crud-image-container">
        <img src={crudImage} alt="CRUD Operations" className="crud-image" />
      </div>

      <div className="about-us">
        <h2>About Us</h2>
        <p>
          Our CRUD application leverages PostgreSQL to securely manage user data,
          providing a responsive and user-friendly experience. We focus on clean design,
          fast performance, and robust functionality allowing users to register, login, and manage their profiles effortlessly.
        </p>
      </div>

      <div className="pdf-container">
        <h2>PDF Reader (No login required)</h2>
        <input type="file" accept="application/pdf" onChange={onFileChange} />
        {numPages && <p>Number of pages: {numPages}</p>}
      </div>

      <div className="extra-content">
        <h2>Platform Highlights</h2>
        <ul>
          <li>Secure authentication and authorization system</li>
          <li>Responsive design compatible with all devices</li>
          <li>Integrated PDF reader for user convenience</li>
          <li>Extensive user profile and dashboard management</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
