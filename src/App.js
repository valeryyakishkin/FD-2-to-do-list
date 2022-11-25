import { Component } from './core';
import './components/molecules/InputGroup/InputGroup';
import './components/molecules/Task/Task';
import './components/atoms/Spinner/Spinner';
import { todoList } from './services/todoList/TodoList';

export class App extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      isError: false,
      textError: '',
      isLoading: false,
    }
  }

  onLoading() {
    this.setState((state) => {
      return {
        ...state,
        isLoading: true,
      }
    })
  }

  showPreloader() {
    return ` 
      <div 
        class='d-flex justify-content-center position-absolute' 
        style='z-index: 1; position: fixed; background: #000; opacity: .5; top: 0; bottom: 0; right: 0; left: 0; display: flex; align-items: center;'
      >
        <my-spinner></my-spinner>
      </div>
      `
  }

  getTasks() {
    this.onLoading();
    todoList.getTasks()
      .then((data) => {
        // throw new Error('Read is not available');
        this.setState((state) => {
          return {
            ...state,
            tasks: data,
          };
        });
      })
      .catch((error) => {
        this.setState(state => {
          return {
            ...state,
            isError: true,
            textError: error.message,
          };
        });
      })
      .finally(() => {
        this.setState(state => {
          return {
            ...state,
            isLoading: false,
          }
        })
      });
  }

  saveTask = (evt) => {
    todoList.createTask({ ...evt.detail, isCompleted: false })
      .then(() => {
        this.getTasks();
      })
  }

  deleteTask = (id) => {
    todoList.deleteTask(id)
      .then(() => {
        this.getTasks();
      })
  }

  onClick = (evt) => {
    const target = evt.target;
    if (target.closest('.delete-action')) {
      const data = target.dataset;
      this.deleteTask(data.id);
    }
  }

  updateTask = ({ detail }) => {
    this.onLoading();
    todoList.updateTask(detail.id, { title: detail.title, isCompleted: false })
      .then(() => {
        this.getTasks();
      });
  }

  componentDidMount() {
    this.setState(state => {
      return {
        ...state,
        isLoading: true,
      };
    });
    this.getTasks();
    this.addEventListener('save-task', this.saveTask);
    this.addEventListener('click', this.onClick);
    this.addEventListener("edit-task", this.updateTask);
  }

  componentWillUnmount() {
    this.removeEventListener('save-task', this.saveTask);
    this.removeEventListener('click', this.onClick);
    this.removeEventListener("edit-task", this.updateTask);
  }

  render() {
    return `
          ${this.state.isLoading ? this.showPreloader() : ''}
          <div class='container mt-5'>
            <my-input-group type="save-task"></my-input-group>
          </div>
          <ul class="list-group">
            ${this.state.isError ? `<div style='color: red;'>${this.state.textError}</div>` : ''}
            ${this.state.tasks
        .map((item) => `
              <my-task 
                id="${item.id}" 
                title="${item.title}" 
                iscompleted="${item.isCompleted}"
                ></my-task>
            `).join(' ')}
          </ul>
        `;

  }
}

customElements.define('my-app', App);

{/* <ul class="list-group">
  <li class="list-group-item">
    <div class="form-check d-flex justify-content-between align-items-center">
      <div>
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            Default checkbox
          </label>
        </div>
        <div class='d-flex'>
          <my-button content="Delete" classname="btn btn-danger btn-sm"></my-button>
          <my-button content="Update" classname="btn btn-primary btn-sm"></my-button>
        </div>
    </div>
  </li>
</ul> */}
