// Fonction pour ajouter les données essentielles à la base de données (roles,panels)
// De-commenter pour première utilisation




import Role from './models/login/roleModel'
import Panel from './models/panel/panelModel'
import Instruction from './models/instructions/instructionModel';

export function initialization() {

    //adding roles
    new Role({
        name: "user"
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added user to role collection");
    })
    new Role({
        name: "admin"
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added admin to role collection");
    })
    new Role({
        name: "superuser"
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added superuser to role collection");
    })

    //adding panels
    new Panel({
        index: 1,
        name: "Indret",
        state: true,
        screen: 1,
        temperature: 0,
        bug: false,
        door_1: false,
        door_2: false,
        online: true,
        isOpen: false
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added indret to panel collection")
    })
    new Panel({
        index: 2,
        name: "UB Aval",
        state: true,
        screen: 1,
        temperature: 0,
        bug: false,
        door_1: false,
        door_2: false,
        online: true,
        isOpen: false
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added ub aval to panel collection")
    })
    new Panel({
        index: 3,
        name: "UB Amont",
        state: true,
        screen: 1,
        temperature: 0,
        bug: false,
        door_1: false,
        door_2: false,
        online: true,
        isOpen: false
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added ub amont to panel collection")
    })
    new Instruction({
        index: 1,
        name: "Indret",
        instruction: true,
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added indret to instruction collection")
    })
    new Instruction({
        index: 2,
        name: "UB Aval",
        instruction: true,
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added aval to instruction collection")
    })
    new Instruction({
        index: 3,
        name: "UB Amont",
        instruction: true,
    }).save(err => {
        if (err) {
            console.log("error", err);
        }
        console.log("added amont to instruction collection")
    })
}