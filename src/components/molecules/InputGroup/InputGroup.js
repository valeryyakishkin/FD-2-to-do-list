import { Component } from "../../../core";
import "../../atoms/Spinner/Spinner";

export class InputGroup extends Component {
  // constructor() {
  //     super();
  //     this.state = {
  //         inputValue: '',
  //         isLoading: false,
  //         isError: false,
  //         textError: '',
  //     };
  // }

  // onSave () {
  //     if(this.state.inputValue) {
  //         this.setState((state) => {
  //             return {
  //                 ...state,
  //                 isLoading: true,
  //             }
  //         });
  //         todoList.createTask({
  //             title: this.state.inputValue,
  //             isCompleted: false,
  //         }).then(() => {
  //             // throw new Error('Save is not available');
  //             this.setState((state) => {
  //                 return {
  //                     ...state,
  //                     inputValue: '',
  //                 }
  //             })
  //         })
  //         .catch((error) => {
  //             this.setState((state) => {
  //                 return {
  //                     ...state,
  //                     isError: true,
  //                     textError: error.message,
  //                 }
  //             })
  //         })
  //         .finally(() => {
  //             this.setState(state => {
  //                 return {
  //                     ...state,
  //                     isLoading: false,
  //                 }
  //             })
  //         })
  //     }
  // }

  // onInput(evt) {
  //     this.setState((state) => {
  //         return {
  //             ...state,
  //             inputValue: evt.detail.value,
  //         }
  //     });
  // }

  // componentDidMount() {
  //     this.addEventListener('save-task', this.onSave);
  //     this.addEventListener('custom-input', this.onInput);
  // }

  onLoading() {
    return `
        <div 
            class='d-flex justify-content-center position-absolute' 
            style='z-index: 1; position: fixed; background: #000; opacity: .5; top: 0; bottom: 0; right: 0; left: 0; display: flex; align-items: center;'
        >
            <my-spinner></my-spinner>
        </div>
    `;
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const task = {};
    const data = new FormData(evt.target);
    if (this.props.taskid) {
      data.append("id", this.props.taskid);
    }
    data.forEach((value, key) => {
      task[key] = value;
    });
    this.dispatch(this.props.type, task);
  };

  componentDidMount() {
    this.addEventListener("submit", this.onSubmit);
  }

  componentWillUnmount() {
    this.removeEventListener("submit", this.onSubmit);
  }

  static get observedAttributes() {
    return ["type", "value", "isshowcancelbutton", "taskid"];
  }

  render() {
    return `
        ${this.state.isLoading ? this.onLoading() : ""}
        <form class="input-group mb-3">
            <input 
                name="title"
                type="text" 
                class="form-control" 
                placeholder="Add a new task"
                value="${this.props.value ?? ''}"
            >
            <button type="submit" class="btn btn-outline-primary">Save</button>
            ${
              this.props.isshowcancelbutton
                ? `<button type="button" class="btn btn-outline-secondary cancel-action">Cancel</button>`
                : ""
            }
            </form>
        ${
          this.state.isError
            ? `<div style="color: red;">${this.state.textError}</div>`
            : ""
        }
        `;
  }
}

customElements.define("my-input-group", InputGroup);
