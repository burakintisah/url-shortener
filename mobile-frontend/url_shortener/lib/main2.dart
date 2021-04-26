// import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
// import 'package:amplify_flutter/amplify.dart';
// import 'package:amplify_core/amplify_core.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_login/flutter_login.dart';
// import 'package:rflutter_alert/rflutter_alert.dart';
//
//
// void main() {
//   runApp(MaterialApp(
//     home: MyApp(),
//   ));
// }
//
// class MyApp extends StatefulWidget {
//   @override
//   _MyAppState createState() => _MyAppState();
// }
//
// class _MyAppState extends State<MyApp> {
//
//   // Instantiate Amplify
//   AmplifyClass amplifyInstance = AmplifyClass();
//
//   // controllers for text input
//   final emailController = TextEditingController();
//   final passwordController = TextEditingController();
//
//   bool isSignUpComplete = false;
//   bool isSignedIn = false;
//
//   @override
//   void initState() {
//     super.initState();
//   }
//
//   @override
//   void dispose() {
//     // Clean up the controller when the widget is removed from the
//     // widget tree.
//     emailController.dispose();
//     passwordController.dispose();
//
//     super.dispose();
//   }
//
//   Future<String> _registerUser(LoginData data) async {
//     try {
//       Map<String, dynamic> userAttributes = {
//         "email": emailController.text,
//       };
//       SignUpResult res = await Amplify.Auth.signUp(
//           username: data.name,
//           password: data.password,
//           options: CognitoSignUpOptions(userAttributes: userAttributes));
//       setState(() {
//         isSignUpComplete = res.isSignUpComplete;
//         print("Sign up: " + (isSignUpComplete ? "Complete" : "Not Complete"));
//       });
//     } on Error catch (e) {
//       print(e);
//       return "Register Error: " + e.toString();
//     }
//   }
//
//   Future<String> _signIn(LoginData data) async {
//     try {
//       SignInResult res = await Amplify.Auth.signIn(
//         username: data.name,
//         password: data.password,
//       );
//       setState(() {
//         isSignedIn = res.isSignedIn;
//       });
//
//       if (isSignedIn)
//         Alert(context: context, type: AlertType.success, title: "Login Success")
//             .show();
//     } on Error catch (e) {
//       print(e);
//       Alert(context: context, type: AlertType.error, title: "Login Failed")
//           .show();
//       return 'Log In Error: ' + e.toString();
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return SafeArea(
//       child: FlutterLogin(
//           // logo: 'assets/vennify_media.png',
//           onLogin: _signIn,
//           onSignup: _registerUser,
//           onRecoverPassword: (_) => null,
//           title: 'Flutter Amplify'),
//     );
//   }
// }