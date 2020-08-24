import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import penguin from '../images/penguin.png';
import loading from '../images/pending.gif';
import Loading from './Loading';
import { actions } from '../redux/actions';
import { connect } from 'react-redux';

class Summary extends Component {
    constructor(props){
        super(props);
        this.props.dispatchLoading();
    }
    state = {
        order: null
    }
    componentDidMount() {
        if (localStorage.getItem('token') && localStorage.getItem('userID'))
            this.props.authen(localStorage.getItem('token'), localStorage.getItem('userID'), this.getOrder);
        else this.props.dispatchShowLogin();
    }
    getOrder = () => {
        fetch(`/getOrder?orderID=${this.props.match.params.orderID}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(order => {                
                this.setState({
                    order: order
                })
                this.props.dispatchLoaded();
            })
    }
    displayCartSummary = () => {
        if (this.state.order) {
            return <div className="current-order">
                <div className="cart-header-summary">
                    {'Your cart contains ' + ((this.state.order.listOfItems.length > 1) ? (this.state.order.listOfItems.length + ' items') : ('1 item'))}
                </div>
                <div className="my-cart-summary">
                    {
                        this.state.order.listOfItems.map((item, index) => {
                            return <div className="item" key={index}>
                                <div className="item-info-cart">
                                    <div className="item-img-cart">
                                        <img src={item.images[0]} alt="" id="summary-item-img" />
                                    </div>
                                    <div className="item-name-quantity-cart">
                                        <div className="item-name-price">
                                            <span id="item-name-cart">{item.name}</span>
                                            <span id="item-price-cart">
                                                <em id="final-price">$ {item.currentPrice}</em>
                                            </span>
                                        </div>
                                        <div className="item-quantity-cart">
                                            Quantity: 1
                            </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        }
    }
    displayAddressInfo = () => {
        const order = this.state.order;
        if (order) {
            return <tr>
                <th>{order.firstname}</th>
                <th>{order.lastname}</th>
                <th>{order.address}</th>
                <th>{order.email}</th>
                <th>{order.phoneNum}</th>
                <th>{order.createdAt.substring(0, 10)}</th>
            </tr>
        }
    }
    render() {
        return (
            <div className="summary-wrapper">
                <Header />
                {(this.props.loading)?<Loading />:null}
                <div className="summary-content">
                    <div className="current">
                        <div className="summary-header">
                            My Orders<br />
                            <u id="pending">Pending Payment</u>
                        </div>
                        {this.displayCartSummary()}                    
                    <div className="address-info">
                        <div className="address-header-summary">
                            Address Information
                            </div>
                        <div className="address-content">
                            <table className="table">
                                <thead>
                                    <tr className="address-thead">
                                        <th>First name</th>
                                        <th>Last name</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Phone number</th>
                                        <th>Created at</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.displayAddressInfo()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="address-header" style={(this.state.order)?{display:"block"}:{display:"none"}}>
                    <img src={penguin} alt="" id="penguin" /><br />
                    <img src={loading} alt="" id="loading" />
                </div>
                <div className="previous-order">

                </div>
            </div>
            <Footer />
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authen: (token, userID, postAuthen) => {
            dispatch(actions.authenticateUserBeta(token, userID, postAuthen))
        },
        dispatchShowLogin: () => {
            dispatch(actions.showLogin())
        },
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        dispatchLoaded: () => {
            dispatch(actions.onLoaded());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);