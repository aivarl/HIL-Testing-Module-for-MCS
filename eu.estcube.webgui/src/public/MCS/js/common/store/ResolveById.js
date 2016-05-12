define([
    "./MissionInformationStore",
    ],

    function(MissionInformationStore) {
        return function(id, node, store) {
            // user MissionInformationStore if none is provided
            store = MissionInformationStore;
            // query for given id
            var results = store.query({ ID: id });
            // in case the name is not resolved use "..."
            node.innerHTML = results.total > 0 ? results[0].name : "...";
            // observe lookup store for updates and replace the "..." with actual name

            var observer = results.observe(function(newValue) {
                node.innerHTML = newValue.name;

            });
        }
    }
);