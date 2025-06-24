import React, { useState } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import QRCode from "react-qr-code";
import './App.css';

const BASE_URL = "http://localhost:3000"; // Change if using ngrok

function App() {
  const [requestUrl, setRequestUrl] = useState('');
  const [proofs, setProofs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null); // 'linkedin' or 'twitter'

  const getVerificationReq = async () => {
    setLoading(true);
    setProofs(null);
    setRequestUrl('');
    setActiveProvider('linkedin');
    try {
      const response = await fetch(BASE_URL + '/generate-config');
      const { reclaimProofRequestConfig } = await response.json();
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);
      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          setProofs(proofs);
          setLoading(false);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setLoading(false);
    }
  };

  const getVerificationReq2 = async () => {
    setLoading(true);
    setProofs(null);
    setRequestUrl('');
    setActiveProvider('twitter');
    try {
      const response = await fetch(BASE_URL + '/generate-config/twitter');
      const { reclaimProofRequestConfig } = await response.json();
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);
      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          setProofs(proofs);
          setLoading(false);
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lindin">
        <button onClick={getVerificationReq} disabled={loading}>
          {loading && activeProvider === 'linkedin' ? "Loading..." : "Linkedin"}
        </button>
        {/* Only show QR and proofs if LinkedIn is active */}
        {activeProvider === 'linkedin' && requestUrl && (
          <div style={{ margin: '20px 0' }}>
            <QRCode value={requestUrl} />
            <br />
            <a href={requestUrl} target="_blank" rel="noopener noreferrer">Open Link</a>
          </div>
        )}
        {activeProvider === 'linkedin' && proofs && (
          <div>
            <h2>Verification Successful!</h2>
            <pre>{JSON.stringify(proofs, null, 2)}</pre>
          </div>
        )}
      </div>
      <div className="twitter">
        <button onClick={getVerificationReq2} disabled={loading}>
          {loading && activeProvider === 'twitter' ? "Loading..." : "Twitter"}
        </button>
        {/* Only show QR and proofs if Twitter is active */}
        {activeProvider === 'twitter' && requestUrl && (
          <div style={{ margin: '20px 0' }}>
            <QRCode value={requestUrl} />
            <br />
            <a href={requestUrl} target="_blank" rel="noopener noreferrer">Open Link</a>
          </div>
        )}
        {activeProvider === 'twitter' && proofs && (
          <div>
            <h2>Verification Successful!</h2>
            <pre>{JSON.stringify(proofs, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
