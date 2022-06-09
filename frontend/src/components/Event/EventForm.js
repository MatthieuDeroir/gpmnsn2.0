import React from 'react';
import axios from "axios";
import authService from "../../services/authService";
import SelectableCardList from "../utils/selectableCards";

class EventForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [[]],
        }
    }

    async EventSubmit(event){
        event.preventDefault();

        await axios.post('http://localhost:4000/events', {
            name: this.refs.eventname.value,
            files: this.state.files,
            _user: authService.getCurrentUser().username
        })
            .then((reponse) => {
                console.log(reponse);
            })
            .catch((error) => {
                console.log(error);
            })

        window.location.reload()
    }

    initDisplayImgJSON(imgJSON) {
        let parsed = [];
        if (imgJSON){
            let stringified = JSON.stringify(imgJSON)
            parsed = JSON.parse(stringified);
            parsed = JSON.parse(parsed);
        }

        const array = [];

        parsed.forEach(function (item) {
            if (item['_user'] == authService.getCurrentUser().username) {
                array.push(item);
            }
        });

        array.forEach(function (item) {
            item['title'] = item['name']
            item['description'] = item['path']
            delete item['date'];
            delete item['__v'];
            delete item['_user'];
            delete item['name'];
            delete item['path']
        });
        return array
    }

    saveFiles(filesSaved){

        console.log(filesSaved)

        var fileArray = [0];

        console.log(filesSaved)

        const tmp = this.initDisplayImgJSON(this.props.fFD)
        console.log(tmp)
        console.log(filesSaved[0])
        console.log(tmp[filesSaved[0]])

        for (let i = 0; i < filesSaved.length; i++){
            console.log(filesSaved)

            fileArray[i] = tmp[filesSaved[i]]
        }

        console.log(fileArray)

        fileArray.forEach(function (item, index) {

            item['name'] = item['title']
            item['path'] = item['description']
            item['index'] = index

            delete item['title']
            delete item['description']
        });

        this.setState({
            files: fileArray,
        })
    }

    onListChanged(selected) {
        this.setState({
            selected: selected
        });
    }

    render() {

        return (
        <div style={{textAlign:"center", padding:"10px"}}>
            <form style={{textAlign:"center", justifyContent:"center", backgroundColor:"#203038"}} onSubmit={this.EventSubmit.bind(this)}>
                <div className="row">
                    <h2 style={{color:"white"}}>Créer un évènement</h2>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input id="eventname" ref="eventname" placeholder="Nom de l'évènement" type="text"/>
                    </div>
                </div>
                <div style={{ width:"100%", overflowY: "scroll", height:"66vh"}}>
                        <h1 className="title">{this.props.title}</h1>
                        <SelectableCardList
                            multiple={true}
                            maxSelectable={28}
                            contents={this.props.fFD != "" ? this.initDisplayImgJSON(this.props.fFD) : this.props.default}
                            onChange={this.onListChanged.bind(this)}/>
                    {/*<Example cardContents={this.props.fFD != "" ? this.initDisplayImgJSON(this.props.fFD) : this.props.default} value={this.state.value} onChangeValue={this.handleChangeValue} multiple/>*/}
                </div>
                <button onClick={(e) => this.saveFiles(this.state.selected)}>
                    Créer l'évenement
                </button>

            </form>
        </div>

        );

    }

}

export default EventForm;
