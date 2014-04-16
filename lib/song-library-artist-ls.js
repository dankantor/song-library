var _ = require('underscore');

function Artists(songList){
    this.songList = songList;
}

// get a list of all unique artists
Artists.prototype.get = function(){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var items = _.uniq(_.pluck(this.songList, 'artist')).sort();
            deferred.resolve(
                {
                    'artists': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of unique artists by a genre
Artists.prototype.getByGenre = function(genre){
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
            var items = _.uniq(_.pluck(filteredItems, 'artist')).sort();
            deferred.resolve(
                {
                    'artists': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

module.exports = Artists;