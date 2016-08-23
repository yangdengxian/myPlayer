var playerApp = angular.module("playerApp", ["ngRoute"]);
playerApp.controller("playerController", ["$scope", "DataList", "DataBinding", "Audio", "Player", "$timeout", function($scope, DataList, DataBinding, Audio, Player) {
    DataBinding.dataBindFunc(0),
    $scope.player = Player,
    $scope.audio = Audio,
    $scope.player.active = 0,
    $scope.player.controllPlay($scope.player.active),
    $scope.player.playerSrc($scope.player.active),
    $scope.isSelected = function() {
        $scope.player.active = this.$index,
        DataBinding.dataBindFunc($scope.player.active),
        $scope.player.controllPlay($scope.player.active);
    }
}
]),
playerApp.factory("DataList", function() {
    var data = [{
        id: 0,
        artist: "Lene Marlin",
        song: "A Place Nearby",
        album: "《Playing My Game》",
        songUrl: "resources/A Place Nearby.mp3",
        avatar: "images/lm.jpg"
    }, {
        id: 1,
        artist: "David Archuleta",
        song: "Crush",
        album: "《David Archuleta》",
        songUrl: "resources/Crush.mp3",
        avatar: "images/da.jpg"
    }, {
        id: 2,
        artist: "Lucie Arnaz",
        song: "I still Believe In Love",
        album: "《They'Re Playing Our Song》",
        songUrl: "resources/I Still Believe In Love.mp3",
        avatar: "images/la.jpg"
    }, {
        id: 3,
        artist: "Jem",
        song: "It's Amazing",
        album: "《Sex And The City - Original Motion Picture Soundtrack》",
        songUrl: "resources/It'S Amazing.mp3",
        avatar: "images/jem.jpg"
    }, {
        id: 4,
        artist: "Jewel",
        song: "Stay Here Forever",
        album: "《Sweet And Wild》",
        songUrl: "resources/Stay Here Forever.mp3",
        avatar: "images/jew.jpg"
    }, {
        id: 5,
        artist: "Lenka",
        song: "The Show",
        album: "《#LOVE acoustic》",
        songUrl: "resources/The Show.mp3",
        avatar: "images/lenka.jpg"
    }, {
        id: 6,
        artist: "Tamas Wells",
        song: "Valder Fields",
        album: "《A Plea En Vendredi》",
        songUrl: "resources/Valder Fields.mp3",
        avatar: "images/tw.jpg"
    }];
    return data
}
),
playerApp.factory("DataBinding", ["$rootScope", "DataList", function($rootScope, DataList) {
    $rootScope.datas = DataList;
    var dataObj = {
        dataBindFunc: function(index) {
            $rootScope.avatar = $rootScope.datas[index].avatar,
            $rootScope.artist = $rootScope.datas[index].artist,
            $rootScope.song = $rootScope.datas[index].song,
            $rootScope.album = $rootScope.datas[index].album
        }
    };
    return dataObj
}
]),
playerApp.factory("Audio", ["$document", function($document) {
    var audio = $document[0].createElement("audio");
    return audio
}
]),
playerApp.factory("Player", ["$rootScope", "$interval", "Audio", "DataList", "DataBinding", function($rootScope, $interval, Audio, DataList, DataBinding) {
    $rootScope.data = DataList;
    var player = {
        musicLen: "7",
        controllPlay: function(index) {
            player.playerSrc(index),
            player.play(),
            player.isPlay = !0,
            DataBinding.dataBindFunc(index),
            player.playing = !0
        },
        playerSrc: function(index) {
            var url = $rootScope.data[index].songUrl;
            Audio.src = url
        },
        play: function() {
            player.playing && player.stop(),
            Audio.play(),
            player.isPlay = !0,
            player.playing = !0
        },
        stop: function() {
            player.playing && Audio.pause(),
            player.isPlay = !1,
            player.playing = !1
        },
        prev: function() {
            console.log("prev:" + player.active),
            0 == player.active ? player.active = player.musicLen - 1 : player.active -= 1,
            player.controllPlay(player.active)
        },
        next: function() {
            console.log("next:" + player.active),
            player.active == player.musicLen - 1 ? player.active = 0 : player.active += 1,
            player.controllPlay(player.active)
        }
    };
    return player
}
]),
playerApp.directive("musicMode", ["$timeout", "$document", function($timeout, $document) {
    return {
        restrict: "AE",
        replace: !0,
        scope: {
            player: "=",
            audio: "="
        },
        templateUrl: "template/mode.html",
        link: function(scope, ele) {
            var status = "list";
            scope.addActive = function(index) {
                ele.children("li").removeClass("active"),
                ele.children("li").eq(index).addClass("active")
            },
            scope.addActive(0),
            scope.listPlay = function() {
                status = "list",
                console.log("list"),
                scope.addActive(0)
            },
            scope.randomPlay = function() {
                console.log("random"),
                status = "random",
                scope.addActive(1)
            }
            ,
            scope.repeatPlay = function() {
                status = "repeat",
                console.log("repeat"),
                scope.addActive(2)
            }
            ,
            scope.audio.addEventListener("ended", function() {
                if ("list" == status)
                    scope.player.active == scope.player.musicLen - 1 ? scope.player.active = 0 : scope.player.active += 1;
                else if ("random" == status) {
                    var randomIndex = parseInt(scope.player.musicLen * Math.random());
                    console.log("randomPlay" + randomIndex),
                    randomIndex == scope.player.active && (randomIndex += 1),
                    scope.player.active = randomIndex
                } else
                    console.log("repeat");
                scope.$apply(scope.player.controllPlay(scope.player.active))
            }
            );
            var volTime;
            scope.volShow = !1,
            scope.showVol = function() {
                scope.volShow = !0,
                clearTimeout(volTime)
            }
            ,
            scope.hideVol = function() {
                volTime = $timeout(function() {
                    scope.volShow = !1
                }
                , 300)
            }
            ,
            scope.volStyle = "height: 64px",
            scope.audio.volume = .8,
            scope.adjustVolume = function(ev) {
                var event = window.event || ev
                  , volumeY = $document[0].querySelector(".play-vol").getBoundingClientRect().bottom - event.clientY;
                scope.audio.volume = (volumeY / 75).toFixed(2),
                scope.volStyle = "height:" + volumeY + "px"
            },
            scope.muted = !0,
            scope.audioMuted = function() {
                0 == scope.audio.muted ? (scope.audio.muted = !0,
                scope.muted = !1) : (scope.audio.muted = !1,
                scope.muted = !0)
            }
        }
    }
}
]),
playerApp.directive("progressBar", ["$document", "$interval", "$rootScope", function($document, $interval, $rootScope) {
    return {
        restrict: "AE",
        replace: !0,
        scope: {
            player: "=",
            audio: "="
        },
        templateUrl: "template/progress.html",
        link: function(scope) {
            console.log($rootScope),
            scope.surplusBar = function() {
                if (!isNaN(scope.audio.duration)) {
                    var surplus = scope.audio.duration - scope.audio.currentTime
                      , surplusMin = parseInt(surplus / 60)
                      , surplusSecond = parseInt(surplus % 60);
                    10 > surplusSecond && (surplusSecond = "0" + surplusSecond),
                    scope.playTime = "-" + surplusMin + ":" + surplusSecond;
                    var progressValue = scope.audio.currentTime / scope.audio.duration * 1e3;
                    scope.surplusWidth = "width:" + parseInt(progressValue) + "px"
                }
            }
            ,
            scope.bufferBar = function() {
                bufferTimer = $interval(function() {
                    var bufferIndex = scope.audio.buffered.length;
                    if (bufferIndex > 0 && void 0 != scope.audio.buffered) {
                        var bufferValue = scope.audio.buffered.end(bufferIndex - 1) / scope.audio.duration * 1e3;
                        scope.bufferWidth = "width:" + parseInt(bufferValue) + "px",
                        Math.abs(scope.audio.duration - scope.audio.buffered.end(bufferIndex - 1)) < 1 && (scope.bufferWidth = "width: 1000px",
                        clearInterval(bufferTimer))
                    }
                }
                , 1e3)
            }
            ,
            scope.adjustPorgress = function(ev) {
                var event = window.event || ev
                  , progressX = event.clientX - $document[0].querySelector(".progress-bar").getBoundingClientRect().left;
                scope.audio.currentTime = parseInt(progressX / 1e3 * scope.audio.duration),
                scope.audio.removeEventListener("canplay", scope.bufferBar)
            }
            ,
            scope.audio.addEventListener("timeupdate", function() {
                scope.$apply(scope.surplusBar())
            }
            ),
            scope.audio.addEventListener("canplay", function() {
                scope.$apply(scope.bufferBar())
            }
            )
        }
    }
}
]),
playerApp.config(function($routeProvider) {
    $routeProvider.when("/player", {
        templateUrl: "index.html",
        controller: "playerController"
    }).otherwise({
        redirectTo: "/player"
    })
}
);
