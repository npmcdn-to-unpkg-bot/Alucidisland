let LoginForm = React.createClass({
  getInitialState() {
    return {
      email: '',
      password: '',
    };
  },

  render: function() {
    return (
      <div className="col-sm-6">
      <h3>Login</h3>

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
      <input className="btn btn-success form-control" type="submit" value="Login" />
      </div>
      </form>
      </div>
    );
  },

  handleSubmit(e) {
    e.preventDefault();
    let ref = new Firebase("https://smsproject.firebaseio.com");
    ref.authWithPassword({
      email: this.state.email,
      password: this.state.password,
    }, (err, authData) => {
      if (err) {
        console.log('Error authenticating!', err);
      } else {
        this.props.addUser(authData);
        this.props.login(authData.uid);
      }
    });
  },

  onEmailChange(email) {
    this.setState({ email });
  },

  onPasswordChange(password) {
    this.setState({ password });
  },
});
