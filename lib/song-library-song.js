var _ = require('underscore');

function Songs(db){
    this.db = db;
}

// get all songs
Songs.prototype.get = function(){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by a genre   
Songs.prototype.getByGenre = function(genre){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre');
    var singleKeyRange = IDBKeyRange.only(genre);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by a genre and artist and album 
Songs.prototype.getByGenreAndArtistAndAlbum = function(genre, artist, album){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre, artist, album');
    var singleKeyRange = IDBKeyRange.only([genre, artist, album]);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by a genre and artist
Songs.prototype.getByGenreAndArtist = function(genre, artist){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre, artist');
    var singleKeyRange = IDBKeyRange.only([genre, artist]);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by a genre and album
Songs.prototype.getByGenreAndAlbum = function(genre, album){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre, album');
    var singleKeyRange = IDBKeyRange.only([genre, album]);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by an artist
Songs.prototype.getByArtist = function(artist){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('artist');
    var singleKeyRange = IDBKeyRange.only(artist);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by an artist and album  
Songs.prototype.getByArtistAndAlbum = function(artist, album){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('artist, album');
    var singleKeyRange = IDBKeyRange.only([artist, album]);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of songs by an album    
Songs.prototype.getByAlbum = function(album){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('album');
    var singleKeyRange = IDBKeyRange.only(album);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'songs': items
                }
            );
        }
    };
    return deferred.promise();
}


module.exports = Songs;