package cloud;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import java.io.*;
import java.util.Iterator;

public class APIHandler implements RequestStreamHandler{

    private static final String DYNAMODB_TABLE_NAME = "url_shortener_table";
    private static final String INDEX_NAME = "User-Index";

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {

        JSONParser parser = new JSONParser();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        JSONObject responseJson = new JSONObject();
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.defaultClient();
        DynamoDB dynamoDb = new DynamoDB(client);

        try {

            JSONObject event = (JSONObject) parser.parse(reader);

            if (event.get("authorization") != null && event.get("user_id") != null) {

                DecodedJWT jwt = JWT.decode((String)event.get("authorization"));
                String user_id = jwt.getClaims().get("sub").asString();

                String path_user_id = (String) event.get("user_id");

                if(user_id.equals(path_user_id)) {

                    QuerySpec spec = new QuerySpec()
                            .withKeyConditionExpression("user_id = :nn")
                            .withValueMap(new ValueMap().withString(":nn", user_id));

                    ItemCollection<QueryOutcome> items = dynamoDb.getTable(DYNAMODB_TABLE_NAME).getIndex(INDEX_NAME).query(spec);
                    Iterator<Item> iterator = items.iterator();

                    JSONArray array = new JSONArray();
                    while (iterator.hasNext()) {
                        JSONObject objFromArray = new JSONObject();
                        Item item = iterator.next();
                        objFromArray.put("short_url", item.getString("short_url"));
                        objFromArray.put("long_url", item.getString("long_url"));
                        objFromArray.put("hits", item.getNumber("hits"));
                        objFromArray.put("is_active", item.getBoolean("is_active"));
                        array.add(objFromArray);

                    }
                    responseJson.put("urls", array);
                    responseJson.put("statusCode", 200);
                }
                else{
                    responseJson.put("statusCode", 401);
                }
            }
        } catch (ParseException | JWTDecodeException ex) {
            responseJson.put("statusCode", 400);
            responseJson.put("exception", ex);
            responseJson.put("message", ex);
        }


        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toString());
        writer.close();
    }
}
