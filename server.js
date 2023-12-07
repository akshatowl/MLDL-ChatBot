const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child, push} = require('firebase/database');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

// Create a new session
app.get('/sessions/:userID', async (req, res) => {
  var userID = req.params.userID;
  console.log(userID);
  var sessions = [];
  const dataRef2 = ref(database);
  get(child(dataRef2, "UserToMessages/" + userID)).then((snapshot) =>{
    if(snapshot.exists()) {
        console.log(snapshot.val());
        for (let i = 0 ; i < snapshot.val().length ; i++) {
            sessions.push(snapshot.val()[i]);
        }
    }
    res.json({data: sessions})
  })
  .catch((error) => {
      alert("Unsuccessful " + error);
      console.log(req.params)
  });
});

app.post('/sessions/:userID/:sessionNum', async (req, res) => {
  var userID = req.params.userID;
  var sessionNum = req.params.sessionNum;
  const { sessionID } = req.body;
  console.log(sessionNum);
  console.log(sessionID);

  const sessionRef = ref(database, "UserToMessages/" + userID + "/" + sessionNum);
  set(sessionRef, sessionID)
  .then(() => {
      console.log("Data stored!");
      res.json({ success: true });
  })
  .catch((error) => {
      console.error("Error storing data:", error);
  });
});

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

app.post('/llm', async (req, res) => {
  const { lastMessageContext } = req.body;

  try {
    console.log(lastMessageContext);
    await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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',
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": lastMessageContext,
                    "max_tokens": 100
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error! Status: ${response.status}");
                }
                return response.json();
            })
            .then(data => {
                res.json(data.choices[0].message.content);
            })
            .catch(error => {
                console.error('Error:', error);
            });

  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ error: error.message });
  }
});
// add user

const generateUserId = async () => {
  const userRef = ref(database, 'UserInfo/');
   
    const userSnapshot = await get(userRef);
    const users = userSnapshot.val();

    const newUserId = users ? (Object.keys(users).length + 1).toString() : "1";
    return newUserId;
};

app.post('/users', async (req, res) => {
  try {
    const { FirstName, LastName, Username, Password } = req.body;

    // Validate input (you may want to add more validation)
    if (!FirstName || !LastName || !Username || !Password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const userRef = ref(database)
    // Generate a unique natural number for the userId
    const newUserId = await generateUserId();

    // Reference to UserInfo table with the new natural number userId
    const newUserRef = ref(database, `UserInfo/${newUserId}`);

    // Set the user data with the dynamic key
    await set(newUserRef, {
      FirstName,
      LastName,
      Username,
      Password,
    });

    res.status(201).json({ message: 'User created successfully', userId: newUserId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

async function getUserByUsername(username) {
  try {
    const userRef = ref(database, 'UserInfo');
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const user = Object.values(users).find(u => u.Username === username);

      if (user) {
        // User with the entered username exists
        console.log("User found:", user);
      } else {
        console.log("User not found");
      }

      return user;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Endpoint to get user by username
app.get('/users/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});