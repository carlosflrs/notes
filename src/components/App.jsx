import React, { Component, Link } from 'react';
import { Switch, Route } from 'react-router-dom';
import Main from './Main.jsx';
import Signin from './Signin.jsx';
import {
  UserSession,
  AppConfig,
} from 'blockstack';

export default class App extends Component {

  constructor(props) {
  	super(props);
    const appConfig = new AppConfig(['store_write', 'publish_data'])
    const userSession = new UserSession({ appConfig })
    window.userSession = userSession
  }

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    userSession.redirectToSignIn(origin, origin + '/manifest.json');
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div>
        { !userSession.isUserSignedIn() ?
          <Signin handleSignIn={ this.handleSignIn } />
          :
          <Switch>
            <Route
              exact path='/'
                render={
                  routeProps => <Main handleSignOut={ this.handleSignOut} {...routeProps} />
                }
              />
          </Switch>
        }
      </div>
    );
  }

  componentWillMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
