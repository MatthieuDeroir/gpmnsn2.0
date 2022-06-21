import * as React from 'react';
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import {Col, Row} from "react-bootstrap";

const CommandPanel = (props) => {
    return (
        <div>
            <Row style={{textAlign:"center", justifyContent:"center", margin: 0,padding: 0, paddingTop: "10px", paddingBottom: "10px"}}>
                <Card style={{maxWidth:"16vw"}}>
                    Utilisateur
                </Card>
            </Row>
            <Row style={{margin:"0px", padding:"0px"}}>
                {props.panels.map((item) => (
                    <Col >
                        <Card style={{textAlign:"center", justifyContent:"center"}}>
                            <p>{"Panneau " + item.name}</p>

                            {item.state?
                                <img src="../assets/img/panneau-indret-amont-allumé.png" alt=""/>
                                : <img src="../assets/img/panneau-indret-amon-eteint.png" alt=""/> }
                            <p>État : {item.state? "Allumé" : "Éteint"}</p>
                            <p>Statut : {item.power? "En ligne" : "Hors ligne"}</p>
                            <p>Intégrité de l'écran : {item.screen? "Complète" : "Partielle"}</p>
                            <p>Temperature CPU : {item.temperature}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row style={{textAlign:"center", justifyContent:"center", margin: 0,padding: 0, paddingTop: "10px"}}>
                <Card style={{maxWidth:"16vw"}}>
                    Off
                    <Switch checked={!!props.panelInstruction[0].instruction && !!props.panelInstruction[1].instruction && !!props.panelInstruction[2].instruction}  onChange={props.switchPanels.bind(this)}/>
                    On
                </Card>
            </Row>
        </div>


    )
}

export default CommandPanel