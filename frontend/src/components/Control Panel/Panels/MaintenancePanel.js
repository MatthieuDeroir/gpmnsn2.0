import * as React from 'react';
import Card from '@mui/material/Card'
import { Col, Row } from "react-bootstrap";
import Switch from "@mui/material/Switch";
import { Button } from "@mui/material";


const MaintenancePanel = (props) => {
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
                    <Col style={{ textAlign: "center", justifyContent: "center", height: "65vh", margin: 0, padding: 0 }}>
                        <Card style={{
                            textAlign: "center",
                            justifyContent: "center",
                            height: "63vh",
                            margin: 0,
                            padding: 0
                        }}>
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
                            <Button onClick={props.switchPanelbyIndex.bind(this, !(item.state), item.index, 'ok')}>
                                {item.state ? "Éteindre" : "Allumer"}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row style={{ textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px" }}>
                <Card style={{ maxWidth: "16vw" }}>
                    Off
                    <Switch
                        checked={props.panelInstruction[0].instruction && !!props.panelInstruction[1].instruction && !!props.panelInstruction[2].instruction}
                        onChange={props.switchPanels.bind(this)}
                    />
                    On
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

export default MaintenancePanel