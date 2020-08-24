import React from 'react';
import {Switch,Route} from 'react-router-dom';
import Home from './components/Home';
import SellingItem from './components/SellingItem';
import Item from './components/Item';
import Cart from './components/Cart';
import Summary from './components/Summary';
import Checkout from './components/Checkout';
import Test from './components/Test';
//import Description from './components/Description';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/my-cart' component={Cart} />
        <Route path='/checkout' component={Checkout} />
        <Route path='/item/:id' component={Item} />
        <Route path='/my-items' component={SellingItem} />
        <Route path='/order-summary/:orderID' component={Summary} />
        <Route path="/" component={Home} />       
        <Route path="/test" component={Test} />        
      </Switch>    
    </div>
  );
}

export default App;
