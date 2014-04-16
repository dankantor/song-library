var _ = require('underscore');

function Albums(db){
    this.db = db;
}

// get a list of all unique albums 
Albums.prototype.get = function(){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('album');
    index.openCursor(null, 'nextunique').onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.album);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'albums': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of unique albums by a genre
Albums.prototype.getByGenre =  function(genre){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre');
    var singleKeyRange = IDBKeyRange.only(genre);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.album);
            cursor.continue();
        }
        else{
            var albums = _.uniq(items);
            deferred.resolve(
                {
                    'albums': albums
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of unique albums by a genre and artist
Albums.prototype.getByGenreAndArtist = function(genre, artist){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre, artist');
    var singleKeyRange = IDBKeyRange.only([genre, artist]);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.album);
            cursor.continue();
        }
        else{
            var albums = _.uniq(items);
            deferred.resolve(
                {
                    'albums': albums
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of unique albums by an artist   
Albums.prototype.getByArtist = function(artist){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('artist');
    var singleKeyRange = IDBKeyRange.only(artist);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.album);
            cursor.continue();
        }
        else{
            var albums = _.uniq(items);
            deferred.resolve(
                {
                    'albums': albums
                }
            );
        }
    };
    return deferred.promise();
}

module.exports = Albums;