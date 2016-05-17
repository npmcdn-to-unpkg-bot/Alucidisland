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
      <form className="form-group" onSubmit={this.handleSubmit}>
      <input className="form-control" type="text" placeholder="email" ref="email" />
      <input className="form-control" type="password" placeholder="password" ref="password" />
      <input className="btn btn-success form-control" type="submit" value="Login" />
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
      <form className="form-group" onSubmit={this.handleSubmit}>
      <input className="form-control" type="text" placeholder="email" ref="email" />
      <input className="form-control" type="password" placeholder="password" ref="password" />
      <input className="btn btn-success form-control" type="submit" value="Register" />
      </form>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function(){
    return{
      comment: {},
      isEdit: 0,
      comments: []
    }
  },

  componentWillMount: function(){
    this.firebaseRef = new Firebase ('https://smsproject.firebaseio.com/comments/')
    this.bindAsArray(this.firebaseRef, 'comments')
  },

  render: function(){
    return(
      <div>
      <h1>Comment System</h1>
      <CommentForm
      {...this.state}
      changeText={this.handleChangeText}
      onCommentUpdate={this.handleCommentUpdate}
      onCommentAdd={this.handleCommentAdd} />
      <CommentList
      {...this.state}
      editComment={this.handleCommentEdit}
      deleteComment={this.handleCommentDelete} />
      </div>
    )
  },

  handleCommentAdd: function(text){
    var newComment = {
      id: this.state.comments.length + 1,
      text: text
    }

    this.firebaseRef.push(newComment);
    this.setState({comment: {}, comments: this.state.comments.concat(newComment)});
  },

  handleCommentDelete: function(comment){
    var comments = this.state.comments

    for(var i = 0; i < comment.length; i++){
      if(comment[i].id == comment.id){
        comment.splice(i, 1);
      }
    }

    this.firebaseRef.child(comment['.key']).remove()
    this.setState({comments: comments});
  },

  handleCommentUpdate: function(comment){
    var comments = this.state.comments

    for(var i = 0; i < comment.length; i++){
      if(comment[i].id == comment.id){
        comment.splice(i, 1);
      }
    }

    this.firebaseRef.child(comment['.key']).update({text: comment.text})
    this.setState({comment: {}, comments: comments});

  },

  handleCommentEdit: function(comment){
    this.setState({
      comment: comment,
      isEdit: true
    });
  },

  handleChangeText: function(text){
    this.state.comment.text = text
    this.setState({comment: this.state.comment});
  }
});

var CommentForm = React.createClass({
  render: function(){
    return(
      <div>
      <form onSubmit={this.onSubmit}>
      <div className="form-group">
      <p>
      <label>Comment Text</label>
      <br />
      <input className="form-control" type="text" value={this.props.comment.text} ref="text" onChange={this.onChange} />
      </p>
      <button onClick={this.onSubmit} className="btn btn-success form-control" type="submit"> 
      Submit
      </button>
      </div>
      </form>
      </div>
    )
  },

  onChange: function(e){
    this.props.changeText(e.target.value)
  },

  onSubmit: function(e){
    e.preventDefault();
    var text = this.refs.text.value.trim();

    if(!text){
      alert("Please Enter a comment");
      return;
    }

    this.props.comment.text = text;
    console.log(this.props.isEdit);
    if(this.props.isEdit){
      this.props.onCommentUpdate(this.props.comment);
    } else {
      this.props.onCommentAdd(this.props.comment.text);
    }

    this.refs.text.value = '';
  }
});

var CommentList = React.createClass({
  render: function(){
    return(
      <ul className="list-group">
      {
        this.props.comments.map(comment => {
          return <li className="list-group-item well" comment={comment} key={comment.id}>
          <button onClick={this.onDelete.bind(this, comment)} className="btn btn-lg btn-danger glyphicon glyphicon-remove" type="button"></button> <button onClick={this.editComment.bind(this, comment)} className="btn btn-lg btn-warning glyphicon glyphicon-pencil" type="button"> </button> {comment.text}</li>
        })
      }
      </ul>
    )
  },

  onDelete: function(comment){
    this.props.deleteComment(comment);
  },
  editComment: function(comment){
    this.props.editComment(comment);
  }

});

ReactDOM.render(
  <AppWrapper className="col-sm-12" />, docID
);
