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
