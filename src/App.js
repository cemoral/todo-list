import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './components/Login'
import Register from './components/Register'
import TodoList from './components/TodoList'


class App extends Component {
    constructor(props) {
        super(props);
        this.Callback = this.Callback.bind(this);
        this.state = {isAuthenticated: false};
    }

    Callback(param)
    {
        this.setState({isAuthenticated:param});
    }

    render() {
        if (this.state.isAuthenticated)
            return (<Router>
                <div className="navbar">
                    <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <Link to="/myTodos" className="navbar-brand">Todo List App</Link>
                            </div>
                            <ul className="nav navbar-nav">
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="/login" className="glyphicon glyphicon-log-out" onClick={() => this.Callback(false)}> Logout</a></li>
                            </ul>
                        </div>
                    </nav>
                    <Route path="/myTodos" component={() => <TodoList isAuthenticated={this.state.isAuthenticated}/>}/>
                </div>
            </Router>)
        else
            return (<Router>
                <div className="navbar">
                    <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <Link to="/" className="navbar-brand">Todo List App</Link>
                            </div>
                            <ul className="nav navbar-nav">
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link className="glyphicon glyphicon-user" to="/register"> Register</Link></li>
                                <li><Link className="glyphicon glyphicon-log-in" to="/login"> Login</Link></li>
                            </ul>
                        </div>
                    </nav>
                    <Route path="/login" component={() => <Login Callback={this.Callback}/>}/>
                    <Route path="/register" component={Register}/>
                </div>
            </Router>);
    }
}

export default App;
