import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
//import loading from '../images/loading.gif';
import auction from '../images/hammer.png';
import { Redirect } from 'react-router-dom';
import LoadingScreen from './Loading';

class Home extends Component {
    componentDidMount() {
        this.checkAuthen();
    }

    checkAuthen = () => {
        if (localStorage.getItem('token') && localStorage.getItem('userID')) {
            this.props.authen(localStorage.getItem('token'), localStorage.getItem('userID'));
        }
        this.getAllItems();
    }

    getAllItems = async () => {
        this.props.dispatchShowFilter();
        this.props.dispatchLoading();
        // await this.props.getAllItems(1);        
        fetch('/getAllItems', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                page: this.state.page
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.isLastPage) {
                    this.setState({
                        isLastPage: true,
                        allItems: [...json.data]
                    })
                }
                else this.setState({
                    isLastPage: false,
                    allItems: [...json.data]
                })
                this.props.dispatchLoaded();
            })
    }

    state = {
        selectedID: '',
        page: 1,
        isLastPage: false,
        allItems: []
    }

    displayCateName = () => {
        switch (this.props.selected_cate) {
            case 0: return "Electronics";
            case 1: return "For Kids";
            case 2: return "For Her";
            case 3: return "For Him";
            case 4: return "Sports";
            case 5: return "Travel";
            case 6: return "Home";
            default: return "All Categories";
        }
    }

    renderToItem = () => {
        if (this.state.selectedID) {
            return <Redirect to={`/item/${this.state.selectedID}`} />
        }
    }

    onClickItem = (id) => {
        //console.log(id);
        this.props.selectItem(id);
        this.props.dispatchHideFilter();
        this.setState({
            selectedID: id
        })
    }

    onClickPrev = () => {
        this.props.dispatchLoading();
        // await this.props.getAllItems(1);        
        fetch('/getAllItems', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                page: this.state.page - 1
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.isLastPage) {
                    this.setState({
                        isLastPage: true,
                        allItems: [...json.data],
                        page: this.state.page - 1
                    })
                }
                else this.setState({
                    isLastPage: false,
                    allItems: [...json.data],
                    page: this.state.page - 1
                })
                this.props.dispatchLoaded();
                window.scrollTo(0, 0);
            })
    }

    onClickNext = () => {
        this.props.dispatchLoading();
        // await this.props.getAllItems(1);        
        fetch('/getAllItems', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                page: this.state.page + 1
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.isLastPage) {
                    this.setState({
                        isLastPage: true,
                        allItems: [...json.data],
                        page: this.state.page + 1
                    })
                }
                else this.setState({
                    isLastPage: false,
                    allItems: [...json.data],
                    page: this.state.page + 1
                })
                this.props.dispatchLoaded();
                window.scrollTo(0, 0);
            })
    }

    render() {
        return (
            <div>
                <Header />
                {/* <LoadingScreen style={(this.state.loaded)?{display: 'none'}:{display: 'block'}} /> */}
                {(this.props.loading) ? <LoadingScreen /> : null}
                <div className="item-list-wrapper">
                    {this.renderToItem()}
                    <div className="category-title">
                        <span>
                            <img src="https://cdn.chilindo.com/Gfx/All-Category.png" alt="" id="all-category-item" />
                        </span>
                        {this.displayCateName()}
                    </div>
                    {this.displayList()}
                    <div className="item-pages">
                        <button className="btn btn-dark" onClick={this.onClickPrev} disabled={this.state.page === 1 || this.props.cateItems.length > 0}
                            style={{ marginRight: "10px" }}>Prev</button>
                        {this.state.page}
                        <button className="btn btn-dark" onClick={this.onClickNext} disabled={this.state.isLastPage || this.props.cateItems.length > 0}
                            style={{ marginLeft: "10px" }}>Next</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    displayList = () => {
        let date = null;
        if (this.props.cateItems.length > 0) {
            return (
                <div className="list-wrapper">
                    {
                        this.props.cateItems.map((item, index) => {
                            date = new Date(item.endDate);
                            return (
                                <div className="one-item" key={index}>
                                    <a href={`/item/${item._id}`} style={{ textDecoration: 'none' }}>
                                        <img src={item.images[0]} alt="" id="item-img" />
                                        <ul id="item-short-info">
                                            <li><b id="one-item-name">{item.name}</b></li>
                                            <li style={{ color: "red" }}>Ends in {date.getMonth() + 1 + '/' + date.getDate() + "/" + date.getFullYear()}</li>
                                            <li id="item-price"><img src={auction} id="hammer-icon" alt="" />  $ {item.currentPrice}</li>
                                        </ul>
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
        else if (this.state.allItems.length > 0) {
            return (
                <div className="list-wrapper">
                    {
                        this.state.allItems.map((item, index) => {
                            date = new Date(item.endDate);
                            return (
                                <div className="one-item" key={index}>
                                    <a href={`/item/${item._id}`} style={{ textDecoration: 'none' }}>
                                        <img src={item.images[0]} alt="" id="item-img" />
                                        <ul id="item-short-info">
                                            <li><b id="one-item-name">{item.name}</b></li>
                                            <li style={{ color: "red" }}>Ends in {date.getMonth() + 1 + '/' + date.getDate() + "/" + date.getFullYear()}</li>
                                            <li id="item-price"><img src={auction} id="hammer-icon" alt="" />  $ {item.currentPrice}</li>
                                        </ul>
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
        else return null;
    }
}

const mapStateToProps = (state) => {
    return {
        // allItems: state.allItems,
        selected_cate: state.selected_cate,
        loading: state.loading,
        cateItems: state.cateItems
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // getAllItems: (page) => {
        //     dispatch(actions.getAllItems(page));            
        // },
        selectItem: (id) => {
            dispatch(actions.getAnItem(id))
            dispatch(actions.getAuctionersForItem(id))
        },
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        dispatchLoaded: () => {
            dispatch(actions.onLoaded())
        },
        dispatchShowFilter: () => {
            dispatch(actions.showFilter())
        },
        authen: (token, userID) => {
            dispatch(actions.authenticateUser(token, userID))
        },
        dispatchHideFilter: () => {
            dispatch(actions.hideFilter())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);