import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { forensic_evidence_backend } from "declarations/forensic_evidence_backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "declarations/forensic_evidence_backend";
import AdminProfile from './AdminProfile';
import logo from '../../public/logo.png';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../Profile.css'; // Import the CSS file

const NavAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [noofreq, setNoofreq] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [principal, setPrincipal] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  let authClient;
  let actor;

  async function handleAuthenticated(authClient) {
    try {
      setIsConnected(true);
      const identity = await authClient.getIdentity();
      actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
      var resp = await actor.isAccountExists();
      if (resp.statusCode === BigInt(200)) {
        setPrincipal(resp.principal.toString());
        if (resp.msg === "null") {
          setLoggedIn(true);
          setIsConnected(true);
        } else if (resp.msg === "admin") {
          setIsConnected(true);
          setIsAdmin(true);
          setLoggedIn(true);
        } else {
          setIsConnected(true);
          setLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }

  async function handleWalletClick() {
    try {
      var authClient = await AuthClient.create();

      if (await authClient.isAuthenticated()) {
        authClient.logout();
        window.location.href = "/";
      } else {
        authClient.login({
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
          onSuccess: async () => {
            await handleAuthenticated(authClient);
          },
          redirectTo:
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/#authorize"
              : `http://${process.env.CANISTER_ID_internet_identity}.localhost:4943`,
        });
      }
    } catch (error) {
      console.error("Wallet click error:", error);
    }
  }

  async function reconnectWallet() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      await handleAuthenticated(authClient);
    } else {
      actor = forensic_evidence_backend;
    }
  }

  useEffect(() => {
    async function sendRequest() {
      await reconnectWallet();
      setIsLoading(false);
      var resp = await actor.getAdminDetails();
      if (resp.statusCode === BigInt(200)) {
        var doc = resp.doc[0];
        setDob(doc.dob);
        setName(doc.name);
        setGender(Object.keys(doc.gender)[0]);
        setSpecialization(doc.specialization);
        setNoofreq(doc.requests.length);
      }
    }
    sendRequest();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsBlurred(!isBlurred); // Toggle the blur effect when the menu is opened/closed
  };
  const hamburger_class = isMenuOpen ? 'hamburger hamburger--spring is-active' : 'hamburger hamburger--spring';
  
  return (
    (isLoading === false) ? (
      <div className="navbar-container1 profile-body1 mt-3">
        {(!isAdmin) ? (<Navigate to="/" />) : (null)}
        <nav className="navbar1">
          <div className="logo">
            <img className='logo1' src={logo} alt="Forensic Logo" />
            <span className='nav-heading'>Forensic Evidence</span>
          </div>
          <div className="profile">
            <button className={hamburger_class} type="button" onClick={toggleMenu}>
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>
        </nav>
        <AdminProfile
          principal={principal}
          name={name}
          dob={dob}
          gender={gender}
          specialization={specialization}
          noofreq={noofreq}
          isBlurred={isBlurred}
        />
        <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="dropdown-box">
          <Link className="button" to="/record-evidence">Add Evidence </Link>
            <Link className="button" to="/fetch-evidence">Fetch Evidence </Link>
          </div>
          <div className="dropdown-box">
            <hr />
            <button className="button" onClick={handleWalletClick}>{loggedIn ? 'Logout' : 'Login'}</button>
            <div className="social-icons" style={{marginLeft: '10px'}}>
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
        </div>
      </div>
    ) : (<div>Loading...</div>)
  );
};

export default NavAdmin;
