let RecipeDisplay = React.createClass({

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
