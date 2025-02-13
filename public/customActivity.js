import Postmonger from 'postmonger';

define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};

    //connection with Journey Builder
    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    connection.on("clickedNext", save);
    //connection.on("requestedTokens", onGetTokens);
    //connection.on("requestedEndpoints", onGetEndpoints);
    //connection.on("clickedNext", save);

    function onRender() {
        connection.trigger("ready");
        //connection.trigger("requestTokens");
        //connection.trigger("requestEndpoints");
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }
        payload.metaData = payload.metaData || {};
        payload.metaData.isConfigured = true;
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
    
        console.log("📥 Payload:", payload);
    
        // Extract `selectedDays` if previously saved
        const inArguments = payload.arguments.execute.inArguments;
        const selectedDays = (inArguments.length > 0 && inArguments[0].selectedDays) || [];
    
        // Pre-fill checkboxes based on existing `selectedDays`
        $("input[name='days']").each(function () {
            const value = parseInt($(this).val());
            if (selectedDays.includes(value)) {
                $(this).prop("checked", true);
            }
        });
    }
    

    function save() {
        //connection.trigger("updateActivity", payload);
        //console.log("✅ Payload Updated:", payload);
        const selectedDays = [];
    $("input[name='days']:checked").each(function () {
        selectedDays.push(parseInt($(this).val()));
    });

    payload.arguments.execute.inArguments = [
        { selectedDays: selectedDays }
    ];
    payload.metaData.isConfigured = true;

    console.log("✅ Payload Updated:", payload);
    connection.trigger("updateActivity", payload);
    }

    function onGetTokens(tokens) {
        // You can use tokens if needed for additional functionality.
        // Example: tokens.fuel2token
    }

    function onGetEndpoints(endpoints) {
        // Use endpoints if needed for additional functionality.
        // Example: endpoints.restHost
    }
});

// import Postmonger from 'postmonger';

// define(["postmonger"], function (Postmonger) {
//     "use strict";

//     var connection = new Postmonger.Session();
//     var payload = {};

//     $(window).ready(onRender);

//     connection.on("initActivity", initialize);
//     connection.on("requestedTokens", onGetTokens);
//     connection.on("requestedEndpoints", onGetEndpoints);


//     function onRender() {
//         connection.trigger("ready");
//         connection.trigger("requestTokens");
//         connection.trigger("requestEndpoints");
//     }

//     function initialize(data) {
//         console.log(data);
//         if (data) {
//             payload = data;
//         }
//         payload.metaData = payload.metaData || {};
//         payload.metaData.isConfigured = true;
    
//         payload.arguments = payload.arguments || {};
//         payload.arguments.execute = payload.arguments.execute || {};
//         payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
    
//         // Pre-fill checkboxes based on existing `selectedDays`
//         const inArguments = payload.arguments.execute.inArguments;
//         const selectedDays = (inArguments.length > 0 && inArguments[0].selectedDays) || [];
//         $("input[name='days']").each(function () {
//             const value = parseInt($(this).val());
//             if (selectedDays.includes(value)) {
//                 $(this).prop("checked", true);
//             }
//         });
//     }


//     $(document).on("submit", "#schedule-form", function (e) {
//         e.preventDefault();
//         save();
//     });

//     function save() {
//         // The `sendEmail` value is configured dynamically via your backend logic
//         // payload['arguments'] = payload['arguments'] || {};
//         // payload['arguments'].execute = {
//         //     inArguments: [
//         //         {
//         //             dayCheckEndpoint: "https://weekday-checker-7c974993cfeb.herokuapp.com/execute",
//         //         },
//         //     ],
//         // };

//         // connection.trigger("updateActivity", payload);

//         const selectedDays = []; // Gather checkbox values dynamically
//     $("input[name='days']:checked").each(function () {
//         selectedDays.push(parseInt($(this).val()));
//     });
//     console.log("Selected Days:", selectedDays);
//     payload.arguments.execute.inArguments = [
//         {
//             selectedDays: selectedDays
//         },
//     ];
//     payload.metaData.isConfigured = true;
//     connection.trigger("updateActivity", payload);
//     console.log("Payload Updated:", payload);
//     }
// });
