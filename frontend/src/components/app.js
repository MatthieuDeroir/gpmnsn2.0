import React from 'react';

import './App.css';

import '../bootstrap/css/bootstrap.min.css'


import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import Paper from '@mui/material/Paper';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';




import { Switch, Route, Link } from "react-router-dom";
import AuthService from "../services/authService";
import Login from "./User/Action/Login";
import Registration from "./User/Action/Registration";
import Profile from "./User/Profile"

import ControlPanel from './Control Panel/ControlPanel'

import Logs from './Logs/Logs'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'



class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //user
            showAdminBoard: false,
            showSuperuserBoard: false,
            currentUser: undefined,
            content: "",
        }


        //users
        this.logOut = this.logOut.bind(this);
        //files


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
    }


    componentWillUnmount() {
    }

    //user
    logOut() {
        AuthService.logout();
    }


    //filesn
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
        const { currentUser, showSuperuserBoard, showAdminBoard } = this.state;


        function detectMob() {
            return ((window.innerWidth <= 800) || (window.innerHeight <= 600));
        }

        return (
            <div>
                {/*{detectMob() ?*/}
                <div>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar style={{ justifyContent: "center", position: "sticky", top: "0", marginBottom: "2vh" }}>
                            <Toolbar style={{ backgroundColor: "#ffffff", justifyContent: "center", padding: "0" }}>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 2 }}
                                    style={{ padding: "0", justifyContent: "center" }}


                                >
                                    {detectMob() ?
                                        <img style={{ width: "60vw", justifyContent: "center", padding: "0" }}
                                            src="../assets/img/STRAMATEL-LOGO.png"
                                            alt="" />
                                        :
                                        <img style={{ height: "10vh", justifyContent: "center", paddingTop: "5px", paddingBottom: "5px" }}
                                            src="../assets/img/STRAMATEL-LOGO.png"
                                            alt="" />
                                    }
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Switch>
                        {currentUser ?
                            <Route exact path="/controlpanel" component={ControlPanel} />
                            : <Route exact path="/controlpanel" component={Login} />
                        }
                        {currentUser ?
                            <Route exact path="/logs" component={Logs} />
                            : <Route exact path="/logs" component={Login} />
                        }
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Registration} />
                        {currentUser ?
                            <Route exact path="/profile" component={Profile} />
                            : <Route exact path="/profile" component={Login} />}

                        <Route exact path="/logout" component={Profile} />
                    </Switch>
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: "1000" }}>
                        <BottomNavigation
                            showLabels
                            style={{ backgroundColor: "#ffffff" }}
                        // value={value}
                        // onChange={(event, newValue) => {
                        //     setValue(newValue);
                        // }}
                        >
                            {currentUser ?
                                <div>
                                    <Link to={"/controlpanel"}>
                                        <BottomNavigationAction label="Tableau de bord"
                                            icon={<DisplaySettingsIcon />} />
                                    </Link>
                                    <Link to={"/logs"}>
                                        <BottomNavigationAction label="Logs"
                                            icon={<TextSnippetIcon />} />
                                    </Link>
                                    <Link to={"/profile"}>
                                        <BottomNavigationAction label="Profil"
                                            icon={<AccountCircle onClick={this.noDisplay} />} />
                                    </Link>
                                    <Link to={"/login"} onClick={this.logOut}>
                                        <BottomNavigationAction label="Déconnexion"
                                            icon={<LogoutIcon />} />
                                    </Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/login"} onClick={this.noDisplay}>
                                        <BottomNavigationAction label="Profil" icon={<LoginIcon />} />
                                    </Link>
                                    <Link to={"/register"}>
                                        <BottomNavigationAction label="Créer un compte" icon={<PersonAddAlt />} />
                                    </Link>
                                </div>
                            }
                        </BottomNavigation>
                    </Paper>
                </div>

                <div style={{ height: "70px" }}>

                </div>


            </div>
        );
    }

}

export default App;

