var productData;
  
var ajax = new XMLHttpRequest();
ajax.open('GET',"https://5d76bf96515d1a0014085cf9.mockapi.io/product",true);
ajax.send();
ajax.addEventListener("readystatechange",data);

function data(e){

  if(e.currentTarget.readyState === 4 && (e.currentTarget.status === 200)){
      
      var data = JSON.parse(e.currentTarget.responseText);
      productData = data;
      console.log(productData);



      


      




  }

}
