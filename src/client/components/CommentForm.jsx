import React from 'react';

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
