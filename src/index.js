import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom';

import App from './components/App.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';

ReactDOM.render((
	<BrowserRouter>
	<App />
	</BrowserRouter>
), document.getElementById('root'));
