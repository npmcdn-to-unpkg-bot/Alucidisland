var RecipeBox = React.createClass({
  mixins: [ReactFireMixin],
  commentRef: null,
  recipe: 0,
  getInitialState: function(){
    return {
      recipes: [],
      user: {}
    };
  },

  componentWillMount: function(){
    this.firebaseRef = new Firebase("https://smsproject.firebaseio.com");
    var authData = this.firebaseRef.getAuth();
    this.setState({user: authData});
  },
  componentDidUpdate: function() {
    var rootRef = new Firebase('https://smsproject.firebaseio.com');
    if(this.props.recipe && this.recipe != this.props.recipe) {
      console.log('prop',this.props.recipe)
      this.recipesRef = rootRef.child('recipes').child(this.props.recipe);
      if(this.recipe != 0) {
        this.unbind("recipes");
      }
      this.bindAsArray(this.recipesRef, 'recipes');
      this.recipe = this.props.recipe
    }
  },
  render: function(){
    var recipes = this.state.recipes;

    return (
      <div>
      <h1>Recipe System</h1>

      {this.props.authenticated
        ? <RecipeForm onRecipeAdd={this.handleRecipeAdd} />
        : <p>Please login to recipe.</p>
      }

      <RecipeList
      recipes={this.state.recipes}
      onRecipeDelete={this.handleRecipeDelete}
      onRecipeUpdate={this.handleRecipeUpdate}
      user={this.state.user}
      />
      </div>
    );
  },

  handleRecipeAdd(text) {
    console.log(this);
    this.recipesRef.push({ text: text, user: this.state.user.uid });
  },

  handleRecipeUpdate(key, text) {
    this.recipesRef.child(key).update({ text: text });
  },

  handleRecipeDelete(key) {
    this.recipesRef.child(key).remove();
  },
});

var RecipeForm = React.createClass({
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
      <label>Recipe Text</label>
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
      this.props.onRecipeAdd(text.trim());
    }
  },

  onTextChange(text) {
    this.setState({ text: text });
  }
});

var RecipeList = React.createClass({
  render() {
    return (
      <ul className="list-group">
      {this.props.recipes.map(recipe => {
        return <Recipe
        recipe={recipe}
        onRecipeDelete={this.props.onRecipeDelete}
        onRecipeUpdate={this.props.onRecipeUpdate}
        key={recipe['.key']}
        user={this.props.user}
        />;
      })}
      </ul>
    )
  }
});

var Recipe = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      editing: false,
      text: this.props.recipe.text || "",
      user: null,
    };
  },

  componentDidMount() {
    var userRef = new Firebase(`https://smsproject.firebaseio.com/users/${this.props.recipe.user}`);
    this.bindAsObject(userRef, 'user')
  },

  render() {
    var recipe = this.props.recipe;
    console.log('recipe',recipe)

    if (!this.state.user || !this.props.user) { return null; }

    if (this.state.editing) {
      return (
        <li className="list-group-item well">
        <a href="#" className='pull-right' onClick={this.toggleEdit} role="button">
        <i className="glyphicon glyphicon-remove"></i>
        </a>

        <form onSubmit={this.handleSubmit}>
        <div className="form-group">
        <label className="control-label">Editing Recipe</label>
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
          <div className="btn-group pull-right" role="group" aria-label="Recipe Options">
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
          onClick={this.props.onRecipeDelete.bind(null, recipe['.key'])}
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

      <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(recipe.text) }} style={{ paddingRight: '155px' }} />
      </li>
    );
  },

  handleSubmit(e) {
    e.preventDefault();

    var text = this.state.text;
    if (text && text.trim().length !== 0) {
      this.props.onRecipeUpdate(this.props.recipe['.key'], text.trim());
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
