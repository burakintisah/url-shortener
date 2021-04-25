package Authentication;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


public class User {

    private String username;
    private String password;
    public User(String json) {

        Gson gson = new Gson();
        User request = gson.fromJson(json, User.class);
        this.username = request.getUsername();
        this.password = request.getPassword();
    }

    // Getter Methods
    public String getPassword() {
        return this.password;
    }


    public String getUsername() {
        return username;
    }

    // Setter Methods
    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.username = name;
    }

    public String toString () {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }

}
