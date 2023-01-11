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
                                <p style={{ margin: "0" }}>Date dernier log : {item.date}</p>
                                <p style={{ margin: "0" }}>État : {item.state ? "Allumé" : "Éteint"}</p>
                                <p style={{ margin: "0" }}>Statut : {item.online ? "En ligne" : "Hors ligne"}</p>
                                <p style={{ margin: "0" }}>Consommation : {item.screen ? "OK" : "Défaut Consommation"}</p>
                                <p style={{ margin: "0" }}>Porte Coffret : {item.door_1 ? "Ouverte" : "Fermée"}</p>
                                <p style={{ margin: "0" }}>Alimentation : {item.door_2 ? "Défaut Secteur" : "OK"}</p>
                                <p style={{ margin: "0" }}>Temperature CPU : {item.temperature}</p>
                                Off
                                <Switch checked={item.state} inputProps={{ 'aria-label': 'ant design' }} onChange={props.switchPanelbyIndex.bind(this, !(item.state), item.index, 'ok')} />
                                On
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px" }}>
                    <Card style={{ maxWidth: "16vw" }}>
                        <Button onClick={props.ShutDownByState.bind(this, true)}>
                            Allumer
                        </Button>
                    </Card>
                    <Card style={{ maxWidth: "16vw" }}>
                        {/* TODO: force actualisation */}
                        <Button onClick={props.ShutDownByState.bind(this, false)}>
                            Éteindre
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