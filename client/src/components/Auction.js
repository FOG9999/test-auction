import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
//import {connect} from 'react-redux';

class Auction extends Component {
    state = {  }
    render() { 
        return (  
            <div className="auction-wrapper">
                <Header />
                <div className="auction-content">
                    <div className="auction-header">

                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

/*
const mapStateToProps = (state) => {

}

const mapDispatchToProps = (dispatch) => {

}
 
*/
export default Auction;