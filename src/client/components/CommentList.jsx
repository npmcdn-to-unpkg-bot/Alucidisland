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
