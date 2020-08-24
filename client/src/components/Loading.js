import React, { Component } from 'react';
import loadingGif from '../images/loading.gif';

class Loading extends Component {
    state = {}
    render() {
        return (
            <div id="loading-div">
                <img id="loading-image" src={loadingGif} alt="Loading..." />
            </div>
        );
    }
}

export default Loading;