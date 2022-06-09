import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Row, Col, Button } from 'react-bootstrap'

const ItemTypes = {
    FILE: 'file',
}
const style = {
    marginBottom: '.5rem',
    backgroundColor: '#263a42',
    cursor: 'move',
    width: "100%",
}
export const Card = ({ _id, name, path, format, duration, index, moveCard }) => {
    const ref = useRef(null)

    // const nameChange = (e) => {
    //     name = e.target.value
    // }

    const saveChanges = (e) => {
        console.log(e.target.value)

        if (!isNaN(e.target.value) && e.target.value) {
            console.log(e.target.value + " is a number")
            duration = e.target.value
        }
    }

    const submitDuration = () => {

    }

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.FILE,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }

            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
            console.log(name)

        },
        changeName(){

        }
    })
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.FILE,
        item: () => {
            return { _id, index, duration }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
        <Row ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
            <Col >
               <div style={{color:"white", fontSize:"30px", position:"middle"}}>#{`${index + 1}`}</div>
            </Col>
            <Col>
            { (() => {
                    switch(format){
                        default: return 0;
                        case "image" :
                            return <img src={`${path}`} alt="" style={{maxWidth:"100%", maxHeight: "10vh"}}/>
                        case "video" :
                            return <video src={`${path}`} alt="" style={{maxWidth:"100%", maxHeight: "10vh"}}/>
                    }
            }) () }
            </Col>
        </Row>
    )
}