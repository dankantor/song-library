var _ = require('underscore');

function Genres(songList){
    this.songList = songList;
}

// get a list of all unique genres
Genres.prototype.get = function(){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var items = _.uniq(_.pluck(this.songList, 'genre')).sort();
            deferred.resolve(
                {
                    'genres': items
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

module.exports = Genres;