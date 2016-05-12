define([
    "config/config",
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                ESTCube1_Commanding: {
                    path: "ESTCube-1/commanding",
                    defaults: {
                        controller: "ESTCube-1.commanding/CommandingController",
                        method: "index",
                    },
                    roles: config.ROLES_CAN_COMMAND
                },
            },

            COMMANDING: {
                SEND_COMMAND_URL: "/sendCommand",
                GET_COMMANDS_URL: "/getCommands",
                GET_COMMAND_ARGUMENTS_URL: "/getCommandArguments",
                DEFAULT_GS: "06",
                DEFAULT_CDHS_SOURCE: "06",
                DEFAULT_CDHS_BLOCK_INDEX: "0",

                defaults: {
                    destAddr: "8A A6 6A 8A 40 40 76",
                    sourceAddr: "8A A6 6A 8A 86 40 62",
                    ctrl: "03",
                    pid: "0F",
                    port: 0
                },

                constraints: {
                    destAddr: { length: 7 },
                    sourceAddr: { length: 7 },
                    ctrl: { length: 1},
                    pid: { length: 1},
                    port: { min: 0, max: 15 },
                    info: { minLength: 1, maxLength: 239 }
                },

                SUBMIT_URL : "/ax25/submit"
            }
        };
    }
);
