import React, { useState, useEffect } from 'react';
import { forensic_evidence_backend } from "declarations/forensic_evidence_backend";
import '../FetchEvidence.css';
import logo from '../../public/Fetch.jpg';

const FetchEvidence = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const fetchedReord = await forensic_evidence_backend.getRecordDetails();
        setRecords(fetchedReord);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Record details:", error);
        setLoading(false);
      }
    };

    fetchRecord();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <button className='back'><a href="/nav-admin" >Back</a></button>
      <div className='fetch-evidence-container'>
        <img className='logo' src={logo} alt="Complaint" />
        <h2>Evidence Details</h2>
        <table>
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Admin Name</th>
              <th>Crime Type</th>
              <th>Crime Description</th>
              <th>Evidence Details</th>
              <th>Crime Area</th>
              <th>Eye Witness</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.recordId}</td>
                <td>{record.adminName}</td>
                <td>{record.crimeType}</td>
                <td>{record.crimeDescription}</td>
                <td>{record.evidenceDetails}</td>
                <td>{record.crimeArea}</td>
                <td>{record.eyeWitness}</td>
                <td>{record.date}</td>
                <td>{record.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FetchEvidence;