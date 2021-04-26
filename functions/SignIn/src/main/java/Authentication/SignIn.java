package Authentication;

import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.io.*;
import java.util.HashMap;
import java.util.Map;


public class SignIn implements RequestStreamHandler  {
    final String CLIENT_ID = "6mbagar7k5msc170rtnke024d6";
    final String USER_POOL_ID = "eu-central-1_cWT8q635q";

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

            InitiateAuthResponse response = signIn(identityProviderClient, CLIENT_ID, user.getUsername(), user.getPassword());
            identityProviderClient.close();

            responseJson.put("message", "User signed in.");
            responseJson.put("statusCode", 200);
            responseJson.put("token", response.authenticationResult().idToken()) ;



        }catch(ParseException pex) {
            responseJson.put("statusCode", 400);
            responseJson.put("exception", pex);
        }

        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toString());
        writer.close();
    }

    public InitiateAuthResponse signIn(CognitoIdentityProviderClient identityProviderClient,
                              String clientId,
                              String username,
                              String password ) {

        InitiateAuthResponse response = null;

        try {
            final Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", username);
            authParams.put("PASSWORD", password);


            InitiateAuthRequest request = InitiateAuthRequest.builder()
                    .clientId(clientId)
                    .authParameters(authParams)
                    .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                    .build();

            response = identityProviderClient.initiateAuth(request);


        } catch(CognitoIdentityProviderException e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            System.exit(1);
        }

        return response;
    }
}
