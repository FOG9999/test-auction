import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import { connect } from 'react-redux';
import { actions } from "../redux/actions";
import {Redirect} from 'react-router-dom';
import LoadingScreen from './Loading';

class Checkout extends Component {
    componentDidMount() {
        this.props.authen(localStorage.getItem("token"), localStorage.getItem('userID'), this.getBoughtItems)
    }

    getBoughtItems = () => {
        fetch('/getCart',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                userID: localStorage.getItem('userID')
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            this.setState({
                listOfItems: [...json],
                total: json.reduce((init, current) => (init + current.currentPrice), 0)
            })
        })
    }
    
    onConfirmOrder = () => {
        const {inputAddress,inputEmail,inputFirstName,inputLastName,inputPhone,listOfItems, total} = this.state;
        if(inputAddress && inputFirstName && inputEmail && inputLastName && inputPhone){
            this.props.dispatchLoading();
            fetch('/createOrder',{
                method: "POST",
                mode: "cors",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: inputEmail,
                    firstname: inputFirstName,
                    lastname: inputLastName,
                    address: inputAddress,
                    phoneNum: inputPhone,
                    userBoughtID: localStorage.getItem('userID'),
                    listOfItems: listOfItems,
                    total: total
                })
            })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                this.props.dispatchLoaded();
                this.setState({
                    redirectToSummary: true,
                    orderID: json._id
                })
            })
        }
    }

    state = {
        inputFirstName: '',
        inputLastName: '',
        inputEmail: '',
        inputAddress: '',
        inputPhone: '',
        listOfItems: [],
        hasEmptyField: true,
        redirectToSummary: false,
        orderID: '',
        total: 0
    }

    onChangeFirstName = (e) => {
        this.setState({
            inputFirstName: e.target.value
        })
    }

    onChangeLastName = (e) => {
        this.setState({
            inputLastName: e.target.value
        })
    }

    onChangeEmail = (e) => {
        this.setState({
            inputEmail: e.target.value
        })
    }

    onChangeAddress = (e) => {
        this.setState({
            inputAddress: e.target.value
        })
    }

    onChangePhone = (e) => {
        this.setState({
            inputPhone: e.target.value
        })
    }

    redirectToSummary = () => {
        if(this.state.redirectToSummary){
            return <Redirect to={`/order-summary/${this.state.orderID}`} />
        }
    }

    render() {
        return (
            <div className="checkout-wrapper">
                <Header />
                {(this.props.loading)?<LoadingScreen />:null}
                {this.redirectToSummary()}
                <div className="checkout-content">
                    <div className="checkout-header">
                        Enter Billing Address
                    </div>
                    <div className="checkout-inputs">
                        <div className="form-group">
                            <label className="input-label">First Name: </label><span className="is-required">required</span><br />
                            <input type="text" value={this.state.inputFirstName} onChange={this.onChangeFirstName}
                            className="input-checkout form-control" required />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Last Name: </label><span className="is-required">required</span><br />
                            <input type="text" value={this.state.inputLastName} onChange={this.onChangeLastName}
                            className="input-checkout form-control" required />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Email: </label><span className="is-required">required</span><br />
                            <input type="text" value={this.state.inputEmail} onChange={this.onChangeEmail}
                            className="input-checkout form-control" required />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Address: </label><span className="is-required">required</span><br />
                            <input type="text" value={this.state.inputAddress} onChange={this.onChangeAddress}
                            className="input-checkout form-control" required />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Phone Number: </label><span className="is-required">required</span><br />
                            <input type="text" value={this.state.inputPhone} onChange={this.onChangePhone}
                            className="input-checkout form-control" required />
                        </div>
                    </div>
                    <div className="chekout-annoucement">
                        <img src="https://www.chilindo.com/gfx/delivery-car.png" alt="" id="car-img-cart" /> You will receive your items from August 4th to August 8th
                    </div>
                    <div className="direction-btns">
                        <div className="back-to-cart-btn">
                            <a href="/my-cart" id="link">Back to your cart</a>
                        </div>
                        <div className="next-to-summary" onClick={this.onConfirmOrder}>
                            {/* {(this.state.inputAddress && this.state.inputFirstName && this.state.inputEmail && this.state.inputLastName && this.state.inputPhone)?<a href="/order-summary" id="link">Next to summary page</a>:"Next to summary page"} */}
                            Next to summary page
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        dispatchLoaded: () => {
            dispatch(actions.onLoaded())
        },
        authen: (token, userID, postAuthen) => {
            dispatch(actions.authenticateUserBeta(token, userID, postAuthen))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);