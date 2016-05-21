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
