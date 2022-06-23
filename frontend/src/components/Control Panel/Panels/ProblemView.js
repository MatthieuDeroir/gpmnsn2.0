import * as React from 'react';
import Card from '@mui/material/Card'
import { Row, Col } from 'react-bootstrap'

const ProblemView = (props) => {
    return (
        <div>
            <Row style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px", paddingBottom: "10px" }}>
                <Card style={{ maxWidth: "16vw" }}>
                    ERREUR
                </Card>
            </Row>
            <Row>
                {props.panels.map((item) => (
                    <Col>
                        {item.bug ? <Card style={{ textAlign: "center", justifyContent: "center", color: "white", backgroundColor: "red" }}>
                            <p style={{ margin: "0" }}>{"Panneau " + item.name}</p>

                            {item.state ?
                                <img src="../assets/img/fleche-c.png" alt="" />
                                : <img src="../assets/img/fleche-s.png" alt="" />}
                            <p style={{ margin: "0" }}>État : {item.state ? "Allumé" : "Éteint"}</p>
                            <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                            <p style={{ margin: "0" }}>Écran : {item.screen ? "En état" : "Défaut Alimentation"}</p>
                            <p style={{ margin: "0" }}>Portes 1 : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                            <p style={{ margin: "0" }}>Portes 2 : {item.door_2 ? "Ouverte" : "Fermée"}</p>
                            <p style={{ margin: "0" }}>Temperature CPU : {item.temperature}</p>
                        </Card>
                            :
                            <Card style={{ textAlign: "center", justifyContent: "center" }}>
                                <p style={{ margin: "0" }}>{"Panneau " + item.name}</p>

                                {item.state ?
                                    <img src="../assets/img/fleche-c.png" alt="" />
                                    : <img src="../assets/img/fleche-s.png" alt="" />}
                                <p style={{ margin: "0" }}>État : {item.state ? "Allumé" : "Éteint"}</p>
                                <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                                <p style={{ margin: "0" }}>Écran : {item.screen ? "En état" : "Défaut Alimentation"}</p>
                                <p style={{ margin: "0" }}>Portes 1 : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                                <p style={{ margin: "0" }}>Portes 2 : {item.door_2 ? "Ouverte" : "Fermée"}</p>
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