import * as React from 'react';
import Card from '@mui/material/Card'
import { Row, Col } from 'react-bootstrap'

const ProblemView = (props) => {
    return (
        <div>
            <Row style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px", paddingBottom: "10px" }}>
                <Card style={{ maxWidth: "16vw" }}>
                    Visualisation
                </Card>
            </Row>
            <Row>
                {props.panels.map((item) => (
                    <Col>
                        {item.bug ? <Card style={{ textAlign: "center", justifyContent: "center", color: "white", backgroundColor: "red" }}>
                            <p>{"Panneau " + item.name}</p>

                            {item.state ?
                                <img src="../assets/img/panneau-indret-amont-allumé.png" alt="" style={{ maxHeight: "139px" }} />
                                : <img src="../assets/img/panneau-indret-amon-eteint.png" alt="" style={{ maxHeight: "139px" }} />}
                            <p>État : {item.state ? "Allumé" : "Éteint"}</p>
                            <p>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                            <p>Écran : {item.screen ? "En état" : "Défaut Alimentation"}</p>
                            <p>Portes 1 : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                            <p>Portes 2 : {item.door_2 ? "Ouverte" : "Fermée"}</p>
                            <p>Temperature CPU : {item.temperature}</p>
                        </Card>
                            :
                            <Card style={{ textAlign: "center", justifyContent: "center" }}>
                                <p>{"Panneau " + item.name}</p>

                                {item.state ?
                                    <img src="../assets/img/panneau-indret-amont-allumé.png" alt="" style={{ maxHeight: "139px" }} />
                                    : <img src="../assets/img/panneau-indret-amon-eteint.png" alt="" style={{ maxHeight: "139px" }} />}
                                <p>État : {item.state ? "Allumé" : "Éteint"}</p>
                                <p>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                                <p>Écran : {item.screen ? "En état" : "Défaut Alimentation"}</p>
                                <p>Portes 1 : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                                <p>Portes 2 : {item.door_2 ? "Ouverte" : "Fermée"}</p>
                                <p>Temperature CPU : {item.temperature}</p>
                            </Card>
                        }


                    </Col>

                ))}
            </Row>
        </div>


    )
}

export default ProblemView