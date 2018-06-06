function myAddEvent(obj,sEv,fn){
   if(obj.attachEvent){
       obj.attachEvent('on'+sEv,function(){
           if(false==fn.call(obj)){
                fn.call(obj);
                event.cancelBubble=true;
                return false;
           }
      });
   }else{
       obj.addEventListener(sEv,function(evt){
           if(false==fn.call(obj)){
              fn.call(obj);
              evt.cancelBubble=true;
              evt.preventDefault();
         }
       },false);
   }
} 

function getStyle(obj,attr){
     if(obj.currentStyle){
        return obj.currentStyle[attr];
     }else{
        return getComputedStyle(obj,false)[attr];
     }
}
    
function getByClass(oParent,sClass){
    var aEle=oParent.getElementsByTagName('*');
    var aResult=[];
    var i=0;
    var reg=new RegExp('\\b'+sClass+'\\b','i');
    for(i=0;i<aEle.length;i++){
       if(reg.test(aEle[i].className)){
          aResult.push(aEle[i]);
       }
    }
    return aResult;
}

function vQuery(vArg){
        this.elements=[];
        switch(typeof vArg){
          case 'function':
               myAddEvent(window,'load',vArg);
               break;
          case 'string':
                switch(vArg.charAt(0)){
                      case '#':
                          var obj=document.getElementById(vArg.substring(1));    //return an object;
                          this.elements.push(obj);
                      break;
  
                       case '.':
                          this.elements=getByClass(document,vArg.substring(1)); //return an array;
                      break;
                        
                      default:
                          this.elements=document.getElementsByTagName(vArg);   //return an array;
                }               
                break;

         case 'object':
               this.elements.push(vArg);
        }
      }      
vQuery.prototype.click=function(fn){
     var i=0;
     for(i=0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],'click',fn);
     }
    return this;
  };
vQuery.prototype.hide=function(){
   var i=0;
   for(i=0;i<this.elements.length;i++){
       this.elements[i].style.display='none';
   }
   return this;
};
vQuery.prototype.show=function(){
   var i=0;
   for(i=0;i<this.elements.length;i++){
       this.elements[i].style.display='block';  //这里忽略了行内元素inline,及其他....
   }
   return this;
};
vQuery.prototype.hover=function(fnOver,fnOut){
   var i=0;
   for(i=0;i<this.elements.length;i++){
        myAddEvent(this.elements[i],'mouseover',fnOver);
        myAddEvent(this.elements[i],'mouseout',fnOut);
   }
   return this;
};
vQuery.prototype.css=function(attr,value){
     if(arguments.length==2){
         var i=0;
         for(i=0;i<this.elements.length;i++){
             this.elements[i].style[attr]=value;
         } 
     }else{
            if(typeof attr=="string"){
               return getStyle(this.elements[0],attr);
            }else{
               var i=0;
               for(i=0;i<this.elements.length;i++){
                   for(var name in attr){
                        this.elements[i].style[name]=attr[name];
                   }
               }   
            }
                      
     }
    return this;
};

vQuery.prototype.toggle=function(){
    
     var i=0;
     var _arguments=arguments;
     for(i=0;i<this.elements.length;i++){

           addToggle(this.elements[i]);
     }
     function addToggle(obj){
        var count=0;
        myAddEvent(obj,'click',function(){
        _arguments[count++%_arguments.length].call(obj);
        }); 
     }
   return this;    
};
vQuery.prototype.attr=function(attr,value){
        var i=0;
        if(arguments.length==2){

          for(i=0;i<this.elements.length;i++){
               this.elements[i][attr]=value;
          }
        }else{
              return this.elements[0][attr];
        }
   return this;
};

vQuery.prototype.eq=function(n){
    return $(this.elements[n]);
};

function appendArr(arr1,arr2){
   var i=0;
   for(i=0;i<arr2.length;i++){
       arr1.push(arr2[i]);
   }
}

vQuery.prototype.find=function(str){
     var i=0;
     var aResult=[];
     for(i=0;i<this.elements.length;i++){
        switch(str.charAt(0)){
            case '.': //class
                 var aEle=getByClass(this.elements[i],str.substring(1));
                 aResult=aResult.concat(aEle);
                 break;
            default: //tag
                 var aEle=this.elements[i].getElementsByTagName(str); //返回的不是一个数组，只是一个集合collections,不能使用数组的concat方法连在一起;
                 appendArr(aResult,aEle);
        }
     }
     var newvQuery=$();
     newvQuery.elements=aResult;
     return newvQuery;
};

function getIndex(obj){
   var i=0;
   var aBrother=obj.parentNode.children;
   for(i=0;i<aBrother.length;i++){
      if(aBrother[i]==obj){
         return i;
      }
   }
}

vQuery.prototype.index=function(){
   return getIndex(this.elements[0]);
}
 
function $(vArg){                //给vQuery套上一层外壳使得 $(vArg)=new vQuery(vArg);
     return new vQuery(vArg);
}

vQuery.prototype.bind=function(sEv,fn){     
   var i=0;
   for(i=0;i<this.elements.length;i++){
         myAddEvent(this.elements[i],sEv,fn);
   }
};

vQuery.prototype.extend=function(name,fn){   //vQuery plugin 

    vQuery.prototype[name]=fn;
}; 