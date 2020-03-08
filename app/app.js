var search = document.getElementById("cardName");
var pageNextBtn = document.getElementById("NextPage");
var pagePrevBtn = document.getElementById("PrevPage");
var getCardsBtn = document.getElementById("GetCards");
var viewDeckBtn = document.getElementById("ViewDeck");
var classList = document.getElementById("classList");
var addCard = document.querySelectorAll("addCard");
var className = document.querySelectorAll("dropdown-item");

var pageNextBtns = document.querySelectorAll("#NextPage");
var pagePrevBtns = document.querySelectorAll("#PrevPage");
var pageNumbers = document.querySelectorAll("#pages");        


const cardsToShow = 12;

var startIndex = 0; 
var endIndex = cardsToShow;

const cards = new Array();
const myDeck = new Array();




const RAPIDAPI_API_URL = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards';
const RAPIDAPI_REQUEST_HEADERS = {    
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"omgvamp-hearthstone-v1.p.rapidapi.com",
    "x-rapidapi-key":"59489fd7femshd11da986701b4cep1b9b50jsn3ce72df24df4"
  };

  








/* ------------------------ ON CLICKS --------------------------------------*/

//Display call cards in the array. 
getCardsBtn.onclick = function() {
  startIndex = 0;
  endIndex = cardsToShow;
  showCards();
};



pageNextBtns.forEach(btn =>{
  btn.onclick = function() {
    startIndex += cardsToShow; 
    endIndex += cardsToShow;
    showCards()
  };
});



pagePrevBtns.forEach(btn =>{
  btn.onclick = function() {
    startIndex = (startIndex == 0) ? 0 : startIndex - cardsToShow ; 
    endIndex= (endIndex == cardsToShow) ?  cardsToShow : endIndex - cardsToShow ; 
    showCards()
  };
});



viewDeckBtn.onclick = function() {
  showDeck();
};











/* -----------------------------------------------------------------------------*/
  loadCardAPI();

/* 
  This API does not have a limit/Pagination PARAM available, 
  I used start and end values to only display 10 cards at a time.
  This is slow but is simple pagination. 
*/

//Called to load the Cards array in from API end point.
function loadCardAPI(){  
  getCardsBtn.style.display = "none"; 
  viewDeckBtn.style.display = "none";  
  classList.style.display = "none";
  hideElements();
  document.getElementById("cards").innerHTML = "Loading... Please Wait "
  axios.get(RAPIDAPI_API_URL, { headers: RAPIDAPI_REQUEST_HEADERS })
    .then(response => { 
      const data = response.data.Basic;    
      data.forEach(element => {    
        //Filters for the cards we want.
        if((element.type != "Hero") && (element.type != "Hero Power") && !element.cardId.includes("DFX") && element.img){
          cards.push(element);        
        }              
        finishLoad();
      });           
    })
    .catch(error => document.getElementById("cards").innerHTML = "Unable To find Cards... " + error);  
}

//Called to display the cards. 
function showCards(){
  var ctr = 0;       
  document.getElementById("cards").innerHTML = "";           
  cards.forEach(element => {             
      if(ctr >= startIndex && ctr < endIndex){
        setPages();
        document.getElementById("cards").innerHTML +=(
          "<div class=\"col-sm-6 col-md-3\" id=\"cards\">"+    
          "<div class=\"card sm-3 \">" +
            "<img class=\"card-img-top\" src= '" + element.img + " 'alt=\"Failed to Load Image\" onerror=\"this.src='resources/cardPlaceHolder.png'\";> " +
            "<div class=\"card-body\">"+
              "<h4 class=\"card-title\"> " + element.name + "</h4>" +
              "<p class=\"card-text\">" +   element.playerClass + ".</p>"+
        " <button class=\"btn btn-primary\" id='addCard' data-id='"+ element.cardId + "'>" + "ADD CARD" + "</button>"+
        "</div></div></div>");                      
      }          
      ctr ++;
  });   
  //Add onclick listener to each button.
  addCard = document.querySelectorAll("#addCard");   
    addCard.forEach(btn =>{
      btn.onclick = function(){
        addCardToDeck(btn.getAttribute("data-id"));
      }
    }); 
}

  function showDeck(){   
    hideElements();
    console.log(myDeck.length);

    if(myDeck.length == 0){
      document.getElementById("cards").innerHTML = (
      "<div class=\"col-sm-6 col-md-3\" id=\"cards\"> No Cards in Deck.  </div>");   
    }else{
      myDeck.forEach(element => {       
            document.getElementById("cards").innerHTML +=(
              "<div class=\"col-sm-6 col-md-3\" id=\"cards\">"+    
              "<div class=\"card sm-3 \">" +
                "<img class=\"card-img-top\" src= '" + element.img + " 'alt=\"Failed to Load Image\" onerror=\"this.src='resources/cardPlaceHolder.png'\";> " +
                "<div class=\"card-body\">"+
                  "<h4 class=\"card-title\"> " + element.name + "</h4>" +
                  "<p class=\"card-text\">" +   element.playerClass + ".</p>"+
            " <button class=\"btn btn-primary\" id='removeCard' data-id='"+ element.cardId + "'>" + "Remove Card" + "</button>"+
            "</div></div></div>");       
      });   
  }
  //Add onclick listener to each button.
  removeCard = document.querySelectorAll("#removeCard");   
  removeCard.forEach(btn =>{
    btn.onclick = function(){
      removeCardFromDeck(btn.getAttribute("data-id"));
    }
  }); 
}



function getACard(cardName){
 //Search the array for a card by name. 
  
}


//Called when the Cards finish loading into the array. 
function finishLoad(){
  getCardsBtn.style.display = "block";   
  viewDeckBtn.style.display = "block"; 
  classList.style.display = "block";
  
  className = document.querySelectorAll(".dropdown-item");   
  className.forEach(btn =>{
    btn.onclick = function(){      
      showClassCards(btn.getAttribute("data-class"));
    }
  }); 


  document.getElementById("cards").innerHTML = ""; 
  showCards();      
}


function setPages(){
  var maxPages =  Math.round(cards.length/cardsToShow); 
  var currPage =  Math.round(endIndex/cardsToShow);

  if(currPage == maxPages){
    pageNextBtns.forEach(btn =>{
      btn.style.display = "none";
    });     
    pagePrevBtns.forEach(btn =>{
      btn.style.display = "block";
    });
  }else if(currPage == 1){
    pageNextBtns.forEach(btn =>{
      btn.style.display = "block";
    });     
    pagePrevBtns.forEach(btn =>{
      btn.style.display = "none";
    });
  }else{
    pageNextBtns.forEach(btn =>{
      btn.style.display = "block";
    });     
    pagePrevBtns.forEach(btn =>{
      btn.style.display = "block";
    });
  }
  pageNumbers.forEach(ele =>{
      ele.innerHTML = "Page " + currPage + " - "+ maxPages;
  });   
}

function addCardToDeck(newCardId){
  for(let element of cards){
    if(element.cardId == newCardId){
      myDeck.push(element);
      break;
    }
  }
}


function removeCardFromDeck(oldCardId){
  for(var index = 0; index < myDeck.length; index++){
    if(myDeck[index].cardId == oldCardId){
      myDeck.splice(index, 1);      
      break;
    }
  }
  showDeck(); 
}


function showClassCards(className){
   
hideElements();           
  cards.forEach(element => { 
        if(element.playerClass == className){
          document.getElementById("cards").innerHTML +=(
            "<div class=\"col-sm-6 col-md-3\" id=\"cards\">"+    
            "<div class=\"card sm-3 \">" +
              "<img class=\"card-img-top\" src= '" + element.img + " 'alt=\"Failed to Load Image\" onerror=\"this.src='resources/cardPlaceHolder.png'\";> " +
              "<div class=\"card-body\">"+
                "<h4 class=\"card-title\"> " + element.name + "</h4>" +
                "<p class=\"card-text\">" +   element.playerClass + ".</p>"+
          " <button class=\"btn btn-primary\" id='addCard' data-id='"+ element.cardId + "'>" + "ADD CARD" + "</button>"+
          "</div></div></div>");                      
           
      }
  });   
  //Add onclick listener to each button.
  addCard = document.querySelectorAll("#addCard");   
    addCard.forEach(btn =>{
      btn.onclick = function(){
        addCardToDeck(btn.getAttribute("data-id"));
      }
    }); 
}

function hideElements(){
  pageNextBtns.forEach(btn =>{
    btn.style.display = "none";
  });     
  pagePrevBtns.forEach(btn =>{
    btn.style.display = "none";
  });

  document.getElementById("pages").innerHTML = "";   
  document.getElementById("cards").innerHTML = "";    
}
