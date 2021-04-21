import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';

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
                <RegContainer >
                <Form className="login-form2 bk" >

                </Form>
                        <Form className="login-form bk" onSubmit={this.handleSubmit}>
                            <h1 >URL Shortener</h1>
                            <h2>Sign Up</h2>
                            <FormGroup className="mt-5 ml-5 mr-5">
                                <Label> Username</Label>
                                <Input  className="input"
                                        type="text" 
                                        id="username"
                                        placeholder="Username"  
                                        value={this.state.username}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label> Email</Label>
                                <Input  className="input"
                                        type="email" 
                                        id="email"
                                        placeholder="Email"  
                                        value={this.state.email}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label> Password</Label>
                                <Input  className="input"
                                        type="password" 
                                        id="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label> Confirm Password</Label>
                                <Input  className="input"
                                        type="password" 
                                        id="confirmpassword"
                                        placeholder="Password"
                                        value={this.state.confirmpassword}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <Button className="btn-lg   ml-5 mr-5">Sign Up</Button>
                            <div className='text-center mt-3 mb-3'>
                                <a href="\login">Log in</a>
                            </div>
                        </Form>
                    </RegContainer>            
            </div>
        );
    }
}

export default Register;

const RegContainer = styled.div`
.login-form{
    width: 100%;
    max-width: 600px;
    margin-left: 25px;
    margin: auto;
    height: 650px;
    margin-top:8%;
    margin-bottom:10%;
    background: rgb(147,50,158);
    background: linear-gradient(90deg, rgba(147,50,158,1) 0%, rgba(180,174,232,1) 0%, rgba(255,227,254,1) 80%);
  }
`;