const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child } = require('firebase/database');
const { MongoClient } = require('mongodb');
const fetch = require('node-fetch'); // Add this line to use 'fetch' in Node.js
const app = express();

const port = 3000;
const cors = require('cors');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPnrk6AHSsjpiConILj8gYbMGVrrGPw6U",
  authDomain: "mldl-chatbot.firebaseapp.com",
  databaseURL: "https://mldl-chatbot-default-rtdb.firebaseio.com",
  projectId: "mldl-chatbot",
  storageBucket: "mldl-chatbot.appspot.com",
  messagingSenderId: "988783282097",
  appId: "1:988783282097:web:9be4075e02a5e7fed31f90",
  measurementId: "G-1VQ6B1E6TD"
};
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);


// MongoDB configuration
const mongoUrl = 'mongodb+srv://akshatp24:password1234@chatbot.phhnt9t.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'Chatbot';

async function connectToMongo() {
  try {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Create a new session
app.post('/sessions/:userID', async (req, res) => {
  const { userID } = req.params;
  const { sessionID } = req.body;

  const db = await connectToMongo();
  const sessionCollection = db.collection('sessions');

  try {
    await sessionCollection.insertOne({
      userID,
      sessionID,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Store a new message in the conversation
app.post('/conversations/:sessionID/:messageNum', async (req, res) => {
  const { sessionID, messageNum } = req.params;
  const { message, userID } = req.body;

  const db = await connectToMongo();
  const messageCollection = db.collection('messages');

  try {
    await messageCollection.insertOne({
      sessionID,
      message,
      userID,
    });

    const messages = await messageCollection.find({ sessionID }).toArray();
    res.json(messages.map(msg => msg.message));
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get all messages for a specific session
app.get('/conversations/:sessionID', async (req, res) => {
  const { sessionID } = req.params;

  const db = await connectToMongo();
  const messageCollection = db.collection('messages');

  try {
    const messages = await messageCollection.find({ sessionID }).toArray();
    res.json(messages.map(msg => msg.message));
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
