import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JOptionPane;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class DataAdapter {

    private static final String BASE_URL = "http://localhost:3000";
    public static List<String> sessions = new ArrayList<String>();

    public static void main(String[] args) {
        // Replace "your_user_id" with the actual user ID
        String userID = "1";

        // Example: Fetch sessions
        getSessions(userID);

        // Example: Send a user message
//        sendMessage(userID, "Hello, how are you?");

        // Example: Fetch messages for a specific session
        getMessagesForSession("1701872512446");
        
//        System.out.println(chatGPT("Rap a song"));
    }

    public static int getSessions(String userID) {
        try {
            URL url = new URL(BASE_URL + "/sessions/" + userID);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                StringBuilder response = new StringBuilder();

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                JSONObject obj = new JSONObject(response.toString());
                JSONArray jArray = obj.getJSONArray("data");
                
                for (int i = 0 ; i < jArray.length() ; i++) {
                	sessions.add((String.valueOf(jArray.getLong(i))));
                }
                System.out.println("SESSIONLENGTH"+ jArray.length());
//                System.out.println(sessions);
//                System.out.println(obj.getJSONArray("data"));
//                sessions.addAll(obj.getJSONArray(userID));
                
                System.out.println("Sessions: " + response.toString());
                return jArray.length();
            } else {
                System.out.println("Error: " + responseCode);
                return 0;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
    
    public static void mapUserToSession(String userID, int conversationCount, String sessionID) {
        try {
            URL url = new URL(BASE_URL + "/sessions/" + userID + "/" + conversationCount);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            String jsonInputString = "{\"sessionID\": " + sessionID + "}";

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Handle the success response
                System.out.println("Message sent successfully");
            } else {
                System.out.println("Error: " + responseCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void sendMessage(String sessionID, String userID, String message) {
        try {
            URL url = new URL(BASE_URL + "/conversations/" + sessionID +"/1");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            String jsonInputString = "{\"message\": \"" + message + "\", \"sessionID\": \"" + sessionID + "\", \"userID\": \"" + userID + "\"}";

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Handle the success response
                System.out.println("Message sent successfully");
            } else {
                System.out.println("Error: " + responseCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getMessagesForSession(String sessionID) {
        try {
            URL url = new URL(BASE_URL + "/conversations/" + sessionID);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                StringBuilder response = new StringBuilder();

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
//                System.out.println("Messages for session " + sessionID + ": " + response.toString());
                
                return response.toString();
            } else {
                System.out.println("Error: " + responseCode);
                return "";
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }
    public static User getUserDetails(String userID) {
        try {
            URL url = new URL(BASE_URL + "/users/" + userID);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                // Parse JSON response manually into User object
                JSONObject jsonObject = new JSONObject(response.toString());

                User user = new User();
                user.FirstName = jsonObject.getString("FirstName");
                user.LastName = jsonObject.getString("LastName");
                user.Username = jsonObject.getString("Username");
                user.Password = jsonObject.getString("Password");

                return user;
            } else {
                System.out.println("Error: " + responseCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
    public static void addUser(String firstName, String lastName, String username, String password) {
        try {
            URL url = new URL(BASE_URL + "/users");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Construct JSON input string
            String jsonInputString = String.format("{\"FirstName\": \"%s\", \"LastName\": \"%s\", \"Username\": \"%s\", \"Password\": \"%s\"}",
                    firstName, lastName, username, password);

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Handle success response if needed
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    System.out.println("User added successfully: " + response.toString());
                }
            } else {
            	if(responseCode > 400)
            	{
            		 System.out.println("Error: " + responseCode);
            	}
            	else {
                    JOptionPane.showMessageDialog(null, "User Saved!");

            	}
               
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static String getChatbotResponse(List<String> lastMessageContext) {
        String url = "https://api.openai.com/v1/chat/completions";
        String apiKey = "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";
        String model = "gpt-3.5-turbo"; 

        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            connection.setRequestProperty("Content-Type", "application/json");

            String body = "{\"model\": \"" + model + "\", \"messages\": " + lastMessageContext + ", \"max_tokens\": " + 100 +  "}";
            connection.setDoOutput(true);
            OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());
            
            writer.write(body);
            writer.flush();
            writer.close();

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            return extractContentFromResponse(response.toString()).replaceAll("\n", " ");

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static String extractContentFromResponse(String response) {
        int start = response.indexOf("content")+11; 
        int end = response.indexOf("\"", start); 
        
        return response.substring(start, end); 
    }
        
   
}
