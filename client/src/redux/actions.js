import {types} from './types';

export const actions = {
    /* No need
    getAllItems: (page) => {
        return (dispatch) => {
            fetch('/getAllItems', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    page: page
                })
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.GETALLITEMS,
                    json: json.data
                });   
                dispatch({
                    type: types.LOADED
                })             
            })
        }
    },
    */
    register: (userInfo) => {
        return (dispatch) => {
            fetch('/user/register',{
                method: "POST",
                mode: "cors",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    password: userInfo.password
                })
            })
            .then(res => res.json())
            .then(json => {
                if(json.token){                                        
                    localStorage.setItem("token",json.token);
                    localStorage.setItem("userID",json.userID);
                }
                dispatch({
                    type: types.REGISTER,
                    msg: json.msg
                })
            })
        }
    },
    login: (userInfo) => {
        return (dispatch) => {
            fetch('/user/login',{
                method: "POST",
                mode: "cors",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email: userInfo.email,
                    password: userInfo.password
                })
            })
            .then(res => res.json())
            .then(json => {
                if(json.newToken){
                    console.log('came here');
                    localStorage.setItem("token",json.newToken);
                    localStorage.setItem("userID",json.userID);
                }
                dispatch({
                    type: types.LOGIN,
                    msg: json.msg
                })
            })
        }
    },
    logout: () => {
        return {
            type: types.LOGOUT
        }
    },
    selectCate: (cateID) => {
        return (dispatch) => {
            fetch(`/category?cateID=${cateID}`,{
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.SELECTECATE,
                    cateID,
                    json
                });
                dispatch({
                    type: types.LOADED
                });
            })
        }
    },
    getAnItem: (id) => {
        return (dispatch) => {
            fetch(`/item?id=${id}`,{
                method: "GET",
                headers: {
                'content-type': "application/json",
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(json => {
                fetch('/getSameCateItems',{
                    mode: "cors",
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        cateNum: json.category
                    })
                })
                .then(res => res.json())
                .then(sameCateItems => {
                    dispatch({
                        type: types.GETSAMECATEITEMS,
                        sameCateItems
                    })
                    dispatch({
                        type: types.GETITEM,
                        selectedItem: {...json}
                    })
                })                
            })
        }
    },
    getAuctionersForItem: (itemID) => {
        return (dispatch) => {
            fetch('/getAuctioners',{
                method: "POST",
                mode: "cors",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    id: itemID
                })
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.GETAUCTIONERS,
                    auctioners: [...json]
                })
            })
        }
    },
    placeBid: (inputBid,itemID,userID) => {
        return (dispatch) => {
            fetch('/placeBid',{
                method: "POST",
                mode: 'cors',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    inputBid: inputBid,
                    itemID: itemID,
                    userID: userID
                })
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.PLACEBID,
                    json
                });
                dispatch({
                    type: types.LOADED
                })
            })
        }
    },
    autoUpdateBidding: (itemID) => {
        return (dispatch) => {
            fetch('/autoUpdateBidding',{
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    itemID: itemID
                })
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.AUTOUPDATE,
                    json
                })
                dispatch({
                    type: types.LOADED
                })
            })
        }
    },
    authenticateUser: (token,userID) => {
        return (dispatch) => {
            fetch('/authen',{
                method: "POST",
                mode: "cors",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,
                    token: token
                })
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.AUTHEN,
                    msg: json.msg
                })
            })
        }
    },
    authenticateUserBeta: (token,userID,doneAuthen) => {
        return (dispatch) => {
            fetch('/authen',{
                method: "POST",
                mode: "cors",
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,
                    token: token
                })
            })
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: types.AUTHEN,
                    msg: json.msg
                })
                if(json.msg === 'Authenticate ok'){
                    doneAuthen();
                }
                else dispatch({
                    type: types.SHOWLOGIN
                })
                dispatch({
                    type: types.LOADED
                })
            })
        }
    },
    showLogin: () => {
        return {
            type: types.SHOWLOGIN
        }
    },
    closeLogin: () => {
        return {
            type: types.CLOSELOGIN
        }
    },
    onLoading: () => {
        console.log('loading');
        return {
            type: types.LOADING
        }
    },
    onLoaded: () => {
        console.log('loaded');
        return {
            type: types.LOADED
        }
    },
    showFilter: () => {
        return {
            type: types.SHOWFILTER
        }
    },
    hideFilter: () => {
        return {
            type: types.HIDEFILTER
        }
    }    
}
