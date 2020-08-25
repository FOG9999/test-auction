import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
import { Modal } from 'react-bootstrap';
import { DatePicker } from '@y0c/react-datepicker';
import LoadingScreen from './Loading';
import Description from './Description';

var fileReader = new FileReader();

const showDetail = {
    animationName: 'showDetailAnim',
    animationDuration: '1s',
    display: 'block'
}

const hideDetail = {
    display: 'none'
}

const forEndedOrBidding = {
    endedStyle: {
        borderLeft: 'orange solid 2px'
    },
    biddingStyle: {
        borderLeft: 'green solid 2px'
    }
}

// const regex = /(^https:\/\/)*[\w\S]/i;

class SellingItem extends Component {
    state = {
        seeDetail: -1,
        userItems: [],
        uploadItemName: '',
        uploadCurrentPrice: 0,
        //imageLink: '',
        showModalAddItem: false,
        endDate: new Date(),
        fileFront: '',
        fileBack: '',
        fileLeft: '',
        fileRight: '',
        previewSrc: '',
        descriptionList: [],
        uploadSellerPhone: '',
        uploadSellerAddress: ''
    }

    componentDidMount() {
        this.checkAuthen();
    }

    checkAuthen = () => {
        this.props.dispatchLoading();
        this.props.authen(localStorage.getItem('token'), localStorage.getItem('userID'), this.getUserItem);
    }

    onHideAddItem = () => {
        this.setState({
            showModalAddItem: false
        })
    }

    onOpenAddItem = () => {
        this.setState({
            showModalAddItem: true
        })
    }

    onChangeEndDate = (date) => {
        this.setState({
            endDate: date.toDate()
        })
    }

    getUserItem = () => {
        fetch('/getUserItem', {
            method: "POST",
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
                this.props.dispatchLoaded();
                this.setState({
                    userItems: [...json]
                })
            })
    }

    showDetail = (index) => {
        if (this.state.seeDetail === index)
            this.setState({
                seeDetail: -1
            })
        else this.setState({
            seeDetail: index
        })
    }

    displayUserItems = () => {
        if (this.state.userItems.length > 0) {
            return <div className="sellingitem-list">
                {
                    this.state.userItems.map((item, index) => {
                        return <div className="sellingitem" key={index} style={
                            ((new Date(item.endDate)).getTime() > (new Date()).getTime()) ? forEndedOrBidding.biddingStyle : forEndedOrBidding.endedStyle
                        }>
                            <img src={item.images[0] || item.images} alt="" id="sellingitem-image" />
                            <div className="sellingitem-info">
                                <span id="sellingitem-name">{item.name}</span><br />
                                <span id="sellingitem-original-price">Original Price: {item.originalPrice}</span>
                                <span id="sellingitem-currBid">Current Bid:        {item.currentPrice}&nbsp;{((new Date(item.endDate)).getTime() < (new Date()).getTime()) ? `(After auction fee: ${this.showAfterAuctionFee(item)})`:null}</span><br />
                                <span id="sellingitem-currWinner">Current Winner:  {(item.userBoughtID) ? `${item.userBoughtID.name}/${item.userBoughtID.email}` : 'none'}</span>                                
                                <br />
                                <span id="begin-end">
                                    Begin Date: {item.beginDate.substring(0, 10)}&nbsp;&nbsp;&nbsp;End Date: {item.endDate.substring(0, 10)}
                                </span><br />
                                <span>
                                    {((new Date(item.endDate)).getTime() > (new Date()).getTime()) ? <b style={{ color: 'green' }}>(Bidding)</b> : <b style={{ color: 'red' }}>(Closed)</b>}
                                </span>&nbsp;
                                <span id="see-details" onClick={() => this.showDetail(index)}>{(this.state.seeDetail === index) ? 'Hide detail' : 'See details'}</span>&nbsp;<span><a href={`/item/${item._id}`}>Go to bidding page</a></span>
                            </div>
                            <div className="details-forSelected" style={(this.state.seeDetail === index) ? showDetail : hideDetail}>
                                <div className="details-header">
                                    Description
                            </div>
                                {(item.detail[0] !== '')?
                                <div className="details-content">
                                    <ul>
                                    {
                                        item.detail.map((desc,index) => {
                                            return <li>
                                                {`${desc.name} : ${desc.value}`}
                                            </li>
                                        })
                                    }
                                    </ul>
                                </div>:
                                <div className="details-content">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </div>}
                            </div>
                        </div>
                    })
                }
            </div>
        }
    }

    onChangeItemName = (e) => {
        this.setState({
            uploadItemName: e.target.value
        })
    }

    onChangeItemStartingPrice = (e) => {
        this.setState({
            uploadCurrentPrice: e.target.value
        })
    }

    onChangeSellerPhone = (e) => {
        this.setState({
            uploadSellerPhone: e.target.value
        })
    }

    onChangeSellerAddress = (e) => {
        this.setState({
            uploadSellerAddress: e.target.value
        })
    }

    onUpdateDescriptionList = (newList) => {
        this.setState({
            descriptionList: [...newList]
        })
    }

    onSubmitAddItem = async () => {
        const { uploadItemName, uploadCurrentPrice, endDate, fileFront, fileBack, fileLeft, fileRight, descriptionList, uploadSellerAddress, uploadSellerPhone } = this.state;
        if (!!uploadCurrentPrice && !!uploadItemName && endDate.getTime() > (new Date()).getTime() && (fileFront && fileBack && fileLeft && fileRight)) {
            this.setState({
                showModalAddItem: false
            })
            this.props.dispatchLoading();
            let formData = new FormData();
            formData.append("fileFront", fileFront);
            formData.append("fileBack", fileBack);
            formData.append("fileLeft", fileLeft);
            formData.append("fileRight", fileRight);
            await Promise.all([
                fetch('/userUploadItem', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        userSellID: localStorage.getItem("userID"),
                        name: uploadItemName,
                        endDate: endDate,
                        startingPrice: uploadCurrentPrice,
                        imageName: [fileFront.name, fileBack.name, fileLeft.name, fileRight.name],
                        descriptionList: descriptionList,
                        sellerPhone: uploadSellerPhone,
                        sellerAddress: uploadSellerAddress,
                        auctionFeeType: (uploadCurrentPrice >= 100)?((uploadCurrentPrice < 1000)?1:2):0
                    })
                }),
                fetch('https://upload-server.glitch.me/upload', {
                    method: "POST",
                    // mode: "cors",
                    body: formData
                })
            ])
                .then(responses => Promise.all([responses[0].json(), responses[1].json()]))
                .then(jsons => {
                    console.log(jsons[0]);
                    console.log(jsons[1]);
                    this.getUserItem();
                    this.props.dispatchLoaded();
                    this.setState({
                        uploadItemName: '',
                        uploadCurrentPrice: 0,
                        fileFront: '',
                        fileBack: '',
                        fileLeft: '',
                        fileRight: '',
                        descriptionList: []
                    })
                })
        }
        else alert('Empty field detected');
    }

    onchangeUploadFront = (e) => {
        this.setState({
            fileFront: e.target.files[0]
        })
        // fileReader.readAsDataURL(e.target.files[0]) => same as being put below because fileReader is global
        fileReader.onloadend = () => {
            this.setState({
                previewSrc: fileReader.result
            })
        }      

        // onloadend happens after readAsDataURL, so result is not empty
        
        fileReader.readAsDataURL(e.target.files[0])
    }

    onchangeUploadBack = (e) => {
        this.setState({
            fileBack: e.target.files[0]
        })
    }

    onchangeUploadLeft = (e) => {
        this.setState({
            fileLeft: e.target.files[0]
        })
    }

    onchangeUploadRight = (e) => {
        this.setState({
            fileRight: e.target.files[0]
        })
    }

    showAuctionFee = () => {
        let uploadPrice = this.state.uploadCurrentPrice;
        if(uploadPrice < 100){
            return '$ 5';
        }
        else if(uploadPrice < 1000){
            return '5% of item\'s final price';
        }
        else return '10% of item\'s final price';
    }

    showAfterAuctionFee = (item) => {
        if(item && item.isSold){
            switch(item.auctionFeeType){
                case 0: return item.currentPrice - 5;
                case 1: return item.currentPrice - item.currentPrice/20
                case 2: return item.currentPrice - item.currentPrice/10
                default: return 0;
            }
        }
        else return null;
    }

    render() {
        return (
            <div className="sellingitem-wrapper">
                <Header />
                {(this.props.loading) ? <LoadingScreen /> : null}
                <div className="sellingitem-content">
                    <div className="sellingitem-header">
                        My bidding items
                    </div>
                    {this.displayUserItems()}
                    <div className="btn-add-item" onClick={this.onOpenAddItem}>Upload new item</div>
                </div>
                <Modal show={this.state.showModalAddItem} onHide={this.onHideAddItem} style={{ height: 'fit-content' }}>
                    <Modal.Header closeButton>
                        <strong>Add new item</strong>
                    </Modal.Header>
                    <Modal.Body style={{ height: 'fit-content' }} className="modal-add-body">
                        <div className="image-preview">
                            <img src={this.state.previewSrc} alt='' id='image-preview' />                            
                        </div>
                        <label>Item name:</label><br />
                        <input className="form-control" value={this.state.uploadItemName} onChange={this.onChangeItemName} type='text' />
                        <label>Item starting price:</label><br />
                        <input className="form-control" value={this.state.uploadCurrentPrice} onChange={this.onChangeItemStartingPrice} type='number' />
                        <label style={{color: "red"}}>Auction fee: {this.showAuctionFee()}</label><br/>
                        <label>Item image (Front):</label><br />
                        <input type="file" onChange={this.onchangeUploadFront} /><br />
                        <label>Item image (Back):</label><br />
                        <input type="file" onChange={this.onchangeUploadBack} /><br />
                        <label>Item image (Left):</label><br />
                        <input type="file" onChange={this.onchangeUploadLeft} /><br />
                        <label>Item image (Right):</label><br />
                        <input type="file" onChange={this.onchangeUploadRight} /><br />                        
                        <Description descriptionList={this.state.descriptionList} onUpdateList={this.onUpdateDescriptionList}/><br/>
                        <label>Choose item's end date:</label>&nbsp;                        
                        <DatePicker onChange={this.onChangeEndDate} />
                        <p style={{color: "red"}}>
                            These below infomation is served for delivery process.
                        </p>
                        <label>Contact phone number:</label><br />
                        <input className="form-control" value={this.state.uploadSellerPhone} onChange={this.onChangeSellerPhone} type='text' />
                        <label>Delivery address:</label><br />
                        <input className="form-control" value={this.state.uploadSellerAddress} onChange={this.onChangeSellerAddress} type='text' />
                    </Modal.Body>
                    <Modal.Footer style={{ height: 'fit-content' }}>
                        <button className="btn btn-primary" onClick={this.onSubmitAddItem}>Add Item</button>
                    </Modal.Footer>
                </Modal>
                <Footer />
            </div>
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
        authen: (token, userID, doneAuthen) => {
            dispatch(actions.authenticateUserBeta(token, userID, doneAuthen))
        },
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        dispatchLoaded: () => {
            dispatch(actions.onLoaded())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SellingItem);