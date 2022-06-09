import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import {HTML5Backend} from 'react-dnd-html5-backend'



import {TouchBackend} from 'react-dnd-touch-backend'
import {DndProvider} from 'react-dnd'
import Container from '../../utils/drag-drop-sortable-list/Container'
import axios from "axios";
import { Row, Col} from "react-bootstrap";

export function reloadComponent() {
    window.location.reload(false);
}


const EventDuration = (props) => {

    const updateEvent = (event) => {
        const url = "http://localhost:4000/event/"
        axios.put(url + props.event._id, {
            files: event.files
        })
            .then(response => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err)
            });
        console.log(event.files)
    }

    function newDuration(newDuration, item, e) {
        console.log(item)
        console.log(e.target.value)

        item.duration = parseInt(e.target.value)
    }

    function returnDuration(path){
        const video = new Audio(path)
        const videoDuration = video.duration
        return <div>{videoDuration}</div>
    }

    return (
        <div style={{display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            height: "100%",
            width:"100%",
            backgroundColor: "#203038",
            padding: "20px"}}>
            <h2 style={{color: "white"}}> Modification de durée</h2>
            <form action="">
                {props.event.files.map((item) =>
                    <div style={{marginBottom: '.5rem',
                    backgroundColor: '#263a42',
                    width: "100%", height:"10vh"}}>
                        <Row>
                            <Col >
                                {item.type === "image" ?
                                    <input type="text" style={{width: "35%"}} placeholder={item.duration}
                                           onChange={newDuration.bind(this, item, item)}/>
                                    :

                                    <div>Vidéo</div>
                                     }

                            </Col>
                            <Col >
                                { item.type === "image" ?
                                    <img src={item.path} style={{height: "10vh"}} alt={item.name}/>
                                    :
                                    <video src={item.path} style={{height: "10vh"}}/>
                                }
                            </Col>

                        </Row>

                    </div>
                )}
                < Button variant={"light"} onClick={updateEvent.bind("ok", props.event)}>
                    Enregistrer
                </Button>

            </form>
        </div>


    )


}

export default EventDuration;