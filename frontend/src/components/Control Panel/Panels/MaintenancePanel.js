import * as React from 'react';
import Card from '@mui/material/Card'
import {Col, Row} from "react-bootstrap";
import Switch from "@mui/material/Switch";
import {Button} from "@mui/material";


const MaintenancePanel = (props) => {
    return (
        <div style={{margin: "0px", padding: "0px", textAlign: "center", justifyContent: "center"}}>
            <Row style={{
                textAlign: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
                paddingTop: "10px",
                paddingBottom: "10px"
            }}>
                <Card style={{maxWidth: "16vw"}}>
                    Maintenance
                </Card>
            </Row>
            <Row style={{textAlign: "center", justifyContent: "center"}}>
                {props.panels.map((item) => (
                    <Col style={{textAlign: "center", justifyContent: "center", height: "63vh", margin: 0, padding: 0}}>
                        <Card style={{
                            textAlign: "center",
                            justifyContent: "center",
                            height: "63vh",
                            margin: 0,
                            padding: 0
                        }}>
                            <p>{"Panneau " + item.name}</p>

                            {item.state ?
                                <img src="../assets/img/panneau-indret-amont-allumé.png" alt=""/>
                                : <img src="../assets/img/panneau-indret-amon-eteint.png" alt=""/>}
                            <p>État : {item.state ? "Allumé" : "Éteint"}</p>
                            <p>Statut : {item.power ? "En ligne" : "Hors ligne"}</p>
                            <p>Intégrité de l'écran : {item.screen ? "Complète" : "Partielle"}</p>
                            <p>Portes : {item.isOpen ? "Ouvertes" : "Fermées"}</p>
                            <p>Temperature CPU : {item.temperature}</p>
                            Off
                            <Switch checked={!!props.panelInstruction[item.index - 1].instruction}
                                    onChange={props.switchPanelbyIndex.bind(this, item.index, 'ok')}/>
                            On
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row style={{textAlign: "center", justifyContent: "center", margin: 0, padding: 0, paddingTop: "10px"}}>
                <Card style={{maxWidth: "16vw"}}>
                    Off
                    <Switch
                        checked={!!props.panelInstruction[0].instruction && !!props.panelInstruction[1].instruction && !!props.panelInstruction[2].instruction}
                        onChange={props.switchPanels.bind(this)}/>
                    On
                </Card>
                <Card style={{maxWidth: "16vw"}}>
                    {/*TODO: force actualisation */}
                    <Button onClick={props.actualize} href={"/controlpanel"}>
                        Actualiser
                    </Button>
                </Card>
            </Row>
        </div>
    )
}

export default MaintenancePanel