import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
      </header>
      <useAuthenticator />
    </div>
  );
}

export default withAuthenticator(App);