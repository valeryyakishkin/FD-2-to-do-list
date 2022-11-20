import { Component } from './core';
import './components/molecules/InputGroup/InputGroup';
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
      return ` 
      <div 
        class='d-flex justify-content-center position-absolute' 
        style='z-index: 1; position: fixed; background: #000; opacity: .5; top: 0; bottom: 0; right: 0; left: 0; display: flex; align-items: center;'
      >
        <my-spinner></my-spinner>
      </div>
      `
    }

    componentDidMount() {
      this.setState(state => {
        return {
          ...state,
          isLoading: true,
        };
      });
      todoList.getTasks()
      .then((data) => {
        // throw new Error('Read is not available');
        this.setState((state) => {
          return {
            ...state,
            isLoading: false,
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

    render() {
        return `
          ${this.state.isLoading ? this.onLoading() : ''}
          <div class='container mt-5'>
            <my-input-group></my-input-group>
          </div>
          <ul class="list-group">
            ${this.state.isError ? `<div style='color: red;'>${this.state.textError}</div>` : ''}
            ${this.state.tasks.map((item) => `
              <li class="list-group-item">
                <div class="form-check d-flex justify-content-between align-items-center">
                  <div>
                    <input class="form-check-input" type="checkbox" ${item.isCompleted ? 'checked' : ''} id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                      ${item.title}
                    </label>
                  </div>
                  <div class='d-flex'>
                    <my-button content="Delete" classname="btn btn-danger btn-sm"></my-button>
                    <my-button content="Update" classname="btn btn-primary btn-sm"></my-button>
                  </div>
                </div>
              </li>
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
