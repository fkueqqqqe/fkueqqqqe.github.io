function startMove(obj,json,fn){
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
       var bStop=true;
       for(attr in json){
           if(attr=="opacity"){
              var curAttr=parseInt(parseFloat(getStyle(obj,attr))*100);
           }else{
              var curAttr=parseInt(getStyle(obj,attr));
           }
           var iTarget=parseInt(json[attr]);
           if(curAttr!=iTarget){bStop=false;}
           var iSpeed=(iTarget-curAttr)/8;
           iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

           if(attr=="opacity"){
              obj.style.filter="alpha(opacity:" +(curAttr+iSpeed)+")";
              obj.style.opacity=(curAttr+iSpeed)/100;
           }else{
              obj.style[attr]=(curAttr+iSpeed)+"px";
           }
       }
       if(bStop){clearInterval(obj.timer);if(fn){fn();}}
    },30);
}

function getStyle(obj,attr){
   if(obj.currentStyle){
     return obj.currentStyle[attr];
   }else{
      return getComputedStyle(obj,false)[attr];
   }
}