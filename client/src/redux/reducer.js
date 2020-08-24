import { types } from './types';

export const rootReducer = (state = {
    // allItems: [],
    cateItems: [],
    logged: false,
    showLogin: false,
    selected_cate: -1,
    selectedItem: null,
    auctionersForItem: [],
    sameCateItems: [],
    loading: false,
    showFilter: false
}, action) => {
    switch (action.type) {
        // case types.GETALLITEMS: return {
        //     ...state,
        //     allItems: [...action.json]
        // }
        case types.AUTHEN:
            if (action.msg === 'Authenticate ok')
                return {
                    ...state,
                    logged: true
                }
            else {
                // Authenticate failed => removeItem in localStorage => showLogin()
                localStorage.removeItem("token");
                localStorage.removeItem("userID");
                return {
                    ...state,
                    logged: false,
                    showLogin: true
                }
            }
        case types.REGISTER: {
            if (action.msg === 'Successfully') {
                return {
                    ...state,
                    logged: true,
                    showLogin: false
                }
            }
            else return state;
        }
        case types.LOGIN: {
            if (action.msg === 'Login successfully') {
                return {
                    ...state,
                    logged: true,
                    showLogin: false
                }
            }
            else return state;
        }
        case types.LOGOUT:
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            return {
                ...state,
                logged: false
            }
        case types.SELECTECATE: return {
            ...state,
            selected_cate: action.cateID,
            cateItems: [...action.json]
        }
        case types.GETITEM: return {
            ...state,
            selectedItem: {
                ...action.selectedItem
            },
            selected_cate: Math.floor(action.selectedItem.category / 10)
        }
        case types.GETAUCTIONERS: return {
            ...state,
            auctionersForItem: [...action.auctioners]
        }
        case types.PLACEBID: return {
            ...state,
            selectedItem: { ...action.json.updatedItem },
            auctionersForItem: [...action.json.updatedAuctioners]
        }
        case types.AUTOUPDATE: return {
            ...state,
            selectedItem: { ...action.json.updatedItem },
            auctionersForItem: [...action.json.updatedAuctioners]
        }        
        case types.GETSAMECATEITEMS:
            return {
                ...state,
                sameCateItems: [...action.sameCateItems]
            }
        case types.SHOWLOGIN: 
        return {
            ...state,
            showLogin: true
        }
        case types.CLOSELOGIN: 
        return {
            ...state,
            showLogin: false
        }
        case types.LOADING: 
        return {
            ...state,
            loading: true
        }
        case types.LOADED: 
        return {
            ...state,
            loading: false
        }
        case types.SHOWFILTER: {
            return {
                ...state,
                showFilter: true
            }
        }
        case types.HIDEFILTER: {
            return {
                ...state,
                showFilter: false
            }
        }
        default: return state
    }
}