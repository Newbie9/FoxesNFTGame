import React, { useEffect, useState, useRef } from "react";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Navbar from "./componenets/Navbar";
import Home from "./componenets/Home";
import Game from "./componenets/Game";
import Footer from "./componenets/Footer";


import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";

function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyA_J0kX2L1t5pSrX082D67B9UYyPDKSmvo",
    authDomain: "avaxfoxes-deneme.firebaseapp.com",
    projectId: "avaxfoxes-deneme",
    storageBucket: "avaxfoxes-deneme.appspot.com",
    messagingSenderId: "982796810661",
    appId: "1:982796810661:web:4c0b37281ed9b3446b104c",
    measurementId: "G-KB4G6YE0CS"
};
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return (
    <div>
      <Router>
      <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/game' exact component={Game} />
        </Switch>
        <Footer />
      </Router> 
    </div>
  );
}

export default App;
