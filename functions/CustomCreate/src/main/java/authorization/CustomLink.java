package authorization;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class CustomLink {

    private String long_url;
    private String custom_url;

    public CustomLink(String json) {
        Gson gson = new Gson();
        CustomLink request = gson.fromJson(json, CustomLink.class);
        this.long_url = request.getLong_url();
        this.custom_url = request.getCustom_url();
    }

    public String getCustom_url() {
        return custom_url;
    }

    public void setCustom_url(String custom_url) {
        this.custom_url = custom_url;
    }

    public String getLong_url() {
        return long_url;
    }
    public void setLong_url(String long_url) {
        this.long_url = long_url;
    }

    public String toString () {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }
}
