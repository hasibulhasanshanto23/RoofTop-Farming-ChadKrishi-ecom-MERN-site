/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState,} from "react";
import axios from 'axios'
import { Row, Col, ListGroup, Image, Card, Button} from "react-bootstrap";
import { PayPalButton } from 'react-paypal-button-v2'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { getOrderDetails, payOrder,deliverOrder } from "../actions/orderActions";
import Loader from "../components/Loader";
import {ORDER_PAY_RESET,ORDER_DELIVER_RESET} from '../constant/orderConstants'



const OrderScreen = ({ match,history }) => {
 const orderId=match.params.id

 const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false)
 
  const orderDetail = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetail;



  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay


  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if(!loading){
    order.itemsPrice = order.orderItems.reduce(
        (flag, item) => flag + item.price * item.qty,
        0
      );
      order.shippingPrice = order.itemsPrice > 200 ? 0 : 50;
  }
 
  // console.log({order})

  useEffect(() => {
    if(!userInfo){
      history.push('/login')
    }
    const addPayPalScript = async () => {
    const { data: clientId } = await axios.get('/api/config/paypal')
    const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

   if(!order || successPay || successDeliver || order._id !== orderId){
     dispatch({type:ORDER_PAY_RESET})
     dispatch({type:ORDER_DELIVER_RESET})
    dispatch(getOrderDetails(orderId))
   }else if (!order.isPaid) {
    if (!window.paypal) {
      addPayPalScript()
    } else {
      setSdkReady(true)
    }
   }
  }, [dispatch,orderId,order,successPay,successDeliver]);




  const successPaymentHandler=(paymentResult)=>{
    console.log('pay',paymentResult)
    dispatch(payOrder(orderId,paymentResult))
  }

  
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }



  return loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : <>
    <h4 className='oder container'>Order No :</h4>
    <h5 className='oder2 container'>{order._id}</h5>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4 className='oder' style={{color:'#3CA861'}}>Shipping</h4>
              <strong>Name : </strong> {order.user.name}
             <p><strong>Email :</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered? (<Message variant='success'>Delivered on {order.deliveredAt}</Message>) : (<Message variant='danger'>Not Delivered</Message>)}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4 className='oder' style={{color:'#3CA861'}}> Payment Method</h4>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid? (<Message variant='success'>Paid on {order.paidAt}</Message>) : (<Message variant='danger'>Not Paid</Message>)}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4 className='oder' style={{color:'#3CA861'}}>Order Items</h4>
              <p>
                {order.orderItems.length === 0 ? (
                  <Message>Order is Empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>

                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>

                          <Col md={4}>
                            {item.qty} x TK {item.price} = {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4 className='oder' style={{color:'#3CA861'}}>Order Summery</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Tk {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>TK {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>TK {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>TK {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  <Link to='/sslpayment'><Button type='button' className='btn-block my-2' variant='info' style={{borderRadius:'5px'}}>SSL Commerce</Button></Link>

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                      variant='success'
                      style={{borderRadius:'5px'}}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
  </>
};

export default OrderScreen;
