public class User {

    public String FirstName;
    public String LastName;
    public String Username;
    public String Password;

    // Add other fields as needed

    // Getters and setters

    @Override
    public String toString() {
        return "User{" +
                "firstName='" + FirstName + '\'' +
                ", lastName='" + LastName + '\'' +
                ", username='" + Username + '\'' +
                ", password='" + Password + '\'' +
                '}';
    }
}
