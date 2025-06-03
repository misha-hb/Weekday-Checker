define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};
 
    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    connection.on("clickedNext", save);


    function onRender() {
        connection.trigger("ready");

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
            payload.arguments.execute.inArguments = [{ selectedDays: [], contactKey: ""  }];
        }

        console.log("📥 Payload:", payload);
    
        // Extract `selectedDays` if previously saved
        const inArguments = payload.arguments.execute.inArguments;
        const selectedDays = (inArguments.length > 0 && inArguments[0].selectedDays) || [];
        const selectedTime = (inArguments.length > 1 && inArguments[1].selectedTime) || "";
        const timezone = (inArguments.length > 2 && inArguments[2].timezone) || "";
        const contactKey = (inArguments.length > 2 && inArguments[3].contactKey) || "";

    
        // Pre-fill checkboxes based on existing `selectedDays`
        $("input[name='days']").each(function () {
            const value = parseInt($(this).val());
            if (selectedDays.includes(value)) {
                $(this).prop("checked", true);
            }
        });

        if (selectedTime) {
            const timeParts = selectedTime.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
            if (timeParts) {
                const [, hour, minute, ampm] = timeParts;
                $('#hour').val(hour);
                $('#minute').val(minute);
                $('#ampm').val(ampm.toUpperCase());
            }
        }

        console.log("Contact Key loaded:", contactKey);

    }
    

    function save() {

        const selectedDays = [];
        $("input[name='days']:checked").each(function () {
            selectedDays.push(parseInt($(this).val()));
        });
    
        const hour = $('#hour').val() || "01";
        const minute = $('#minute').val() || "00";
        const ampm = $('#ampm').val() || "AM";

        const selectedTime = `${hour}:${minute} ${ampm}`
        const timezone = $('#timezone').val() || "ET";


        const existingInArgs = payload.arguments.execute.inArguments || [];
        let contactKey = "";
        if (existingInArgs.length > 3) {
            contactKey = existingInArgs[3]?.contactKey || "";
        } else {
            contactKey = "";
        }

        // Save selectedDays and contactKey in inArguments
        payload.arguments.execute.inArguments = [
            { selectedDays: selectedDays },
            { selectedTime: selectedTime },
            { timezone: timezone },
            { contactKey: contactKey }
        ];

        payload.metaData.isConfigured = true;

        console.log("Selected days to save:", selectedDays);
        console.log("Contact Key saved:", contactKey);

        connection.trigger("updateActivity", payload);
        console.log("Updated payload:", payload);


    }

});