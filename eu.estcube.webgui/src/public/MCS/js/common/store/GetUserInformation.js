define(['common/store/MissionInformationStore'], function(MissionInformationStore) {
    return function(callback) {
        var userInfo = MissionInformationStore.query( {class: "UserInfo"} );
        
        if(typeof(userInfo[0]) != 'undefined') {
            callback(userInfo[0]);
        } else {
            var handle = userInfo.observe(function() {
               callback(userInfo[0]);
               
               handle.cancel();
            });
        }
    };
});