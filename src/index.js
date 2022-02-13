import React from 'react';
import ReactDOM from 'react-dom';
import './Convertor.css';
import Convertor from './Convertor';



function App(){
  return (
    <div className="App">
      <Convertor/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Convertor/> , rootElement);
