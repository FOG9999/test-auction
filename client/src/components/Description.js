import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import links from '../images/imageLinks';

class Description extends Component {
    state = {
        descriptionList: [...this.props.descriptionList]        
    }
    onChangeDesc = (e, index, isChangeName) => {
        let newList = [...this.state.descriptionList];
        if (isChangeName)
            newList[index] = {
                ...newList[index],
                name: e.target.value
            }
        else newList[index] = {
            ...newList[index],
            value: e.target.value
        }
        this.props.onUpdateList(newList);
        this.setState({
            descriptionList: [...newList]
        })
    }
    displayDescriptionList = () => {
        return <div className="description-content">
            {this.state.descriptionList.map((desc, index) => {
                return <div className="one-desc" key={index}>
                    <div className="minus-div" onClick={() => this.onDeleteDesc(index)}>
                        <img src={links.minusBtn} id="minus-btn" alt=""/>
                    </div>
                    <input className="form-control" type="text" style={{width: "100px"}}
                    value={desc.name} placeholder="Name" id="one-desc-name" onChange={(e) => this.onChangeDesc(e, index, true)} />&nbsp;:&nbsp;
                    <input className="form-control" type="text" style={{width: "300px"}}
                    value={desc.value} placeholder="Value" id="one-desc-value" onChange={(e) => this.onChangeDesc(e, index, false)} />                    
                </div>
            })}
        </div>
    }
    onDeleteDesc = (index) => {
        let list = [...this.state.descriptionList];
        list.splice(index, 1);
        this.props.onUpdateList(list);
        this.setState({
            descriptionList: [...list]
        })
    }
    onAddNewDesc = () => {
        let list = [...this.state.descriptionList];
        list.push({
            name: '',
            value: ''
        })
        this.props.onUpdateList(list);
        this.setState({
            descriptionList: [...list]
        })
    }
    render() {
        return (
            <div className="description-wrapper">
                <div className="description-header">
                    Description
                </div>
                {this.displayDescriptionList()}
                <button className="circle-btn btn btn-dark" onClick={this.onAddNewDesc} style={{borderRadius: "50%"}}>+</button>
            </div>
        );
    }
}

export default Description;