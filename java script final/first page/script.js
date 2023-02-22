  
  
  
 var productList;
  
  var ajax = new XMLHttpRequest();
  ajax.open('GET',"https://5d76bf96515d1a0014085cf9.mockapi.io/product",true);
  ajax.send();
  ajax.addEventListener("readystatechange",data);

  function data(e){

    if(e.currentTarget.readyState === 4 && (e.currentTarget.status === 200)){
        
        var data = JSON.parse(e.currentTarget.responseText);
        productList = data;

      


        var clothingSection = document.getElementById('clothing_section');
        var accessoriesSection =document.getElementById('accessories_section');
      
      
      
        function cardCreation(index,resultOfSection) {

          var productId = data[index].id;


            
          var parentDiv = document.createElement('div');
          resultOfSection.append(parentDiv);


          var aTag = document.createElement('a');
          parentDiv.append(aTag);
          aTag.classList.add('aTag')
          aTag.href="/second/index.html?productId="+productId;
           
          var img = document.createElement('img');
          img.src = productList[index].preview;
          img.alt = productList[index].description;
        
          var div = document.createElement('div');
          var para1 = document.createElement('p');
          para1.innerText = productList[index].name;
          var para2 = document.createElement('p');
          para2.innerText = productList[index].brand;
          var para3 = document.createElement('p');
          para3.innerText = "Rs" + " " + productList[index].price;
           
          aTag.append(img);
          aTag.append(div);
          div.append(para1);
          div.append(para2);
          div.append(para3);
        
          parentDiv.classList.add("pdiv");
          img.classList.add('image');
          div.classList.add('details');
          para1.classList.add("para1");
          para2.classList.add("para2");
          para3.classList.add("para3");
      
      
      }
      
      for(var i=0; i<=productList.length; i++){
        if(productList[i].isAccessory == true){
          cardCreation(i,accessoriesSection  )
      
        }else{
          cardCreation(i, clothingSection)
        }
      }
        
       
        

    }

  }


  var counter =1;
  setInterval(function(){
    document.getElementById('radio' + counter).checked =true;
    counter++;
    if(counter>4){
        counter=1;
    }
  },5000);


