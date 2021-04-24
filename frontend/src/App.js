import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import Welcome from './components/auth/Welcome';
import Notfound from './components/Notfound';
class App extends Component {

  state = {
    isAuthenticated: false,
    user: null
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user });
  }


  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser
    }

    return (
      <div className="App">
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" render= {(props) => <LogIn {...props} auth={authProps}/> }/>
              <Route exact path="/" render= {(props) => <Home {...props} auth={authProps}/> }/>
              <Route exact path="/register" render= {(props) => <Register {...props} auth={authProps}/> }/>
              <Route exact path="/welcome" render= {(props) => <Welcome {...props} auth={authProps}/> }/>
              <Route exact path="/notfound" render= {(props) => <Notfound {...props} auth={authProps}/> }/>
              <Route exact path="/dashboard" render= {() => (window.location = "https://cloudwatch.amazonaws.com/dashboard.html?dashboard=url_shortener&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTMwNDYzOTE5MzM1MSIsIlUiOiJ1cy1lYXN0LTFfcnhMWlE2UVhyIiwiQyI6IjduMGx1dDNyZms1anVhOWNnc2RuZWwwMmIwIiwiSSI6InVzLWVhc3QtMTpjNDdiZTk5Yy01YzkxLTQ3NWMtOTUyOC0yMGYzZjBlNWEyNjAiLCJPIjoiYXJuOmF3czppYW06OjMwNDYzOTE5MzM1MTpyb2xlL3NlcnZpY2Utcm9sZS9DbG91ZFdhdGNoRGFzaGJvYXJkLVJlYWRPbmx5QWNjZXNzV2l0aExvZ3MtdXJsX3Nob3J0ZW5lLTlDNEpITk5XIiwiTSI6IlVzclB3U2luZ2xlIn0=")}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

