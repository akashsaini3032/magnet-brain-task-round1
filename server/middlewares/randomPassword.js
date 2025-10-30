const RanPassword=()=>{
    let string="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&";

    let strLen= string.length;
    let myPass="";
    for (var i=0; i<=7; i++)
    {
         const myPos= Math.floor(Math.random()*strLen);
         myPass+=string.charAt(myPos);
    }
   
return myPass;
    
}

module.exports=RanPassword;