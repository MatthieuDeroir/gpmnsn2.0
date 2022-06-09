import React, { Component } from "react";
import AuthService from "../../services/authService";
import UserList from './UserList'
import axios from "axios";
import {ButtonGroup, Col, Row} from 'react-bootstrap'
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import {AccountCircle} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {MenuItem, Select} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save'

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentUser: AuthService.getCurrentUser(),
            roles: [],
        };

        this.onChangeRoles = this.onChangeRoles.bind(this)

        const url = 'http://localhost:4000/users'


        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    users: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    onChangeRoles(_id, e) {
        this.setState({
            _id : _id,
            roles: e.target.value
        });
        console.log(_id)
    }




    render() {
        const { currentUser } = this.state;
        return (
            <div className="container" >
                <Row>
                    <Col>
                        <header className="jumbotron">
                            <h3 style={{color:"white"}}>
                                <strong >{currentUser.username}</strong> Profile
                            </h3>
                        </header>
                        <p style={{color:"white"}}>
                            <strong >Token:</strong>{" "}
                            {currentUser.accessToken.substring(0, 20)} ...{" "}
                            {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                        </p>
                        <p style={{color:"white"}}>
                            <strong>Id:</strong>{" "}
                            {currentUser.id}
                        </p>
                        <strong style={{color:"white"}} >Authorities:</strong>
                        <ul style={{color:"white"}}>
                            {currentUser.roles &&
                            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                        </ul>
                    </Col>
                    <Col sm={5} style={{padding: "10px"}}>
                        <div>
                            <Accordion defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}

                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    style={{backgroundColor: "#203038"}}>
                                    <IconButton >
                                        <AccountCircle sx={{ color: "white"}}/>
                                    </IconButton>
                                    <Typography color={"white"} style={{padding:"8px"}}>Gestion des Utilisateurs</Typography></AccordionSummary>
                                <AccordionDetails style={{
                                    width: "100%",
                                    maxHeight: "63vh",
                                    overflowY: "scroll",
                                    justifyContent: "center",
                                    backgroundColor: "#203038"
                                }}>
                                    {this.state.users.map((item) => (
                                        AuthService.getCurrentUser() ?
                                            <ButtonGroup style={{width: "inherit"}}
                                                           className={"p-1"}>
                                                <Col>
                                                    <p style={{color: "white", padding: "5px", margin: "0"}}>{item.username}</p>
                                                </Col>
                                                <Col className={"justify-content-right"}>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        // value={item.roles[0]}
                                                        value={this.state.roles[0]}
                                                        placeholder="Role"
                                                        label="roles"
                                                        onChange={this.onChangeRoles.bind(this, item._id)}
                                                    >
                                                        <MenuItem value="user">Utilisateur</MenuItem>
                                                        <MenuItem value="admin">Administrateur</MenuItem>
                                                        <MenuItem value="superuser">Super Utilisateur</MenuItem>
                                                    </Select>

                                                    <IconButton
                                                        size="large"
                                                        aria-label="account of current user"
                                                        aria-controls="menu-appbar"
                                                        aria-haspopup="true"
                                                        style={{padding: "0 5px", color: "#fe9b19"}}
                                                        // onClick={AuthService.updateUser.bind(this,item._id, this.state.roles)}
                                                        color="inherit"
                                                    >
                                                        <SaveIcon/>
                                                    </IconButton>

                                                    <IconButton
                                                        size="large"
                                                        aria-label="account of current user"
                                                        aria-controls="menu-appbar"
                                                        aria-haspopup="true"
                                                        style={{padding: "0 5px", color: "#c93028"}}
                                                        color="inherit"
                                                    >
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>


                                            </ButtonGroup>
                                            : 0


                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        </div>

                    </Col>
                </Row>
            </div>
        );
    }
}