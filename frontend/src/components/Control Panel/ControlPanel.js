import * as React from 'react';

import ViewPanel from './Panels/ViewPanel';
import ProblemView from './Panels/ProblemView';
import CommandPanel from './Panels/CommandPanel';
import MaintenancePanel from './Panels/MaintenancePanel';

import AuthService from '../../services/authService'
import { Component } from "react";
import axios from "axios";

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
        this.sendUserLogs = this.sendUserLogs.bind(this)
        this.totalShutDown = this.totalShutDown.bind(this)

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

        this.sendUserLogs(this.state.panels[str - 1].name, sw)

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async totalShutDown(state = false) {
        let url = "http://" + config.ip + ":" + config.port + "/instructions"

        if (state != false) {
            state = !(state[0].state)
        }

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
            instruction: state
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });


        await axios.put(url + this.state.panelInstruction[1]._id, {
            instruction: state
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });
        await axios.put(url + this.state.panelInstruction[2]._id, {
            instruction: state
        })
            .then((Reponse) => {
                console.log(Reponse.data.instruction)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    async switchAllPanels(a, b, c, d) {

        console.log("a : ", a)
        console.log("b : ", b)
        console.log("c : ", c)
        console.log("d : ", d)



        this.setState({
            panelInstructions: [{
                index: 0,
                name: "Indret",
                instruction: !b[0].state,
            },
            {
                index: 1,
                name: "UB Aval",
                instruction: !b[1].state,
            },
            {
                index: 2,
                name: "UB Amont",
                instruction: !b[2].state,
            }]
        })
        this.sendUserLogs("ALL", true)


        console.log(this.state.panelInstructions)


        let url = "http://" + config.ip + ":" + config.port + "/instruction/"

        console.log(url + this.state.panelInstruction[0]._id)

        await axios.put(url + this.state.panelInstruction[0]._id, {
            instruction: this.state.panelInstructions[0].instruction
        })
            .then((Reponse) => {
                console.log(Reponse)
            })
            .catch((error) => {
                console.log(error)
            });

        await axios.put(url + this.state.panelInstruction[0]._id, {
            instruction: this.state.panelInstructions[0].instruction
        })
            .then((Reponse) => {
                console.log(Reponse)
            })
            .catch((error) => {
                console.log(error)
            });


        await axios.put(url + this.state.panelInstruction[1]._id, {
            instruction: this.state.panelInstructions[1].instruction
        })
            .then((Reponse) => {
                console.log(Reponse)
            })
            .catch((error) => {
                console.log(error)
            });

        await axios.put(url + this.state.panelInstruction[1]._id, {
            instruction: this.state.panelInstructions[1].instruction
        })
            .then((Reponse) => {
                console.log(Reponse)
            })
            .catch((error) => {
                console.log(error)
            });

        await axios.put(url + this.state.panelInstruction[2]._id, {
            instruction: this.state.panelInstructions[2].instruction
        })
            .then((Reponse) => {
                console.log(Reponse)
            })
            .catch((error) => {
                console.log(error)
            });

        await axios.put(url + this.state.panelInstruction[2]._id, {
            instruction: this.state.panelInstructions[2].instruction
        })
            .then(Reponse => {
                console.log(Reponse)
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


    async sendUserLogs(name, state) {
        console.log("SENDING USER LOGS...")
        const url = "http://" + config.ip + ":" + config.port + "/userLogs"
        await axios.post(url, {
            username: AuthService.getCurrentUser().name,
            message: `a actionné les panneaux`,
        })
            .then((Reponse) => {
            })
            .catch((error) => {
                console.log(error)
            });
    }

    hasProblem() {
        let ret = false
        this.state.panels.map((panel) => {
            if (panel.bug) {

                ret = true
                this.state.panels.map((panel) => {
                    if (panel.state) {
                        this.totalShutDown()
                    }
                })
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
                            switchPanels={this.switchAllPanels.bind(this)}
                        />
                    </div>
                )
            } else if (AuthService.getCurrentUser()['roles'][0] === 'ROLE_SUPERUSER') {
                return (
                    <div>
                        <MaintenancePanel actualize={this.actualize.bind(this)} panels={this.state.panels}
                            panelInstruction={this.state.panelInstruction ? this.state.panelInstruction : this.state.default}
                            switchPanels={this.switchAllPanels.bind(this)}
                            switchPanelbyIndex={this.switchPanelbyIndex.bind(this)}
                            totalShutDown={this.totalShutDown.bind(this)}
                        />

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


