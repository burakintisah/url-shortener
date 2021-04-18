package cloud;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LongURL {
    private String long_url;

    public LongURL(String json) {
        Gson gson = new Gson();
        LongURL request = gson.fromJson(json, LongURL.class);
        this.long_url = request.getLong_url();
    }

    public String toString() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }
}
