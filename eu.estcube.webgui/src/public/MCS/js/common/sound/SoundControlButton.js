define([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/cookie",
        "dijit/form/Button",
        "dijit/form/VerticalSlider",
        "dijit/form/CheckBox",
        "dijit/form/TextBox",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojox/layout/TableContainer",
        "common/store/AudioSettingStore", 
        "common/display/AudioContentProvider"
        ],

        function(declare, DomConstruct, Cookie, Button, VerticalSlider, CheckBox, 
                 TextBox, TooltipDialog, Popup, TableContainer, AudioSettingStore, 
                 AudioContentProvider) {

            declare("SoundControlButton", Button, {

                constructor: function(args) {

                    var audio2 = new AudioContentProvider({ 
                        id:"soundPopUp", 
                        vertical:true, 
                        style1: "notifications-slider", 
                        style2: "stream-slider",
                    }).getContent();

                    this.streamSoundMute = (Cookie(config.COOKIE_STREAM_MUTE) == "true" ? true : false);
                    this.notificationSoundMute = (Cookie(config.COOKIE_NOTIFICATIONS_MUTE) == "true" ? true : false);

                    this.title = args.tooltip == null ? args.label : args.tooltip;
                    this.iconClass = (this.notificationSoundMute && this.streamSoundMute) ? config.CLASS_SPEAKER_MUTE : config.CLASS_SPEAKER;

                    var button = this;

                    var notificationCheckBoxFilter = AudioSettingStore.query();
                    var notificationCheckBoxObserve = notificationCheckBoxFilter.observe(function (object) {
                        if (Cookie(config.COOKIE_STREAM_MUTE) == "true" && Cookie(config.COOKIE_NOTIFICATIONS_MUTE) == "true"){
                            button.set("iconClass", config.CLASS_SPEAKER_MUTE);
                        } else {
                            button.set("iconClass", config.CLASS_SPEAKER);
                        };

                        if ((object.setting == "audio2.notificationCheckBox") && (object.value != notificationCheckBox.checked)) {
                            notificationCheckBox.set("checked", object.value);
                        }
                        else if ((object.setting == "audio2.notificationsSlider") && (object.value != notificationsSlider.value)) {
                            notificationsSlider.set("value", object.value);
                        }
                        else if ((object.setting == "audio2.streamSlider") && (object.value != streamSlider.value)) {
                            streamSlider.set("value", object.value);
                        }
                        else if ((object.setting == "audio2.streamCheckBox") && (object.value != streamCheckBox.checked)) {
                            streamCheckBox.set("checked", object.value);
                            soundManager.toggleMute(config.SOUND_ID_STREAM);
                        }
                    }, true);

                    this.closed = true;
                    
                    this.soundControlDialog = new TooltipDialog({
                        content: audio2,
                        onClose: function() {
                            button.closed = true;
                        },
                        onBlur: function() {
                            Popup.close(this);
                            button.closed = true;
                        }
                    });
                },

                onClick: function() {

                    if (this.closed){
                        this.closed = false;
                        Popup.open({
                            popup: this.soundControlDialog,
                            around: this.domNode,
                            orient: ["below-centered"]
                        });
                        this.soundControlDialog.focus();
                    } else {
                        this.closed = true;
                        Popup.hide(this.soundControlDialog);
                    }
                }
            });  
        }
    );