package Auth;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpRequest;

import java.io.*;
import java.util.ArrayList;
import java.util.List;


public class SignUp implements RequestStreamHandler {

    final String CLIENT_ID = "6mbagar7k5msc170rtnke024d6";
    String err = "";

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {

        JSONParser parser = new JSONParser();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        JSONObject responseJson = new JSONObject();

        try{
            JSONObject event = (JSONObject) parser.parse(reader);

            User user = new User (event.get("body").toString());

            CognitoIdentityProviderClient identityProviderClient = CognitoIdentityProviderClient.builder()
                    .region(Region.EU_CENTRAL_1)
                    .build();

            boolean res = signUp(identityProviderClient, CLIENT_ID, user.getUsername(), user.getPassword(), user.getEmail());
            identityProviderClient.close();

            if (res) {
                responseJson.put("message", "User successfully created. Check your email.");
                responseJson.put("statusCode", 200);
            }
            else {
                responseJson.put("message", "There is a user with same username.");
                responseJson.put("statusCode", 400);
            }

        }catch(ParseException pex) {
            responseJson.put("statusCode", 400);
            responseJson.put("exception", pex);
        }

        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toString());
        writer.close();

    }

    public boolean signUp(CognitoIdentityProviderClient identityProviderClient,
                              String clientId,
                              String userName,
                              String password,
                              String email) {

        AttributeType attributeType = AttributeType.builder()
                .name("email")
                .value(email)
                .build();

        List<AttributeType> attrs = new ArrayList<>();
        attrs.add(attributeType);

        try {

            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .userAttributes(attrs)
                    .username(userName)
                    .clientId(clientId)
                    .password(password)
                    .build();

            identityProviderClient.signUp(signUpRequest);
            return true;

        } catch(CognitoIdentityProviderException e) {
            err = e.awsErrorDetails().errorMessage();
            return false;
        }
    }

}
