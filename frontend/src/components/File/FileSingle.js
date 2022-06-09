import React from 'react';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Row, Col } from 'react-bootstrap'

const FileSingle = (props) => {
    return (

    <Card text={"light"} style={{backgroundColor:"#203038", padding:"10px"}} >
        { (() => {
            switch (props.file.type) {
                case "image":
                    return <Card.Img src={`${props.file.path}`} alt="image"/>;
                case "video":
                    return <video src={`${props.file.path}`} autoPlay="1" muted="1" style={{ width: '100%' }} loop/>;
                default:
                    return <p>Invalid Format</p>;
            }
        }) ()}

        <Card.Body className={"justify-content-center"}>
            <Row style={{justifyContent:"center"}}>
                <Col style={{justifyContent:"center"}}>
                    <Button variant="warning">Modifier</Button>
                </Col>
                <Col style={{justifyContent:"center"}}>
                    <Button variant="danger">Supprimer</Button>
                </Col>
            </Row>
        </Card.Body>
    </Card>
    );
}

export default FileSingle;