import React from 'react';
import './selectableCards.css'

class Card extends React.Component {
    render() {
        return (<div className="minicard">{this.props.children}</div>)
    }
}

class SelectableCard extends React.Component {
    render() {
        let isSelected = this.props.selected ? "selected" : "";
        let className = "selectable " + isSelected;
        return (
            <Card>
                <div className={className} onClick={this.props.onClick}>
                    {this.props.children}
                    <div className="check">
                        <span className="checkmark">✓</span>
                    </div>
                </div>
            </Card>
        );
    }
}

class SelectableTitleCard extends React.Component {

    render() {
        let {
            title,
            description,
            type,
            selected
        } = this.props;
        if (type === "image") {
            return (

                <SelectableCard onClick={this.props.onClick}
                                selected={selected}>
                    <div className="content">
                        <img src={`${description}`} alt={`${title}`}
                             style={{width: "100%", height: "100%"}}/>
                    </div>
                </SelectableCard>


            );
        } else if (type === "video") {
            return (

                <SelectableCard onClick={this.props.onClick}
                                selected={selected}>
                    <div className="content">
                        <video src={`${description}`} alt={`${title}`}
                               style={{width: "100%", height: "100%"}}
                               autoPlay="1" muted="1" loop/>
                    </div>
                </SelectableCard>


            );
        }
    }
}

class SelectableCardList extends React.Component {

    constructor(props) {
        super(props);
        let selected = props.multiple ? [] : 0;
        let initialState = {
            selected: selected
        };
        this.state = initialState;
    }

    onItemSelected(index) {
        this.setState((prevState, props) => {
            if (props.multiple) {
                var selectedIndexes = prevState.selected;
                var selectedIndex = selectedIndexes.indexOf(index);
                if (selectedIndex > -1) {
                    selectedIndexes.splice(selectedIndex, 1);
                    props.onChange(selectedIndexes);
                } else {
                    if (!(selectedIndexes.length >= props.maxSelectable)) {
                        selectedIndexes.push(index);
                        props.onChange(selectedIndexes);
                    }
                }
                return {
                    selected: selectedIndexes
                };
            } else {
                props.onChange(index);
                return {
                    selected: index
                }
            }
        });
    }

    render() {
        var {
            contents,
            multiple
        } = this.props;
        if (contents){
            var content = contents.map((cardContent, i) => {
                    var {
                        title,
                        description,
                        type,
                        selected
                    } = cardContent;
                    var selected = multiple ? this.state.selected.indexOf(i) > -1 : this.state.selected == i;
                    return (
                        <SelectableTitleCard key={i}
                                             title={title} description={description}
                                             type={type}
                                             selected={selected}
                                             onClick={(e) => this.onItemSelected(i)}/>
                    );
            });
        }

        return (<div className="cardlist">{content}</div>);
    }
}

// class Example extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     onListChanged(selected) {
//         this.setState({
//             selected: selected
//         });
//     }
//
//     submit() {
//         window.alert("Selected: " + this.state.selected);
//         console.log(this.props.value)
//     }
//
//     render() {
//         return (
//             <div className="column">
//                 <h1 className="title">{this.props.title}</h1>
//                 <SelectableCardList
//                     multiple={this.props.multiple}
//                     maxSelectable={this.props.maxSelectable}
//                     contents={this.props.cardContents}
//                     onChange={this.onListChanged.bind(this)}
//                     value={this.props.value}
//                 onChange={this.props.onChangeValue}/>
//                 <button className="card" onClick={(e) => this.submit()}>
//                     Get selected
//                 </button>
//             </div>);
//     }
// }


export default SelectableCardList;