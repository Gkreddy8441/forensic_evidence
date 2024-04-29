import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { forensic_evidence_backend } from "declarations/forensic_evidence_backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "declarations/forensic_evidence_backend";
import '../SignUp.css';
import logo from '../../public/logo.png';
// import Footer from './Footer';

function SignUp() {
  const [isConnected, setIsConnected] = useState(false);
  const [isxAdmin, setIsxAdmin] = useState(false);

  async function handleWalletClick() {
    var authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      authClient.logout();
      window.location.href = "/";
    } else {
      authClient.login({
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        identityProvider: process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://localhost:4943?canisterId=${process.env.CANISTER_ID_internet_identity}`,
        onSuccess: async () => {
          handleAuthenticated(authClient);
        },
      });
    }
  }

  async function reconnectWallet() {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      handleAuthenticated(authClient);
    }
  }

  async function handleAuthenticated(authClient) {
    setIsConnected(true);
    const identity = await authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const resp = await actor.isAccountExists();
    if (resp.statusCode === BigInt(200)) {
      if (resp.msg === "admin") {
        setIsConnected(true);
        setIsxAdmin(true);
      }
    }
  }

  useEffect(() => {
    async function sendRequest() {
      await reconnectWallet();
    }
    sendRequest();
  }, []);

  async function handleSignUp() {
    var name = document.getElementById("name").value;
    var dob = document.getElementById("date").value;
    var gender = document.getElementById("gender").value;
    var mobile = document.getElementById("mobile").value;
    var g = gender === 'male' ? { Male: null } : { Female: null };

    if (!isConnected) {
      alert("Connect Wallet to continue");
    }

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    if ((name === null || name === "") || (dob === null || dob === "") || (gender === null || gender === "") || (mobile === null || mobile === "")) {
      alert("Fill in All Details to Signup.");
      return;
    }

    const resp = await actor.createAdmin(name, dob, g, mobile);
    if (resp.statusCode === BigInt(200)) {
      setIsxAdmin(true);
    } else {
      alert(resp.msg);
    }
  }

  return (
    <>
      <div className="signup-container">
        {
          isxAdmin ? <Navigate to="/nav-admin" /> : null
        }
        <div className="content">
          <div className="left-content">
            <img src={logo} alt="admin" className="image" />
            <p className="label">Admin SignUp</p>
          </div>
        </div>
        <div className="signup-form">
          <h2>Sign up As a ADMIN</h2>
          <form>
            <label>
              Fullname:
              <input id="name" className="type" type="name" placeholder="Enter Your Name" />
            </label>
            <label>
              Date of Birth:
              <input id="date" className="type" type="date" />
            </label>
            <label>
              Gender:
              <select id="gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label>
              Mobile Number:
              <input id="mobile" className="type" type="text" placeholder="Enter Your Mobile Number" />
            </label>
          </form>
          <button type="button" onClick={handleSignUp} className="btn1">Sign Up</button>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default SignUp;
