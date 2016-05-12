define([
        "dojo/_base/declare",
        "dojo/cookie",
        "dojo/dom-construct",
        "dijit/layout/ContentPane", 
        "dijit/form/CheckBox", 
        "dijit/form/HorizontalSlider",
        "dijit/form/VerticalSlider",
        "dojox/layout/TableContainer",
        "common/store/AudioSettingStore",
        "./ContentProvider",
        ],

    function (declare, Cookie, DomConstruct, ContentPane, CheckBox, HorizontalSlider, 
    		  VerticalSlider, TableContainer, AudioSettingStore, ContentProvider) {

        return declare(ContentProvider, {

        	/** TODO to Timo from Ivar
        	 *  Now you can easily call this content provider in SoundControlButton by using:
        	 *  new AudioContentProvider({id:"soundPopUp", vertical:true}).getContent()
        	 *  What you should do is delete the dublicated code from the SoundControlButton.js
        	 *  and add to SoundControlButton audio button status change on events using the Audio Store.
        	 *  In the result we will have this audio content provider for creating audio setting view
        	 *  and the sound controll button class, where this provider is used.
        	 *  @author: Ivar Mahhonin.
        	 */

            getContent: function () {

            	var d = new Date();
            	var cookieExpires=d.getDay()+100;
            	this.id= this.id + cookieExpires;

                if (Cookie(config.COOKIE_NOTIFICATIONS_MUTE) === undefined){
                    Cookie(config.COOKIE_NOTIFICATIONS_MUTE, "false", { expires: cookieExpires });
                };
                if (Cookie(config.COOKIE_STREAM_MUTE) === undefined){
                    Cookie(config.COOKIE_STREAM_MUTE, "true", { expires: cookieExpires });
                };
                if (Cookie(config.COOKIE_NOTIFICATIONS_VOLUME) === undefined){
                    Cookie(config.COOKIE_NOTIFICATIONS_VOLUME, 50, { expires: cookieExpires });
                };
                if (Cookie(config.COOKIE_STREAM_VOLUME) === undefined){
                    Cookie(config.COOKIE_STREAM_VOLUME, 50, { expires: cookieExpires });
                };

                this.streamSoundVolume = Cookie(config.COOKIE_STREAM_VOLUME);
                this.streamSoundMute = (Cookie(config.COOKIE_STREAM_MUTE) == "true" ? true : false);

                this.notificationSoundVolume = Cookie(config.COOKIE_NOTIFICATIONS_VOLUME);
                this.notificationSoundMute = (Cookie(config.COOKIE_NOTIFICATIONS_MUTE) == "true" ? true : false);

                var pane = new ContentPane({});             

                var tc = new TableContainer( {
                    cols: 2,
                    style: "text-align: center;",
                    orientation: "vert",
                    showLabels: true,
                    labelWidth: "30",
                    spacing: "7",
                });

                var streamSliderSetting = {
                        label: "Beacon",
                        value: this.streamSoundVolume,
                        minimum: 0,
                        maximum: 100,
                        baseClass: this.style2,
                        intermediateChanges: true,
                        onChange: function(value){
                        	AudioSettingStore.put({setting: "streamSlider", value: this.value});
                            soundManager.setVolume(config.SOUND_ID_STREAM,value);
                            Cookie(config.COOKIE_STREAM_VOLUME, (value), { expires: cookieExpires });
                        }
                    };

                var streamSlider;

                var notificationsSliderSetting = {
                        label: "Notifications",
                        value: this.notificationSoundVolume,
                        minimum: 0,
                        maximum: 100,
                        baseClass: this.style1,
                        intermediateChanges: true,
                        onChange: function(value){
                        	AudioSettingStore.put({setting: "notificationsSlider", value: this.value});
                            soundManager.setVolume(config.SOUND_ID_AOS,value);
                            soundManager.setVolume(config.SOUND_ID_LOS,value);
                            soundManager.setVolume(config.SOUND_ID_AOSINONE,value);
                            soundManager.setVolume(config.SOUND_ID_LOSINONE,value);
                            soundManager.setVolume(config.SOUND_ID_AOSINFIVE,value);
                            soundManager.setVolume(config.SOUND_ID_LOSINFIVE,value);
                            soundManager.setVolume(config.SOUND_ID_FRAME,value);
                            Cookie(config.COOKIE_NOTIFICATIONS_VOLUME, value, { expires: cookieExpires });
                        }
                    };

                var notificationsSlider;

                if (this.vertical == true){
                	streamSlider = new VerticalSlider(streamSliderSetting);
                	notificationsSlider = new VerticalSlider(notificationsSliderSetting);
                }
                else {
                	streamSlider = new HorizontalSlider(streamSliderSetting);
                	notificationsSlider = new HorizontalSlider(notificationsSliderSetting);
                }

                var streamCheckBox = new CheckBox( {
                    label: "Mute",
                    checked: this.streamSoundMute,
                    onChange: function(b){                           
                        if (b){
                            Cookie(config.COOKIE_STREAM_MUTE, "true", { expires: cookieExpires });
                        } else {
                            Cookie(config.COOKIE_STREAM_MUTE, "false", { expires: cookieExpires });
                        }
                    soundManager.toggleMute(config.SOUND_ID_STREAM);
                    AudioSettingStore.put({ setting: "streamCheckBox", value: this.checked });
                    }
                });

                var notificationCheckBox = new CheckBox({
                	label: "Mute",
                    checked: this.notificationSoundMute,
                    onChange: function(b){ 
                    	AudioSettingStore.put({setting: "notificationCheckBox", value: this.checked});
                        if (b) {
                            Cookie(config.COOKIE_NOTIFICATIONS_MUTE, "true", { expires: cookieExpires });
                        } else {
                            Cookie(config.COOKIE_NOTIFICATIONS_MUTE, "false", { expires: cookieExpires });
                        }

                        soundManager.toggleMute(config.SOUND_ID_AOS);
                        soundManager.toggleMute(config.SOUND_ID_LOS);
                        soundManager.toggleMute(config.SOUND_ID_AOSINONE);
                        soundManager.toggleMute(config.SOUND_ID_LOSINONE);
                        soundManager.toggleMute(config.SOUND_ID_AOSINFIVE);
                        soundManager.toggleMute(config.SOUND_ID_LOSINFIVE);
                        soundManager.toggleMute(config.SOUND_ID_FRAME);
                        AudioSettingStore.put({ setting: "notificationCheckBox", value: this.checked });
                    }
                });

                var notificationCheckBoxFilter = AudioSettingStore.query();           	
                var notificationCheckBoxObserve = notificationCheckBoxFilter.observe(function (object) {
                    if ((object.setting == "notificationCheckBox") && (object.value != notificationCheckBox.checked)) {
                        notificationCheckBox.set("checked", object.value);
                    }
                    else if ((object.setting == "notificationsSlider") && (object.value != notificationsSlider.value)) {
                        notificationsSlider.set("value", object.value);
                    }
                    else if ((object.setting == "streamSlider") && (object.value != streamSlider.value)) {
                        streamSlider.set("value", object.value);
                    }
                    else if ((object.setting == "streamCheckBox") && (object.value != streamCheckBox.checked)) {
                        streamCheckBox.set("checked", object.value);
                        soundManager.toggleMute(config.SOUND_ID_STREAM);
                    }
                }, true);

                if (this.vertical == true){
                    tc.addChild(notificationsSlider);
                    tc.addChild(streamSlider);
                    tc.addChild(notificationCheckBox);
                    tc.addChild(streamCheckBox);
                } else {
                    tc.addChild(notificationCheckBox);
                    tc.addChild(notificationsSlider);
                    tc.addChild(streamCheckBox);
                    tc.addChild(streamSlider);
                }

                tc.startup();
                pane.addChild(tc);
                
                return pane;
            }
        });
    }
);