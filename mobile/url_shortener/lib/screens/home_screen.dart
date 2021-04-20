import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:flutter/material.dart';
import 'package:url_shortener/screens/add_link_screen.dart';
import 'package:url_shortener/screens/welcome_screen.dart';

import '../constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key key, @required this.session, @required this.user}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
  final CognitoAuthSession session;
  final AuthUser user;
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: Text('URL Shortener'),
      ),
      body: Center(
          child: TextButton(
        child: Text('Sign out'),
        onPressed: () {
          _signOutUser();

        },
      )),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) {
                  return AddLinkScreen(session: widget.session, user: widget.user);
                },
              ),
          );
          // Add your onPressed code here!
        },
        child: const Icon(Icons.add),
        backgroundColor: primaryColor,
      ),
    );
  }

  void _signOutUser() async {
    try {
      SignOutResult res = await Amplify.Auth.signOut();
      ScaffoldMessenger.of(context)
          .showSnackBar(new SnackBar(content: Text("Signed Out")));
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(
            builder: (context) {
              return WelcomeScreen();
            },
          ),
              (Route<dynamic> route) => false
      );
    } on AmplifyException catch (e) {
      print(e);
      ScaffoldMessenger.of(context)
          .showSnackBar(new SnackBar(content: Text("Try again")));
    }
  }
}
