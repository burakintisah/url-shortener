package cloud;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class URL {
    private String long_url;

    public URL(String json) {
        Gson gson = new Gson();
        URL request = gson.fromJson(json, URL.class);
        this.long_url = request.getLong_url();
    }

    public String toString() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
    }
}
