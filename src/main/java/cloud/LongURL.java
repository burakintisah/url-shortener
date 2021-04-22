package cloud;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class LongURL {
    private String long_url;
    private String user_id;

    public LongURL(String json) {
        Gson gson = new Gson();
        LongURL request = gson.fromJson(json, LongURL.class);
        this.long_url = request.getLong_url();
        this.user_id = request.getUserId();
    }

    public String getUserId() {
        return user_id;
    }

    public String getLong_url() {
        return this.long_url;
    }

    public String toString() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }

}
