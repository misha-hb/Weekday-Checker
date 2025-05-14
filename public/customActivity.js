define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};

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
        console.log("data is initialized");
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

        //connection.trigger("updateActivity", payload);

    }
    

    function save() {

        const selectedDays = [];
    $("input[name='days']:checked").each(function () {
        selectedDays.push(parseInt($(this).val()));
    });

    console.log("selected days are ", selectedDays);
    //payload.arguments.execute.outArguments = [
        //{ selectedDays: selectedDays }
    //];
    payload.metaData.isConfigured = true;

    console.log("✅ Payload Updated:", payload);
    connection.trigger("updateActivity", payload);
    }

});


/*

function getClosestDate(selectedDays, currentDate) {
    const currentDayOfWeek = currentDate.getDay();
    let closestDate = new Date(currentDate);

    let minDaysDifference = 7;
    let closestDay = null;

    for (const selectedDay of selectedDays) {
      let difference = selectedDay - currentDayOfWeek;
      if (difference < 0) {
        difference += 7;
      }

      if (difference < minDaysDifference) {
        minDaysDifference = difference;
        closestDay = new Date(currentDate);
        closestDay.setDate(currentDate.getDate() + difference);
      }
    }

    return closestDay;
  }

  // Custom formatting function for the desired format
  function formatDate(date) {
    const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleString('en-US', options);

    // Adjust format to "MMM-DD-YY 11:59 PM"
    const [month, day, year, time, period] = formattedDate.split(/[\s,]+/);
    const shortYear = year.slice(2);  // Take last two digits of the year
    return `${month}-${day}-${shortYear} ${time} ${period}`;
  }

  console.log('✅ Request received at /execute:', req.body);

  const today = new Date();
  const inArguments = req.jwtPayload?.inArguments || [];

  if (!Array.isArray(inArguments) || inArguments.length === 0) {
    //console.error('❌ No inArguments provided');
    inArguments = [{ selectedDays: [0, 1, 2, 3, 4, 5, 6] }];
  }

  const selectedDays = inArguments[0].selectedDays || [];

  const closestDate = getClosestDate(selectedDays, today);

  // Set the time to 11:59 PM
  closestDate.setHours(23);
  closestDate.setMinutes(59);
  closestDate.setSeconds(0);
  closestDate.setMilliseconds(0);

  const formattedDate = formatDate(closestDate);


*/


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
