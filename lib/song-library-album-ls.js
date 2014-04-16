var _ = require('underscore');

function Albums(songList){
    this.songList = songList;
}

// get a list of all unique albums 
Albums.prototype.get = function(){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var items = _.uniq(_.pluck(this.songList, 'album')).sort();
            deferred.resolve(
                {
                    'albums': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of unique albums by a genre
Albums.prototype.getByGenre =  function(genre){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.genre === genre){
                        return true;
                    }
                }
            );
            var items = _.uniq(_.pluck(filteredItems, 'album')).sort();
            deferred.resolve(
                {
                    'albums': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of unique albums by a genre and artist
Albums.prototype.getByGenreAndArtist = function(genre, artist){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.genre === genre && song.artist === artist){
                        return true;
                    }
                }
            );
            var items = _.uniq(_.pluck(filteredItems, 'album')).sort();
            deferred.resolve(
                {
                    'albums': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of unique albums by an artist   
Albums.prototype.getByArtist = function(artist){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.artist === artist){
                        return true;
                    }
                }
            );
            var items = _.uniq(_.pluck(filteredItems, 'album')).sort();
            deferred.resolve(
                {
                    'albums': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

module.exports = Albums;