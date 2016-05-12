define([
        "dojo/_base/declare",
        "dojo/cookie",
        "common/TimeFactory",
        ],

    function(declare, Cookie, TimeFactory) {

        declare("SoundController", null, {
            initSound: function(){
                var d = new Date();
                var cookieExpires=d.getDay()+100;
                var mySound = null;
                soundManager.setup({
                    url: config.SOUND_URL_FLASH,
                    flashVersion: 9, // optional: shiny features (default = 8)
                    // optional: ignore Flash where possible, use 100% HTML5 mode
                    preferFlash: false,
                    
                    onready: function() {
                        mySound = soundManager.createSound({
                            id: config.SOUND_ID_STREAM,
                            stream: true,
                            url: config.SOUND_URL_STREAM,
                            volume: (Cookie(config.COOKIE_STREAM_VOLUME)=== undefined)? 50 : Cookie(config.COOKIE_STREAM_VOLUME)
                        });
                        var notificationsVolume = (Cookie(config.COOKIE_NOTIFICATIONS_VOLUME)=== undefined)? 50 : Cookie(config.COOKIE_NOTIFICATIONS_VOLUME);

                        var AOSSound = soundManager.createSound({
                            id: config.SOUND_ID_AOS,
                            url: config.SOUND_URL_AOS,
                            volume: notificationsVolume
                        });
                        var LOSSound = soundManager.createSound({
                            id: config.SOUND_ID_LOS,
                            url: config.SOUND_URL_LOS,
                            volume: notificationsVolume
                        });
                        var AOSinOne = soundManager.createSound({
                            id: config.SOUND_ID_AOSINONE,
                            url: config.SOUND_URL_AOSINONE,
                            volume: notificationsVolume
                        });
                        var LOSinOne = soundManager.createSound({
                            id: config.SOUND_ID_LOSINONE,
                            url: config.SOUND_URL_LOSINONE,
                            volume: notificationsVolume
                        });
                        var AOSinFive = soundManager.createSound({
                            id: config.SOUND_ID_AOSINFIVE,
                            url: config.SOUND_URL_AOSINFIVE,
                            volume: notificationsVolume
                        });
                        var LOSinFive = soundManager.createSound({
                            id: config.SOUND_ID_LOSINFIVE,
                            url: config.SOUND_URL_LOSINFIVE,
                            volume: notificationsVolume
                        });
                        var Frames = soundManager.createSound({
                            id: config.SOUND_ID_FRAME,
                            url: config.SOUND_URL_FRAME,
                            volume: notificationsVolume
                        });

                        if(Cookie(config.COOKIE_NOTIFICATIONS_MUTE) === undefined){
                            Cookie(config.COOKIE_NOTIFICATIONS_MUTE, "false", { expires: cookieExpires });
                        }
                        if(Cookie(config.COOKIE_STREAM_MUTE) === undefined){
                            Cookie(config.COOKIE_STREAM_MUTE, "true", { expires: cookieExpires });
                        }

                        mySound.play();

                        if (Cookie(config.COOKIE_STREAM_MUTE)=="true") {
                            soundManager.toggleMute(config.SOUND_ID_STREAM);
                        }

                        if (Cookie(config.COOKIE_NOTIFICATIONS_MUTE) == "true") {
                            soundManager.toggleMute(config.SOUND_ID_AOS);
                            soundManager.toggleMute(config.SOUND_ID_LOS);
                            soundManager.toggleMute(config.SOUND_ID_AOSINONE);
                            soundManager.toggleMute(config.SOUND_ID_LOSINONE);
                            soundManager.toggleMute(config.SOUND_ID_AOSINFIVE);
                            soundManager.toggleMute(config.SOUND_ID_LOSINFIVE);
                            soundManager.toggleMute(config.SOUND_ID_FRAME);
                        }
                    }
                });

                // Adding a listener to play sounds at certain events
                var counter = Number.MAX_VALUE;
                TimeFactory.addListener (['aosLosInterval'], this, function( eventName, eventTime ) {
                    if (eventTime >= 0) {
                        var eventTimeS = Math.round(eventTime / 1000.0);

                        if (Cookie(config.COOKIE_NOTIFICATIONS_MUTE) == "false"){
                            if (eventName == 'AOS' && (counter-eventTimeS) < 0){
                                soundManager.play('LOS');
                            }
                            if (eventName == 'LOS' && (counter-eventTimeS) < 0){
                                soundManager.play('AOS');
                            }
                            if (eventName == 'AOS' && (eventTimeS <= 60 && eventTimeS >= 60)){
                                soundManager.play('AOSinOne');
                            }
                            if (eventName == 'LOS' && (eventTimeS <= 60 && eventTimeS >= 60)){
                                soundManager.play('LOSinOne');
                            }
                            if (eventName == 'AOS' && (eventTimeS <= 300 && eventTimeS >= 300)){
                                soundManager.play('AOSinFive');
                            }
                            if (eventName == 'LOS' && (eventTimeS <= 300 && eventTimeS >= 300)){
                                soundManager.play('LOSinFive');
                            }
                        }

                        counter = eventTimeS;
                    } 
                });
            }
        });  
    }
);