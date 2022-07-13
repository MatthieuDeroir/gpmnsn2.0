import * as React from 'react';
import Card from '@mui/material/Card'
import { Col, Row } from "react-bootstrap";
import Switch from "@mui/material/Switch";
import { Button } from "@mui/material";


const MaintenancePanel = (props) => {

    if (props.panels) {
        return (
            <div style={{ margin: "0px", padding: "0px", textAlign: "center", justifyContent: "center" }}>
                <Row style={{
                    textAlign: "center",
                    justifyContent: "center",
                    margin: 0,
                    padding: 0,
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}>
                    <Card style={{ maxWidth: "16vw" }}>
                        Maintenance
                    </Card>
                </Row>
                <Row style={{ textAlign: "center", justifyContent: "center" }}>
                    {props.panels.map((item) => (
                        <Col style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0 }}>
                            <Card style={{
                                textAlign: "center",
                                justifyContent: "center",
                                height: "65vh",
                                margin: 0,
                                padding: 0
                            }}>
                                <p style={{ margin: "0" }}>{"Panneau " + item.name}</p>

                                {item.state ?
                                    <img src="../assets/img/fleche-c.png" alt="" />
                                    : <img src="../assets/img/fleche-s.png" alt="" />}
                                <p style={{ margin: "0" }}>Date dernier log : {item.date}</p>
                                <p style={{ margin: "0" }}>État : {item.state ? "Allumé" : "Éteint"}</p>
                                <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                                <p style={{ margin: "0" }}>Écran : {item.screen ? "En état" : "Défaut Alimentation"}</p>
                                <p style={{ margin: "0" }}>Porte 1 : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                                <p style={{ margin: "0" }}>Porte 2 : {item.door_2 ? "Ouverte" : "Fermée"}</p>
                                <p style={{ margin: "0" }}>Temperature CPU : {item.temperature}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px" }}>
                    <Card style={{ maxWidth: "16vw" }}>
                        <Button onClick={props.totalShutDown.bind(this, props.panels)}>
                            Actionner
                        </Button>
                    </Card>
                    <Card style={{ maxWidth: "16vw" }}>
                        {/* TODO: force actualisation */}
                        <Button onClick={props.actualize} href={"/controlpanel"}>
                            Actualiser
                        </Button>
                    </Card>
                </Row>
            </div>
        )
    }
    else {
        return (
            <div> WAITING </div>
        )

    }

}

export default MaintenancePanel