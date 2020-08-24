import React, { Component } from 'react';
import fb_icon from '../images/fb_icon.png';
import twitter_icon from '../images/twitter-icon.png';
import insta_icon from '../images/insta_icon.png';
import electronic from '../images/electronic.png';
import girl from '../images/girl.png';
import boy from '../images/boy.png';
import kid from '../images/kid.png';
import travel from '../images/travel.png';
import home from '../images/home.png';
import sport from '../images/sport.png';
import yt_icon from '../images/youtube_icon.png';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';
import { Redirect } from 'react-router-dom';

class Footer extends Component {
    state = {
        returnToHomePage: false
    }

    onClickCate = (cateID) => {
        if (window.location.href !== 'http://localhost:3000/') {
            this.setState({
                returnToHomePage: true
            })
        }
        this.props.dispatchLoading();
        this.props.dispatchSelectCate(cateID);
    }

    returnHomePage = () => {
        if (this.state.returnToHomePage)
            return <Redirect to='/' />
    }

    render() {
        return (
            <div className="footer-wrapper">
                {this.returnHomePage()}
                <div className="categories">
                    <h5 id="h3-exception-footer">CATEGORIES</h5>
                    <ul id="categories">
                        <li id="footer-item" onClick={() => this.onClickCate(0)}><img src={electronic} alt='' id="icon-footer" />Electronics</li>
                        <li id="footer-item" onClick={() => this.onClickCate(1)}><img src={kid} alt='' id="icon-footer" />For Kids</li>
                        <li id="footer-item" onClick={() => this.onClickCate(2)}><img src={girl} alt='' id="icon-footer" />For Her</li>
                        <li id="footer-item" onClick={() => this.onClickCate(3)}><img src={boy} alt='' id="icon-footer" />For Him</li>
                        <li id="footer-item" onClick={() => this.onClickCate(4)}><img src={sport} alt='' id="icon-footer" />Sports</li>
                        <li id="footer-item" onClick={() => this.onClickCate(5)}><img src={travel} alt='' id="icon-footer" />Travel</li>
                        <li id="footer-item" onClick={() => this.onClickCate(6)}><img src={home} alt='' id="icon-footer" />Home</li>
                    </ul>
                </div>
                <div className="about">
                    <h5 id="h3-exception-footer">ABOUT</h5>
                    <ul id="about">
                        <li id="footer-item">About Us</li>
                        <li id="footer-item">Company Info</li>
                        <li id="footer-item">Privacy Policy</li>
                        <li id="footer-item">Jobs</li>
                    </ul>
                </div>
                <div className="help-contact">
                    <h5>HELP & CONTACT</h5>
                    <ul id="help">
                        <li id="footer-item">Contact</li>
                        <li id="footer-item">Delivery Info</li>
                        <li id="footer-item">Registration</li>
                        <li id="footer-item">Payment & Shipping</li>
                        <li id="footer-item">Bidding Help</li>
                    </ul>
                </div>
                <div className="connect">
                    <h5>STAY CONNECTED</h5>
                    <ul id="connect">
                        <li id="footer-item"><img src={fb_icon} alt='' id="icon-footer" />Facebook</li>
                        <li id="footer-item"><img src={twitter_icon} alt='' id="icon-footer" />Twitter</li>
                        <li id="footer-item"><img src={insta_icon} alt='' id="icon-footer" />Instagram</li>
                        <li id="footer-item"><img src={yt_icon} alt='' id="icon-footer" />Youtube</li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSelectCate: (cateID) => {
            dispatch(actions.selectCate(cateID))
        },
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        }
    }
}

export default connect(null, mapDispatchToProps)(Footer);
