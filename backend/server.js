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
 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})