import React, {Component} from "react";
import Form from "react-validation/build/form"
import { Input, Select, InputLabel, MenuItem } from "@mui/material"
import CheckButton from "react-validation/build/button"
import AuthService from "../../../services/authService"

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Ce champs est requis !
            </div>
        );
    }

};
const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                Le nom d'utilisateur doit faire entre 3 et 20 caractères.
            </div>
        );
    }
};
const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                Le mot de passe doit faire entre 6 et 40 caractères.
            </div>
        );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            username: "",
            password: "",
            roles: [],
            successful: false,
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
    onChangeRoles(e) {
        this.setState({
            roles: e.target.value
        });
    }

    handleRegister(e) {
        e.preventDefault();
        this.setState({
            message: "",
            successful: false
        });
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.username,
                this.state.password,
                this.state.roles
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.message.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <div style={{margin:"10px", maxWidth:"350px", justifyContent:"center", color:"white", textAlign:"center", marginLeft:"auto", marginRight:"auto"}}>
                <div className="card card-container flex-column" style={{borderRadius:"0", justifyContent:"center", textAlign:"center", backgroundColor:"#203038"}}>
                    <Form
                        onSubmit={this.handleRegister}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        Créer un compte
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="username">Nom d'utilisateur</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[required, vusername]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mot de passe</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required, vpassword]}
                                    />
                                </div>
                                <InputLabel id="demo-simple-select-label">Sélectionner un rôle</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.roles}
                                    label="roles"
                                    onChange={this.onChangeRoles.bind(this)}
                                >
                                    <MenuItem value="user">Utilisateur</MenuItem>
                                    <MenuItem value="admin">Administrateur</MenuItem>
                                    <MenuItem value="superuser">Super Utilisateur</MenuItem>
                                </Select>
                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">Sign Up</button>
                                </div>
                            </div>
                        )}
                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}