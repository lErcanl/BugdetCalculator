var budgetController=(function(){
  var Expense = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };
  var Income = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };

var calcTotal=function(type){
    var sum=0;
    data.allItems[type].forEach(function(cur){
        sum+=cur.value;
  });
    data.totals[type]=sum;
  }

      var data={
          allItems:{
            exp:[],
            inc:[]
          },
          totals:{
            exp:0,
            inc:0
          },
          budget:0,
          percentage:-1
      };
      return{
        addItem:function(type,des,val){

       var newItem, ID;
       //create Id
        if(data.allItems[type].length>0){
          ID=data.allItems[type][data.allItems[type].length-1].id +1;

        }
        else{
          ID=0;
        }
        // create new item based on inc or exp
          if(type==='exp'){
            newItem=new Expense(ID,des,val);
          }
          else if(type==='inc'){
          newItem= new Income(ID,des,val);
          }

          //push it into our data structure
          data.allItems[type].push(newItem);

          //return new element.
          return newItem;

        },

        calldata:function(){
          console.log(data);
        },

        calculateBudget:function(){
          calcTotal('exp');
          calcTotal('inc');
          data.budget=data.totals.inc-data.totals.exp;
          if (data.totals.inc>0) {
            data.percentage=Math.round((data.totals.exp/data.totals.inc) *100);

          }
            else{
              data.percentage=-1;
            }
          },
        getBudget:function(){
          return{
            budget:data.budget,
            percentage:data.percentage,
            totalInc:data.totals.inc,
            totalExp:data.totals.exp
          };
        },
        deleteItem:function(type,id){
            var ids;
            //difference between map and forEach map can return an array which is new brand array.
            ids=data.allItems[type].map(function(current){
              return current.id;
           });
            index=ids.indexOf(id);
            if (index!==-1) {
              //splice arrayden eleman çıkarmamızı sağlar index array konumunu belirtir , 1 ise 1 tane sileceğiz demektir.
              data.allItems[type].splice(index,1);
            }
        }
      };


})();

var uiController= (function(){
  var domStrings={
      type:'.add__type',
      description:'.add__description',
      value:'.add__value',
      btn:'.add__btn',
      incomeContainer:'.income__list',
      expanseContainer:'.expenses__list',
      budgetIncome:'.budget__income--value',
      budgetExpense:'.budget__expenses--value',
      budgetPercentage:'.budget__expenses--percentage',
    budgetTotal:'.budget__value',
    container:'.container'
  };
      return{
          getinput:function(){

            return{
              //birden fazla return elemanı olduğu için objelendirme yapıldı.
             type:document.querySelector(domStrings.type).value, //will be either inc or exp
             description:document.querySelector(domStrings.description).value,
             value:parseFloat(document.querySelector(domStrings.value).value)
          };
        },
          getDomstrings:function(){
            return domStrings;
          },
          clearfield:function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(domStrings.description+', ' + domStrings.value);
            fieldsArr=Array.prototype.slice.call(fields);
              fieldsArr.forEach(function(current,index,array){
                current.value="";
              }
              );
              fieldsArr[0].focus();

          },
            addItemlist:function(obj,type){
              var html,newHtml,element;
              //Create htmlString with placeholder text
              if(type==='inc'){
html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    element=domStrings.incomeContainer;

}
else if(type==='exp')
{
  element=domStrings.expanseContainer;

 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

}
        newHtml=html.replace('%id%',obj.id);
        newHtml=newHtml.replace('%description%',obj.description);
        newHtml=newHtml.replace('%value%',obj.value);

        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

              //replace placeholder text with some actual text

              //Insert the HTML into the DOM
            },
            budgetUI:function(obj){
                document.querySelector(domStrings.budgetIncome).textContent=obj.totalInc;
                document.querySelector(domStrings.budgetExpense).textContent=obj.totalExp;
                document.querySelector(domStrings.budgetTotal).textContent=obj.budget;
                if(obj.percentage>0){
                  document.querySelector(domStrings.budgetPercentage).textContent=obj.percentage;

                }
                else{
                  document.querySelector(domStrings.budgetPercentage).textContent='---';

                }
            }

      }
})();



var controller=  (function(budgetCt,uict){
  var setupEventListeners=function(){
    var dom=uict.getDomstrings();
    document.querySelector(dom.btn).addEventListener('click',ctrlAddItem);

      document.addEventListener('keypress',function(event){
        if (event.keyCode===13 || event.which===13) {
          ctrlAddItem();
        }
      });
      document.querySelector(dom.container).addEventListener('click',ctrlDeleteItem);

};
  var updateBudget=function(){
    // first calc budget
    budgetCt.calculateBudget();
    // second return variables.
var budget= budgetCt.getBudget();
  uict.budgetUI(budget);
    //updateUI
  }
var  ctrlDeleteItem = function(event){
  var splitId, id, type, itemId;


  itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;

  if (itemId) {
    splitId=itemId.split('-');
    type=splitId[0];
    id=parseInt(splitId[1]);
    budgetCt.deleteItem(type,id);
    }
}
var ctrlAddItem= function()
{
  var newItem,input;
   input=uict.getinput();
   if (input.description!=="" && !isNaN(input.value) && input.value>0) {
     newItem= budgetCt.addItem(input.type,input.description,input.value);
         uiController.addItemlist(newItem,input.type);
         uiController.clearfield();
         updateBudget();
   }

};
      return {
        init:function(){
          uict.budgetUI(  {  budget:0,
              percentage:0,
              totalInc:0,
              totalExp:0
            });

          console.log("her şey yeni başladı");
          setupEventListeners();
        }
      }


  })(budgetController,uiController);
  controller.init();
