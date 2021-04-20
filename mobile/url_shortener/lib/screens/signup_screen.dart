import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:url_shortener/constants.dart';
import 'package:url_shortener/screens/login_screen.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';

class SignUpScreen extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  String email;
  String username;
  String password;

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: Text('Sign Up'),
      ),
      body: Container(
          child: Center(
              child: SingleChildScrollView(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: <Widget>[
                        RoundedInputField(
                          hintText: "Your Email",
                          onChanged: (value) {
                            email = value;
                          },
                        ),
                        RoundedInputField(
                          hintText: "Your Username",
                          onChanged: (value) {
                            username = value;
                          },
                        ),
                        RoundedPasswordField(
                          onChanged: (value) {
                            password = value;
                          },
                        ),
                        RoundedButton(
                          text: "SIGNUP",
                          press: () {
                            _registerUser();
                          },
                        ),
                        SizedBox(height: size.height * 0.03),
                        AlreadyHaveAnAccountCheck(
                          press: () {
                            Navigator.pop(context);
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
                      ])))),
    );
  }

  Future<String> _registerUser() async {
    try {
      Map<String, String> userAttributes = {
        "email": email,
      };
      SignUpResult res = await Amplify.Auth.signUp(
          username: username,
          password: password,
          options: CognitoSignUpOptions(userAttributes: userAttributes));

      if(res.isSignUpComplete){
        ScaffoldMessenger.of(context)
            .showSnackBar(new SnackBar(content: Text("Signed Up")));
        Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) {
                return LoginScreen();
              },
            ),
        );
      }
      else {
        ScaffoldMessenger.of(context)
            .showSnackBar(new SnackBar(content: Text("Try again")));
      }
    } on AmplifyException catch (e) {
      print(e);
      ScaffoldMessenger.of(context).showSnackBar(new SnackBar(
          content: Text("Try again")
      ));
      // return "Register Error: " + e.toString();
    }
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

class RoundedInputField extends StatelessWidget {
  final String hintText;
  final IconData icon;
  final ValueChanged<String> onChanged;

  const RoundedInputField({
    Key key,
    this.hintText,
    this.icon = Icons.person,
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

class RoundedPasswordField extends StatefulWidget {
  final ValueChanged<String> onChanged;

  RoundedPasswordField({
    Key key,
    this.onChanged,
  }) : super();

  @override
  _RoundedPasswordFieldState createState() =>
      _RoundedPasswordFieldState(onChanged);
}

class _RoundedPasswordFieldState extends State<RoundedPasswordField> {
  final ValueChanged<String> onChanged;
  bool obscureState = true;

  _RoundedPasswordFieldState(this.onChanged) : super();

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      child: TextField(
        obscureText: obscureState,
        onChanged: onChanged,
        cursorColor: Colors.white,
        style: TextStyle(color: Colors.white),
        decoration: InputDecoration(
          icon: Icon(
            Icons.lock,
            color: Colors.white,
          ),
          hintText: "Password",
          hintStyle: TextStyle(color: Colors.white),
          suffixIcon: IconButton(
            icon: Icon(
              Icons.visibility,
              color: Colors.white,
              size: 30,
            ),
            onPressed: () {
              setState(() {
                this.obscureState = !this.obscureState;
              });
            },
          ),
          border: InputBorder.none,
        ),
      ),
    );
  }
}

// class RoundedPasswordField extends StatelessWidget {
//   final ValueChanged<String> onChanged;
//   const RoundedPasswordField({
//     Key key,
//     this.onChanged,
//   }) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return TextFieldContainer(
//       child: TextField(
//         obscureText: true,
//         onChanged: onChanged,
//         cursorColor: Colors.white,
//         decoration: InputDecoration(
//           hintText: "Password",
//           hintStyle: TextStyle(color: Colors.white),
//           icon: Icon(
//             Icons.lock,
//             color: Colors.white,
//           ),
//           suffixIcon: Icon(
//             Icons.visibility,
//             color: primaryColor,
//           ),
//           border: InputBorder.none,
//         ),
//       ),
//     );
//   }
// }

class TextFieldContainer extends StatelessWidget {
  final Widget child;
  const TextFieldContainer({
    Key key,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      width: size.width * 0.8,
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(29),
      ),
      child: child,
    );
  }
}

class AlreadyHaveAnAccountCheck extends StatelessWidget {
  final Function press;
  const AlreadyHaveAnAccountCheck({
    Key key,
    this.press,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text(
          "Already have an account? ",
          style: TextStyle(color: primaryColor),
        ),
        GestureDetector(
          onTap: press,
          child: Text(
            "Login",
            style: TextStyle(
              color: primaryColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        )
      ],
    );
  }
}
