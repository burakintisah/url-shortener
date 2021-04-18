import React, { Component } from 'react';
import { Auth } from "aws-amplify"

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
        errors: {
            cognito: null,
            blankfield: false,
            passwordmatch: false
        }
    }

    clearErrorState = () => {
        this.setState({
            errors: {
                cognito: null,
                blankfield: false,
                passwordmatch: false
            }
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        // Form validation
        this.clearErrorState();

        // AWS Cognito integration here
        const { username, email, password } = this.state;
        try {
            const signUpResponse = await Auth.signUp ({
                username,
                password,
                attributes: {
                    email:email
                }
            });
            console.log(signUpResponse);

            // redirecting to Welcome Page
            this.props.history.push('/welcome')

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
    }

    render() {
        return (
            <div className="container">
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <p>
                            <input
                                className="input"
                                type="text"
                                id="username"
                                placeholder="Enter username"
                                value={this.state.username}
                                onChange={this.onInputChange}
                            />
                        </p>
                    </div>
                    <div >
                        <p>
                            <input
                                className="input"
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                value={this.state.email}
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
                            <input
                                className="input"
                                type="password"
                                id="confirmpassword"
                                placeholder="Confirm password"
                                value={this.state.confirmpassword}
                                onChange={this.onInputChange}
                            />
                        </p>
                    </div>
                    <div >
                        <p >
                            <a href="/forgotpassword">Forgot password?</a>
                        </p>
                    </div>
                    <div>
                        <p>
                            <button>
                                Register
                  </button>
                        </p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;