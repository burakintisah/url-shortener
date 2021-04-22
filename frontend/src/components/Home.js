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
        customUrl: "",
        isCustom: false,
    }

    handleSubmit = async event => {
        event.preventDefault();
        try {
            const options = {
                headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                }
              };
              var data = { long_url: this.state.longUrl, user_id: this.props.auth.user.attributes.sub}
              axios.post('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create', data, options).then(res => {
               // var myJSON = JSON.stringify(res.data.body);
              console.log("RES data:",JSON.parse(res.data.body).short_url);
                
                this.setState({shortUrl: JSON.parse(res.data.body).short_url});   
            });
        }
        catch(error) {
            //console.log(error.message);
        }
    };

    handleSubmitCustom = async event => {
        event.preventDefault();
        try {
            const options = {
                headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                }
              };
              var data = { long_url: this.state.longUrl, user_id: this.props.auth.user.attributes.sub, custom_url: this.state.customUrl}
  //            axios.post('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create', data, options).then(res => {
//                this.setState({shortUrl: res.data.short_url});   
     //        });
        }
        catch(error) {
            //console.log(error.message);
        }
    };

    handleCustom = event =>{
        this.setState({isCustom:true});
    }

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

        return (
            <div  >
                <HomeContainer>
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
                            
                    </Form>
                    <Form className="home-form bk" hidden={!this.state.isCustom} onSubmit={this.handleSubmitCustom}>                            
                            <h6 hidden={!this.state.isCustom}> Enter a custom link:</h6>
                            <FormGroup className="ml-5 mr-5">
                                <Row>
                                    <Col sm="2"></Col>
                                    <Col sm="8"><Input  className=""
                                        type="text" 
                                        id="customUrl"
                                        placeholder="Custom Link"  
                                        value={this.state.customUrl}
                                        onChange={this.onInputChange} /></Col>
                                    <Col sm="2"><Button className="btn-md mr-5">Create Custom Link</Button></Col>
                                </Row>                                
                            </FormGroup>                            
                    </Form>
                    <Row>
                        <Col sm="2"></Col>
                        <Col sm="8"> <h6 hidden={this.state.shortUrl === ""}>Shortened URL:</h6> {" " + this.state.shortUrl} </Col>
                        <Col sm="2"> <Button className="btn-md mr-5" hidden = {this.state.isCustom} onClick={this.handleCustom}> Create Custom Link</Button> </Col>
                    </Row>
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
    margin-top:40px;
  }
  .home2-form{
    width: 100%;
    max-width: 1800px;
    margin: auto;
    height: 50px;
    margin-top: 30px;
  }
`;
