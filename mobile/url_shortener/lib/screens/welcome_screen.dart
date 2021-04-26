import 'package:flutter/material.dart';
import 'package:url_shortener/constants.dart';
import 'package:url_shortener/screens/login_screen.dart';
import 'package:url_shortener/screens/signup_screen.dart';

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('URL Shortener'),
      ),
      body: Body(),
    );
  }
}

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Container(
        child: Center(
            child: SingleChildScrollView(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
          Text(
            "WELCOME TO\nURL SHORTENER APP OF\nGROUP 2",
            textAlign: TextAlign.center,
            style: TextStyle(
                color: primaryColor, fontWeight: FontWeight.bold, fontSize: 30),
          ),
          SizedBox(height: 100),
          RoundedButton(
            text: "LOGIN",
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return LoginScreen();
                  },
                ),
              );
            },
          ),
          RoundedButton(
            text: "SIGN UP",
            color: primaryLightColor,
            textColor: primaryDarkColor,
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return SignUpScreen();
                  },
                ),
              );
            },
          ),
        ]))));
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
    Size size = MediaQuery.of(context).size;
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
