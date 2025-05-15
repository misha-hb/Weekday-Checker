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

    console.log("selected days are ", selectedDays);
    payload.arguments.execute.inArguments[0].selectedDays = selectedDays;

    
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
    
      function formatDate(date) {
        const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedDate = date.toLocaleString('en-US', options);
        const [month, day, year, time, period] = formattedDate.split(/[\s,]+/);
        return `${month}-${day}-${year} ${time} ${period}`;
      }
        
      const today = new Date();
        
      const closestDate = getClosestDate(selectedDays, today);
    
      // Set the time to 11:59 PM
      closestDate.setHours(23);
      closestDate.setMinutes(59);
      closestDate.setSeconds(0);
      closestDate.setMilliseconds(0);
    
      const formattedDate = formatDate(closestDate);
    
    payload.arguments.execute.outArguments[0].closestDate = formattedDate;


    payload.metaData.isConfigured = true;

    console.log("✅ closest date is: ", formattedDate);

    connection.trigger("updateActivity", payload);
    console.log("updated payload is: ", payload);

    /*getAccessToken();

    // Now send the upsert request to Marketing Cloud
    const externalKey = 'EmailScheduler';  // Replace with your data extension external key
    const apiEndpoint = `https://mcjtfjy4vdxv2ww8bm6y0zn1rpf4.rest.marketingcloudapis.com/hub/v1/dataevents/key:${externalKey}/rowset`;  // Replace {subdomain} with your actual subdomain
    //client secret GMIZ3FdMYaDnew4T1tCKFxf9
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);  // Replace with your access token
    headers.append('Content-Type', 'application/json');

    const body = JSON.stringify([
        {
            "keys": {
                "MemberId": "38bed58c-9b97-4e95-90bf-8f39e8f539e1"
            },
            "values": {
                "FirstName": "Raul",
                "Surname": "Nieto",
                "RewardsPoints": 23456,
                "RewardsTier": 3,
                "Area": "Enfield"
            }
        },
        {
            "keys": {
                "MemberId": "54ce45e4-bd37-4284-bffe-593256ea5bd4"
            },
            "values": {
                "FirstName": "Mary",
                "Surname": "Evans",
                "RewardsPoints": 7849,
                "RewardsTier": 1,
                "Area": "Islington"
            }
        }
    ]);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Upsert successful:", result);
        } else {
            console.error("Error with upsert:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error sending request:", error);
    }*/

    }

});