import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import {HTML5Backend} from 'react-dnd-html5-backend'

import {TouchBackend} from 'react-dnd-touch-backend'
import {DndProvider} from 'react-dnd'
import Container from '../../utils/drag-drop-sortable-list/Container'

import EventOrder from './EventOrder'
import EventDuration from './EventDuration'
import { Row, Col } from 'react-bootstrap'


const EventMod = (props) => {

    return (
        <div>
            <Row>
                <Col>
                    <EventOrder event={props.event}/>
                </Col>
                <Col>
                    <EventDuration event={props.event}/>

                </Col>
            </Row>

        </div>
    )


}

export default EventMod;


