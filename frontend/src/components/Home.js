//import { button } from '@aws-amplify/ui';
import React, { Component } from 'react';
import axios from 'axios';
import {Col, Row } from 'reactstrap';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import DataTable from 'react-data-table-component';

class Home extends Component {
    state = {
        longUrl: "",
        shortUrl: "",
        customUrl: "",
        isCustom: false,
        isValidCustom: true,
        getLinks:true,
        data: [],
        columns: [{
            name: 'Long URL',
            selector: 'long_url',
            wrap: true,
            },
            {
            name: 'Short Url',
            selector: 'short_url',
            maxWidth: "420px"
            },
            {
                name: 'Hit Count',
                selector: 'hits',
                maxWidth: "20px"
            }
        ],
    }

    componentDidMount() {
        
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
                this.setState({getLinks: true});
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
                  this.setState({shortUrl: res.data.short_url}); 
                  this.setState({getLinks: true});  
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

        if(this.state.getLinks)
        {
            this.setState({getLinks: false});
            try{
                //console.log(this.props.auth.user.signInUserSession.idToken.jwtToken)
                const options = {
                    headers: {'Authorization': this.props.auth.user.signInUserSession.idToken.jwtToken,
                    }
                  };
                axios.get('https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/test/users/' + this.props.auth.user.attributes.sub + '/links', options).then(res => {
                    //console.log(res);                    
                    this.setState({ data: res.data.urls })
                });
            }
            catch{
                console.log("get links error");
            }
        }

        const conditionalRowStyles= [
            {
              when: row => row.is_active,
              style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
                '&:hover': {
                  cursor: 'pointer',
                },
              },
            },
          ];

          const conditionalRowStylesRed= [
            {
              when: row => !row.is_active,
              style: {
                backgroundColor: 'red',
                color: 'white',
              },
            },
          ];

        return (
            <div  >
                <HomeContainer>
                    <Form className="home2-form bk">
                        <Row>
                            <Col sm="3"><h1 className="white">URL Shortener</h1></Col>
                            <Col sm="8"></Col>
                            <Col sm="1">
                                <Row className="white">Hi {this.props.auth.user.username + ","}</Row>
                                <Row><div><a href="/login" className="linkColor" > Log Out</a></div></Row>
                            </Col>
                        </Row>
                    </Form>
                    
                    <Form className="home-form bk" onSubmit={this.handleSubmit}>
                            <p className="white"> Enter a link:</p>
                            <FormGroup className="mt-2 ml-5 mr-5">
                                <Row>
                                    <Col sm="2"></Col>
                                    <Col sm="8"><Input  className=""
                                        type="text" 
                                        id="longUrl"
                                        placeholder="Link"  
                                        value={this.state.longUrl}
                                        onChange={this.onInputChange} /></Col>
                                    <Col sm="2"><Button className="btn-md btn mr-5">Shorten</Button></Col>
                                </Row>                                
                            </FormGroup>
                            
                    </Form>
                    <Form className="home-form bk" hidden={!this.state.isCustom} onSubmit={this.handleSubmitCustom}>                            
                            <p className="white" hidden={!this.state.isCustom}> https://d36euqp7ddsjbp.cloudfront.net/t/ </p>
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
                                    <Col sm="1"><Button className="btn-md btn mr-5">Create Custom Link</Button></Col>
                                </Row>                                
                            </FormGroup>                            
                    </Form>
                    <Row>
                        <Col sm="2"></Col>
                        <Col sm="8"> <p className="white" hidden={this.state.shortUrl === ""}>Shortened URL:  {" " + this.state.shortUrl}  </p> </Col>
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
                            conditionalRowStyles={conditionalRowStyles}
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
    color: #90caf9;
    font-size:12px;
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
