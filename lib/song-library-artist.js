var _ = require('underscore');

function Artists(db){
    this.db = db;
}

// get a list of all unique artists
Artists.prototype.get = function(){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('artist');
    index.openCursor(null, 'nextunique').onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.artist);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'artists': items
                }
            );
        }
    };
    return deferred.promise();
}

// get a list of unique artists by a genre
Artists.prototype.getByGenre = function(genre){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre');
    var singleKeyRange = IDBKeyRange.only(genre);
    index.openCursor(singleKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.artist);
            cursor.continue();
        }
        else{
            var artists = _.uniq(items);
            deferred.resolve(
                {
                    'artists': artists
                }
            );
        }
    };
    return deferred.promise();
}

module.exports = Artists;