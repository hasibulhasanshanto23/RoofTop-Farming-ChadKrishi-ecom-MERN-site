import React from "react";
import {BrowserRouter as Router,Route} from 'react-router-dom'
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from './screens/ProductScreen'
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'
import About from './components/About'
import sslPayment from './screens/Payment'



const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
        <Route path='/order/:id' exact component={OrderScreen}/>
        <Route path='/shipping' exact component={ShippingScreen} />
        <Route path='/placeorder' exact component={PlaceOrderScreen}/> 
        <Route path='/payment' exact component={PaymentScreen}/> 
        <Route path='/sslpayment' exact component={sslPayment}/>
        <Route path='/login' exact component={LoginScreen} />
        <Route path='/register' exact component={RegisterScreen} />
        <Route path='/profile' exact component={ProfileScreen} />
         <Route path='/product/:id' exact component={ProductScreen} />
         <Route path='/cart/:id?' exact component={CartScreen}/>
         <Route path='/admin/userlist' exact component={UserListScreen}/>
         <Route path='/admin/user/:id/edit' exact component={UserEditScreen}/>
         <Route path='/admin/productlist' exact component={ProductListScreen}/>
         <Route path='/admin/product/:id/edit' exact component={ProductEditScreen}/>
         <Route path='/admin/orderlist' exact component={OrderListScreen}/>
         <Route path='/about' exact component={About}/>
         <Route path='/search/:keyword' exact component={HomeScreen}/>
         <Route path='/' exact component={HomeScreen} />
         </Container>    
      </main>
      <Footer />
    </Router>
  );
};

export default App;
