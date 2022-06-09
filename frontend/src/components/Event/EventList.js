import React from 'react';
import AuthService from "../../services/authService";
// import {Accordion, AccordionActions, AccordionSummary, Button} from "@mui/material";
// import Accordion from "react-bootstrap/Accordion";
import Button from "@mui/material/Button"
import {Col, Row, ButtonGroup} from 'react-bootstrap';

import IconButton from '@mui/material/IconButton';
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import ModifyIcon from "@mui/icons-material/Mode";
import DisplayIcon from "@mui/icons-material/CastConnected";
import PreviewIcon from "@mui/icons-material/Preview";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PermMediaIcon from "@mui/icons-material/PermMedia";


// <Accordion />
// <AccordionActions />
// <AccordionDetails />
// <AccordionSummary />


const EventList = (props) => {

    return (

        <div>
            <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{backgroundColor: "#203038"}}>
                        <IconButton >
                            <PermMediaIcon sx={{ color: "white"}}/>
                        </IconButton>
                        <Typography color={"white"} style={{padding:"8px"}}>Évènements</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        style={{backgroundColor: "#203038"}}>
                        <div style={{
                            width: "100%",
                            maxHeight: "61vh",
                            height: "auto",
                            overflowY: "scroll",
                            overflowX: "hidden"
                        }} className={"align-content-center"}>
                            <Row>
                                <Button
                                    variant="outline-light"
                                    href="#!" key={0}
                                    onClick={props.displayScore.bind(this)} style={{width: "100%", height: "90%"}}>
                                    Afficher le Score
                                </Button>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        variant="outline-light"
                                        href="#!" key={0}
                                        onClick={props.importEvent.bind(this)} style={{width: "100%", height: "90%"}}>
                                        Créer un évenement
                                    </Button>

                                    {/*<IconButton*/}
                                    {/*    size="large"*/}
                                    {/*    aria-label="account of current user"*/}
                                    {/*    aria-controls="menu-appbar"*/}
                                    {/*    aria-haspopup="true"*/}
                                    {/*    style={{padding: "0"}}*/}

                                    {/*    color="inherit"*/}
                                    {/*>*/}
                                    {/*    <LogoutIcon/>*/}
                                    {/*</IconButton>*/}
                                </Col>
                            </Row>


                            {props.event.map((item) => {
                                if (AuthService.getCurrentUser()) {
                                    if (item._user == AuthService.getCurrentUser().username) {
                                        return <ButtonGroup style={{width: "inherit"}}
                                                            className={"p-1"}>
                                            {/*<Row className="flex-col justify-content-center">*/}

                                            {/*<Row>*/}

                                            <Col>
                                                <p style={{color: "white", padding: "5px", margin: "0"}}>{item.name}</p>

                                            </Col>
                                            <Col className={"justify-content-right"}>
                                                <IconButton
                                                    size="large"
                                                    aria-label="account of current user"
                                                    aria-controls="menu-appbar"
                                                    aria-haspopup="true"
                                                    style={{padding: "0 5px", color: "#982d23"}}
                                                    onClick={props.updateCurrentEvent.bind(this, item)}
                                                    color="inherit"
                                                >
                                                    <PreviewIcon/>
                                                </IconButton>


                                                {/*<Button*/}
                                                {/*    variant="dark"*/}
                                                {/*    href="#!" key={item._id + 1}*/}
                                                {/*    onClick={props.updateCurrentEvent.bind(this, item)}*/}
                                                {/*    style={{backgroundColor: "#982d23"}}>*/}
                                                {/*    <p>{item.name}</p>*/}
                                                {/*</Button>*/}
                                                {/*</Col>*/}

                                                {/*</Row>*/}


                                                {/*<Row>*/}

                                                {/*<Col>*/}
                                                {/*<Button*/}
                                                {/*    // GRIS : #31434f*/}
                                                {/*    // BORDEAU : #982d23*/}
                                                {/*    // ROUGE : #c93028*/}
                                                {/*    // ORANGE : #fb6a22*/}
                                                {/*    // JAUNE : #fe9b19*/}
                                                {/*    variant="dark"*/}
                                                {/*    href="#!" key={item._id + 2}*/}
                                                {/*    onClick={props.modifyCurrentEvent.bind(this, item)}*/}
                                                {/*    style={{backgroundColor: "#fb6a22"}}>*/}
                                                {/*    Modifier*/}
                                                {/*</Button>*/}

                                                <IconButton
                                                    size="large"
                                                    aria-label="account of current user"
                                                    aria-controls="menu-appbar"
                                                    aria-haspopup="true"
                                                    style={{padding: "0 5px", color: "#fb6a22"}}
                                                    onClick={props.modifyCurrentEvent.bind(this, item)}

                                                    color="inherit"
                                                >
                                                    <ModifyIcon/>
                                                </IconButton>

                                                {/*</Col>*/}
                                                {/*<Col>*/}
                                                {/*<Button*/}
                                                {/*    variant="dark"*/}
                                                {/*    href="#!" key={item._id + 4} disableSpacing={true}*/}
                                                {/*    onClick={props.displayEvent.bind(this, item)}*/}
                                                {/*    style={{backgroundColor: "#fe9b19"}}>*/}
                                                {/*    Afficher*/}
                                                {/*</Button>*/}

                                                <IconButton
                                                    size="large"
                                                    aria-label="account of current user"
                                                    aria-controls="menu-appbar"
                                                    aria-haspopup="true"
                                                    style={{padding: "0 5px", color: "#fe9b19"}}
                                                    onClick={props.displayEvent.bind(this, item)}


                                                >
                                                    <DisplayIcon/>
                                                </IconButton>

                                                {/*</Col>*/}
                                                {/*<Col>*/}
                                                {/*<Button*/}
                                                {/*    variant="dark"*/}
                                                {/*    href="#!" key={item._id + 3}*/}
                                                {/*    onClick={props.deleteCurrentEvent.bind(this, item)}*/}
                                                {/*    style={{backgroundColor: "#c93028"}}>*/}
                                                {/*    Supprimer*/}
                                                {/*</Button>*/}

                                                <IconButton
                                                    size="large"
                                                    aria-label="account of current user"
                                                    aria-controls="menu-appbar"
                                                    aria-haspopup="true"
                                                    style={{padding: "0 5px", color: "#c93028"}}
                                                    onClick={props.deleteCurrentEvent.bind(this, item)}
                                                    color="inherit"
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Col>
                                            {/*</Row>*/}

                                            {/*<Button variant={"light"} href="#!" key={0} disableSpacing={true}*/}
                                            {/*        onClick={props.importFile.bind(this)}*/}
                                            {/*        size={"small"} variant="text">Importer un media</Button>*/}
                                            {/*</Row>*/}
                                        </ButtonGroup>
                                            ;
                                    }
                                }
                            })}

                        </div>
                    </AccordionDetails>
            </Accordion>

        </div>

    );


}

export default EventList;