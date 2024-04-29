import React, { useState, useEffect } from 'react';
import { forensic_evidence_backend } from "declarations/forensic_evidence_backend";
import '../Record.css';
import logo from '../../public/Add_Record.jpg';

const RecordEvidence = () => {
  const [records, setRecords] = useState([]);
  const [recordId, setRecordId] = useState('');
  const [adminName, setAdminName] = useState('');
  const [crimeType, setCrimeType] = useState('');
  const [crimeDescription, setCrimeDescription] = useState('');
  const [evidenceDetails, setEvidenceDetails] = useState('');
  const [crimeArea, setCrimeArea] = useState('');
  const [eyeWitness, setEyeWitness] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // State variables for input validation
  const [adminNameError, setAdminNameError] = useState('');
  const [crimeTypeError, setCrimeTypeError] = useState('');
  const [crimeDescriptionError, setCrimeDescriptionError] = useState('');
  const [evidenceDetailsError, setEvidenceDetailsError] = useState('');
  const [crimeAreaError, setCrimeAreaError] = useState('');
  const [eyeWitnessError, setEyeWitnessError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

  const generateRandomId = () => {
    let newId;
    do {
      newId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (records.some(record => record.id === newId));

    return newId;
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const fetchedRecord = await forensic_evidence_backend.getRecordDetails();
        setRecords(fetchedRecord);
      } catch (error) {
        console.error("Error fetching Record:", error);
      }
    };

    fetchRecord();
    setRecordId(generateRandomId());
  }, []);

  const handleAddComplaint = async () => {
    try {
      // Validate all fields
      if (!adminName) {
        setAdminNameError('Admin Name is required');
        return;
      }
      if (!crimeType) {
        setCrimeTypeError('Crime Type is required');
        return;
      }
      if (!crimeDescription) {
        setCrimeDescriptionError('Crime Description is required');
        return;
      }
      if (!evidenceDetails) {
        setEvidenceDetailsError('Evidence Details are required');
        return;
      }
      if (!crimeArea) {
        setCrimeAreaError('Crime Area is required');
        return;
      }
      if (!eyeWitness) {
        setEyeWitnessError('Eye Witness details are required');
        return;
      }
      if (!date) {
        setDateError('Date is required');
        return;
      }
      if (!time) {
        setTimeError('Time is required');
        return;
      }

      // If all fields are filled, proceed to submit complaint
      const timestamp = new Date().toISOString();
      await forensic_evidence_backend.submitRecord({
        recordId,
        adminName,
        crimeType,
        crimeDescription,
        evidenceDetails,
        crimeArea,
        eyeWitness,
        date,
        time,
        timestamp,
      });

      // Update Record list after submission
      const updatedRecords = await forensic_evidence_backend.getRecordDetails();
      setRecords(updatedRecords);

      // Clear form fields after submission
      setRecordId(generateRandomId());
      setAdminName('');
      setCrimeType('');
      setCrimeDescription('');
      setEvidenceDetails('');
      setCrimeArea('');
      setEyeWitness('');
      setDate('');
      setTime('');

      // Display success message
      alert("Complaint submitted successfully!");
      console.log("Complaint submitted successfully!");
    } catch (error) {
      console.error("Error adding complaint:", error);
    }
  };

  return (
    <>
    <button className='back'><a href="/nav-admin" >Back</a></button>
    <div className='complaint-container'>
      <img className='logo' src={logo} alt="Complaint" />
      <div className='complaint-form'>
        <h2>File a Complaint</h2>
        <div className="input-container">
          <label htmlFor="recordId">Record ID:</label>
          <input
            type="text"
            id="recordId"
            value={recordId}
            readOnly
          />
        </div>
        <div className="input-container">
          <label htmlFor="adminName">Admin Name:</label>
          <input
            type="text"
            id="adminName"
            value={adminName}
            onChange={(e) => {
              setAdminName(e.target.value);
              setAdminNameError('');
            }}
            required
            placeholder='Enter Admin Name '/>
          <span className="error">{adminNameError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="crimeType">Crime Type:</label>
          <input
            type="text"
            id="crimeType"
            value={crimeType}
            onChange={(e) => {
              setCrimeType(e.target.value);
              setCrimeTypeError('');
            }}
            required
            placeholder='Enter Crime Type '
          />
          <span className="error">{crimeTypeError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="crimeDescription">Crime Description:</label>
          <textarea
            id="crimeDescription"
            value={crimeDescription}
            onChange={(e) => {
              setCrimeDescription(e.target.value);
              setCrimeDescriptionError('');
            }}
            required
            placeholder='Enter Crime Description'
          />
          <span className="error">{crimeDescriptionError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="evidenceDetails">Evidence Details:</label>
          <textarea
            id="evidenceDetails"
            value={evidenceDetails}
            onChange={(e) => {
              setEvidenceDetails(e.target.value);
              setEvidenceDetailsError('');
            }}
            required
            placeholder='Enter Evidence Details'
          />
          <span className="error">{evidenceDetailsError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="crimeArea">Crime Area:</label>
          <input
            type="text"
            id="crimeArea"
            value={crimeArea}
            onChange={(e) => {
              setCrimeArea(e.target.value);
              setCrimeAreaError('');
            }}
            required
            placeholder='Enter Crime Area'
          />
          <span className="error">{crimeAreaError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="eyeWitness">Eye Witness:</label>
          <input
            type="text"
            id="eyeWitness"
            value={eyeWitness}
            onChange={(e) => {
              setEyeWitness(e.target.value);
              setEyeWitnessError('');
            }}
            required
            placeholder='Enter Eye Witness details'
          />
          <span className="error">{eyeWitnessError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDateError('');
            }}
            required
          />
          <span className="error">{dateError}</span>
        </div>
        <div className="input-container">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setTimeError('');
            }}
            required
          />
          <span className="error">{timeError}</span>
        </div>
        <button onClick={handleAddComplaint}>Submit Complaint</button>
      </div>
    </div>
    </>
  );
};

export default RecordEvidence;

