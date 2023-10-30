import * as React from 'react';
import Card from '@mui/material/Card'
import { Row, Col } from 'react-bootstrap'

const ProblemView = (props) => {
    return (
        <div>
            <Row style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px", paddingBottom: "10px" }}>
                <Card style={{ maxWidth: "16vw", backgroundColor: "red", color: "white" }}>
                    Erreur
                </Card>
            </Row>
            <Row>
                {props.panels.map((item) => (
                    <Col>
                        {item.bug ? <Card style={{ textAlign: "center", justifyContent: "center", color: "white", backgroundColor: "red" }}>
                            <p style={{ margin: "0" }}><strong>{"Panneau " + item.name}</strong></p>

                            {item.name == "UB Aval" ?
                                item.state ?
                                    <img src="../assets/img/fleche-i-c.png" alt="" />
                                    : <img src="../assets/img/fleche-i-s.png" alt="" />
                                :

                                item.state ?
                                    <img src="../assets/img/fleche-c.png" alt="" />
                                    : <img src="../assets/img/fleche-s.png" alt="" />

                            }
                            <p style={{ margin: "0" }}>Dernier log : {item.date}</p>
                            <p style={{ margin: "0" }}>État : {item.state ? "Allumé" : "Éteint"}</p>

                            <div>
                                {
                                    item.online ? <p style={{ margin: "0" }}>Statut : {item.online ?  "En ligne": "Hors ligne" }</p>
                                        : <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne" }</p>
                                }
                            </div>
                            <div>
                                {
                                    !item.screen ? <p style={{ margin: "0" }}>Consommation : {item.screen ? "OK" : "Défaut Consommation"}</p>
                                        : null
                                }
                            </div>
                            <div>
                                {
                                    item.door_1 ? <p style={{ margin: "0" }}>Porte Coffret : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                                        : null
                                }
                            </div>
                            <div>
                                {
                                    item.door_2 ? <p style={{ margin: "0" }}>Alimentation : {item.door_2 ? "Défaut Secteur" : "OK"}</p>
                                        : null
                                }
                            </div>
                            <div>
                                {
                                    item.temperature > 80 ? <p style={{ margin: "0" }}>Temperature CPU : {item.temperature}</p>
                                        : null
                                }
                            </div>
                                <p>{ //changed 18/04/2023
                                    props.panelInstruction[item.index - 1] && props.panelInstruction[item.index - 1].instruction !== item.state ?
                                        <b style={{ margin: "0" }}>Demande en cours : { props.panelInstruction[item.index - 1].instruction ? "Allumage"
                                            : "Extinction"} </b> :
                                        <b></b>
                                }
                                </p>

                            </Card>
                            :
                            <Card style={{
                                textAlign: "center",
                                justifyContent: "center",
                                height: "65vh",
                                margin: 0,
                                padding: "16px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            }}>

                                <div style={{ backgroundColor: "#000", borderRadius: "4px", padding: "4px", marginBottom:"5px" }}>
                                    <p style={{ margin: "0", color: "#fff" }}><strong>{"Panneau " + item.name}</strong></p>
                                </div>

                                {item.name === "UB Aval" ?
                                    item.state ?
                                        <img src="../assets/img/fleche-i-c.png" alt="" />
                                        : <img src="../assets/img/fleche-i-s.png" alt="" />
                                    :
                                    item.state ?
                                        <img src="../assets/img/fleche-c.png" alt="" />
                                        : <img src="../assets/img/fleche-s.png" alt="" />
                                }
                                <div className="info-container" style={{ marginTop: "5px" }}>
                                    <p className="panel-info"><span className="label">Date dernier log :</span> <span className="value">{item.date}</span></p>
                                    <p className="panel-info"><span className="label">État :</span> <span className="value">{item.state ? "Allumé" : "Éteint"}</span></p>
                                    <p className="panel-info"><span className="label">Statut :</span> <span className="value">{item.online ? "En ligne" : "Hors ligne"}</span></p>
                                    <p className="panel-info"><span className="label">Consommation :</span> <span className="value">{item.screen ? "OK" : "Défaut Consommation"}</span></p>
                                    <p className="panel-info"><span className="label">Porte Coffret :</span> <span className="value">{item.door_1 ? "Ouverte" : "Fermée"}</span></p>
                                    <p className="panel-info"><span className="label">Alimentation :</span> <span className="value">{item.door_2 ? "Défaut Secteur" : "OK"}</span></p>
                                    <p className="panel-info"><span className="label">Temperature CPU :</span> <span className="value">{item.temperature.toString().split('.')[0]} °C</span></p>
                                </div>

                                <br />
                                <p>{ //changed 18/04/2023
                                    props.panelInstruction[item.index - 1] && props.panelInstruction[item.index - 1].instruction !== item.state ?
                                        <b className="blink" style={{ margin: "0" }}>Demande en cours : {props.panelInstruction[item.index - 1].instruction ? "Allumage"
                                            : "Extinction"} </b> :
                                        <b></b>
                                }
                                </p>
                            </Card>
                        }


                    </Col>

                ))}
            </Row>
        </div>


    )
}

export default ProblemView