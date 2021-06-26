import logo from './logo.svg';
import React from 'react';
import './App.css';
import List from './customerList/list'
import '../src/scss/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <List/>
    </div>
  );
}

export default App;
