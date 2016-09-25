var fs = require('fs');
var Player = require('player');
var that;

function MusicPlayer(musicPath) {
  this.path = musicPath;
  var b = 'test';
  that = this;
};

MusicPlayer.prototype.foo = function foo() {
//  console.log(this.path);
  fs.readdir(this.path, this.recieveFiles);
}

MusicPlayer.prototype.recieveFiles = function(err, files) {
  if (err) {
    console.log(err);
  } else {
 //   console.log('this', that);
    var fileList = files.map(function(file) {
      return that.path + '/' + file;
    });
//    console.log(fileList);
    that.player = new Player(fileList);
    that.player.play();
  }
}

module.exports = MusicPlayer;
