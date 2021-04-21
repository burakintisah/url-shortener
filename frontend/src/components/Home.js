//import { button } from '@aws-amplify/ui';
import React, { Component } from 'react';
import axios from 'axios';
import {Col, Row } from 'reactstrap';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
class Home extends Component {
    state = {
        longUrl: "",
        shortUrl: "",
    }

    handleSubmit = async event => {
        event.preventDefault();
        try {
            const options = {
                headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                }
              };
              var data = { long_url: this.state.longUrl}
              axios.post('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create', data, options).then(res => {
                console.log("RES data:",res) 
                this.setState({shortUrl: res.data.short_url});   
            });
        }
        catch(error) {
            console.log(error.message);
        }
    };

    onInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
        document.getElementById(event.target.id);
    };

    render () {
        if(!this.props.auth.isAuthenticated || !this.props.auth.user)
        {
            return <Redirect push to={'/login'} />
        }

        console.log("in home : "+this.props.auth.user.signInUserSession.idToken.jwtToken);
        return (
            <div  >
                <HomeContainer>
                    <Form className="home3-form bk"></Form>
                    <Form className="home2-form bk">
                        <Row>
                            <Col sm="3"><h1>URL Shortener</h1></Col>
                            <Col sm="8"></Col>
                            <Col sm="1">
                                <Row>Hi {this.props.auth.user.username + ","}</Row>
                                <Row><div><a href="/login" > Log Out</a></div></Row>
                            </Col>
                            
                        </Row>
                    </Form>
                    <Form className="home2-form bk"></Form>
                    <Form className="home-form bk" onSubmit={this.handleSubmit}>
                            <h6> Enter a link:</h6>
                            <FormGroup className="mt-2 ml-5 mr-5">
                                <Row>
                                    <Col sm="2"></Col>
                                    <Col sm="8"><Input  className=""
                                        type="text" 
                                        id="longUrl"
                                        placeholder="Link"  
                                        value={this.state.longUrl}
                                        onChange={this.onInputChange} /></Col>
                                    <Col sm="2"><Button className="btn-md mr-5">Shorten</Button></Col>
                                </Row>
                                
                            </FormGroup>
                            
                            <h6 hidden={this.state.shortUrl === ""}>Shortened URL:</h6> {" " + this.state.shortUrl}
                            
                        </Form>
                </HomeContainer>
            </div>
        )
    }
}
export default Home;

const HomeContainer = styled.div`
.home-form{
    width: 100%;
    max-width: 1800px;
    margin: auto;
    height: 700px;
  }
  .home2-form{
    width: 100%;
    max-width: 1800px;
    margin: auto;
    height: 50px;
  }
  .home3-form{
    width: 100%;
    max-width: 1800px;
    margin: auto;
    height: 20px;
  }
`;
