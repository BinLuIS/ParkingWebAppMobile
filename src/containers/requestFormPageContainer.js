import React, { Component } from 'react'
import { connect } from "react-redux"
import requestFormPage from '../components/requestFormPage'
import { addParkOrder, getOrderByCarNumber, changeOrderStatus } from '../util/APIUtils';
import { Modal, Toast } from 'antd-mobile';

const alert = Modal.alert;
  const getLatestCarOrderOfCar=(carOrderList)=>{
    let largestId=0;  
    let result=null;
    for(let i=0;i<carOrderList.length;i++){
        if(carOrderList[i].id>largestId){
            largestId=carOrderList[i].id;
            result=carOrderList[i];
        }
      }
      return result
  }


const mapDispatchToProps =(dispatch) => ({
    addNewOrderRequest: newOrderRequest => {
      const newOrderRequestItem ={
        carNumber: newOrderRequest
        
      }
      console.log(newOrderRequestItem)
     console.log(JSON.stringify(newOrderRequestItem))
  //    fetch("https://parkingsystem.herokuapp.com/orders", {
  //      method: 'POST', 
  //      headers: new Headers({
  //      'Content-Type': 'application/json'
  //    }), 
  //    mode: 'cors', 
  //    body: JSON.stringify(newOrderRequestItem)
  //  })
  // .then(res => res.json())
   addParkOrder(newOrderRequestItem)
   .then(res => {
    // Toast.success("成功申請泊車",3);
    alert('成功申請泊車', <div>訂單編號: <b>{res.id}</b> <br/>車牌號碼: <b>{res.carNumber}</b><br/><br/>***請緊記提取單據***<br/>***以作日後提取車輛使用***</div>, [
      {
        text: '確認',
        onPress: () =>
          new Promise((resolve) => {
            setTimeout(resolve, 1000);
          }),
      },
    ])
     dispatch({
       type: "ADD_NEW_ORDER_REQUEST",
       payload: {
        //  id: res.id,
        //  carNumber: res.carNumber,
        //  requestType: res.requestType,
        //  status: res.status
       }
     })
   })
   .catch((error) => {
    if(error.status === 409) {
      Toast.fail("你的車子已被申請，請勿重覆",3);                    
    } else {
      console.log('error: ' + error);
      Toast.fail("未能申請泊車, 請向管理員查詢",3);                         
    }
    
  }); 
   },
   addNewFetchRequest: (newOrderRequestCarNum,newOrderRequestOrderId) => {
    const newOrderRequestItem ={
      carNumber: newOrderRequestCarNum,
      orderId: newOrderRequestOrderId,
      status: 'pendingFetching'
    }
    console.log(`${newOrderRequestCarNum}, ${newOrderRequestOrderId}`)
  //   fetch("https://parkingsystem.herokuapp.com/orders?carNumber="+newOrderRequest, {
  //   mode: 'cors', 
  // }).then(res => res.json())
  getOrderByCarNumber(newOrderRequestCarNum)
  .then(resp => {
    // console.log(resp[0].status)
    if(resp.length==0){
      Toast.fail("沒有符合的訂單編號及車牌號碼",3);
    }else {
        let order=getLatestCarOrderOfCar(resp)
        if(order.status=='parked'){
    //     fetch("https://parkingsystem.herokuapp.com/orders/"+resp[0].id, {
    //      method: 'PATCH', 
    //      headers: new Headers({
    //      'Content-Type': 'application/json'
    //    }), 
    //    mode: 'cors', 
    //    body: JSON.stringify(newOrderRequestItem)
    //  }).then(res => res.json())
    changeOrderStatus(newOrderRequestOrderId,newOrderRequestItem)
    .then(res => {
      Toast.success("成功申請取車",4);
      dispatch({
        type: "ADD_NEW_ORDER_REQUEST",
        payload: {
          // id: res.id,
          // carNumber: res.carNumber,
          // requestType: res.requestType,
          // status: res.status
        }
      })
    }).catch((error) => {
      if(error.status === 404) {
        Toast.fail("沒有符合的訂單編號及車牌號碼",3);                    
      } else {
        console.log('error: ' + error);
        Toast.fail("未能申請取車, 請向管理員查詢",3);                         
      }
       })
  }else{
      Toast.fail("車子不在停車場",3);
  }
}
})
   },
    getStatusRequest: getOrderRequest => {
    const newOrderRequestItem ={
      carNumber: getOrderRequest,
    }
    console.log(newOrderRequestItem)
    getOrderByCarNumber(getOrderRequest)
    .then(resp => {
      if(resp.length==0){
        Toast.fail("沒有此車子的申請",3);
      }else{
        let order=getLatestCarOrderOfCar(resp);
      // console.log(resp[0].status)
      if(order.status=='pendingParking')
        Toast.success("你的車子正等待服務員處理",3);
      else if(order.status=='accepted')
        Toast.success("你的泊車申請已被接納",3);
      else if(order.status=='parked')
        Toast.success("你的車子已進入停車場",3);
      else if(order.status=='pendingFetching')
        Toast.success("你的車子正等待被提取, 請耐心等候",3);
      else if(order.status=='completed')
        Toast.success("你的車子已被提取",3);
    }
  })
    .catch((error) => {
      console.log('error: ' + error);
      Toast.fail("請向管理員查詢",3);
     
    });
  }
  })
   
  const printReceipt = () => (
    alert('Delete', 'Are you sure???', [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () =>
          new Promise((resolve) => {
            Toast.info('onPress Promise', 1);
            setTimeout(resolve, 1000);
          }),
      },
    ])
  );
 export default connect(null, mapDispatchToProps)(requestFormPage)