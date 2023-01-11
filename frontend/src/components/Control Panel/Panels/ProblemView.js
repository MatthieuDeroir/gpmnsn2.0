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
                                    item.online ? <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                                        : <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
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
                        </Card>
                            :
                            <Card style={{ textAlign: "center", justifyContent: "center" }}>
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
                                <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                                <p style={{ margin: "0" }}>Consommation : {item.screen ? "OK" : "Défaut Consommation"}</p>
                                <p style={{ margin: "0" }}>Porte Coffret : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                                <p style={{ margin: "0" }}>Alimentation : {item.door_2 ? "Défaut Secteur" : "OK"}</p>
                                <p style={{ margin: "0" }}>Temperature CPU : {item.temperature}</p>
                            </Card>
                        }


                    </Col>

                ))}
            </Row>
        </div>


    )
}

export default ProblemView