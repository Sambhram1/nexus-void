const express = require('express')
const { ReclaimProofRequest, verifyProof } = require('@reclaimprotocol/js-sdk')
const cors = require('cors')

const app = express()
const port = 3000

// Allow only your frontend origin (change the port if needed)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.text({ type: '*/*', limit: '50mb' })) // This is to parse the urlencoded proof object that is returned to the callback url

const BASE_URL = "http://localhost:3000"; // if using ngrok, provide the ngrok base url
 
// Route to generate SDK configuration
app.get('/generate-config', async (req, res) => {
  const APP_ID = '0xA6086ff3ed8648399BEEa77D5365422849375f75' 
  const APP_SECRET = '0xca12ccf9f39ca08f18c50266a0ed1225d9dc496511da3ea937c518dada243ffd'
  const PROVIDER_ID = 'a9f1063c-06b7-476a-8410-9ff6e427e637'
 
  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
    
    // we will be defining this endpoint in the next step
    reclaimProofRequest.setAppCallbackUrl(BASE_URL+'/receive-proofs')
    
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
 
    return res.json({ reclaimProofRequestConfig })
  } catch (error) {
    console.error('Error generating request config:', error)
    return res.status(500).json({ error: 'Failed to generate request config' })
  }
})
app.get('/generate-config/twitter', async (req, res) => {
  const APP_ID = '0xA6086ff3ed8648399BEEa77D5365422849375f75' 
  const APP_SECRET = '0xca12ccf9f39ca08f18c50266a0ed1225d9dc496511da3ea937c518dada243ffd'
  const PROVIDER_ID = '0b978e97-688f-4e9d-b27f-95a012cb46cc'

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
    reclaimProofRequest.setAppCallbackUrl(BASE_URL + '/receive-proofs')
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
    return res.json({ reclaimProofRequestConfig })
  } catch (error) {
    console.error('Error generating request config (twitter):', error)
    return res.status(500).json({ error: 'Failed to generate request config for twitter' })
  }
})
 
// --- Add your provider IDs here ---
const KAGGLE_PROVIDER_ID = 'your-kaggle-provider-id';
const LEETCODE_PROVIDER_ID = 'your-leetcode-provider-id';
const STACKOVERFLOW_PROVIDER_ID = 'your-stackoverflow-provider-id';

// --- Kaggle ---
app.get('/generate-config/kaggle', async (req, res) => {
  const APP_ID = '0xA6086ff3ed8648399BEEa77D5365422849375f75';
  const APP_SECRET = '0xca12ccf9f39ca08f18c50266a0ed1225d9dc496511da3ea937c518dada243ffd';
  const PROVIDER_ID = KAGGLE_PROVIDER_ID;

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
    reclaimProofRequest.setAppCallbackUrl(BASE_URL + '/receive-proofs');
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();
    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error('Error generating request config (kaggle):', error);
    return res.status(500).json({ error: 'Failed to generate request config for kaggle' });
  }
});

// --- LeetCode ---
app.get('/generate-config/leetcode', async (req, res) => {
  const APP_ID = '0xA6086ff3ed8648399BEEa77D5365422849375f75';
  const APP_SECRET = '0xca12ccf9f39ca08f18c50266a0ed1225d9dc496511da3ea937c518dada243ffd';
  const PROVIDER_ID = LEETCODE_PROVIDER_ID;

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
    reclaimProofRequest.setAppCallbackUrl(BASE_URL + '/receive-proofs');
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();
    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error('Error generating request config (leetcode):', error);
    return res.status(500).json({ error: 'Failed to generate request config for leetcode' });
  }
});

// --- StackOverflow ---
app.get('/generate-config/stackoverflow', async (req, res) => {
  const APP_ID = '0xA6086ff3ed8648399BEEa77D5365422849375f75';
  const APP_SECRET = '0xca12ccf9f39ca08f18c50266a0ed1225d9dc496511da3ea937c518dada243ffd';
  const PROVIDER_ID = STACKOVERFLOW_PROVIDER_ID;

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
    reclaimProofRequest.setAppCallbackUrl(BASE_URL + '/receive-proofs');
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();
    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error('Error generating request config (stackoverflow):', error);
    return res.status(500).json({ error: 'Failed to generate request config for stackoverflow' });
  }
});

// Route to receive proofs
app.post('/receive-proofs', async (req, res) => {
  // decode the urlencoded proof object; see below if not using express middlewares for decoding
  const decodedBody = decodeURIComponent(req.body);
  const proof = JSON.parse(decodedBody);
 
  // Verify the proof using the SDK verifyProof function
  const result = await verifyProof(proof)
  if (!result) {
    return res.status(400).json({ error: 'Invalid proofs data' });
  }
 
  console.log('Received proofs:', proof)
  // Process the proofs here
  return res.sendStatus(200)
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})