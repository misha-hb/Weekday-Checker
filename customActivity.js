define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};
    var currentStep = 'step1';

    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    connection.on("requestedTokens", onGetTokens);
    connection.on("requestedEndpoints", onGetEndpoints);
    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack);
    connection.on("gotoStep", onGotoStep);

    function onRender() {
        connection.trigger("ready");
        connection.trigger("requestTokens");
        connection.trigger("requestEndpoints");
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        if (!hasInArguments) {
            payload['arguments'] = payload['arguments'] || {};
            payload['arguments'].execute = payload['arguments'].execute || {};
            payload['arguments'].execute.inArguments = [];
        }

        payload['metaData'] = payload['metaData'] || {};
        payload['metaData'].isConfigured = true;
    }

    function onGetTokens(tokens) {
        // You can use tokens if needed for additional functionality.
        // Example: tokens.fuel2token
    }

    function onGetEndpoints(endpoints) {
        // Use endpoints if needed for additional functionality.
        // Example: endpoints.restHost
    }

    function onClickedNext() {
        save();
    }

    function onClickedBack() {
        connection.trigger("prevStep");
    }

    function onGotoStep(step) {
        currentStep = step;
        connection.trigger("ready");
    }

    function save() {
        // The `sendEmail` value is configured dynamically via your backend logic
        payload['arguments'].execute.inArguments = [
            {
                dayCheckEndpoint: "https://weekday-checker.onrender.com/execute",
            },
        ];

        connection.trigger("updateActivity", payload);
    }
});
