# MLDL-ChatBot
Chatbot with embeddings
## Dependencies

- Express.js
- Express JSON
- JSON Library(Desktop)
- Http connection
- Java Swing UI (Desktop)
- CORS
- MongoClient (to connect with mongodb)
- Firebase client (to connect with firebase)

  ```
  npm install node
  npm install express
  npm install mongodb
  npm install cors
  
  ```
## Tech stack used: HTML, CSS, Javascript, Java,  Firebase for database, MongoDB  

## Web-Client
### Running the script  

Make sure you have **node** dependencies installed to run the local server. In  your terminal run the following:  

```
npm install node
```

This installs Node.Js dependencies. We do not use Node.js for our backend logic. Node.js is needed to start a local host which we have set up in the file **server.js**.  

Start a server instance. In the terminal run:

```
node server.js
```
or just run the code in your text editor.  

After that click on `http://localhost:3000` or go to this URL and you should see the Login Page.  



## Setting up the Desktop client

Make sure to add the JSON jar and MongoDB jar file in your classpath. Project -> classPath -> add JAR -> select your JARs and apply.  
All the necessary JAR files are places within the src folder inside JavaApp folder


# Running the desktop client 

Firstly, run the server, go to the directory wherever your server.js file is and then run:  
```
node server.js
```

Go to the src folder , if you in this project folder, then:
```
cd JavaApp/src
```

After that open your client in your IDE and run the `Application.java` file




