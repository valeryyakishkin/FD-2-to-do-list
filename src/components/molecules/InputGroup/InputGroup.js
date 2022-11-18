import { Component } from "../../../core";
import { todoList } from "../../../services/todoList/TodoList";
import '../../atoms/Button/Button';
import '../../atoms/Input/Input';
import '../../atoms/Spinner/Spinner';

export class InputGroup extends Component {

    constructor() {
        super();
        this.state = {
            inputValue: '',
            isLoading: false,
            isError: false,
            textError: '',
        };
    }

    onSave () {
        if(this.state.inputValue) {
            this.setState((state) => {
                return {
                    ...state,
                    isLoading: true,
                }
            });
            todoList.createTask({
                title: this.state.inputValue,
                isCompleted: false, 
            }).then(() => {
                // throw new Error('Save is not available');
                this.setState((state) => {
                    return {
                        ...state,
                        inputValue: '',
                        isLoading: false,
                    }
                })
            })
            .catch((error) => {
                this.setState((state) => {
                    return {
                        ...state,
                        isError: true,
                        textError: error.message,
                    }
                })
            })
            .finally(() => {
                this.setState(state => {
                    return {
                        ...state,
                        isLoading: false,
                    }
                })
            })
        }
    }

    onInput(evt) {
        this.setState((state) => {
            return {
                ...state,
                inputValue: evt.detail.value,
            }
        });
    }

    componentDidMount() {
        this.addEventListener('save-task', this.onSave);
        this.addEventListener('custom-input', this.onInput);
    }

    render() {
        return `
        ${this.state.isLoading ? `
            <div 
                class='d-flex justify-content-center position-absolute' 
                style='z-index: 1; position: fixed; background: #000; opacity: .5; top: 0; bottom: 0; right: 0; left: 0; display: flex; align-items: center;'
            >
                <my-spinner></my-spinner>
            </div>
        ` : ''}
        <div class="input-group mb-3">
            <my-input value="${this.state.inputValue}" placeholder="Add a new task" type="text"></my-input>
            <my-button eventtype="save-task" content="Save" classname="btn btn-outline-primary"></my-button>
        </div>
        ${this.state.isError ? `<div style='color: red;'>${this.state.textError}</div>` : ''}
        `;
    }
}

customElements.define('my-input-group', InputGroup);
