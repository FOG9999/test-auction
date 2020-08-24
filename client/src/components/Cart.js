import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import hammer from '../images/hammer.png';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
import links from '../images/imageLinks';
import LoadingScreen from './Loading';

class Cart extends Component {
    state = {
        cart: [],
        total: 0,
        havePendingOrder: false,
        pendingOrderID: ''
    }

    checkAuthen = () => {
        this.props.dispatchLoading();
        this.props.authen(localStorage.getItem("token"), localStorage.getItem("userID"), this.getCart);
    }

    componentDidMount() {
        this.checkAuthen();
    }

    getCart = () => {
        fetch('/getCart', {
            method: "POST",
            mode: "cors",
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                userID: localStorage.getItem("userID")
            })
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    cart: [...data],
                    total: data.reduce((init, current) => (init + current.currentPrice), 0)
                })
            })

        // check if user has a pending order 
        fetch('/checkPendingOrder', {
            method: "POST",
            mode: "cors",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userBoughtID: localStorage.getItem("userID")
            })
        })
            .then(res => res.json())
            .then(result => {
                if (!result.havePendingOrder) // no pending order
                    this.setState({
                        havePendingOrder: result.havePendingOrder
                    })
                else this.setState({ // order is pending
                    havePendingOrder: true,
                    pendingOrderID: result.orderID
                })
            })
    }

    displayCart = () => {
        if (this.state.cart.length > 0) {
            return <div className="items-list">
                {
                    this.state.cart.map((item, index) => {
                        return <div className="item" key={index}>
                            <div className="shipment">
                                Shipment: Receive from August 1st to August 10th
                        </div>
                            <div className="item-info-cart">
                                <div className="item-img-cart">
                                    <img src={item.images[0]} alt="" id="cart-item-img" />
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
                {(this.state.havePendingOrder) ?
                    <span>
                        <img src={links.warningIcon} id="warning-icon" alt='' />
                        <b>You have an order that's not paid yet.<a href={`/order-summary/${this.state.pendingOrderID}`}>Check now</a></b>
                    </span>
                    : null
                }
            </div>
        }
        else {
            return <div className="empty-cart">
                <img src={links.sadIcon} alt="" id="img-empty-cart" />
                <b id="bold-link">Your cart is empty. <a href='/'>Countinue bidding?</a></b><br />
                {(this.state.havePendingOrder) ?
                    <span>
                        <img src={links.warningIcon} id="warning-icon" alt='' />
                        <b>You have an order that's not paid yet.<a href={`/order-summary/${this.state.pendingOrderID}`}>Check now</a></b>
                    </span>
                    : null
                }
            </div>
        }
    }

    render() {
        return (
            <div className="cart-wrapper">
                <Header />
                {(this.props.loading) ? <LoadingScreen /> : null}
                <div className="cart-content">
                    <div className="cart-items">
                        <div className="cart-header">
                            <span id="my-cart">
                                <img src={hammer} alt="" id="hammer-cart" />
                                My auction
                            </span>
                        </div>
                        {this.displayCart()}
                    </div>
                    <div className="order-summary">
                        <span id="order-summary-cart">Order Summary</span>
                        <br />
                        <div className="price-wrapper"><span id="price-title">Item Total</span><span id="price">$ {this.state.total}</span></div>
                        <div className="price-wrapper"><span id="price-title">Delivery</span><span id="price">$ 1</span></div>
                        <div className="price-wrapper"><span id="price-title">Total</span><span id="big-price">$ {this.state.total + 1}</span></div>
                        <div className="checkout-btn-cart">
                            <span id="checkout-btn-span">
                                {(this.state.cart.length > 0 || !this.state.havePendingOrder) ? <a href="/checkout" id="link">Checkout Now</a> : "Checkout Now"}
                            </span>
                        </div>
                        <span>
                            <img src="https://www.chilindo.com/gfx/delivery-car.png" alt="" id="car-img-cart" />
                        </span>
                        <span className="minimize">
                            Nationwide delivery | from $ 1
                            </span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        logged: state.logged,
        loading: state.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        authen: (token, userID, doneAuthen) => {
            dispatch(actions.authenticateUserBeta(token, userID, doneAuthen))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);