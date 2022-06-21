import React from 'react';
import {Card} from '@mui/material';
import axios from "axios";
import {Row, Col} from 'react-bootstrap'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default class Logs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelLogs: [],
            userLogs: [],
        }
    }

    componentDidMount() {
        let url = 'http://localhost:4000/panelLogs'

        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelLogs: Reponse.data.reverse(),
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = 'http://localhost:4000/userLogs'

        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    userLogs: Reponse.data.reverse(),
                })
            })
            .catch((error) => {
                console.log(error)
            });

    }


    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <TableContainer component={Paper} style={{maxHeight: "74vh"}}>
                            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                                <TableHead >
                                    <TableRow>
                                        <TableCell>Logs Panneaux</TableCell>
                                        <TableCell align="right">Date</TableCell>
                                        <TableCell align="right">État</TableCell>
                                        <TableCell align="right">Statut</TableCell>
                                        <TableCell align="right">Portes</TableCell>
                                        <TableCell align="right">Intégrité de l'écran</TableCell>
                                        <TableCell align="right">Temperature CPU</TableCell>
                                        <TableCell align="right">Index</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{overflowY: "scroll"}}>
                                    {this.state.panelLogs.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.date}</TableCell>
                                            <TableCell align="right">{row.state ? "Allumé" : "Éteint"}</TableCell>
                                            <TableCell align="right">{row.power ? "En ligne" : "Hors ligne"}</TableCell>
                                            <TableCell align="right">{row.isOpen ? "Ouvertes" : "Fermées"}</TableCell>
                                            <TableCell align="right">{row.screen ? "Complète" : "Partielle"}</TableCell>
                                            <TableCell align="right">{row.temperature}</TableCell>
                                            <TableCell align="right">{row.index}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                    <Col>
                        <TableContainer component={Paper} style={{maxHeight: "74vh"}}>
                            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                                <TableHead >
                                    <TableRow>
                                        <TableCell>Logs Utilisateur</TableCell>
                                        <TableCell align="right">Date</TableCell>
                                        <TableCell align="right">Message</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{overflowY: "scroll"}}>
                                    {this.state.userLogs.map((row) => (
                                        <TableRow
                                            key={row.username}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.username}
                                            </TableCell>
                                            <TableCell align="right">{row.date}</TableCell>
                                            <TableCell align="right">{row.message}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Col>
                </Row>
            </div>

            // this.state.panelLogs.map((item) => (
            //     <div>{"[" + item.date + "]"} {"Panneau " + item.name + " /"}
            //         {item.isOpen ? "Portes : Ouvertes /" : "Portes : Fermées /"}
            //         {item.power ? "Statut : En Ligne /" : "Statut : Hors Ligne /"}
            //         {item.screen ? "Intégrité de l'écran : Complète /" : "Intégrité de l'écran : Partielle /"}
            //         {"Temperature CPU : "} {item.temperature + "/"}
            //
            //     </div>

        )

    }
}

// import * as React from 'react';



