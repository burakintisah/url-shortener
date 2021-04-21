import React from 'react';
import styled from 'styled-components';


export default function Welcome() {
  return (
    <div className="container">
      <WelcomeContainer>
        <div className="header">

        </div>
      </WelcomeContainer>
      <WelcomeContainer>
        <div className="welcome-mid">
            <h1>Welcome!</h1>
            <p>You have successfully registered a new account.</p>
            <p>We've sent you an email. Please check email.</p>
        </div>
      </WelcomeContainer>
    </div>
  )
}

const WelcomeContainer = styled.div`
.welcome-mid{
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
    margin-top:10%;  
}
`;




