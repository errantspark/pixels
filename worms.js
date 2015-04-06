var dgram = require('dgram');
var glwidth = 1900;
var glheight = 1000;
var client = dgram.createSocket('udp4');

client.bind(6668)
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

client.on('listening', function(msg) {console.log(msg)})

client.on('message', function(msg, rinfo) {
  console.log('Received %d bytes from %s:%d\n',
              msg.length, msg, rinfo.address, rinfo.port);
});

var msgs = new Buffer('get 100 100'); 
client.send(msgs, 0, msgs.length, 6668, '10.0.0.30')
//process.exit()
