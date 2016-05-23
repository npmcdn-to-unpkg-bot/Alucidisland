import React from 'react';

import RecipeDisplay from './RecipeDisplay';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import CommentBox from './CommentBox';

const AppWrapper = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      authenticated: false,
      user: null,
    }
  },

  componentDidMount() {
    let self = this;

    this.firebaseRef = new Firebase("https://smsproject.firebaseio.com");
    let authData = this.firebaseRef.getAuth();

    if (authData) {
      this.login(authData.uid);
    }
  },


  render() {
    console.log(this.state.user);
    return (
      <div className="container-fluid">
      {this.state.authenticated && (
        <a
        className="btn btn-info logout"
        href="#" onClick={this.logout}
        role="button"
        >
        <i className="glyphicon glyphicon-user"></i>
        &nbsp;
        Logout
        </a>
      )}

      <h1>Welcome To My App</h1>

      <RecipeDisplay source="https://api2.bigoven.com/recipes/random?api_key=dvx0k0O07jpZ1583Ba0gsaIeGlo3b1jY"/>

      {!this.state.authenticated && (
        <div className="row jumbotron">

        <LoginForm addUser={this.addUser} login={this.login} />
        <RegistrationForm addUser={this.addUser} />
        </div>
      )}

      <CommentBox authenticated={this.state.authenticated} user={this.state.user} />
      </div>
    );
  },


  addUser(authData) {
    let userRef = this.firebaseRef.child('users').child(authData.uid);
    userRef.set({
      uid: authData.uid,
      email: authData.password.email,
      avatar: authData.password.profileImageURL,
    });
  },

  login(uid) {
    let self = this;
    let userRef = this.firebaseRef.child('users').child(uid);
    userRef.once('value', snap => {
      self.setState({
        authenticated: true,
        user: snap.val(),
      });
    });
  },

  logout(e) {
    e.preventDefault();
    this.firebaseRef.unauth();
    this.setState({
      authenticated: false,
      user: null,
    });
  }
});

export default AppWrapper;
