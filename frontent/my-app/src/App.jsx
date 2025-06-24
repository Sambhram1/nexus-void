import React, { useState, useEffect } from 'react';

import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import QRCode from "react-qr-code";
import './App.css';


 
const BASE_URL = "http://localhost:3000"; // if using ngrok, use the ngrok base url here
 
function StartReclaimVerification() {
  const [proofs, setProofs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleVerification = async () => {
    try {
      setIsLoading(true);
 
      // Step 1: Fetch the configuration from your backend
      const response = await fetch(BASE_URL + '/generate-config');
      const { reclaimProofRequestConfig } = await response.json();
      console.log(response)
 
      // Step 2: Initialize the ReclaimProofRequest with the received configuration
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);
 
      // Step 3: Trigger the verification flow automatically
      // This method detects the user's platform and provides the optimal experience:
      // - Browser extension for desktop users (if installed)
      // - QR code modal for desktop users (fallback)
      // - Native app clips for mobile users
      await reclaimProofRequest.triggerReclaimFlow();
 
      // Step 4: Start listening for proof submissions
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          console.log('Successfully created proof', proofs);
          setProofs(proofs);
          setIsLoading(false);
          // Handle successful verification - proofs are also sent to your backend callback
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setIsLoading(false);
          // Handle verification failure
        },
      });
 
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setIsLoading(false);
      // Handle initialization error (e.g., show error message)
    }
  };
  const handleVerification2 = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(BASE_URL + '/generate-config/twitter');
      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error:', data.error);
        setIsLoading(false);
        return;
      }

      const { reclaimProofRequestConfig } = data;
      if (!reclaimProofRequestConfig) {
        console.error('No config returned from backend');
        setIsLoading(false);
        return;
      }

      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);
      await reclaimProofRequest.triggerReclaimFlow();
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          setProofs(proofs);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <button onClick={handleVerification} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Linkdin'}
      </button>
      <button onClick={handleVerification2} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Twitter'}
      </button>
      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
 


 


function App() {
  return (
    <>
      <StartReclaimVerification></StartReclaimVerification>
    </>
  );
}

export default App;
