import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class SignUpPage extends JFrame {
    private JTextField firstNameField;
    private JTextField lastNameField;
    private JTextField signUpUsernameField;
    private JPasswordField signUpPasswordField;

    public SignUpPage() {
        setTitle("Sign Up");
        setSize(300, 200);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel signUpPanel = new JPanel(new SpringLayout());

        signUpPanel.add(new JLabel("First Name:"));
        firstNameField = new JTextField(8);
        signUpPanel.add(firstNameField);

        signUpPanel.add(new JLabel("Last Name:"));
        lastNameField = new JTextField(8);
        signUpPanel.add(lastNameField);

        signUpPanel.add(new JLabel("Username:"));
        signUpUsernameField = new JTextField(8);
        signUpPanel.add(signUpUsernameField);

        signUpPanel.add(new JLabel("Password:"));
        signUpPasswordField = new JPasswordField(8);
        signUpPanel.add(signUpPasswordField);

        SpringUtilities.makeCompactGrid(signUpPanel,
                4, 2, //rows, cols
                6, 6, //initX, initY
                6, 6); //xPad, yPad

        JButton signUpButton = new JButton("Sign Up");
        signUpButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                onSignUp();
            }
        });

        JPanel signUpButtonPanel = new JPanel();
        signUpButtonPanel.add(signUpButton);

        setLayout(new BoxLayout(getContentPane(), BoxLayout.Y_AXIS));
        add(signUpPanel);
        add(signUpButtonPanel);
    }

    private void onSignUp() {
        String firstName = firstNameField.getText().trim();
        String lastName = lastNameField.getText().trim();
        String signUpUsername = signUpUsernameField.getText().trim();
        String signUpPassword = new String(signUpPasswordField.getPassword()).trim();
        if (firstName.isEmpty() || lastName.isEmpty() || signUpUsername.isEmpty() || signUpPassword.isEmpty()) {
            // Throw an exception or display an error message
            JOptionPane.showMessageDialog(this, "Please fill in all fields", "Error", JOptionPane.ERROR_MESSAGE);
            return; // Exit the method if validation fails
        }
        // Validate and process the sign-up data as needed
        // For simplicity, you can print the values for now
        System.out.println("First Name: " + firstName);
        System.out.println("Last Name: " + lastName);
        System.out.println("Username: " + signUpUsername);
        System.out.println("Password: " + signUpPassword);
        User user = DataAdapter.getUserDetails(signUpUsername);
        if(user == null)
        {
        	DataAdapter.addUser(firstName, lastName, signUpUsername, signUpPassword);
        }else {
            // User not found
        	JOptionPane.showMessageDialog(null, "User NOT Saved!");
        }
        
        
        // Close the sign-up frame
        dispose();
    }
}
