define([
    "dojo/_base/declare",
    "dojo/topic",
    "dojox/socket",
    "dojox/socket/Reconnect",
    "config/config",
    "./ProxyBase",
    ],

    function(declare, Topic, socket, reconnect, Constants, proxyBase) {

        return declare("WebSocketProxy", ProxyBase, {

            sockets: [],
            baseUrl: "ws:" + window.location.hostname + ":" + Constants.WEB_SOCKET_PORT,

            connect: function(channel, activeChannels) {
                try {
                    var channelUrl = this.baseUrl + channel;
                    console.log("[WebSocketProxy] connecting to " + channelUrl);
                    Topic.publish(Constants.TOPIC_CHANNEL_EVENT, { channel: channel, eventType: "Connecting", source: "WebSocketProxy" });
                    activeChannels.push(channel);
                    var socket = dojox.socket.Reconnect(dojox.socket(channelUrl));
                    this.listenSocket(activeChannels, channel, socket)
                }
                catch (e) {
                    Topic.publish(Constants.TOPIC_CHANNEL_EVENT, { channel: channel, eventType: "Error", source: "WebSocketProxy", error: e });
                    console.error("[WebSocketProxy] failed to listent WebSocket " + channel);
                    throw e;
                }
            },

            listenSocket: function(activeChannels, channel, socket) {
                socket.on("open", dojo.hitch(this, this.onSocketOpen, activeChannels, channel, socket));
                socket.on("close", dojo.hitch(this, this.onSocketClose, activeChannels, channel));
                socket.on("error", dojo.hitch(this, this.onSocketError, channel));
                socket.on("message", dojo.hitch(this, this.onSocketMessage, channel));
            },

            onSocketOpen: function(activeChannels, channel, socket, event) {
                this.addSocket(channel, socket);
                console.log("[WebSocketProxy] channel " + channel + " is active now; total channels: " + activeChannels.length);
                Topic.publish(Constants.TOPIC_CHANNEL_EVENT, { channel: channel, eventType: "Connected", source: "WebSocketProxy" });
            },

            onSocketClose: function(activeChannels, channel, event) {
                var i = activeChannels.indexOf(channel);
                if (i != -1) {
                    activeChannels.splice(i, 1);
                }
                this.removeSocket(channel);
                console.log("[WebSocketProxy] channel " + channel + " closed; total channels: " + activeChannels.length);
                Topic.publish(Constants.TOPIC_CHANNEL_EVENT, { channel: channel, eventType: "Closed", source: "WebSocketProxy" });
            },

            onSocketError: function(channel, error) {
                console.error("[WebSocketProxy] socket error in channel " + channel + "; " + JSON.stringify(error));
                Topic.publish(Constants.TOPIC_CHANNEL_EVENT, { channel: channel, eventType: "Error", source: "WebSocketProxy", error: error });
                throw error;
            },

            onSocketMessage: function(channel, event) {
                try {
                    var data = this.parseInput(event.data);
                    Topic.publish(channel, { data: data, channel: channel });
                } catch (error) {
                    console.error("[WebSocketProxy] error on delivering message in channel " + channel);
                    Topic.publish(Constants.TOPIC_CHANNEL_EVENT, { channel: channel, eventType: "Error", source: "WebSocketProxy", error: error });
                    throw error;
                }
            },

            sendMessage: function(message) {
                var socket = this.getSocket(message.channel);
                if (socket != null) {
                    try {
                        socket.send(message.data);
                    } catch (e) {
                        this.onSocketError(message.channel, e);
                    }
                } else {
                    console.warn("[WebSocketProxy] socket not available for channel " + message.channel);
                }
            },

            addSocket: function(channel, socket) {
                this.sockets[channel] = socket;
            },

            removeSocket: function(channel) {
                delete this.sockets[channel];
            },

            getSocket: function(channel) {
                return this.sockets[channel];
            }

        });
    }
);