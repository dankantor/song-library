var _ = require('underscore');

function Genres(db){
    this.db = db;
}

// get a list of all unique genres
Genres.prototype.get = function(){
    var deferred = new $.Deferred();
    var items = [];
    var objectStore = this.db.transaction('songs').objectStore('songs');
    var index = objectStore.index('genre');
    index.openCursor(null, 'nextunique').onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            items.push(cursor.value.genre);
            cursor.continue();
        }
        else{
            deferred.resolve(
                {
                    'genres': items
                }
            );
        }
    };
    return deferred.promise();
}

module.exports = Genres;