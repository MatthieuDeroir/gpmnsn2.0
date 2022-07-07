import React, { Component } from "react";
import { Col, Row } from 'react-bootstrap';
import UserService from "../../services/userService";
import "../App.css"


import FileList from '../File/FileList';
import FileSingle from '../File/FileSingle';
import FileForm from '../File/FileForm';

import EventList from '../Event/EventList';
import EventSingle from '../Event/EventSingle';
import EventForm from '../Event/EventForm';
import EventMod from '../Event/EventMod/EventMod';



import axios from "axios";
import authService from "../../services/authService";
// import Accordion from "react-bootstrap/Accordion";
import Accordion from "@mui/material/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            files: [],
            currentFile: [],
            events: [],
            currentEvent: [],
            fileForDisplay: "",
            eventForDisplay: "",
            users: [],

            //template
            // JSONtemplate: {[
            //
            //         ]
            // }

            //triggers
            //creation
            importFile: false,
            importEvent: false,

            //selection
            isFileSelected: false,
            isEventSelected: false,

            //modification
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,

            //display lists
            displayFileList: props.displayFileList,
            displayEventList: props.displayEventList,

            default: [{
                title: "DEFAULT_IMAGE",
                description: "STRAMATEL DEFAULT"
                //image logo stramatel
            }]
        };

    }

    componentDidMount() {
        UserService.getPublicContent().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );

    }

    render() {
        return (
            //
            <div className="container">
                <Row >

                    <Col className={"m1"}>
                        {this.state.isFileSelected ?
                            <Col>
                                <FileSingle file={this.state.currentFile} />
                            </Col>
                            :
                            this.state.isEventSelectedForModification ?
                                <Col> <EventMod event={this.state.currentEvent} /> </Col>
                                :
                                this.state.importEvent ?
                                    <Col><EventForm fFD={this.state.fileForDisplay} default={this.state.default} /></Col>
                                    :
                                    this.state.isEventSelected ?
                                        <Col> <EventSingle event={this.state.currentEvent} /></Col>

                                        :
                                        this.state.importFile ?
                                            <Col><FileForm file={this.state.selectedFile} /></Col>
                                            : null
                            // <Card text={"light"} bg={"dark"} >
                            //     <img src="../assets/img/STRAMATEL-LOGO-dark.png" alt=""/>
                            //     <Card.Body>
                            //         <Card.Title></Card.Title>
                            //         <Card.Text > Prévisualisation des médias </Card.Text>
                            //         <Button variant="warning">Modifier</Button>
                            //     </Card.Body>
                            // </Card>
                        }
                    </Col>
                </Row>
            </div>

        );

    }
}