var docID = document.getElementById('app');

var firebaseUrl = "https://smsproject.firebaseio.com/";

var converter = new Showdown.converter();

var ref = new Firebase("https://smsproject.firebaseio.com");

var AppWrapper = React.createClass({
  render: function(){
    return(
      <div className="container-fluid">
      <h1>Welcome To My App</h1>
      <RegistrationBox />
      <LoginBox />
      <CommentBox />
      </div>
    );
  }
});

var LoginBox = React.createClass({
  mixins: [ReactFireMixin],

  handleLoginSubmit: function(registration) {
    this.firebaseRefs["data"]
  },

  getInitialState: function() {
    return {
      data :[]
    };
  },

  render: function() {
    return (
      <div className="col-sm-6">
      <h3>Login System</h3>
      <LoginForm onLoginSubmit={this.handleLoginSubmit} />
      </div>
    );
  }
});

var LoginForm = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();

    var email = this.refs.email.value.trim();
    var password = this.refs.password.value.trim();
    this.props.onLoginSubmit({email: email, password: password});
    this.refs.email.value = '';
    this.refs.password.value = '';

    ref.authWithPassword({
      email    : email,
      password : password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  },

  render: function() {
    return (
      <div className="">
      <form className="" onSubmit={this.handleSubmit}>
      <input className="" type="text" placeholder="email" ref="email" />
      <input className="" type="password" placeholder="password" ref="password" />
      <input className="btn btn-primary" type="submit" value="Login" />
      </form>
      </div>
    );
  }
});

var RegistrationBox = React.createClass({
  mixins: [ReactFireMixin],

  handleRegistrationSubmit: function(registration) {

    this.firebaseRefs["data"];
  },

  getInitialState: function() {
    return {
      data :[]
    };
  },

  render: function() {
    return (
      <div className="col-sm-6">
      <h3>Registration System</h3>
      <RegistrationForm onRegitstrationSubmit={this.handleRegistrationSubmit} />
      </div>
    );
  }
});

var RegistrationForm = React.createClass({

  handleSubmit: function(event) {
    event.preventDefault();

    var email = this.refs.email.value.trim();
    var password = this.refs.password.value.trim();
    this.props.onRegitstrationSubmit({email: email, password: password});
    this.refs.email.value = '';
    this.refs.password.value = '';

    ref.createUser({
      email    : email,
      password : password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });
  },

  render: function() {
    return (
      <div className="">
      <form className="" onSubmit={this.handleSubmit}>
      <input className="" type="text" placeholder="email" ref="email" />
      <input className="" type="password" placeholder="password" ref="password" />
      <input className="btn btn-success" type="submit" value="Register" />
      </form>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  mixins: [ReactFireMixin],

  handleCommentSubmit: function(comment) {
    // Here we push the update out to Firebase and let ReactFire update this.state.data
    this.firebaseRefs["data"].push(comment);
  },

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseUrl + "comment"), "data");
  },

  render: function() {
    return (
      <div className="col-sm-12">
      <h1>Comment System</h1>
      <CommentForm  onCommentSubmit={this.handleCommentSubmit} />
      <CommentList data={this.state.data} />
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },

  render: function() {
    return (
      <div className="form-group col-sm-12">
      <form className="form-group col-sm-12" onSubmit={this.handleSubmit}>
      <input className="form-control col-sm-5" type="text" placeholder="Who are you?" ref="author" />
      <input className="form-control col-sm-5" type="text" placeholder="Got something to say?" ref="text" />
      <input className="form-control btn btn-primary col-sm-10" type="submit" value="Post" />
      </form>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
    });

    return <div className="commentList">{commentNodes}</div>;
  }
});

var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comments col-sm-8">
      <h2 className="commentAuthor">{this.props.author}</h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

ReactDOM.render(
  <AppWrapper className="col-sm-12" />, docID
);
