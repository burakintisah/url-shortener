import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:flutter/material.dart';
import 'package:url_shortener/screens/add_link_screen.dart';
import 'package:url_shortener/screens/welcome_screen.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key key, @required this.session, @required this.user}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
  final CognitoAuthSession session;
  final AuthUser user;

}

class _HomeScreenState extends State<HomeScreen> {
  Future<List<Link>> _getLinks() async{
    List<Link> links = null;

    try {
      var url = Uri.parse(
          'https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/users/' + widget.user.userId.toString() + '/links');
      print(url);
      var response = await http.get(url,
          headers: {'Authorization': widget.session.userPoolTokens.idToken});

      if (response.statusCode == 401){
        ScaffoldMessenger.of(context)
            .showSnackBar(new SnackBar(content: Text("Session expired, login again")));
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


      var jsonURLs = jsonDecode(response.body)['urls'];
      links = [];
      for (var url in jsonURLs) {
        Link link = Link(url["short_url"], url["long_url"], url["hits"]);
        links.add(link);
      }

    } on Exception catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(new SnackBar(content: Text("URLs cannot be fetched.")));
    }

    return links;
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: Text('All URLs'),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text(
                'URL Shortener',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.logout),
              title: Text('Sign out'),
              onTap: (){
                _signOutUser();
              },
            ),
          ],
        ),
      ),
      body: Container(
        child: FutureBuilder(
          future: _getLinks(),
          builder: (BuildContext context, AsyncSnapshot snapshot) {
            if (snapshot.data == null) {
              return Container(
                  child: Center(
                      child: Text("Loading...")
                  )
              );
            } else {
              if (snapshot.data.length == 0) {
                return Container(
                    child: Center(
                      child: Text("You have not created a URL yet.\nYou can add by clicking the plus button below.", textAlign: TextAlign.center)
                    )

                );
              } else {
                return ListView.builder(
                    itemCount: snapshot.data.length,
                    itemBuilder: (BuildContext context, int index) {
                      return LinkListTile(
                        longLink: snapshot.data[index].longLink,
                        shortLink: snapshot.data[index].shortLink,
                        hits: snapshot.data[index].hits,
                      );
                    }

                );
              }
            }

          },
        )
      ),
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

class LinkListTile extends StatelessWidget {
  final String longLink;
  final String shortLink;
  final int hits;

  const LinkListTile({
    Key key,
    this.longLink,
    this.shortLink,
    this.hits,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery
        .of(context)
        .size;
    return Card (
        child: ListTile(
          title: Text(this.longLink),
          subtitle: Text(this.shortLink),
          onTap: (){
            Clipboard.setData(new ClipboardData(
                text: shortLink));
            ScaffoldMessenger.of(context)
                .showSnackBar(new SnackBar(
                content: Text("Copied")));
          },
          trailing: Text("Hits: " + hits.toString()),
      )
    );
  }
}

class Link{
  final String shortLink;
  final String longLink;
  final int hits;

  Link(
    this.shortLink,
    this.longLink,
    this.hits,
  );
}

