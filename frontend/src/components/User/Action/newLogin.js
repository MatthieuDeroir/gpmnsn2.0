import React, {Component} from "react";
import Form from "react-validation/build/form"
import { Box, Input, Button } from "@mui/material"
import { Col, Row } from 'react-bootstrap'
import CheckButton from "react-validation/build/button"
import AuthService from "../../../services/authService"
import authService from "../../../services/authService";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required !
            </div>
        );
    }
};

export default class Login extends Component {
    constructor(props) {
        super(props);


        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();
        this.setState({
            message: "",
            loading: true,
        });
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                () => {
                    console.log('OK')
                    this.props.history.push("/home");
                    window.location.reload();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.message.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false

            });
        }
    }

    render() {
        return (
            <Col style={{margin:"10px", maxWidth:"350px", justifyContent:"center", color:"white"}}>
                <div className="card card-container" style={{borderRadius:"0", justifyContent:"center", textAlign:"center", backgroundColor:"#203038"}}>
                    <Form
                        onSubmit={this.handleLogin}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        LOGIN
                        <div className="form-group">
                            <Row>
                                <label htmlFor="username">Nom d'utilisateur</label>
                            </Row>

                            <Row>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={this.state.username}
                                    style={{maxWidth:"80%"}}
                                    onChange={this.onChangeUsername}
                                    validations={[required]}
                                />
                            </Row>
                        </div>
                        <div className="form-group" >
                            <Row>
                                <label htmlFor="password">Mot de passe</label>

                            </Row>
                            <Row>
                                <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    style={{justifyContent:"center", textAlign:"center", maxWidth:"80%"}}
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    validations={[required]}
                                />
                            </Row>

                        </div>
                        <div className="form-group" style={{justifyContent:"center", textAlign:"center"}}>
                            <button
                                className="btn btn-primary btn-block"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Login</span>
                            </button>
                        </div>
                        {this.state.message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </Col>
        );
    }
}