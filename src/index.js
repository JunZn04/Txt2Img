import React from 'react';
import ReactDOM from 'react-dom/client';
import Imgenration from './ImgGeneration';
import Txt2Img from './Txt2Img';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Imgenration/> */}
    <Txt2Img/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
