import React from 'react';
import {ImageList, ImageListItem} from '@mui/material'
// import {Accordion, Button} from 'react-bootstrap'
import userService from "../../services/userService";
import AuthService from "../../services/authService";
import {Row, Col} from 'react-bootstrap'

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from "@mui/material/IconButton";

import ImageIcon from "@mui/icons-material/Image"

import Button from "@mui/material/Button"


// <Accordion />
// <AccordionActions />
// <AccordionDetails />
// <AccordionSummary />


const FileList = (props) => {
    return (
        <div>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}

                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{backgroundColor: "#203038"}}>
                    <IconButton >
                        <ImageIcon sx={{ color: "white"}}/>
                    </IconButton>
                    <Typography color={"white"} style={{padding:"8px"}}>Médias</Typography></AccordionSummary>
                <AccordionDetails style={{
                    width: "100%",
                    maxHeight: "63vh",
                    overflowY: "scroll",
                    justifyContent: "center",
                    backgroundColor: "#203038"
                }}>
                    <Row>
                        <Button variant="outline-light" href="#!" key={0}
                                onClick={props.importFile.bind(this)}
                                size={"small"} style={{width: "100%", height: "90%"}}>Importer un media</Button>
                    </Row>

                    {/*{props.files.map((item) => {*/}
                    {/*    if (AuthService.getCurrentUser()) {*/}
                    {/*        if (item._user === AuthService.getCurrentUser().username) {*/}
                    {/*            return <Row>*/}
                    {/*                <Button variant="outline-dark" href="#!" key={item._id+1} disableSpacing={true}*/}
                    {/*                        onClick={props.updateCurrentFile.bind(this, item)}*/}
                    {/*                        size={"small"}style={{width: "95%", height: "90%"}} >{item.name}</Button>*/}
                    {/*            </Row>*/}

                    {/*        }*/}
                    {/*    }*/}
                    {/*})}*/}


                    <ImageList
                        variant="masonry" gap={8}
                    >
                        {props.files.map((item) => (
                            !AuthService.getCurrentUser() ? null
                                :
                                item._user !== AuthService.getCurrentUser().username ?
                                    null
                                    : <ImageListItem key={item.img} cols={item.cols || 0} rows={item.rows || 0}>
                                        {item.type === "image" ?
                                            <a
                                                href="#!" key={item._id + 1}
                                                onClick={props.updateCurrentFile.bind(this, item)}
                                                style={{width: "248px", fit: "crop", auto: "format"}}
                                            >
                                                <img
                                                    src={`${item.path}?w=248&fit=crop&auto=format`}
                                                    srcSet={`${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                    alt={item.title}
                                                    style={{width: "100%"}}
                                                    loading="lazy"
                                                />
                                            </a>
                                            :
                                            <div>
                                                <a
                                                    href="#!" key={item._id + 1}
                                                    onClick={props.updateCurrentFile.bind(this, item)}
                                                    style={{width: "248px", fit: "crop", auto: "format"}}
                                                >
                                                    <video
                                                        src={`${item.path}?w=248&fit=crop&auto=format`}
                                                        srcSet={`${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        style={{width: "100%", height: "100%"}}

                                                    />
                                                </a>
                                            </div>

                                        }
                                    </ImageListItem>
                        ))}
                    </ImageList>

                </AccordionDetails>
            </Accordion>
        </div>);
}

export default FileList;