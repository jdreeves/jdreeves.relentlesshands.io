/* Scrolleo - make your video scroll with inertia
* MIT License - by Mark Teater
*/
(function(window, document, undefined) {
 
    "use strict";
 
    var _Scrolleo = function(opts) {
        // Defaults
        this.acceleration = 0.08; //1 is fastest, 0 is slowest, 0.08 is default
        this.secondsPerScreen = null; //Set this to the length of the video. "1" is 1 second.
        this.additionalOffset = 0; //Add or subtract pixels to when the video will start. "10" means that the video will start 10px earlier.
        this.wrapperEl = null;
 
        // Override defaults
        if (opts) {
            for (var opt in opts) {
                this[opt] = opts[opt];
            }
        }
    };
 
    var targetscrollpos;
 
    _Scrolleo.prototype = {
        init: function() {
            var self = this;
            this.wrapper = document.querySelectorAll(this.wrapperEl);
 
            // get the location of the top of the page
            targetscrollpos = window.pageYOffset;
            Array.prototype.forEach.call(this.wrapper, function(wr) {
 
                // Set the pixelsPerSecond to the full duration of the video if nothing was set in the options
                if (self.secondsPerScreen === null) {
                    self.wrapper[0].addEventListener('loadedmetadata', function() {
                        self.secondsPerScreen = self.wrapper[0].duration;
                        //recalculate values on video with new pixelsPerSecond
                        self.distanceToTop = getElemDistanceToTop(elem);
                        self.offsetFromTop = getOffsetFromTop(self.distanceToTop);
                        self.pixelsPerSecond = getPixelsPerSecond();
                    });
                }
 
                self.pixelsPerSecond = null;
                self.scrollpos = null;
                self.currentTime = null;
                self.offsetFromTop = null;
                self.distanceToTop = null;
 
                // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
                // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
                (function() {
                    var lastTime = 0;
                    var vendors = ['ms', 'moz', 'webkit', 'o'];
                    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                    }
                    if (!window.requestAnimationFrame)
                        window.requestAnimationFrame = function(callback, element) {
                            var currTime = new Date().getTime();
                            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                            var id = window.setTimeout(function() {
                                    callback(currTime + timeToCall);
                                },
                                timeToCall);
                            lastTime = currTime + timeToCall;
                            return id;
                        };
                    if (!window.cancelAnimationFrame)
                        window.cancelAnimationFrame = function(id) {
                            clearTimeout(id);
                        };
                }());
 
                // requestAnim shim layer by Paul Irish
                window.requestAnimFrame = (function() {
                    return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function( /* function */ callback, /* DOMElement */ element) {
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();
 
                // Define functions to be used by Scrolleo
                var getElemDistanceToTop = function(elem) {
                        //http://gomakethings.com/get-distances-to-the-top-of-the-document-with-native-javascript/
                        var location = 0;
                        if (elem.offsetParent) {
                            do {
                                location += elem.offsetTop;
                                elem = elem.offsetParent;
                            } while (elem);
                        }
                        return location >= 0 ? location : 0;
                    },
                    getOffsetFromTop = function(distanceToTop) {
                        var offset = distanceToTop - window.innerHeight + self.additionalOffset;
                        return offset >= 0 ? offset : 0;
                    },
                    getPixelsPerSecond = function() {
                        var pixelsPerSecond = (window.innerHeight + self.wrapper[0].clientHeight) / self.secondsPerScreen;
                        return pixelsPerSecond >= 0 ? pixelsPerSecond : 0;
                    },
                    scrollHandler = function() {
                        targetscrollpos = window.pageYOffset;
                    },
                    resizeHandler = function() {
                        //recalculate values on resize
                        self.distanceToTop = getElemDistanceToTop(elem);
                        self.offsetFromTop = getOffsetFromTop(self.distanceToTop);
                        self.pixelsPerSecond = getPixelsPerSecond();
                    },
                    scrollControl = function() {
                        //what to do when scrolling
                        self.scrollpos += ((targetscrollpos - self.offsetFromTop) - self.scrollpos) * self.acceleration;
                        self.currentTime = self.scrollpos / self.pixelsPerSecond; //convert scrollpos from pixels to seconds to set self.currentTime
                        self.wrapper[0].currentTime = self.currentTime;
                        self.wrapper[0].pause();
                    };
 
 
                // Get an element's distance from the top of the page
                var elem = self.wrapper[0];
 
                // Calulate the initial size, distance, and offset of each scrolleo video
                self.distanceToTop = getElemDistanceToTop(elem);
                self.offsetFromTop = getOffsetFromTop(self.distanceToTop);
                self.pixelsPerSecond = getPixelsPerSecond();
 
                self.scrollpos = targetscrollpos - self.offsetFromTop;
 
                wr.pause();
 
                // Use requestAnimationFrame to ensure the video is updating when the browser is ready
                window.requestAnimFrame(function render() {
                    window.requestAnimFrame(render);
                    scrollControl();
                });
 
                window.addEventListener('scroll', scrollHandler, false);
                window.addEventListener('resize', resizeHandler, false);
            });
        }
    };
    window.Scrolleo = _Scrolleo;
})(window, document);


// Setup video 1
var scrolleo1 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 20, // Defaults to video duration
  additionalOffset: 0, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-1' // id of the video you want to control

});
scrolleo1.init();

// Video 2
var scrolleo2 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 6, // Defaults to video duration
  additionalOffset: -10, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-2'


});
scrolleo2.init();

// Video 3
var scrolleo3 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 8, // Defaults to video duration
  additionalOffset: 0, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-3'

});
scrolleo3.init();

// Video 4
var scrolleo4 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 8, // Defaults to video duration
  additionalOffset: 0, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-4'

});
scrolleo4.init();

// Video 5
var scrolleo5 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 40, // Defaults to video duration
  additionalOffset: 300, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-5'

});
scrolleo5.init();

// Video 6
var scrolleo6 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 5, // Defaults to video duration
  additionalOffset: 0, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-6'

});
scrolleo6.init();


// Video 7
var scrolleo7 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 10, // Defaults to video duration
  additionalOffset: 0, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-7'

});
scrolleo7.init();

// Video 8
var scrolleo8 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 4, // Defaults to video duration
  additionalOffset: 300, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-8'

});
scrolleo8.init();

// Video 9
var scrolleo9 = new Scrolleo({

  acceleration: 1, // 1 = instant, 0 = never
  secondsPerScreen: 4, // Defaults to video duration
  additionalOffset: 300, // Negative starts the video later, positive starts earlier. default starts when top of video hits bottom of the screen
  wrapperEl: '#scrolleo-9'

});
scrolleo9.init();



