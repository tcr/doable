import React from 'react'
import classNames from 'classnames';

function classes() {
  return {
    className: classNames.apply(null, arguments)
  };
}

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      title: props.title,
      status: props.status,
    };
  }

  update(e) {
    e.preventDefault();

    console.log(e);
    window.why = e;

    this.setState({
      editing: false,
      title: e.target['title'].value,
      status: e.target['status'].value,
    });

    this.props.onUpdate({
      title: e.target['title'].value,
      status: e.target['status'].value,
    });
  }

  select(e) {
    this.setState({
      editing: true,
    });
  }

  render() {
    if (this.state.editing) {
      return (
        <div {...classes('todo')}>
          <form onSubmit={(e) => this.update(e)}>
            <h2>
              <input
                type="text"
                name="title"
                defaultValue={this.state.title}
              />
            </h2>
            <p>
              <textarea
                name="status"
                defaultValue={this.state.status}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    var event = new Event('submit');
                    e.target.form.dispatchEvent(event);
                  }
                }}
              />
            </p>
          </form>
        </div>
      );
    } else {
      return (
        <div {...classes('todo')} onClick={(e) => this.select(e)}>
          <h2>{this.state.title}</h2>
          <p>{this.state.status}</p>
        </div>
      );
    }
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
    };
  }

  componentDidMount() {
    let todos;
    try {
      console.log(window.localStorage['todos'])
      todos = JSON.parse(window.localStorage['todos']);
    } catch (e) {
      todos = [
        {
          title: 'Cool',
          status: 'body',
        },
        {
          title: 'Cool',
          status: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fringilla, erat quis pretium sollicitudin, magna est placerat sapien, vel mattis lorem quam in mauris. Curabitur ornare pharetra ipsum eget tristique. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam euismod ex a neque auctor, sit amet convallis justo bibendum. Phasellus venenatis ut tellus in ullamcorper. Praesent tincidunt, enim sagittis pharetra ornare, diam metus feugiat enim, luctus posuere erat erat sed neque. Nulla facilisi. Fusce fermentum nunc egestas viverra pharetra. Aenean at imperdiet ipsum, vitae aliquet nulla. Phasellus at nulla eu odio porttitor mattis ac et neque. Sed a fringilla ex. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut luctus neque non leo auctor auctor.',
        },
      ];
    }

    this.setState({
      todos
    })
  }

  updateChild(idx, value) {
    let todos = this.state.todos.slice();
    todos.splice(idx, 1);
    todos.unshift(value);

    this.setState({
      todos: todos,
    });

    this.save(todos);
  }

  remove() {
    let todos = this.state.todos.slice();
    todos.splice(todos.length - 1, 1);

    this.setState({
      todos: todos,
    });

    this.save(todos);
  }

  create() {
    let todos = this.state.todos.slice();
    todos.unshift({
      title: 'New Todo',
      status: 'What is your status?',
    });

    this.setState({
      todos: todos,
    });

    this.save(todos);
  }

  save(todos) {
    window.localStorage['todos'] = JSON.stringify(todos);
  }

  render() {
    let todos = this.state.todos
      .map((props, i) => <Todo
        {...props}
        key={Math.random()}
        onUpdate={(value) => this.updateChild(i, value)}
      />);
    while (todos.length % 3 != 0) {
      todos.push(<div />);
    }

    return (
      <div>
        <div id="header">
          <span id="logo">Doable</span>
          <button id="new" onClick={() => this.create()}>+</button>
        </div>
        <div {...classes('todo-list')}>
          {todos}
        </div>
      </div>
    );
  }
}

export default () => (
  <div>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />

    <TodoList />

    <style jsx global>{`
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: "Open Sans", sans-serif;
        background: #ccc;
      }

      #header {
        color: white;
        background: #777;
        padding: 5px 10px;
        line-height: 30px;
        height: 40px;
        box-sizing: border-box;
      }

      #logo {
        display: inline-block;
        margin-right: 30px;
      }

      #new {
        width: 30px;
        height: 30px;
        font-weight: bold;
        color: #bbb;
        background: #888;
        border: none;
        font-size: 20px;
        line-height: 10px;
        vertical-align: middle;
        cursor: pointer;
      }

      .todo-list {
         display: flex;
         justify-content: space-around;
         flex-direction: row;
         flex-wrap: wrap;
         align-items: flex-start;
         margin-top: 20px;
      }

      .todo-list > * {
        width: 32%;
      }

      .todo {
        border: 1px solid #aaa;
        box-sizing: border-box;
        padding: 0 15px;
        margin-bottom: 20px;
        background: #fafafa;
      }

      .todo input {
        font: inherit;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ddd;
      }

      .todo textarea {
        width: 100%;
        box-sizing: border-box;
        height: 5em;
        font: inherit;
        display: block;
        border: 1px solid #ccc;
      }
    `}</style>
  </div>
)
