import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Row, Col } from 'react-bootstrap'

import ViewPanel from './Panels/ViewPanel';
import ProblemView from './Panels/ProblemView';
import CommandPanel from './Panels/CommandPanel';
import MaintenancePanel from './Panels/MaintenancePanel';

import AuthService from '../../services/authService'
import { Component } from "react";
import axios from "axios";
import authService from "../../services/authService";
import { runInThisContext } from 'vm';

import Ping from 'ping.js';
import { config } from '../../config'

export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panels: [],
            panelInstructions: [],
            default: [{
                instruction: false,
            }],
            problem: false,
            time: Date.now(),

        }

        this.switchAllPanels = this.switchAllPanels.bind(this)
        this.switchPanelbyIndex = this.switchPanelbyIndex.bind(this)
        this.actualize = this.actualize.bind(this)
        this.setPanelStatus = this.setPanelStatus.bind(this)

    }

    async componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);


        let url = 'http://' + config.ip + ':' + config.port + '/instructions'
        setInterval(() => {
            axios.get(url)
                .then((Reponse) => {
                    this.setState({
                        panelInstruction: Reponse.data,
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        },

            1000);

        url = 'http://' + config.ip + ':' + config.port + '/panels'

        setInterval(() => {
            axios.get(url)
                .then((Reponse) => {
                    this.setState({
                        panels: Reponse.data,
                    })
                })
                .catch((error) => {
                    console.log(error)
                });
        },

            1000);

        setInterval(() => {
            this.ping()
        }, 1000);

        // await axios.put(url + this.state.panelInstruction[0]._id, {
        //     instruction: this.state.panelInstructions[0].instruction
        // })
        //     .then((Reponse) => {
        //         console.log(Reponse.data.instruction)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });

        // await axios.put(url + this.state.panelInstruction[0]._id, {
        //     instruction: this.state.panelInstructions[0].instruction
        // })
        //     .then((Reponse) => {
        //         console.log(Reponse.data.instruction)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });


        // await axios.put(url + this.state.panelInstruction[1]._id, {
        //     instruction: this.state.panelInstructions[1].instruction
        // })
        //     .then((Reponse) => {
        //         console.log(Reponse.data.instruction)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });
        // await axios.put(url + this.state.panelInstruction[2]._id, {
        //     instruction: this.state.panelInstructions[2].instruction
        // })
        //     .then((Reponse) => {
        //         console.log(Reponse.data.instruction)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });
    }

    async switchPanelbyIndex(sw, str, i, a, b, c) {
        console.log("index : " + sw)
        console.log(i)
        console.log(a)
        console.log(b)
        console.log(c)
        console.log("str :" + str)


        let url = "http://" + config.ip + ":" + config.port + "/instruction/"

        await axios.put(url + this.state.panelInstruction[str - 1]._id, {
            instruction: sw
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/instructions/"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelInstruction: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/panels"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panels: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });
        url = "http://" + config.ip + ":" + config.port + "/instruction/"

        await axios.put(url + this.state.panelInstruction[str - 1]._id, {
            instruction: sw
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/instructions/"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelInstruction: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/panels"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panels: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async totalShutDown() {
        let url = "http://" + config.ip + ":" + config.port + "/instructions"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelInstruction: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/panels"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panels: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/instruction/"

        await axios.put(url + this.state.panelInstruction[0]._id, {
            instruction: false
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });


        await axios.put(url + this.state.panelInstruction[1]._id, {
            instruction: false
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });
        await axios.put(url + this.state.panelInstruction[2]._id, {
            instruction: false
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });

        await axios.put(url + this.state.panelInstruction[0]._id, {
            instruction: false
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });


        await axios.put(url + this.state.panelInstruction[1]._id, {
            instruction: false
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });
        await axios.put(url + this.state.panelInstruction[2]._id, {
            instruction: false
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });


    }

    async switchAllPanels(sw) {

        if (sw.target.checked) {
            this.setState({
                panelInstructions: [{
                    index: 0,
                    name: "Indret",
                    instruction: true,
                },
                {
                    index: 1,
                    name: "UB Aval",
                    instruction: true,
                },
                {
                    index: 2,
                    name: "UB Amont",
                    instruction: true,
                }]
            })
        } else {
            this.setState({
                panelInstructions: [{
                    index: 0,
                    name: "Indret",
                    instruction: false,
                },
                {
                    index: 1,
                    name: "UB Aval",
                    instruction: false,
                },
                {
                    index: 2,
                    name: "UB Amont",
                    instruction: false,
                }]
            })
        }


        let url = "http://" + config.ip + ":" + config.port + "/instruction/"

        await axios.put(url + this.state.panelInstructions[0]._id, {
            test: this.state.panelInstructions[0].instruction
        })
            .then((Reponse) => {
            })
            .catch((error) => {
                console.log(error)
            });

        await axios.put(url + this.state.panelInstructions[0]._id, {
            instruction: this.state.panelInstructions[0].instruction
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });


        await axios.put(url + this.state.panelInstructions[1]._id, {
            instruction: this.state.panelInstructions[1].instruction
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });
        await axios.put(url + this.state.panelInstructions[2]._id, {
            instruction: this.state.panelInstructions[2].instruction
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/instructions"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panelInstruction: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });

        url = "http://" + config.ip + ":" + config.port + "/panels"

        await axios.get(url)
            .then((Reponse) => {
                this.setState({
                    panels: Reponse.data,
                })
            })
            .catch((error) => {
                console.log(error)
            });

    }

    async setPanelStatus(online, id) {
        const url = "http://" + config.ip + ":" + config.port + "/panel/"
        if (online) {
            await axios.put(url + id, {
                online: true
            })
                .then((Reponse) => {
                })
                .catch((error) => {
                    console.log(error)
                });
        } else {
            await axios.put(url + id, {
                online: false
            })
                .then((Reponse) => {
                })
                .catch((error) => {
                    console.log(error)
                });
        }

    }

    async ping() {
        var p = new Ping();

        let ip_panel_2 = "127.0.0.1"
        let ip_panel_3 = "127.0.0.1"

        // let { stdout, stderr } = await exec('ping -c 1 192.167.100.185')
        // console.log(stdout, stderr)

        // p.ping("192.167.100.185")
        //     .then(data => {
        //         console.log("Successful ping: " + data);
        //     })
        //     .catch(data => {
        //         console.error("Ping failed: " + data);
        //     })

        // p.ping(ip_panel_2)
        //     .then(data => {
        //         console.log("Successful ping: " + data);
        //     })
        //     .catch(data => {
        //         console.error("Ping failed: " + data);
        //     })
        // p.ping(ip_panel_3)
        //     .then(data => {
        //         console.log("Successful ping: " + data);
        //     })
        //     .catch(data => {
        //         console.error("Ping failed: " + data);
        //     })
    }

    hasProblem() {
        let ret = false
        this.state.panels.map((panel) => {
            if (panel.bug) {

                ret = true
                if (panel.state) {
                    this.totalShutDown()
                }
            }
        })

        return ret
    }

    actualize() {

        console.log('page actualized !')
    }


    render() {
        let error = this.hasProblem()
        if (error) {
            return (
                <ProblemView panels={this.state.panels} />
            )
        }
        else {
            if (AuthService.getCurrentUser()['roles'][0] === 'ROLE_USER') {
                return (
                    <div>
                        <ViewPanel panels={this.state.panels} />
                    </div>
                )
            } else if (AuthService.getCurrentUser()['roles'][0] === 'ROLE_ADMIN') {
                return (
                    <div>

                        <CommandPanel actualize={this.actualize} panels={this.state.panels}
                            panelInstruction={this.state.panelInstruction ? this.state.panelInstruction : this.state.default}
                            switchPanels={this.switchAllPanels.bind(this)} />
                    </div>
                )
            } else if (AuthService.getCurrentUser()['roles'][0] === 'ROLE_SUPERUSER') {
                return (
                    <div>
                        <MaintenancePanel actualize={this.actualize.bind(this)} panels={this.state.panels}
                            panelInstruction={this.state.panelInstruction ? this.state.panelInstruction : this.state.default}
                            switchPanels={this.switchAllPanels.bind(this)}
                            switchPanelbyIndex={this.switchPanelbyIndex.bind(this)} />

                    </div>


                )
            }
        }


    }

}
//
// <Row style={{display:"flex", justifyContent:"center"}}>
//     { this.state.panel.map((item) => (
//         <Card style={{justifyContent:"center"}}>
//             {item.name}
//         </Card>
//
//     ))}
// </Row>


