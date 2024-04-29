import React, { useEffect, useState } from 'react';
import { forensic_evidence_backend } from "declarations/forensic_evidence_backend";
import '../Home.css'
import Hero from './Hero'
// import Footer from './Footer';

const Home = () => {
  return (
    <>
   
      <Hero 
        cName='hero'
        HeroImg='bg.jpg'
      />
      {/* <Footer/> */}
    </>
  )
}

export default Home;
