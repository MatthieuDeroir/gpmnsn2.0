import update from 'immutability-helper'
import React, {useCallback, useState, setState} from 'react'
import {Card} from './Card.js'
import AuthService from '../../../services/authService'
import axios from 'axios'
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

const style = {

}




export const Container = (props) => {
    {
        const updateEvent = (newFiles) => {
            const url = "http://localhost:4000/event/"
            axios.put(url+props.event._id, {
                files: newFiles
            })
                .then(response => {
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err)
                });
            window.location.reload()
        }


        let flag = 0


        const [cards, setCards] = useState(props.event.files)

        console.log(props.event._id)





        const moveCard = useCallback((dragIndex, hoverIndex) => {
            setCards((prevCards) =>
                update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                    ],
                }),
            )
        }, [])
        const renderCard = useCallback((card, index) => {
            card.index = index
            console.log(card.duration)

            return (
                <Card
                    key={card.index}
                    index={index}
                    id={card.index}
                    name={card.name}
                    format={card.type}
                    duration={card.duration}
                    path={card.path}
                    moveCard={moveCard}
                    // updateIndex={updateIndex}
                />
            )
        }, [])

        if (cards){
            return (
                <div>
                    {/* introduire ici return EVENT changeName && return  FILE changeOrder
                    EVENT et FILE ne sont pas le meme objet :)
                    se réferer à : https://react-dnd.github.io/react-dnd/docs/api/use-drop
                    */}
                    <div style={{display: "flex",
                        justifyContent: "center",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        height: "100%",
                        width:"100%",
                        backgroundColor: "#203038",
                        padding: "20px"}}> <h2 style={{color: "white"}}> Modification de l'ordre </h2>
                        {cards.map((card, i) => renderCard(card, i))}
                        <Button variant={"light"} onClick={updateEvent.bind("ok",cards)}>
                            Enregistrer
                        </Button>
                    </div>
                    <Row className={"justify-content-center"}>

                    </Row>

                </div>
            )
        }

    }
}

export default Container
