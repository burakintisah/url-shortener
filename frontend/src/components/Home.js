import { button } from '@aws-amplify/ui';
import React, { Component } from 'react';


class Home extends Component {

    render () {
        return (
            <div className="container">
              <h1>Welcome!</h1>
              <div>
              {this.props.auth.isAuthenticated && this.props.auth.user && (
                  <p>
                      Hello {this.props.auth.user.username}
                  </p>
              )}
              </div>
            <div>
            {this.props.auth.isAuthenticated && (
                <div>
                    <a href="/" > Log Out</a>
                </div>
            )}
            </div>
            <div>
            {!this.props.auth.isAuthenticated && (
                <div>
                    <a href="/login" > Sign In</a>
                </div>
            )}
            </div>
            </div>
        )
    }
}
export default Home;

