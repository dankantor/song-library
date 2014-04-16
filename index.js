var GenresDB = require("./lib/song-library-genre.js"),
    ArtistsDB = require("./lib/song-library-artist.js"),
    AlbumsDB = require("./lib/song-library-album.js"),
    SongsDB = require("./lib/song-library-song.js"),
    GenresLS = require("./lib/song-library-genre-ls.js"),
    ArtistsLS = require("./lib/song-library-artist-ls.js"),
    AlbumsLS = require("./lib/song-library-album-ls.js"),
    SongsLS = require("./lib/song-library-song-ls.js"),
    storage = require('local-storage-json'),
    _ = require('underscore');

// constructor
function SongLibrary(){
    this.db = null;
    this.dbName = null;
    this.dbVersion = null;
    this.songList = null;
    this.selectedGenres = null;
    this.selectedArtists = null;
    this.selectedAlbums = null;
}

////////////////////////////////// DB OPS ///////////////////////

// get a ref to the DB
SongLibrary.prototype.get = function(name, version){
    this.dbName = name;
    this.dbVersion = version;
    var deferred = new $.Deferred();
    if(window.indexedDB){
        var request = indexedDB.open(this.dbName, this.dbVersion);
        request.onsuccess = function(event){
            this.db = event.target.result;
            this.genres = new GenresDB(this.db);
            this.artists = new ArtistsDB(this.db);
            this.albums = new AlbumsDB(this.db);
            this.songs = new SongsDB(this.db);
            deferred.resolve();
        }.bind(this)
        request.onupgradeneeded = function(event){
            this.db = event.target.result;
            this.create().then(
                function(){
                    this.genres = new GenresDB(this.db);
                    this.artists = new ArtistsDB(this.db);
                    this.albums = new AlbumsDB(this.db);
                    this.songs = new SongsDB(this.db);
                    deferred.resolve();
                }.bind(this),
                function(e){
                    deferred.reject(e);
                }.bind(this)
            );
        }.bind(this)
        request.onerror = function(e){
            deferred.reject(e);
        }.bind(this)
    }
    else{
        var songs = storage.get('songLibrary_' + this.dbName + '_' + this.dbVersion);
        if(songs !== null){
            this.songList = songs;
            this.genres = new GenresLS(this.songList);
            this.artists = new ArtistsLS(this.songList);
            this.albums = new AlbumsLS(this.songList);
            this.songs = new SongsLS(this.songList);
        }
        deferred.resolve();
    }
    return deferred.promise();
}

// create the object store (schema, indexes)
SongLibrary.prototype.create = function(){
    var deferred = new $.Deferred();
    //db.deleteObjectStore('songs');
    var objectStore = this.db.createObjectStore(
        'songs',
        {
            'keyPath': 'url' 
        }
    );
    objectStore.createIndex(
        'genre',
        'genre',
        {
            'unique': false 
        }
    );
    objectStore.createIndex(
        'artist',
        'artist',
        {
            'unique': false 
        }
    );
    objectStore.createIndex(
        'album',
        'album',
        {
            'unique': false 
        }
    );
    objectStore.createIndex(
        'genre, artist',
        ['genre', 'artist'],
        {
            'unique': false 
        }
    );
    objectStore.createIndex(
        'genre, artist, album',
        ['genre', 'artist', 'album'],
        {
            'unique': false 
        }
    );
    objectStore.createIndex(
        'genre, album',
        ['genre', 'album'],
        {
            'unique': false 
        }
    );
    objectStore.createIndex(
        'artist, album',
        ['artist', 'album'],
        {
            'unique': false 
        }
    );
    objectStore.transaction.oncomplete = function(event){
        deferred.resolve(event);
    }
    objectStore.transaction.onerror = function(event){
        deferred.reject(event);
    }
    return deferred.promise();
}

// write list of songs to db
SongLibrary.prototype.write = function(songs){
    var deferred = new $.Deferred();
    if(this.db !== null){
        var transaction = this.db.transaction(['songs'], 'readwrite');
        transaction.oncomplete = function(event) {
            deferred.resolve(event);
        };
        transaction.onerror = function(event) {
            event.preventDefault();
        };
        var objectStore = transaction.objectStore('songs');
        _.each(
            songs,
            function(song){
                objectStore.add(song);
            }
        );
    }
    else{
        this.songList = songs;
        storage.set(
            'songLibrary_' + this.dbName + '_' + this.dbVersion, 
            this.songList
        );
        this.genres = new GenresLS(this.songList);
        this.artists = new ArtistsLS(this.songList);
        this.albums = new AlbumsLS(this.songList);
        this.songs = new SongsLS(this.songList);
        deferred.resolve();
    }
    return deferred.promise();
}

///////////////////////////////// SELECT ////////////////////////

// select a genre
SongLibrary.prototype.selectGenre = function(genres){
    var deferred = new $.Deferred();
    var promises = [];
    this.selectedGenres = genres;
    this.selectedArtists = null;
    this.selectedAlbums = null;
    if(this.selectedGenres !== null){
        _.each(
            this.selectedGenres, 
            function(item){
                promises.push(this.artists.getByGenre(item));
                promises.push(this.albums.getByGenre(item));
                promises.push(this.songs.getByGenre(item));
            }.bind(this)
        );
    }
    else{
        promises.push(this.artists.get());
        promises.push(this.albums.get());
        promises.push(this.songs.get());
    }
    $.when.apply($, promises).then(
        function(){
             var obj = this.getFromArguments(arguments);
             deferred.resolve(obj);
        }.bind(this)
    );
    return deferred.promise();
}

// select an artist
SongLibrary.prototype.selectArtist = function(artists){
    var deferred = new $.Deferred();
    var promises = [];
    this.selectedArtists = artists;
    this.selectedAlbums = null;
    if(this.selectedArtists !== null){
         _.each(
            this.selectedArtists, 
            function(item){
                if(this.selectedGenres !== null){
                    _.each(
                        this.selectedGenres, 
                        function(genre){
                            promises.push(this.albums.getByGenreAndArtist(genre, item));
                            promises.push(this.songs.getByGenreAndArtist(genre, item));
                        }.bind(this)
                    );
                }
                else{
                    promises.push(this.albums.getByArtist(item));
                    promises.push(this.songs.getByArtist(item));
                }
            }.bind(this)
        );
    }
    else{
        if(this.selectedGenres !== null){
            _.each(
                this.selectedGenres, 
                function(item){
                    promises.push(this.albums.getByGenre(item));
                    promises.push(this.songs.getByGenre(item));
                }.bind(this)
            );
        }
        else{
            promises.push(this.albums.get());
            promises.push(this.songs.get());
        }
    }
    $.when.apply($, promises).then(
        function(){
             var obj = this.getFromArguments(arguments);
             deferred.resolve(obj);
        }.bind(this)
    );
    return deferred.promise();
}

// select an album
SongLibrary.prototype.selectAlbum = function(albums){
    var deferred = new $.Deferred();
    var promises = [];
    this.selectedAlbums = albums;
    if(this.selectedAlbums !== null){
        _.each(
            this.selectedAlbums, 
            function(album){
                if(this.selectedGenres !== null){
                    _.each(
                        this.selectedGenres, 
                        function(genre){
                            if(this.selectedArtists !== null){
                                _.each(
                                    this.selectedArtists, 
                                    function(artist){
                                        promises.push(this.songs.getByGenreAndArtistAndAlbum(genre, artist, album));
                                    }.bind(this)
                                );
                            }
                            else{
                                promises.push(this.songs.getByGenreAndAlbum(genre, album));
                            }
                        }.bind(this)
                    );
                }
                else{
                    if(this.selectedArtists !== null){
                        _.each(
                            this.selectedArtists, 
                            function(artist){
                                promises.push(this.songs.getByArtistAndAlbum(artist, album));
                            }.bind(this)
                        );
                    }
                    else{
                        promises.push(this.songs.getByAlbum(album));
                    }
                }
            }.bind(this)
        );
    }
    else{
        if(this.selectedGenres !== null){
            _.each(
                this.selectedGenres, 
                function(item){
                    if(this.selectedArtists !== null){
                        _.each(
                            this.selectedArtists, 
                            function(artist){
                                promises.push(this.songs.getByGenreAndArtist(item, artist));
                            }.bind(this)
                        );
                    }
                    else{
                        promises.push(this.songs.getByGenre(item));
                    }
                }.bind(this)
            );
        }
        else{
            if(this.selectedArtists !== null){
                _.each(
                    this.selectedArtists, 
                    function(artist){
                        promises.push(this.songs.getByArtist(artist));
                    }.bind(this)
                );
            }
            else{
                promises.push(this.songs.get());
            }
        }
    } 
    $.when.apply($, promises).then(
        function(){
             var obj = this.getFromArguments(arguments);
             deferred.resolve(obj);
        }.bind(this)
    );
    return deferred.promise();
}



///////////////////////////////// UTIL //////////////////////////

// arguments from promises
SongLibrary.prototype.getFromArguments = function(arguments){
    var obj = {
        'genres': [],
        'artists': [],
        'albums': [],
        'songs': []
    };
    _.each(
        arguments,
        function(argument){
            if(argument.genres){
                obj.genres = obj.genres.concat(argument.genres);
            }
            if(argument.artists){
                obj.artists = obj.artists.concat(argument.artists);
            }
            if(argument.albums){
                obj.albums = obj.albums.concat(argument.albums);
            }
            if(argument.songs){
                obj.songs = obj.songs.concat(argument.songs);
            }
        }
    );
    obj.genres.sort();
    obj.artists.sort();
    obj.albums.sort();
    return obj;
}


module.exports = SongLibrary;