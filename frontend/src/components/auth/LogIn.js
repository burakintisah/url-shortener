import React, { Component } from 'react';
import { Auth } from "aws-amplify"

class LogIn extends Component {
    state = {
        username: "",
        password: "",
        errors: {
            cognito: null,
            blankfield: false
        }
    };

    clearErrorState = () => {
        this.setState({
            errors: {
                cognito: null,
                blankfield: false
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        // Form validation
        this.clearErrorState();

        // AWS Cognito integration here
        try {
            const user = await Auth.signIn (this.state.username, this.state.password);
            console.log(user);
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);
            // redirecting to Welcome Page
            this.props.history.push('/')

        } catch (error) {
            let err = null;
            !error.message ? err = {"message": error} : err= error;
            this.setState ({
                errors: {
                    ...this.state.errors,
                    cognito: error
                }
            })
        }
    };


    onInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
        document.getElementById(event.target.id);
    };


    render() {
        return (
                <div className="container">
                    <h1>Log in</h1>


                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <p>
                                <input
                                    className="input"
                                    type="text"
                                    id="username"
                                    placeholder="Enter username or email"
                                    value={this.state.username}
                                    onChange={this.onInputChange}
                                />
                            </p>
                        </div>
                        <div>
                            <p>
                                <input
                                    className="input"
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.onInputChange}
                                />
                            </p>

                        </div>
                        <div>
                            <p>
                                <a href="/forgotpassword">Forgot password?</a>
                            </p>

                        </div>
                        <div>
                            <p>
                                <button className="button">
                                    Login
                                </button>
                            </p>

                        </div>
                    </form>
                </div>
        );
    }
}

export default LogIn;