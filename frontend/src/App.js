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
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

