import React, { Component } from 'react';
import { Auth } from "aws-amplify"
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components'

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
                    <LoginContainer >
                        <Form className="login-head bk"></Form>
                        <Form className="login-form bk" onSubmit={this.handleSubmit}>
                            <h1 >URL Shortener</h1>
                            <h2>Login</h2>
                            <FormGroup className="mt-5 ml-5 mr-5">
                                <Label> Enter username or email</Label>
                                <Input  className=""
                                        type="text" 
                                        id="username"
                                        placeholder="Username or Email"  
                                        value={this.state.username}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label> Password</Label>
                                <Input  type="password" 
                                        id="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <Button className="btn-lg   ml-5 mr-5">Log in</Button>
                            <div className='text-center mt-3 mb-3'>
                                <a href="\register">Sign up</a>
                                
                            </div>
                        </Form>
                    </LoginContainer>
                </div>
        );
    }
}

/*
<span className="p-2">|</span>
                                <a href="/login">Forgot Password</a>
*/

export default LogIn;

const LoginContainer = styled.div`

.login-form{
    width: 100%;
    max-width: 650px;
    margin-left: 25px;
    margin: auto;
    height: 500px;
  }
  .login-head{
    width: 100%;
    max-width: 650px;
    margin-left: 25px;
    margin: auto;
    height: 100px;
    margin-top:8%;
  }
`;