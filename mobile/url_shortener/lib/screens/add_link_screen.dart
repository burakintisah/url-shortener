import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:flutter/services.dart';
import 'package:url_shortener/screens/welcome_screen.dart';
import 'dart:convert';

import '../constants.dart';

class AddLinkScreen extends StatefulWidget {
  const AddLinkScreen({Key key, @required this.session, @required this.user})
      : super(key: key);

  @override
  _AddLinkScreenState createState() => _AddLinkScreenState();
  final CognitoAuthSession session;
  final AuthUser user;

}

class _AddLinkScreenState extends State<AddLinkScreen> {
  String link;
  String shortLink;
  String customLink;
  bool showShortLinkButton = false;
  bool customLinkState = false;

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery
        .of(context)
        .size;

    return Scaffold(
      appBar: AppBar(
        title: Text('Generate Short URL'),
      ),
      body: Container(
          child: Center(
              child: SingleChildScrollView(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: <Widget>[
                        RoundedInputField(
                          hintText: "URL",
                          onChanged: (value) {
                            link = value;
                          },
                        ),
                        Visibility(
                          visible: customLinkState,
                          child: RoundedInputField(
                            hintText: "Custom Key",
                            onChanged: (value) {
                              customLink = value;
                            },
                          ),
                        ),


                        CheckboxListTile(
                          title: Text("Generate short URL with custom key"), //    <-- label
                          value: customLinkState,
                          onChanged: (newValue) {
                            setState(() {
                            customLinkState = newValue;
                            });
                          },
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                        RoundedButton(
                          text: "GENERATE",
                          widthScale: 0.5,
                          press: () {
                            _generateShortLink();
                          },
                        ),
                        SizedBox(height: size.height * 0.05),
                        Visibility(
                          visible: showShortLinkButton,
                          child: Column(
                              children: <Widget>[
                                Text(
                                  "You can copy the short URL by clicking on it.",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 16,
                                    // color: primaryColor
                                  ),
                                ),
                                RoundedButton(
                                text: shortLink,
                                widthScale: 0.8,
                                press: () {
                                  Clipboard.setData(new ClipboardData(
                                      text: shortLink));
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(new SnackBar(
                                      content: Text("Copied")));
                                },
                              )
                              ]
                          ),
                        ),
                      ])))),
    );
  }

  void _generateShortLink() async {
    try {
      if (link != null && link != "") {
        Uri longLink = Uri.parse(link);
        if(!longLink.isAbsolute){
          ScaffoldMessenger.of(context)
              .showSnackBar(new SnackBar(content: Text("Enter absolute path")));
        }
        else {
          if ((customLinkState && customLink != null && customLink.length <= 8 &&
              customLink.length >= 6) || !customLinkState ) {
            var url;
            var response;
            if (customLinkState) {
              url = Uri.parse(
                  'https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create/custom');
              response = await http.post(url, body: jsonEncode(
                  {'long_url': link, 'custom_url': customLink}),
                  headers: {
                    'Authorization': widget.session.userPoolTokens.idToken,
                    'Content-Type': 'application/json'
                  });
            } else {
              url = Uri.parse(
                  'https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create');
              response = await http.post(url, body: jsonEncode(
                  {'long_url': link}),
                  headers: {
                    'Authorization': widget.session.userPoolTokens.idToken,
                    'Content-Type': 'application/json'
                  });
            }

            if (response.statusCode == 401) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(
                  new SnackBar(content: Text("Session expired, login again")));
              Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return WelcomeScreen();
                    },
                  ),
                      (Route<dynamic> route) => false
              );
              return null;
            }

            setState(() {
              shortLink = jsonDecode(response.body)['short_url'].trim();
              showShortLinkButton = true;
            });
            ScaffoldMessenger.of(context)
                .showSnackBar(
                new SnackBar(content: Text("Short URL generated")));
          } else {
            ScaffoldMessenger.of(context)
                .showSnackBar(new SnackBar(content: Text("Enter an valid custom key. Length of the key should be between 6 and 8.")));
          }
        }
      } else {
        ScaffoldMessenger.of(context)
            .showSnackBar(new SnackBar(content: Text("Enter an URL")));
      }

    } on Exception catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(new SnackBar(content: Text("Try again")));
    }
  }
}

class RoundedInputField extends StatelessWidget {
  final String hintText;
  final IconData icon;
  final ValueChanged<String> onChanged;

  const RoundedInputField({
    Key key,
    this.hintText,
    this.icon = Icons.short_text,
    this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      child: TextField(
        onChanged: onChanged,
        cursorColor: Colors.white,
        style: TextStyle(color: Colors.white),
        decoration: InputDecoration(
          // icon: Icon(
          //   icon,
          //   color: Colors.white,
          // ),
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.white),
          border: InputBorder.none,
        ),
      ),
    );
  }
}

class TextFieldContainer extends StatelessWidget {
  final Widget child;

  const TextFieldContainer({
    Key key,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery
        .of(context)
        .size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      width: size.width*0.9,
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(29),
      ),
      child: child,
    );
  }
}

class RoundedButton extends StatelessWidget {
  final String text;
  final Function press;
  final Color color, textColor;
  final double widthScale;

  const RoundedButton({
    Key key,
    this.text,
    this.press,
    this.color = primaryColor,
    this.textColor = Colors.white,
    this.widthScale,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery
        .of(context)
        .size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10),
      width: size.width * this.widthScale,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(29),
        child: FlatButton(
          padding: EdgeInsets.symmetric(vertical: 20, horizontal: 40),
          color: color,
          onPressed: press,
          child: Text(
            text,
            style: TextStyle(color: textColor),
          ),
        ),
      ),
    );
  }
}