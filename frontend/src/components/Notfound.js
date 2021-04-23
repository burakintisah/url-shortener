import React from 'react';
import styled from 'styled-components';
import {Col, Row } from 'reactstrap';

export default function Notfound() {
  return (
    <div className="container">
        <NotfoundContainer>
            <div className="header">
            </div>
        </NotfoundContainer>
      <NotfoundContainer>
        <div className="not-mid">
            <Row>
                <Col sm="3"></Col>
                <Col sm="4">
                    <Row>
                      <h1>URL SHORTENER</h1>
                    <Col sm="4"></Col>
                    <Col sm="1"> 
                        <Row className="mt-5"><h1>404 </h1></Row>
                        <Row><h3>SORRY!</h3></Row>
                    </Col>
                    </Row>
                    <Row><h6>The Page You're Looking For Was Not Found :(</h6></Row>
                </Col>
                <Col sm="4"></Col>
            </Row>
        </div>
      </NotfoundContainer>
    </div>
  )
}
/*
<div className='text-center'>
                <a href="\login">Log in</a>
            </div>
*/
const NotfoundContainer = styled.div`
.not-mid{
    width: 100%;
    max-width: 600px;
    margin-left: 25px;
    margin: auto;
    height: 100%;
    height:300px;
    margin-bottom:10%;
  }
  .header {
    width: 100%;
    max-width: 600px;
    margin-left: 25px;
    margin: auto;
    height: 100%;
    height:100px;
}
`;




