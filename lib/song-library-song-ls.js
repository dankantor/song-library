var _ = require('underscore');

function Songs(songList){
    this.songList = songList;
}

// get all songs
Songs.prototype.get = function(){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            deferred.resolve(
                {
                    'songs': this.songList
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by a genre   
Songs.prototype.getByGenre = function(genre){
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
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by a genre and artist and album 
Songs.prototype.getByGenreAndArtistAndAlbum = function(genre, artist, album){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.genre === genre &&
                       song.artist === artist &&
                       song.album === album){
                        return true;
                    }
                }
            );
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by a genre and artist
Songs.prototype.getByGenreAndArtist = function(genre, artist){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.genre === genre &&
                       song.artist === artist){
                        return true;
                    }
                }
            );
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by a genre and album
Songs.prototype.getByGenreAndAlbum = function(genre, album){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.genre === genre &&
                       song.album === album){
                        return true;
                    }
                }
            );
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by an artist
Songs.prototype.getByArtist = function(artist){
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
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by an artist and album  
Songs.prototype.getByArtistAndAlbum = function(artist, album){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.artist === artist &&
                       song.album === album){
                        return true;
                    }
                }
            );
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}

// get a list of songs by an album    
Songs.prototype.getByAlbum = function(album){
    var deferred = new $.Deferred();
    process.nextTick(   
        function(){
            var filteredItems = _.filter(
                this.songList,
                function(song){
                    if(song.album === album){
                        return true;
                    }
                }
            );
            deferred.resolve(
                {
                    'songs': filteredItems
                }
            );      
        }.bind(this)
    );
    return deferred.promise();
}


module.exports = Songs;