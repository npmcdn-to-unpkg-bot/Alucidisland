import React from 'react';

let RegistrationForm = React.createClass({
  getInitialState() {
    return {
      email: '',
      password: '',
    };
  },

  handleSubmit: function(e) {
    e.preventDefault();

    ref.createUser({
      email    : this.state.email,
      password : this.state.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });
  },

  render() {
    return (
      <div className="col-sm-6">
      <h3>Register</h3>
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
      <input
      className="form-control"
      onChange={e => this.onEmailChange(e.target.value)}
      placeholder="Email"
      type="text"
      />
      </div>

      <div className="form-group">
      <input
      className="form-control"
      onChange={e => this.onPasswordChange(e.target.value)}
      placeholder="Password"
      type="password"
      />
      </div>

      <div className="form-group">
      <input className="btn btn-success form-control" type="submit" value="Register" />
      </div>
      </form>
      </div>
    );
  },

  onEmailChange(email) {
    this.setState({ email });
  },

  onPasswordChange(password) {
    this.setState({ password });
  },
});
