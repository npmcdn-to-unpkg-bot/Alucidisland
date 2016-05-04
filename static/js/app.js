var docID = document.getElementById('app');

var firebaseUrl = "https://smsproject.firebaseio.com/";

var converter = new Showdown.converter();


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


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
    });

    return <div className="commentList">{commentNodes}</div>;
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
    this.bindAsArray(new Firebase(firebaseUrl + "commentBox"), "data");
  },

  render: function() {
    return (
      <div className="container-fluid">
      <h1>Comment System</h1>
      <CommentForm  onCommentSubmit={this.handleCommentSubmit} />
      <CommentList data={this.state.data} />
      </div>
    );
  }
});




ReactDOM.render(
  <CommentBox className="col-sm-12" />, docID
);