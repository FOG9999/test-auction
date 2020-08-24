import React, { Component } from 'react';
import hammer from '../images/hammer.png';
import lock from '../images/lock.png';
import history from '../images/history.png';
import logo from '../images/logo.png';
import '../style.css';
// import '../responsive.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actions } from '../redux/actions';

class Header extends Component {
    state = {
        inputLoginUsername: "",
        inputLoginPassword: "",
        inputSignupUsername: "",
        inputSignupPassword: "",
        inputSignupName: '',
        showLogin: this.props.showLogin,
        showSignup: false,
        errorMessage: ''
    }

    onHideLogin = () => {
        this.props.dispatchCloseLogin()
    }

    onOpenLoginModal = () => {
        if (!this.props.logged)
            this.props.dispatchShowLogin();
        else {
            this.props.dispatchLogout();
            window.location.reload();
        }
    }

    onChangeInputLoginUsername = (e) => {
        this.setState({
            inputLoginUsername: e.target.value
        })
    }

    onChangeInputLoginPassword = (e) => {
        this.setState({
            inputLoginPassword: e.target.value
        })
    }

    onHideSignup = () => {
        this.setState({
            showSignup: false
        })
    }

    onOpenSignupModal = () => {
        this.setState({
            showLogin: true
        })
    }

    onChangeInputSignupUsername = (e) => {
        this.setState({
            inputSignupUsername: e.target.value
        })
    }

    onChangeInputSignupPassword = (e) => {
        this.setState({
            inputSignupPassword: e.target.value
        })
    }

    onChangeInputSignupName = (e) => {
        this.setState({
            inputSignupName: e.target.value
        })
    }

    openSignupCloseLogin = () => {
        this.props.dispatchCloseLogin();
        this.setState({
            showSignup: true
        })
    }

    openLoginCloseSignup = () => {
        this.setState({
            showLogin: true,
            showSignup: false
        })
    }

    onSignupConfirm = () => {
        const { inputSignupUsername, inputSignupPassword, inputSignupName } = this.state;
        if (!!inputSignupUsername && !!inputSignupPassword && !!inputSignupName) {
            this.props.dispatchSignup({
                name: inputSignupName,
                email: inputSignupUsername,
                password: inputSignupPassword
            })
            this.setState({
                inputLoginUsername: '',
                inputLoginPassword: '',
                showSignup: false
            })
        }
        else {
            this.setState({
                inputSignupUsername: '',
                inputSignupPassword: '',
                errorMessage: 'Empty field(s) detected!'
            })
        }
    }

    onLoginConfirm = () => {
        const { inputLoginPassword, inputLoginUsername } = this.state;
        if (!!inputLoginPassword && !!inputLoginUsername) {
            this.props.dispatchLogin({
                email: inputLoginUsername,
                password: inputLoginPassword
            })
            this.setState({
                inputLoginUsername: '',
                inputLoginPassword: '',
                showLogin: false
            })
        } else {
            this.setState({
                inputLoginUsername: '',
                inputLoginPassword: '',
                errorMessage: 'Login failed'
            })
        }
    }

    // checkLoginSuccessful = () => {
    //     if (this.props.logged) {
    //         alert("Login successfully");
    //     }
    // }

    requireLogin = () => {
        if (!this.props.logged) {
            this.props.dispatchShowLogin();
        }
    }

    onClickCate = (cateID) => {
        this.props.dispatchLoading();
        this.props.dispatchSelectCate(cateID);
    }

    render() {
        return (
            <div className="header-wrapper">
                {/* {this.checkLoginSuccessful()} */}
                <div className="functions">
                    <a href="/"><img src={logo} alt="" id="logo" /></a>
                    <div className="my-chest" onClick={this.requireLogin}>
                        <img src={history} alt='' id="header-icon" />
                        {(!!localStorage.getItem("token") && !!localStorage.getItem("userID"))?(<a href='/my-cart' id='my-cart-link'>My Cart</a>):"My Cart"}
                    </div>
                    <div className="auction-history" onClick={this.requireLogin}>
                        <img src={hammer} alt="" id="header-icon" />
                        {(!!localStorage.getItem("token") && !!localStorage.getItem("userID"))?(<a id="link-to-upload-page" href="/my-items">Uploaded Items</a>):"Uploaded Items"}
                    </div>
                    <div className="sign-in" onClick={this.onOpenLoginModal}>
                        <img src={lock} alt='' id="header-icon" />
                        {(!localStorage.getItem("token") && !localStorage.getItem("userID")) ? 'Sign in' : 'Logout'}
                    </div>
                </div>
                {(this.props.showFilter)?<div className="category-header">
                    <ul id="cate-ul">
                        <li id="cate" onClick={() => window.location.reload()}>All</li>
                        <li id="cate" onClick={() => this.onClickCate(0)}>Electronics</li>
                        <li id="cate" onClick={() => this.onClickCate(1)}>For Kids</li>
                        <li id="cate" onClick={() => this.onClickCate(2)}>For Her</li>
                        <li id="cate" onClick={() => this.onClickCate(3)}>For Him</li>
                        <li id="cate" onClick={() => this.onClickCate(4)}>Sports</li>
                        <li id="cate" onClick={() => this.onClickCate(5)}>Travel</li>
                        <li id="cate" onClick={() => this.onClickCate(6)}>Home</li>
                    </ul>
                </div>:null}
                <Modal show={this.props.showLogin} onHide={this.onHideLogin} size="md" style={{ height: "fit-content" }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ height: "fit-content", textAlign: "center" }}>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ height: "fit-content" }}>
                        <div style={{ textAlign: "center", color: "red" }}>
                            {this.state.errorMessage}
                        </div>
                        <label>Email:</label><br />
                        <div className="form-group">
                            <input type="text" className="form-control" value={this.state.inputLoginUsername} onChange={this.onChangeInputLoginUsername} />
                        </div>
                        <label>Password:</label><br />
                        <div className="form-group">
                            <input type="password" className="form-control" value={this.state.inputLoginPassword} onChange={this.onChangeInputLoginPassword} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ height: "fit-content", textAlign: "center" }}>
                        <button className="btn btn-primary login-btn" onClick={this.onLoginConfirm}>Login</button>
                        <button className="btn btn-dark signup-btn" onClick={this.openSignupCloseLogin}>Signup</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showSignup} onHide={this.onHideSignup} size="md" style={{ height: "fit-content" }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ height: "fit-content", textAlign: "center" }}>Signup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ height: "fit-content" }}>
                        <div style={{ textAlign: "center", color: "red" }}>
                            {this.state.errorMessage}
                        </div>
                        <label>Your name:</label><br />
                        <div className="form-group">
                            <input type="text" className="form-control" value={this.state.inputSignupName} onChange={this.onChangeInputSignupName} />
                        </div>
                        <label>Email:</label><br />
                        <div className="form-group">
                            <input type="text" className="form-control" value={this.state.inputSignupUsername} onChange={this.onChangeInputSignupUsername} />
                        </div>
                        <label>Password:</label><br />
                        <div className="form-group">
                            <input type="password" className="form-control" value={this.state.inputSignupPassword} onChange={this.onChangeInputSignupPassword} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ height: "fit-content", textAlign: "center" }}>
                        <button className="btn btn-dark login-btn" onClick={this.openLoginCloseSignup}>Login</button>
                        <button className="btn btn-primary signup-btn" onClick={this.onSignupConfirm}>Signup</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        logged: state.logged,
        showLogin: state.showLogin,
        showFilter: state.showFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLogin: (userInfo) => {
            dispatch(actions.login(userInfo));
        },
        dispatchSignup: (userInfo) => {
            dispatch(actions.register(userInfo));
        },
        dispatchLogout: () => {
            dispatch(actions.logout())
        },
        dispatchSelectCate: (cateID) => {
            dispatch(actions.selectCate(cateID))
        },
        dispatchShowLogin: () => {
            dispatch(actions.showLogin())
        },
        dispatchLoading: () => {
            dispatch(actions.onLoading())
        },
        dispatchCloseLogin: () => {
            dispatch(actions.closeLogin())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);