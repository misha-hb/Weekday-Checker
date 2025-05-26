define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};
    //var accessToken = '';

    //connection with Journey Builder
    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    connection.on("clickedNext", save);


    function onRender() {
        connection.trigger("ready");
        console.log("trieggered");

    }

    function initialize(data) {
        if (data) {
            payload = data;
        }
        console.log("data is initialized", payload);
        payload.metaData = payload.metaData || {};
        payload.metaData.isConfigured = true;
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
    
        if (!Array.isArray(payload.arguments.execute.inArguments) || payload.arguments.execute.inArguments.length === 0) {
            payload.arguments.execute.inArguments = [{ selectedDays: [] }];
        }

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
    
    /*async function getAccessToken() {
        const tokenUrl = `https://mcjtfjy4vdxv2ww8bm6y0zn1rpf4.auth.marketingcloudapis.com/v2/token`;  // Replace with your subdomain
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const body = JSON.stringify({
            grant_type: "client_credentials",
            client_id: "cvv69pjvucdwkhhpjqbam0gh",  // Replace with your Client ID
            client_secret: "GMIZ3FdMYaDnew4T1tCKFxf9"  // Replace with your Client Secret
        });

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: headers,
                body: body
            });

            if (response.ok) {
                const data = await response.json();
                accessToken = data.access_token;  // Store the access token
                console.log("Access token:", accessToken);
            } else {
                console.error("Error fetching access token:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching access token:", error);
        }
    }*/

    function save() {

        const selectedDays = [];
        $("input[name='days']:checked").each(function () {
            selectedDays.push(parseInt($(this).val()));
        });
    
        // Update the payload with selected days
        payload.arguments.execute.inArguments = [{ selectedDays: selectedDays }];
        payload.metaData.isConfigured = true;
    
        console.log("Selected days to save:", selectedDays);
    
        connection.trigger("updateActivity", payload);
        console.log("Updated payload:", payload);


    }

});