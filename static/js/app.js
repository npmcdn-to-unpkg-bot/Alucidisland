var docID = document.getElementById('app');

var firebaseUrl = "https://smsproject.firebaseio.com/";

var converter = new Showdown.converter();

var ref = new Firebase("https://smsproject.firebaseio.com");

var AppWrapper = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      authenticated: false,
      user: null,
    }
  },

  componentDidMount() {
    var self = this;

    this.firebaseRef = new Firebase("https://smsproject.firebaseio.com");
    var authData = this.firebaseRef.getAuth();

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
    var userRef = this.firebaseRef.child('users').child(authData.uid);
    userRef.set({
      uid: authData.uid,
      email: authData.password.email,
      avatar: authData.password.profileImageURL,
    });
  },

  login(uid) {
    var self = this;
    var userRef = this.firebaseRef.child('users').child(uid);
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

var LoginForm = React.createClass({
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
    var ref = new Firebase("https://smsproject.firebaseio.com");
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

var RegistrationForm = React.createClass({
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

var RecipeDisplay = React.createClass({

  getInitialState: function() {
    return {
      title: '',
      instructions: ''
    };
  },

  componentDidMount: function() {

    this.serverRequest = $.get(this.props.source, function (data) {
      this.setState({
        title: data.Title,
        instructions: data.Instructions,
        image: data.Photo
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div>
      {this.state.image}
      <h3>{this.state.title}</h3>
      <p>{this.state.instructions}</p>
      </div>
    );
  }
});


var CommentBox = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function(){
    return {
      comments: [],
    };
  },

  componentWillMount: function(){
    var rootRef = new Firebase('https://smsproject.firebaseio.com');

    var commentsRef = rootRef.child('comments');
    this.bindAsArray(commentsRef, 'comments');
  },

  render: function(){
    var comments = this.state.comments;

    return (
      <div>
      <h1>Comment System</h1>

      {this.props.authenticated
        ? <CommentForm onCommentAdd={this.handleCommentAdd} />
        : <p>Please login to comment.</p>
      }

      <CommentList
      comments={this.state.comments}
      onCommentDelete={this.handleCommentDelete}
      onCommentUpdate={this.handleCommentUpdate}
      user={this.props.user}
      />
      </div>
    );
  },

  handleCommentAdd(text) {
    this.firebaseRefs['comments'].push({ text: text, user: this.props.user.uid });
  },

  handleCommentUpdate(key, text) {
    this.firebaseRefs['comments'].child(key).update({ text: text });
  },

  handleCommentDelete(key) {
    this.firebaseRefs['comments'].child(key).remove();
  },
});

var CommentForm = React.createClass({
  getInitialState() {
    return {
      text: "",
    };
  },

  render: function() {
    var text = this.state.text;

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
      <label>Comment Text</label>
      <input
      className="form-control"
      onChange={e => this.onTextChange(e.target.value)}
      type="text"
      value={text}
      />
      </div>

      <div className="form-group">
      <button
      className="btn btn-success form-control"
      onClick={this.handleSubmit}
      type="submit"
      >
      Submit
      </button>
      </div>
      </form>
      </div>
    )
  },

  handleSubmit(event) {
    event.preventDefault();

    var text = this.state.text;
    if (text && text.trim().length !== 0) {
      this.props.onCommentAdd(text.trim());
    }
  },

  onTextChange(text) {
    this.setState({ text: text });
  }
});

var CommentList = React.createClass({
  render() {
    return (
      <ul className="list-group">
      {this.props.comments.map(comment => {
        return <Comment
        comment={comment}
        onCommentDelete={this.props.onCommentDelete}
        onCommentUpdate={this.props.onCommentUpdate}
        key={comment['.key']}
        user={this.props.user}
        />;
      })}
      </ul>
    )
  }
});

var Comment = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      editing: false,
      text: this.props.comment.text || "",
      user: null,
    };
  },

  componentDidMount() {
    var userRef = new Firebase(`https://smsproject.firebaseio.com/users/${this.props.comment.user}`);
    this.bindAsObject(userRef, 'user')
  },

  render() {
    var comment = this.props.comment;

    if (!this.state.user || !this.props.user) { return null; }

    if (this.state.editing) {
      return (
        <li className="list-group-item well">
        <a href="#" className='pull-right' onClick={this.toggleEdit} role="button">
        <i className="glyphicon glyphicon-remove"></i>
        </a>

        <form onSubmit={this.handleSubmit}>
        <div className="form-group">
        <label className="control-label">Editing Comment</label>
        <input
        className="form-control"
        onChange={e => this.onTextChange(e.target.value)}
        type="text"
        value={this.state.text}
        />
        <button
        className="btn btn-success form-control"
        onClick={this.handleSubmit}
        type="submit"
        >
        Update
        </button>
        </div>
        </form>
        </li>
      )
    }

    return (
      <li className="list-group-item well">
      {this.props.user.uid === this.state.user.uid
        ? (
          <div className="btn-group pull-right" role="group" aria-label="Comment Options">
          <button
          className="btn btn-sm btn-info"
          onClick={this.toggleEdit}
          type="button"
          >
          <i className="glyphicon glyphicon-pencil"></i>
          &nbsp;
          Edit
          </button>

          <button
          className="btn btn-sm btn-danger"
          onClick={this.props.onCommentDelete.bind(null, comment['.key'])}
          type="button"
          >
          <i className="glyphicon glyphicon-trash"></i>
          &nbsp;
          Delete
          </button>
          </div>
        )
        : null
      }

      <img src={this.state.user.avatar} className='avatar' />

      <p><strong>{this.state.user.email} wrote:</strong></p>

      <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(comment.text) }} style={{ paddingRight: '155px' }} />
      </li>
    );
  },

  handleSubmit(e) {
    e.preventDefault();

    var text = this.state.text;
    if (text && text.trim().length !== 0) {
      this.props.onCommentUpdate(this.props.comment['.key'], text.trim());
      this.setState({ editing: false });
    }
  },

  onTextChange(text) {
    this.setState({ text: text });
  },

  toggleEdit() {
    this.setState({ editing: !this.state.editing });
  }
});

ReactDOM.render(
  <AppWrapper className="col-sm-12" />, docID
);
