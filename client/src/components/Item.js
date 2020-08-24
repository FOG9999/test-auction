import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import links from '../images/imageLinks';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
import converter from '../functions/converter';
import LoadingScreen from './Loading';
import DefaultDesc from './DefaultDescription';
import leftArrow from '../images/left arrow btn.png';
import rightArrow from '../images/right arrow btn.png';

class Item extends Component {
    constructor(props) {
        super(props);
        // in case go to page by entering url
        window.scrollTo(0, 0);
        this.getItemAndSameCateItems();
        if (localStorage.getItem('token') && localStorage.getItem('userID')) {
            this.props.authen(localStorage.getItem('token'), localStorage.getItem('userID'));
        }
    }

    state = {
        timeLeft: '',
        inputBid: 0,
        currentBid: 0,
        currentWinner: '...',
        error: '',
        selectedImg: 0
    }

    getItemAndSameCateItems = async () => {
        this.props.dispatchLoading();
        if (!this.props.selectedItem) {
            await this.props.selectItem(this.props.match.params.id);
        }
    }

    returnCurrentWinner = () => {
        if (this.props.auctionersForItem.length > 0) {
            let currWinner = this.props.auctionersForItem[0];
            this.props.auctionersForItem.forEach((value, index) => {
                if (value.givenPrice > currWinner.givenPrice) {
                    currWinner = { ...value }
                }
            });
            return `${currWinner.auc.name}/${currWinner.auc.email}`;
        }
        else return "No one auction yet";
    }

    componentDidMount(){
        setInterval(() => {
            this.props.dispatchLoading();
            this.props.dispatchAutoUpdate(this.props.match.params.id);
        },60000);
    }

    displayTableOfAuctioner = () => {
        if (this.props.auctionersForItem.length > 0) {
            return (
                <tbody>
                    {
                        this.props.auctionersForItem
                            .sort((a, b) => (b.givenPrice - a.givenPrice))
                            .map((auctioner, index) => {
                                return (<tr key={index}>
                                    <th>{`${auctioner.auc.name} / ${auctioner.auc.email}`}</th>
                                    <th>{auctioner.givenPrice}</th>
                                    <th>{converter.displayAuctionTime(auctioner.auctionAt)}</th>
                                </tr>)
                            })
                    }
                </tbody>
            )
        }
    }

    onClickImage = (index) => {
        this.setState({
            selectedImg: index
        })
    }

    onClickArrowLeft = () => {
        this.setState({
            selectedImg: (this.state.selectedImg + 3) % 4
        })
    }

    onClickArrowRight = () => {
        this.setState({
            selectedImg: (this.state.selectedImg + 1) % 4
        })
    }

    displayItemImages = (item) => {
        if (item) {
            if (item.images.length === 1) {
                return <div className="imgItem">
                    <img src={item.images} alt="" id="mainItemImage" />
                </div>

            }
            else {
                return <div className="item-images-container">
                    <div className="main-img-area">
                        <img src={leftArrow} alt="" id="left-arrow" onClick={this.onClickArrowLeft} />
                        <img src={item.images[this.state.selectedImg]} alt="" id="main-img" />
                        <img src={rightArrow} alt="" id="right-arrow" onClick={this.onClickArrowRight} />
                    </div><br />
                    <ul className="all-images">
                        {
                            item.images.map((img, index) =>
                                <li key={index} id="li-image"><img alt='' src={img} id="small-img" onClick={() => this.onClickImage(index)} /></li>
                            )
                        }
                    </ul>
                </div>
            }
        } else {
            return <div className="imgItem">
                <img src={links.itemImageExample} alt='' id="mainItemImage" />
            </div>
        }
    }

    displaySameCateItems = () => {
        if (this.props.sameCateItems.length > 0) {
            return (<div className="see-more">
                {
                    this.props.sameCateItems.map((item, index) => {
                        return <div className="test-item" key={index}>
                            <h5 id="test-item-name">{item.name}</h5>
                            <div className="test-item-info">
                                <img src={item.images} alt="" id="test-item-img" />
                                <div className="test-info">
                                    <h5 id="test-status">{(converter.checkEndedForSameCateItem(item.endDate)) ? "Ended" : "Bidding"}</h5>
                                        $ {item.currentPrice}<br />
                                    <button className="btn btn-primary btn-place-bid-side">
                                        <a href={`/item/${item._id}`} className="link-same-cate">Place Bid</a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>)
        }
    }

    onChangeInputBid = (e) => {
        this.setState({
            inputBid: e.target.value
        })
    }

    onPlaceBid = () => {
        if (isNaN(parseInt(this.state.inputBid))) {
            this.setState({
                error: 'Invalid input',
                inputBid: 0
            })
        }
        else if (parseInt(this.state.inputBid) < this.props.selectedItem.currentPrice) {
            this.setState({
                error: 'Bid a greater value than the current one',
                inputBid: 0
            })
        }
        else {
            this.props.dispatchLoading();
            this.props.authenBeta(localStorage.getItem("token"), localStorage.getItem("userID"), this.placeBidPostAuthen)           
        }
    }

    placeBidPostAuthen = () => { // if this function is called, that means user is authenticated
        this.props.placeBid(localStorage.getItem("userID"), this.props.match.params.id, this.state.inputBid);
        this.setState({
            error: '',
            inputBid: 0
        })
    }

    componentDidMount() {
        fetch(`/item?id=${this.props.match.params.id}`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
            },
            mode: 'cors'
        })
            .then(res => res.json())
            .then(json => {
                setInterval(() => {
                    this.setState({
                        timeLeft: converter.convertToTimer(json.endDate)
                    })
                }, 1000)
                this.props.dispatchLoaded();
            })
    }

    displayDescription = () => {
        if (this.props.selectedItem) {
            let list = this.props.selectedItem.detail;
            if (list[0].name && list[0].value) {
                return <ul className="ulDescription">
                    {
                        list.map((desc, index) => {
                            return <li key={index}>
                                {`${desc.name} : ${desc.value}`}
                            </li>
                        })
                    }
                </ul>
            }
            else return <DefaultDesc />
        }
        else return <DefaultDesc />
    }

    render() {
        return (
            <div className="item-wrapper">
                <Header />
                {(this.props.loading) ? <LoadingScreen /> : null}
                <div className="mainInfo">
                    <div className="bidInfo">
                        {this.displayItemImages(this.props.selectedItem)}
                        <div className="itemBidInfo">
                            <div className="itemInfoStatus">
                                <ul id="ulItemBidInfo">
                                    <li id="itemName">
                                        {(this.props.selectedItem) ? this.props.selectedItem.name : "Loading"}
                                    </li>
                                    <li id="itemAuctionStatus">
                                        {this.state.timeLeft}
                                    </li>
                                </ul>
                            </div>
                            <div className="currentAuction">
                                <div className="current-div">
                                    <div className="currentBid">
                                        <h6 id="h5current">CURRENT BID</h6>
                                        <h5 id="h4currentBidPrice">$ {(this.props.selectedItem) ? this.props.selectedItem.currentPrice : '...'}</h5>
                                    </div>
                                    <div className="currentWinner">
                                        <h6 id="h5current">
                                            <img src={links.trophyLink} id="trophyIconItem" alt='' />
                                        CURRENT WINNER
                                        </h6>
                                        <h5 id="h4currentWinner">{this.returnCurrentWinner()}</h5>
                                    </div>
                                </div>
                                <div className="placeNewBid">
                                    <p>PLACE YOUR BID: <b style={{ color: 'red' }}><br />{this.state.error}</b></p>
                                    <div className="input-bid-value">
                                        <input id="input-form-bid" className="form-control" type="number" value={this.state.inputBid} onChange={this.onChangeInputBid} />
                                        <button className="btn btn-primary btn-place-bid" onClick={this.onPlaceBid}
                                            disabled={this.state.timeLeft === '00:00:00'}>
                                            Place Bid
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="moreInfo">
                        <div className="extraInfo">
                            <img src={links.calendarLink} id="extraIconItem" alt="" /><br />
                                30 days return policy
                            </div>
                        <div className="extraInfo">
                            <img src={links.deliveryLink} alt="" id="extraIconItem" /><br />
                                Shipping from : $ 2
                            </div>
                        <div className="extraInfo">
                            <img src={links.auctionLink} alt="" id="extraIconItem" /><br />
                                Auctions from $ 1 !
                            </div>
                        <div className="extraInfo">
                            <img src={links.phoneLink} id="extraIconItem" alt="" /><br />
                                (028)-36222111
                            </div>
                    </div>
                </div>
                <div className="seeMoreAndDetails">
                    <div className="seemore-details-container">
                        <div className="details">
                            <div className="auctioner-table">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Amount</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    {this.displayTableOfAuctioner()}
                                </table>
                            </div>
                            <div className="product-details">
                                <div className="product-description">
                                    <p id="detail-header">Description</p>
                                    {this.displayDescription()}
                                </div>
                                <div className="shipping">
                                    <p id="detail-header">Shipping</p>
                            No matter how many items you have on your invoice, you will always only pay one delivery charge plus a 10% service charge to make sure your parcel is sent safe and fast.
                            </div>
                                <div className="policy">
                                    <p id="detail-header">Return Policy</p>
                            We offer a 30 day return policy after we receive your order. Our 30 days return policy applies for all products so you can safely purchase clothes, shoes etc. Note: All products should be returned in the same condition as received. You will receive a full refund excluding return shipping fees
                            </div>
                                <div className="payment">
                                    <p id="detail-header">Payment</p>
                            We offer convenient and secure gateway to make online payments through credit/debit Visa or MasterCard.
                            </div>
                            </div>
                        </div>
                        {this.displaySameCateItems()}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        selectedItem: state.selectedItem,
        auctionersForItem: state.auctionersForItem,
        logged: state.logged,
        showLogin: state.showLogin,
        sameCateItems: state.sameCateItems,
        selected_cate: state.selected_cate,
        loading: state.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectItem: (id) => {
            dispatch(actions.getAnItem(id));
            dispatch(actions.getAuctionersForItem(id))
        },
        placeBid: (userID, itemID, inputBid) => {
            dispatch(actions.placeBid(inputBid, itemID, userID))
        },
        authen: (token, userID) => {
            dispatch(actions.authenticateUser(token, userID))
        },
        authenBeta: (token, userID, postAuthen) => {
            dispatch(actions.authenticateUserBeta(token, userID, postAuthen))
        },
        showLogin: () => {
            dispatch(actions.showLogin())
        },
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        dispatchLoaded: () => {
            dispatch(actions.onLoaded())
        },
        dispatchAutoUpdate: (itemID) => {
            dispatch(actions.autoUpdateBidding(itemID))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);