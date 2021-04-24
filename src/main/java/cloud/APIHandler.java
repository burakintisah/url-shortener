package cloud;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

public class APIHandler {

    private static final String DYNAMODB_TABLE_NAME = "url_shortener_table";
    private Timestamp get_timestamp(){
        return new Timestamp(System.currentTimeMillis());
    }

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
            Boolean is_active = result.getBoolean("is_active");
            String long_url = "";
            if (result != null && is_active) {
                long_url = result.getString("long_url");
                int count = result.getNumber("hits").intValue();

                String ttlString = result.getString("ttl");
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.SSS");
                Date parsedDate = dateFormat.parse(ttlString);
                Timestamp ttl = new java.sql.Timestamp(parsedDate.getTime());
                Timestamp timestamp = get_timestamp();


                if (timestamp.after(ttl)){
                    is_active = false;
                }



                UpdateItemSpec updateItemSpec = new UpdateItemSpec().withPrimaryKey("short_id", short_id)
                                                .withUpdateExpression("set hits = :h , is_active=:a")
                                                .withValueMap(new ValueMap().withNumber(":h", count + 1)
                                                        .withBoolean(":a", is_active))
                                                .withReturnValues(ReturnValue.UPDATED_NEW);

                dynamoDb.getTable(DYNAMODB_TABLE_NAME).updateItem(updateItemSpec);



            }
            if(is_active){
                responseJson.put("statusCode", 301);
                throw new Exception(new ResponseFound(long_url));
            }
            else {
                long_url = "https://frontend.d2kmvlz3pn1yrn.amplifyapp.com/error";
                responseJson.put("statusCode", 301);
                throw new Exception(new ResponseFound(long_url));
            }

        } catch (ParseException pex) {
            responseJson.put("statusCode", 400);
            responseJson.put("exception", pex);
        }

        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toString());
        writer.close();
    }
}
