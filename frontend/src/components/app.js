import React from 'react';
import axios from "axios";

import './App.css';

import '../bootstrap/css/bootstrap.min.css'


import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import Image from '@mui/icons-material/Image';
import PermMedia from '@mui/icons-material/PermMedia';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import Paper from '@mui/material/Paper';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';

import ResponsiveAppBar from './Navigation/Navbar';


import {Switch, Route, Link} from "react-router-dom";
import AuthService from "../services/authService";
import Login from "./User/Action/Login";
import Registration from "./User/Action/Registration";
import Home from "./User/Home"
import Profile from "./User/Profile"
import BoardUser from "./User/View/UserBoard"
import BoardAdmin from "./User/View/AdminBoard"
import BoardSuperuser from "./User/View/SuperuserBoard"


import FileList from './File/FileList';
import FileSingle from './File/FileSingle';
import FileForm from './File/FileForm';

import EventList from './Event/EventList';
import EventSingle from './Event/EventSingle';
import EventForm from './Event/EventForm';

import ControlPanel from './Control Panel/ControlPanel'
import Logs from './Logs/Logs'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBNavbar,
    CDBNavBrand,
    CDBNavItem,
    CDBNavLink,
    CDBDropDown,
    CDBDropDownMenu,
    CDBDropDownToggle,
    CDBBtn,
    CDBNavToggle,
    CDBIcon,
    CDBCollapse,
    CDBNavbarNav,
    CDBContainer,
} from 'cdbreact';
import {NavLink} from 'react-router-dom';
import {Col, Row} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";


/*
couleurs STRAMATEL :

GRIS : #31434f
BORDEAU : #982d23
ROUGE : #c93028
ORANGE : #fb6a22
JAUNE : #fe9b19


 */


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //user
            showAdminBoard: false,
            showSuperuserBoard: false,
            currentUser: undefined,
            //files
            // files: [],
            // currentFile: [],
            // events: [],
            // currentEvent: [],
            // connected: true,
            content: "",
            files: [],
            currentFile: [],
            events: [],
            currentEvent: [],
            fileForDisplay: "",
            eventForDisplay: "",

            //template
            // JSONtemplate: {[
            //
            //         ]
            // }

            //triggers
            //creation
            importFile: false,
            importEvent: false,

            //selection
            isFileSelected: false,
            isEventSelected: false,

            //modification
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,

            //display lists
            displayFileList: false,
            displayEventList: false,

            default: [{
                title: "DEFAULT_IMAGE",
                description: "STRAMATEL DEFAULT"
                //image logo stramatel
            }]

        }


        //users
        this.logOut = this.logOut.bind(this);
        //files
        // this.updateCurrentFile = this.updateCurrentFile.bind(this);
        // this.updateCurrentEvent = this.updateCurrentEvent.bind(this);
        //triggers
        //importation
        this.importFile = this.importFile.bind(this);
        this.importEvent = this.importEvent.bind(this);
        //selection
        this.updateCurrentFile = this.updateCurrentFile.bind(this);
        this.updateCurrentEvent = this.updateCurrentEvent.bind(this);

        //modification
        this.modifyCurrentEvent = this.modifyCurrentEvent.bind(this);
        this.modifyCurrentFile = this.modifyCurrentFile.bind(this);

        //deletion
        this.deleteCurrentEvent = this.deleteCurrentEvent.bind(this);
        this.deleteCurrentFile = this.deleteCurrentFile.bind(this);

        //display lists
        this.displayFileList = this.displayFileList.bind(this)
        this.displayEventList = this.displayEventList.bind(this)
        this.noDisplay = this.noDisplay.bind(this)

        //trigger display event
        this.displayEvent = this.displayEvent.bind(this);
        this.convertToJSON = this.convertToJSON.bind(this);

    }

    componentDidMount() {
//users
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
                showSuperuserBoard: user.roles.includes("ROLE_SUPERUSER"),
                // displayEventList: true
            });
        }

//files
        let url = 'http://localhost:4000/files'

        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    files: Reponse.data,
                    currentFile: Reponse.data[0]
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = 'http://localhost:4000/events'

        axios.get(url)
            .then((Reponse) => {
                this.setState({
                    events: Reponse.data
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    //files
    importFile() {
        this.setState({
            importFile: true,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
        })
    }

    //Update current file
    updateCurrentFile(item) {
        this.setState({
            currentFile: item,
            importFile: false,
            importEvent: false,
            isFileSelected: true,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,

        })
    }

    modifyCurrentFile(item) {
        this.setState({
            currentFile: item,
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isFileSelectedForModification: true,
            isEventSelectedForModification: false,
        })
    }

    deleteCurrentFile(item) {
        this.setState({
            currentFile: item,
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
        })
    }

    displayFileList() {
        this.setState({
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
            displayFileList: true,
            displayEventList: false,
        })
    }

    //event
    importEvent() {
        this.setState({
            importFile: false,
            importEvent: true,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
        })
    }

    updateCurrentEvent(item) {
        this.setState({
            currentEvent: item,
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: true,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
        })
    }

    modifyCurrentEvent(item) {
        this.setState({
            isEventSelectedForModification: false,
        })
        this.m(item)
    }

    m(item) {
        this.setState({
            currentEvent: item,
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: true,
            isFileSelectedForModification: false,
        })
    }

    deleteCurrentEvent(item) {
        this.setState({
            currentEvent: item,
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
        })


        axios.delete("http://localhost:4000/event/" + item._id)
        window.location.reload()
    }

    displayEventList() {
        this.setState({
            importFile: false,
            importEvent: false,
            isFileSelected: false,
            isEventSelected: false,
            isEventSelectedForModification: false,
            isFileSelectedForModification: false,
            displayFileList: false,
            displayEventList: true,
        })
    }

    convertToJSON(item) {
        console.log(item)
    }

    displayEvent(item) {
        this.convertToJSON(item);
    }

    noDisplay() {
        this.setState({
            displayFileList: false,
            displayEventList: false,
        })
    }


    componentWillUnmount() {
    }

    //user
    logOut() {
        document.location.href="localhost:3000/login";
        AuthService.logout();
        window.location.reload(true);
    }


    //files
    //Update current file
    updateCurrentFile(item) {
        this.setState({
            currentFile: item,
        })
    }

    updateCurrentEvent(item) {
        this.setState({
            currentEvent: item,
        })
    }


    render() {
        const {currentUser, showSuperuserBoard, showAdminBoard} = this.state;


        function detectMob() {
            return ((window.innerWidth <= 800) || (window.innerHeight <= 600));
        }

        return (
            <div>
                {/*{detectMob() ?*/}
                <div>
                    <Box sx={{flexGrow: 1}}>
                        <AppBar style={{justifyContent: "center", position: "sticky", top: "0", marginBottom:"2vh"}}>
                            <Toolbar style={{backgroundColor: "#ffffff", justifyContent: "center", padding: "0"}}>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{mr: 2}}
                                    style={{padding: "0", justifyContent: "center"}}


                                >
                                    { detectMob() ?
                                        <img style={{width: "60vw", justifyContent: "center", padding: "0"}}
                                             src="../assets/img/STRAMATEL-LOGO.png"
                                             alt=""/>
                                        :
                                        <img style={{height: "10vh", justifyContent: "center", paddingTop: "5px", paddingBottom: "5px"}}
                                             src="../assets/img/STRAMATEL-LOGO.png"
                                             alt=""/>
                                    }
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Switch>
                        <Route exact path="/controlpanel" component={ControlPanel}/>
                        <Route exact path="/logs" component={Logs}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Registration}/>
                        <Route exact path="/profile" component={Profile}/>
                    </Switch>
                    <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: "1000"}}>
                        <BottomNavigation
                            showLabels
                            style={{backgroundColor: "#ffffff"}}
                            // value={value}
                            // onChange={(event, newValue) => {
                            //     setValue(newValue);
                            // }}
                        >
                            {/*<a className="" href="/" onClick={this.noDisplay} style={{right: "100%"}}>*/}
                            {/*    <IconButton*/}
                            {/*        showLabel*/}
                            {/*        size="large"*/}
                            {/*        aria-label="account of current user"*/}
                            {/*        aria-controls="menu-appbar"*/}
                            {/*        aria-haspopup="true"*/}
                            {/*        color="inherit"*/}
                            {/*        style={{padding: "0"}}*/}
                            {/*        label="Stramatel"*/}
                            {/*    >*/}
                            {/*        <img style={{width: "200px", padding: "12px"}}*/}
                            {/*             src="../assets/img/STRAMATEL-LOGO-dark.png"*/}
                            {/*             alt=""/>*/}
                            {/*    </IconButton>*/}
                            {/*</a>*/}
                            {currentUser ?
                                <div>
                                    <Link to={"/controlpanel"}>
                                        <BottomNavigationAction label="Tableau de bord"
                                                                icon={<DisplaySettingsIcon />}/>
                                    </Link>
                                    <Link to={"/logs"}>
                                        <BottomNavigationAction label="Logs"
                                                                icon={<TextSnippetIcon />}/>
                                    </Link>
                                    <Link to={"/profile"}>
                                        <BottomNavigationAction label="Profil"
                                                                icon={<AccountCircle  onClick={this.noDisplay}/>}/>
                                    </Link>
                                    <Link to={"/"} onClick={this.noDisplay}>
                                        <BottomNavigationAction label="Déconnexion"
                                                                icon={<LogoutIcon  onClick={this.logOut}/>}/>
                                    </Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/login"} onClick={this.noDisplay}>
                                        <BottomNavigationAction label="Profil" icon={<LoginIcon />}/>
                                    </Link>
                                    <Link to={"/register"}>
                                        <BottomNavigationAction label="Créer un compte" icon={<PersonAddAlt />}/>
                                    </Link>
                                </div>
                            }
                        </BottomNavigation>
                    </Paper>
                </div>
                {/*:*/}
                {/*<div style={{display: 'flex'}}>*/}
                {/*    <div>*/}
                {/*        <CDBSidebar style={{position: "sticky", top: "0", height: "100vh"}} textColor="#fff"*/}
                {/*                    backgroundColor="#fefee2">*/}
                {/*            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>*/}
                {/*                <a href="/" className="text-decoration-none" style={{color: 'inherit'}}*/}
                {/*                   onClick={this.noDisplay}>*/}
                {/*                    Tableau de Bord*/}
                {/*                </a>*/}
                {/*            </CDBSidebarHeader>*/}

                {/*            <CDBSidebarContent className="sidebar-content">*/}
                {/*                <CDBSidebarMenu>*/}
                {/*                    <NavLink exact to="/files" activeClassName="activeClicked"*/}
                {/*                             onClick={this.displayFileList}>*/}
                {/*                        <CDBSidebarMenuItem icon="columns">Médiathèque</CDBSidebarMenuItem>*/}
                {/*                    </NavLink>*/}
                {/*                    <NavLink exact to="/events" activeClassName="activeClicked"*/}
                {/*                             onClick={this.displayEventList}>*/}
                {/*                        <CDBSidebarMenuItem icon="table">Évenements</CDBSidebarMenuItem>*/}
                {/*                    </NavLink>*/}
                {/*                    <NavLink exact to="/users" activeClassName="activeClicked">*/}
                {/*                        <CDBSidebarMenuItem icon="chart-line">Gestion*/}
                {/*                            Utilisateur</CDBSidebarMenuItem>*/}
                {/*                    </NavLink>*/}

                {/*                    <NavLink exact to="/hero404" target="_blank" activeClassName="activeClicked">*/}
                {/*                        <CDBSidebarMenuItem icon="exclamation-circle">404 page</CDBSidebarMenuItem>*/}
                {/*                    </NavLink>*/}


                {/*                </CDBSidebarMenu>*/}
                {/*            </CDBSidebarContent>*/}
                {/*            <CDBSidebarFooter style={{textAlign: "center"}}>*/}

                {/*                <div*/}
                {/*                    className="sidebar-btn-wrapper"*/}
                {/*                    style={{*/}
                {/*                        padding: '20px 5px',*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    Stramatel*/}
                {/*                </div>*/}
                {/*            </CDBSidebarFooter>*/}
                {/*        </CDBSidebar>*/}
                {/*    </div>*/}


                {/*    <div className="container-fluid" style={{padding: "0"}}>*/}
                {/*        /!*<ResponsiveAppBar />*!/*/}
                {/*        <nav className="navbar navbar-expand navbar-dark"*/}
                {/*             style={{backgroundColor: "#fefee2", justifyContent: "right"}}>*/}

                {/*            {currentUser ? (*/}
                {/*                <div className="navbar-nav w-100" style={{justifyContent: "center"}}>*/}
                {/*                    <a className="" href="/" onClick={this.noDisplay} style={{right: "100%"}}>*/}
                {/*                        <IconButton*/}
                {/*                            size="large"*/}
                {/*                            aria-label="account of current user"*/}
                {/*                            aria-controls="menu-appbar"*/}
                {/*                            aria-haspopup="true"*/}
                {/*                            color="inherit"*/}
                {/*                            style={{padding: "0"}}*/}
                {/*                        >*/}
                {/*                            <img style={{width: "200px"}}*/}
                {/*                                 src="../assets/img/STRAMATEL-LOGO-dark.png"*/}
                {/*                                 alt=""/>*/}

                {/*                        </IconButton>*/}
                {/*                    </a>*/}
                {/*                    <li className="nav-item" style={{right: "100%"}}>*/}
                {/*                        <Link to={"/profile"} className="nav-link">*/}
                {/*                            <IconButton*/}
                {/*                                size="large"*/}
                {/*                                aria-label="account of current user"*/}
                {/*                                aria-controls="menu-appbar"*/}
                {/*                                aria-haspopup="true"*/}
                {/*                                color="inherit"*/}
                {/*                                style={{padding: "0"}}*/}

                {/*                            >*/}
                {/*                                <AccountCircle/>*/}
                {/*                            </IconButton>*/}
                {/*                        </Link>*/}
                {/*                    </li>*/}
                {/*                    <li className="nav-item right">*/}
                {/*                        <a href={"/login"} className="nav-link" onClick={this.logOut}>*/}
                {/*                            <IconButton*/}
                {/*                                size="large"*/}
                {/*                                aria-label="account of current user"*/}
                {/*                                aria-controls="menu-appbar"*/}
                {/*                                aria-haspopup="true"*/}
                {/*                                style={{padding: "0"}}*/}

                {/*                                color="inherit"*/}
                {/*                            >*/}
                {/*                                <LogoutIcon/>*/}
                {/*                            </IconButton>*/}
                {/*                        </a>*/}
                {/*                    </li>*/}
                {/*                </div>*/}
                {/*            ) : (*/}
                {/*                <div className="navbar-nav ml-auto">*/}
                {/*                    <a className="" href="/" onClick={this.noDisplay} style={{right: "100%"}}>*/}
                {/*                        <IconButton*/}
                {/*                            size="large"*/}
                {/*                            aria-label="account of current user"*/}
                {/*                            aria-controls="menu-appbar"*/}
                {/*                            aria-haspopup="true"*/}
                {/*                            color="inherit"*/}
                {/*                            style={{padding: "0"}}*/}
                {/*                        >*/}
                {/*                            <img style={{width: "200px"}}*/}
                {/*                                 src="../assets/img/STRAMATEL-LOGO-dark.png"*/}
                {/*                                 alt=""/>*/}

                {/*                        </IconButton>*/}
                {/*                    </a>*/}
                {/*                    <li className="nav-item">*/}
                {/*                        <Link to={"/login"} className="nav-link">*/}
                {/*                            <IconButton*/}
                {/*                                size="large"*/}
                {/*                                aria-label="account of current user"*/}
                {/*                                aria-controls="menu-appbar"*/}
                {/*                                aria-haspopup="true"*/}
                {/*                                style={{padding: "0"}}*/}
                {/*                                color="inherit"*/}
                {/*                            >*/}
                {/*                                <LoginIcon*/}
                {/*                                />*/}
                {/*                            </IconButton>*/}
                {/*                        </Link>*/}
                {/*                    </li>*/}
                {/*                    <li className="nav-item">*/}
                {/*                        <Link to={"/register"} className="nav-link">*/}
                {/*                            <IconButton*/}
                {/*                                size="large"*/}
                {/*                                aria-label="account of current user"*/}
                {/*                                aria-controls="menu-appbar"*/}
                {/*                                aria-haspopup="true"*/}
                {/*                                style={{padding: "0"}}*/}
                {/*                                color="inherit"*/}
                {/*                            >*/}
                {/*                                <PersonAddAlt/>*/}
                {/*                            </IconButton>*/}
                {/*                        </Link>*/}
                {/*                    </li>*/}
                {/*                </div>*/}
                {/*            )}*/}
                {/*        </nav>*/}
                {/*        /!*<Col>*!/*/}
                            {this.state.displayFileList ?
                                <Home displayFileList={this.state.displayFileList} displayEventList={this.state.displayEventList}/>
                            : null }
                            { this.state.displayEventList ?
                                <Home displayEventList={this.state.displayEventList} displayFileList={this.state.displayFileList}/>
                                : null }

                {/*        /!*</Col>*!/*/}
                {/*        <Switch>*/}
                {/*            <Route exact path={["/", "/home"]} component={Home}/>*/}
                {/*            <Route exact path="/login" component={Login}/>*/}
                {/*            <Route exact path="/register" component={Registration}/>*/}
                {/*            <Route exact path="/profile" component={Profile}/>*/}
                {/*            <Route path="/user" component={BoardUser}/>*/}
                {/*            <Route path="/admin" component={BoardAdmin}/>*/}
                {/*            <Route path="/superuser" component={BoardSuperuser}/>*/}
                {/*        </Switch>*/}
                {/*    </div>*/}

                {/*</div>*/}
                {/*}*/}
                <div style={{height: "70px"}}>

                </div>


            </div>
        );
    }

}

export default App;

