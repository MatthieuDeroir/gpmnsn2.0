import React from 'react';
import {ImageList, ImageListItem, MenuItem, Select} from '@mui/material'
// import {Accordion, Button} from 'react-bootstrap'
import userService from "../../services/userService";
import AuthService from "../../services/authService";
import {Row, Col, ButtonGroup} from 'react-bootstrap'

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from "@mui/material/IconButton";

import ImageIcon from "@mui/icons-material/Image"

import Button from "@mui/material/Button"
import {AccountCircle} from "@mui/icons-material";
import PreviewIcon from "@mui/icons-material/Preview";
import ModifyIcon from "@mui/icons-material/Mode";
import DisplayIcon from "@mui/icons-material/CastConnected";
import DeleteIcon from "@mui/icons-material/Delete";


// <Accordion />
// <AccordionActions />
// <AccordionDetails />
// <AccordionSummary />


const UserList = (props) => {
    return (
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
                        {props.users.map((item) => (
                            !AuthService.getCurrentUser() ? null
                                : <ButtonGroup style={{width: "inherit"}}
                                               className={"p-1"}>

                                    <Col>
                                        <p style={{color: "white", padding: "5px", margin: "0"}}>{item.username}</p>

                                    </Col>
                                    <Col className={"justify-content-right"}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // value={item.roles[0]}
                                            value={item.roles[0]}
                                            placeholder={"Role"}
                                            label="roles"
                                            onChange={props.onChangeRoles(this)}
                                        >
                                            <MenuItem value="">Role</MenuItem>
                                            <MenuItem value="user">Utilisateur</MenuItem>
                                            <MenuItem value="admin">Administrateur</MenuItem>
                                            <MenuItem value="superuser">Super Utilisateur</MenuItem>
                                        </Select>

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


                        ))}
                </AccordionDetails>
            </Accordion>
        </div>);
}

export default UserList;