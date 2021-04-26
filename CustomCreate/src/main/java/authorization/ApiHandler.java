package authorization;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.sql.Timestamp;
import java.util.InputMismatchException;

public class ApiHandler implements RequestStreamHandler {

    private static final String DYNAMODB_TABLE_NAME = "url_shortener_table";
    private static final String APPLICATION_URL = System.getenv("APP_URL");
    private static final int MIN_URL_LENGTH = Integer.parseInt(System.getenv("MIN_CHAR"));
    private static final int MAX_URL_LENGTH = Integer.parseInt(System.getenv("MAX_CHAR"));

    private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
    private DynamoDB dynamoDb = new DynamoDB(client);

    private Timestamp get_timestamp(){
        return new Timestamp(System.currentTimeMillis());
    }
    private Timestamp get_expiration_date(Timestamp from){
        Timestamp timestamp = new Timestamp(from.getTime() + (604800 * 1000));
        return timestamp;
    }
    private boolean check_id(String short_id){
        Item item = dynamoDb.getTable(DYNAMODB_TABLE_NAME).getItem("short_id",short_id);
        return item != null;
    }

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
        JSONParser parser = new JSONParser();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        JSONObject responseJson = new JSONObject();

        try{
            JSONObject event = (JSONObject) parser.parse(reader);

            CustomLink custom_url = new CustomLink(event.get("body").toString());
            String short_id = custom_url.getCustom_url();

            if (short_id.length() < MIN_URL_LENGTH || short_id.length() > MAX_URL_LENGTH) {
                throw new InputMismatchException();
            }

            if (check_id(short_id)) {
                throw new InvalidObjectException("Already created a custom link with provided string.");
            }

            String short_url = APPLICATION_URL + short_id;
            Timestamp timestamp = get_timestamp();
            Timestamp ttl = get_expiration_date(timestamp);

            if (event.get("body") != null  && event.get("authorization") != null ) {

                System.out.println("HERE");
                DecodedJWT jwt = JWT.decode((String)event.get("authorization"));
                String user_id = jwt.getClaims().get("sub").asString();


                dynamoDb.getTable(DYNAMODB_TABLE_NAME)
                        .putItem(new PutItemSpec().withItem(new Item().withString("short_id", short_id)
                                .withString("created_at", timestamp.toString())
                                .withString("ttl", ttl.toString())
                                .withString("short_url", short_url)
                                .withString("long_url", custom_url.getLong_url())
                                .withString("user_id", user_id)
                                .withBoolean("is_active", true)
                                .withNumber("hits", 0)));

            }

            //JSONObject responseBody = new JSONObject();
            responseJson.put("short_id", short_id);
            responseJson.put("short_url", short_url);
            responseJson.put("long_url", custom_url.getLong_url());

            responseJson.put("statusCode", 200);


        }catch (ParseException | JWTDecodeException ex) {
            responseJson.put("statusCode", 400);
            responseJson.put("exception", ex);
        }catch(InputMismatchException err) {
            responseJson.put("statusCode", 400);
            responseJson.put("message", "Custom link length should be between " + MIN_URL_LENGTH + " and " + MAX_URL_LENGTH);
        }catch(InvalidObjectException err ){
            responseJson.put("statusCode", 400);
            responseJson.put("message", err.getMessage());
        }



        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toString());
        writer.close();
    }
}
