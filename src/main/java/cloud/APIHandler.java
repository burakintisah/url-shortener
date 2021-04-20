package cloud;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;

public class APIHandler {

    private static final String DYNAMODB_TABLE_NAME = "url_shortener_table";

    public void handleGetByParam(InputStream inputStream, OutputStream outputStream) throws Exception {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        DynamoDB dynamoDb = new DynamoDB(client);
        JSONParser parser = new JSONParser();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        JSONObject responseJson = new JSONObject();

        Item result = null;
        try {
            JSONObject event = (JSONObject) parser.parse(reader);
            JSONObject responseBody = new JSONObject();
            String short_id = (String) event.get("short_id");

            if (short_id != null) {
                result = dynamoDb.getTable(DYNAMODB_TABLE_NAME).getItem("short_id", short_id);
            }
            if (result != null) {
                String long_url = result.getString("long_url");
                int count = result.getNumber("hits").intValue();
                result.withNumber("hist", count + 1);
                responseJson.put("statusCode", 301);
                throw new Exception(new ResponseFound(long_url));
            }
            else {
                Object message = "Page cannot be found!";
                responseBody.put("message", message);
                responseJson.put("statusCode", 404);
            }

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
