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
        },
        isSamePass : true,
        isValid: true,
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
        const { username, email, password, confirmpassword } = this.state;
        if(password != confirmpassword)
        {
            this.setState({isSamePass:false});
        }
        else{
            this.setState({isSamePass:true});
            try {
                const signUpResponse = await Auth.signUp ({
                    username,
                    password,
                    attributes: {
                        email:email
                    }
                });
                //console.log(signUpResponse);
    
                // redirecting to Welcome Page
                this.setState({isValid: true});
                this.props.history.push('/welcome')
    
            } catch (error) {
                this.setState({isValid: false});
                let err = null;
                !error.message ? err = {"message": error} : err= error;
                this.setState ({
                    errors: {
                        ...this.state.errors,
                        cognito: error
                    }
                })
            }
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
                            <h1 className="white">URL Shortener</h1>
                            <h2 className="white">Sign Up</h2>
                            <FormGroup className="mt-5 ml-5 mr-5">
                                <Label className="white"> Username</Label>
                                <Input  className="input"
                                        type="text" 
                                        id="username"
                                        placeholder="Username"  
                                        value={this.state.username}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label className="white"> Email</Label>
                                <Input  className="input"
                                        type="email" 
                                        id="email"
                                        placeholder="Email"  
                                        value={this.state.email}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label className="white"> Password</Label>
                                <Input  className="input"
                                        type="password" 
                                        id="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <FormGroup className="ml-5 mr-5">
                                <Label className="white"> Confirm Password</Label>
                                <Input  className="input"
                                        type="password" 
                                        id="confirmpassword"
                                        placeholder="Password"
                                        value={this.state.confirmpassword}
                                        onChange={this.onInputChange} />
                            </FormGroup>
                            <p hidden={this.state.isSamePass} className="pass"> 
                                Passwords are different!
                            </p>
                            <p hidden={this.state.isValid} className="pass"> 
                                Email or username is taken, try another!
                            </p>
                            <p className="warning"> 
                                Password must be at least 8 characters and contain at least a number, a special character, a lower and an upper case character!
                            </p>
                            <Button className="btn-lg  btn ml-5 mr-5">Sign Up</Button>
                            <div className='text-center mt-3 mb-3'>
                                <a href="\login" className="linkColor">Log in</a>
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
  }
.pass{
    color: red;
    font-size: 11px;
}
.warning{
    color: #90caf9;
    font-size:10px;
}
.white{
    color: white;
}
.linkColor{
    color: #90caf9;
}
.btn {
    background: #64b5f6;
}
`;





