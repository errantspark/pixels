var dgram = require('dgram');
var glwidth = 1900;
var glheight = 1000;
var client = dgram.createSocket('udp4');

client.bind(6668);
  client.pixelWaiting = [];
  //{callback: function(pixel, color){code}, pixel: [100, 100]}
  client.on('message', function(msg, rinfo) {
    console.log(msg.toString('ascii'), rinfo.address, rinfo.port);

    var msgA = msg.toString('ascii').split(" ");
    var pixel = [msgA[0], msgA[1]]
    var color = {r: msgA[2], g: msgA[3], b: msgA[4]}
  // console.log(pixel)
  executePixel(pixel, color, client.pixelWaiting)
  });

var executePixel = function(pixel, color, callbacks){

  var lookup = {};
  for (var i = 0, len = callbacks.length; i < len; i++) {
    // console.log(callbacks)
    lookup[callbacks[i].pixel.join(" ")] = {callback: callbacks[i].callback, index: i};
  }
  var exec = lookup[pixel.join(" ")]
    if (exec){
      exec.callback(pixel, color);
      callbacks.splice(exec.index, 1);
    } 
}
//the function that executes when you get a message checks against an array of pixels and executes an associated callback if they thing exists 
var setPixel = function(pixel,color,socket,callback){
  if(color.constructor.toString().indexOf("Array") > -1 && color.length === 3){
    color = {r: color[0], g: color[1], b: color[2]}
  } 
  var msg = new Buffer('set '+pixel[0]+' '+pixel[y]+' '+color.r+' '+color.g+' '+color.b);
  socket.send(msg, 0, msg.length, 6668, '10.0.0.30', callback)
}
var getPixel = function(pixel,socket,callback){
  //callback gets (pixel,color)
  var addsocket = (function(socket){
    return function(){socket.pixelWaiting.push({pixel: pixel, callback: callback})}
  } )(socket)
  var msgs = new Buffer('get '+pixel[0]+' '+pixel[1]); 
  client.send(msgs, 0, msgs.length, 6668, '10.0.0.30', addsocket);
}
getPixel([100,100], client, function(pixel,color){console.log(pixel,color)});
var clear = function(width,height,ex){
  //ex ? null : ex = width
  ex = ex || width
    var msg = new Buffer('set '+width+' '+height+' 0 0 0');
  width = width -1
    if (width < 0){
      width = ex;
      height = height - 1;
    }
  var fclear = (function(fwidth,fheight,fex){return function(){clear(fwidth,fheight,fex)}})(width,height,ex)
    if (height < 0){
      fclear = function(){fn(Math.round(glwidth/2),Math.round(glheight/2))}
    }
  client.send(msg, 0, msg.length, 6668, '10.0.0.30', fclear)
}

clear(1900,1000);
var c = 1;
var fn = function(x,y,sx,sy,l){
  var l = l || 400
    l--
    x > glwidth ? x = 0 : null;
  x < 0 ? x = glwidth : null;
  y > glheight ? y = 0 : null;
  y < 0  ? y = glheight : null;
  sx = sx || x;
  sy = sy || y;
  //var r = Math.min(Math.max(0,Math.round((Math.random()-0.5)*3)+r),255);
  //var g = Math.min(Math.max(0,Math.round((Math.random()-0.5)*5)+g),255);
  // var b = Math.min(Math.max(0,Math.round((Math.random()-0.5)*2)+b), 255);
  var msg = new Buffer('set '+Math.round(sx)+' '+Math.round(sy)+' 235 30 97'); 
  //var msg2 = new Buffer('set '+x+' '+y+' 223 123 80'); 
  var nx = Math.round((Math.random()-0.5)*20+x);
  var ny = Math.round((Math.random()-0.5)*20+y);
  //var nx = x;
  //var ny = y;
  var dx = (nx-sx);
  var dy = 0-(ny-sy);
  var pol = Math.atan2(dx,dy);
  //var ix = dx < 0 ? -1 : 1
  //var iy = dy < 0 ? -1 : 1
  var nsy = sy-(Math.cos(pol));
  var nsx = sx+(Math.sin(pol)); 
  var fx = (function(mx,my,msx,msy,ml){return function(){fn(mx,my,msx,msy,ml)}})(nx,ny,nsx,nsy,l)
    if (Math.random() < (1/c) && c < 43){
      c++
        fn(nx,ny,nsx,nsy,(l*Math.random()));
    }
  if (l > 0){
    setTimeout(function(){
      //client.send(msg2, 0, msg2.length, 6668, '10.0.0.30')
      client.send(msg, 0, msg.length, 6668, '10.0.0.30', fx)
    }, 7)
  } else {
    c--
  }
}

//for (var i = 0; i < 50; i++){
fn(Math.round(glwidth/2),Math.round(glheight/2))
  //     }

  //client.on('listening', function(msg) {console.log(msg)})

  //client.on('message', function(msg, rinfo) {
  //  console.log(msg.toString('ascii'), rinfo.address, rinfo.port);
  //});

  //var msgs = new Buffer('get 100 100'); 
  //client.send(msgs, 0, msgs.length, 6668, '10.0.0.30')
  //process.exit()
