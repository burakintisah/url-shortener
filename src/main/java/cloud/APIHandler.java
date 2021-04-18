package cloud;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.KeyAttribute;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import java.io.*;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

public class APIHandler implements RequestStreamHandler {

    private static final String DYNAMODB_TABLE_NAME = "url_shortener_table";
    private static final String APPLICATION_URL = System.getenv("APP_URL");
    private static final int MIN_URL_LENGTH = Integer.parseInt(System.getenv("MIN_CHAR"));
    private static final int MAX_URL_LENGTH = Integer.parseInt(System.getenv("MAX_CHAR"));
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
    private DynamoDB dynamoDb = new DynamoDB(client);

    private Timestamp get_timestamp(){
        Date date= new Date();
        long time = date.getTime();
        return new Timestamp(time);
    }
    private Timestamp get_expiration_date(Timestamp from){
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(from.getTime());
        cal.add(Calendar.SECOND, 30);
        return new Timestamp(cal.getTime().getTime());
    }
    private boolean check_id(String short_id){
        KeyAttribute keyAttribute = new KeyAttribute("short_id",short_id);
        PrimaryKey primaryKey = new PrimaryKey(keyAttribute);
        Item item = dynamoDb.getTable(DYNAMODB_TABLE_NAME).getItem(primaryKey);
        return item != null;
    }
    private int get_random_number(int min, int max){
        return min + (int) (Math.random() * (max + 1));
    }

    private String generate_random_string(){
        StringBuilder short_id = new StringBuilder();
        int random_length = get_random_number(MIN_URL_LENGTH, MAX_URL_LENGTH);
        for(int i = 0; i < random_length; i++){
            int random_char_pos= get_random_number(0, ALPHANUMERIC.length() - 1);
            char random_char = Character.toLowerCase(ALPHANUMERIC.charAt(random_char_pos));
            short_id.append(random_char);
        }
        return short_id.toString();
    }

    private String generate_id(){
        String id = generate_random_string();
        while(check_id(id)){
            id = generate_random_string();
        }
        return id;
    }

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {

        JSONParser parser = new JSONParser();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        JSONObject responseJson = new JSONObject();

        String short_id = generate_id();
        String short_url = APPLICATION_URL + short_id;
        Timestamp timestamp = get_timestamp();
        Timestamp ttl = get_expiration_date(timestamp);


        try {
            JSONObject event = (JSONObject) parser.parse(reader);
            URL long_url = new URL((String) event.get("body"));

            if (event.get("body") != null) {

                dynamoDb.getTable(DYNAMODB_TABLE_NAME)
                        .putItem(new PutItemSpec().withItem(new Item().withString("short_id", short_id)
                                                    .withString("created_at", timestamp.toString())
                                                    .withString("ttl", ttl.toString())
                                                    .withString("short_url", short_url)
                                                    .withString("long_url", long_url.getLong_url())
                                                    .withNumber("hits", 0)));
            }

            JSONObject responseBody = new JSONObject();
            responseBody.put("short_id", short_url);
            responseBody.put("long_url", long_url.getLong_url());

            responseJson.put("statusCode", 200);
            responseJson.put("body", responseBody.toString());

        } catch (ParseException pex) {
            responseJson.put("statusCode", 400);
            responseJson.put("exception", pex);
        }

        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toString());
        writer.close();
    }
}