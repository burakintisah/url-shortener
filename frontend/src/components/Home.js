//import { button } from '@aws-amplify/ui';
import React, { Component } from 'react';
import axios from 'axios';
import {Col, Row } from 'reactstrap';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { MDBDataTableV5 } from 'mdbreact';

class Home extends Component {
    state = {
        longUrl: "",
        shortUrl: "",
        customUrl: "",
        isCustom: false,
        isValidCustom: true,
        data: [],
        columns: [{
            name: 'Long URL',
            selector: 'long_url',
            wrap: true,
            attributes: {
                'aria-controls': 'DataTable',
                'aria-label': 'Name',
              },
            },
            {
            name: 'Short Url',
            selector: 'short_url',
            maxWidth: "420px"
            },
        ],
    }

    componentDidMount() {
        try{
            //console.log(this.props.auth.user.signInUserSession.idToken.jwtToken)
            const options = {
                headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                }
              };
            axios.get('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/users/' + this.props.auth.user.attributes.sub + '/links', options).then(res => {
                this.setState({links: res.data}); 
                this.setState({ data: res.data.urls })
            });
        }
        catch{
            console.log("get links error");
        }
      }

    handleSubmit = async event => {
        event.preventDefault();
        try {
            //console.log(this.props.auth.user.signInUserSession.idToken.jwtToken)
            const options = {
                headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                }
              };
              var data = { long_url: this.state.longUrl}
            axios.post('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create', data, options).then(res => {
                this.setState({shortUrl: res.data.short_url});
            });
            this.componentDidMount();
        }
        catch(error) {
            //console.log(error.message);
        }
    };

    handleSubmitCustom = async event => {
        event.preventDefault();
        if(this.state.customUrl.length >= 6  &&  this.state.customUrl.length <= 8)
        {
            //this.setState({isValidCustom: true});
            try {
                const options = {
                    headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                    }
                  };
                  var data = { long_url: this.state.longUrl, user_id: this.props.auth.user.attributes.sub, custom_url: this.state.customUrl}
                  axios.post('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/create/custom', data, options).then(res => {
                      console.log(res);
                  this.setState({shortUrl: res.data.short_url});   
                });
            }
            catch(error) {
                //console.log(error.message);
            }
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
                                        onChange={this.onInputChange} />
                                        <p className="warning"> 
                                            Custom link length must be between 6 and 8.
                                        </p>    
                                    </Col>
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
                <Row className="mt-5" hidden = {this.state.data.length === 0}>
                        <Col sm="2"></Col>
                        <Col sm="8" >
                            <DataTable className="mb-1 mt-1"
                            title= {'Shortened URLs'}
                            columns={this.state.columns}
                            data={this.state.data}
                            pagination paginationRowsPerPageOptions={[5, 10]}
                           />
                        </Col>
                        <Col sm="2"></Col>
                    </Row>
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
  .warning{
    color: gray;
    font-size:12px;
}
`;
