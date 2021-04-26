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
            <h1 className="white">URL SHORTENER</h1>
            <h2 className="white" >404</h2>
            <h5 className="white" >SORRY!</h5>
            <p className="white">The Page You're Looking For Was Not Found :(</p>
            <div className='text-center'>
            <a href="\login" className="linkColor">Log in</a>
        </div>
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

.white{
  color: white;
}
.linkColor{
  color: #90caf9;
}
`;




