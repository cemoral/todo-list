import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import TodoItems from "./TodoItems";
import moment from 'moment';
import axios from "axios"
import Constants from "../Constants";

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: [],
            filteredItems: [],
            todoList: [],
            selectedListId: 1
        };


        this.deleteTodoList = this.deleteTodoList.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.setItemCompleted = this.setItemCompleted.bind(this);
        this.createTodoList = this.createTodoList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchItem = this.searchItem.bind(this);
        this.filterItem = this.filterItem.bind(this);
    }

    createTodoList(e) {
        if (this._inputTodoListName.value !== "") {
            axios.post(Constants.Backendpoint + "todoList/create", {
                name: this._inputTodoListName.value
            }, {headers: {"Authorization": Constants.AuthorizationToken}})
                .then((response) => {
                    console.log(response);
                    this.getTodoLists();
                })
                .catch(function (error) {
                    console.log(error);
                });
            this._inputTodoListName.value = "";
        }
        else
            alert('Name cannot be empty');
        e.preventDefault();
    }

    setItemCompleted(id) {
        axios
            .get(Constants.Backendpoint + "todoItems/setCompleted/" + id, {headers: {"Authorization": Constants.AuthorizationToken}})
            .then(response => {
                this.getTodoItems(this.state.selectedListId);
            })
            .catch(error => console.log(error));
    }

    getTodoLists() {
        axios
            .get(Constants.Backendpoint + "todoList", {headers: {"Authorization": Constants.AuthorizationToken}})
            .then(response => {
                // create an array of contacts only with relevant data
                const newLists = response.data.map(c => {
                    return {
                        id: c.id,
                        name: c.name
                    };
                });

                // create a new "State" object without mutating
                // the original State object.
                const newState = Object.assign({}, this.state, {
                    todoList: newLists,
                    selectedListId: newLists[newLists.length - 1].id
                });
                // store the new state object in the component's state
                this.setState(newState);
                this.getTodoItems(this.state.selectedListId);
            })
            .catch(error => console.log(error));

    }

    getTodoItems(id) {
        axios
            .get(Constants.Backendpoint + "todoItems/" + id, {headers: {"Authorization": Constants.AuthorizationToken}})
            .then(response => {
                // create an array of contacts only with relevant data
                const newItems = response.data.map(c => {
                    return {
                        id: c.id,
                        name: c.name,
                        description: c.description,
                        status: c.status,
                        deadline: c.deadline
                    };
                });

                // create a new "State" object without mutating
                // the original State object.
                const newState = Object.assign({}, this.state, {
                    todoItems: newItems
                });
                // store the new state object in the component's state
                this.setState(newState);
                this.searchItem();
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.getTodoLists();
    }

    addItem(e) {
        if (this._inputName.value !== "" && this._inputDescription.value !== "" && this._inputDeadline.value !== "") {
            let newItem = {
                name: this._inputName.value,
                description: this._inputDescription.value,
                status: 0,
                deadline: this._inputDeadline.value
            };
            axios.post(Constants.Backendpoint + "todoItems/add/" + this.state.selectedListId, {
                name: newItem.name,
                description: newItem.description,
                status: newItem.status,
                deadline: new Date(newItem.deadline)
            }, {headers: {"Authorization": Constants.AuthorizationToken}})
                .then((response) => {
                    console.log(response);
                    this.getTodoItems(this.state.selectedListId);
                })
                .catch(function (error) {
                    console.log(error);
                });
            this._inputName.value = this._inputDescription.value = this._inputDeadline.value = "";
        }
        else
            alert('Please fill the blanks');
        e.preventDefault();
    }

    deleteItem(id) {
        let filteredItems = this.state.todoItems.filter(function (item) {
            return (item.id !== id);
        });
        axios
            .get(Constants.Backendpoint + "todoItems/delete/" + id, {headers: {"Authorization": Constants.AuthorizationToken}})
            .then(response => {
            })
            .catch(error => console.log(error));
        this.setState({
            todoItems: filteredItems,
            filteredItems: filteredItems
        });
    }

    deleteTodoList(e) {
        axios
            .get(Constants.Backendpoint + "todoList/delete/" + this.state.selectedListId, {headers: {"Authorization": Constants.AuthorizationToken}})
            .then(response => {
                this.getTodoLists();
            })
            .catch(error => console.log(error));
        e.preventDefault();
    }

    handleChange(event) {
        this.getTodoItems(event.target.value);
        this.setState({selectedListId: event.target.value});
    }

    searchItem(event) {
        if (event === undefined) {
            this.setState({filteredItems: this.state.todoItems});
        }
        else {
            let updatedList = this.state.todoItems;
            updatedList = updatedList.filter((item) => {
                if (item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1 || item.description.toLowerCase().search(event.target.value.toLowerCase()) !== -1) {
                    return item;
                }
            });
            this.setState({filteredItems: updatedList});
        }
    }

    filterItem(event) {
        if (event.target.value === "0")
            this.setState({filteredItems: this.state.todoItems});
        else {
            let updatedList = this.state.todoItems;
            updatedList = updatedList.filter((item) => {
                switch (event.target.value) {
                    case "1":
                        if (item.status === true) {
                            return item;
                        }
                        else
                            break;
                    case "2":
                        if (item.status === false)
                            return item;
                        else
                            break;
                    case "3":
                        if (moment().isAfter(moment(item.deadline)))
                            return item;
                        else
                            break;
                    case "4":
                        if (moment().isBefore(moment(item.deadline)))
                            return item;
                        else
                            break;
                }
            });
            this.setState({filteredItems: updatedList});
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return (
                <div className="container">
                    <h4 className="row"> Todo List </h4>
                    <div className="form-group row">
                        <select className="form-control" value={this.state.selectedListId} onChange={this.handleChange}>
                            {this.state.todoList.map((item) => {
                                return <option key={item.id} value={item.id}>{item.name}</option>;
                            })}
                        </select>
                        <form onSubmit={this.deleteTodoList}>
                            <button className="btn btn-danger col-xs-6 pull-right" type="submit">Delete
                            </button>
                        </form>
                    </div>
                    <h4 className="row">Create Todo List </h4>
                    <form className="row" onSubmit={this.createTodoList}>
                        <input className="form-control"
                               ref={(a) => this._inputTodoListName = a} placeholder="create new"></input>
                        <button className="btn btn-primary col-xs-6 pull-right" type=" submit">Add</button>
                    </form>
                    <h4 className="row"> Create Todo Item </h4>
                    <div className="form group">
                        <form className="row" onSubmit={this.addItem}>
                            <input className="form-control" ref={(a) => this._inputName = a}
                                   placeholder="name"></input>
                            <input className="form-control" ref={(a) => this._inputDescription = a}
                                   placeholder="description"></input>
                            <input className="form-control" type="date"
                                   min={moment().add(1, 'days').format('YYYY-MM-DD')}
                                   ref={(a) => this._inputDeadline = a}></input>
                            <button className=" btn btn-primary col-xs-6 pull-right" type=" submit">Add</button>
                        </form>
                    </div>
                    <h4 className="row"> Todo Items </h4>
                    <div className="filter-list">
                        <form>
                            <fieldset className="form-group row">
                                <input type="text" className="form-control form-control-lg" placeholder="Search"
                                       onChange={this.searchItem}/>
                                <select className="form-control"
                                        onChange={this.filterItem}>
                                    <option key="0" value="0">Filter</option>
                                    <option key="1" value="1">Completed</option>
                                    <option key="2" value="2">Not Completed</option>
                                    <option key="3" value="3">Expired</option>
                                    <option key="4" value="4">Not Expired</option>
                                </select>
                            </fieldset>
                        </form>
                        <TodoItems entries={this.state.filteredItems}
                                   delete={this.deleteItem} setCompleted={this.setItemCompleted}/>
                    </div>
                </div>
            );
        }
        else {
            return (
                <Redirect to="/"/>
            )
        }
    }
}

export default TodoList;