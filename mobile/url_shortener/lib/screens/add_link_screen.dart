import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:flutter/services.dart';
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
  bool showShortLinkButton = false;

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
                        RoundedButton(
                          text: "GENERATE",
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
                                  "You can copy the short link by clicking on it.",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: primaryColor
                                  ),
                                ),
                                RoundedButton(
                                text: shortLink,
                                press: () {
                                  Clipboard.setData(new ClipboardData(
                                      text: shortLink));
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(new SnackBar(
                                      content: Text("Copied.")));
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
      var url = Uri.parse(
          'https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create');
      Uri longLink = Uri.parse(link);
      if(!longLink.isAbsolute){
        ScaffoldMessenger.of(context)
            .showSnackBar(new SnackBar(content: Text("Enter absolute path")));
      }
      else {
        var response = await http.post(url, body: jsonEncode(
            {'long_url': link, 'user_id': widget.user.userId}),
            headers: {'Authorization': widget.session.userPoolTokens.idToken});
        print('Response body: ${response.body}');
        setState(() {
          shortLink = jsonDecode(response.body)['short_url'].trim();
          showShortLinkButton = true;
        });
        ScaffoldMessenger.of(context)
            .showSnackBar(new SnackBar(content: Text("Short link generated")));
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
          icon: Icon(
            icon,
            color: Colors.white,
          ),
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
      width: size.width,
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

  const RoundedButton({
    Key key,
    this.text,
    this.press,
    this.color = primaryColor,
    this.textColor = Colors.white,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery
        .of(context)
        .size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10),
      width: size.width * 0.8,
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