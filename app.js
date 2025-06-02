const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios')

const app = express();
app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
})

app.get('/customActivity.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'customActivity.js'));
});

app.get('/js/postmonger.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'postmonger.js'));
});


// Serve `config.json`
app.get('/config.json', (req, res) => {
  {console.log("Inside the config.json function")};

  res.sendFile(path.join(__dirname, 'config.json'));
});

function getClosestDate(selectedDays, selectedTime) {
  const currentDate = new Date(); // This gives local time
  const currentDay = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

  // Parse selectedTime (e.g., "4:00 PM") → to hours and minutes
  const [time, modifier] = selectedTime.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  // Construct the selected time today using local components
  const selectedTimeToday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hours,
    minutes,
    0,
    0
  );

  let closestDay = null;
  let minDiff = 8;

  for (let day of selectedDays) {
    let diff = (day - currentDay + 7) % 7;

    if (diff === 0) {
      if (currentDate.getTime() < selectedTimeToday.getTime()) {
        minDiff = 0;
        closestDay = day;
        break;
      } else {
        diff = 7; // it's too late today, go to next week
      }
    }

    if (diff < minDiff) {
      minDiff = diff;
      closestDay = day;
    }
  }

  const resultDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + minDiff,
    hours,
    minutes,
    0,
    0
  );

  return resultDate;
}


function formatDate(date) {
  const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedDate = date.toLocaleString('en-US', options);
  const [month, day, year] = formattedDate.split(/[\s,]+/);
  return `${month}-${day}-${year}`;
}

app.post('/execute', async (req, res) => {
    try {

      const {
        activityId,
        journeyId,
        inArguments = [],
      } = req.body;
  
      
      const selectedDays = (inArguments[0] && inArguments[0].selectedDays) || [];
      let selectedTime = (inArguments[1] && inArguments[1].selectedTime) || "";
      const contactKey = (inArguments[2] && inArguments[2].contactKey) || "";

      const closestDate = getClosestDate(selectedDays, selectedTime);
        
      if (!selectedTime) {
        selectedTime = "1:00 PM";
      }
        
      const formattedDate = formatDate(closestDate) + " " + selectedTime;
      console.log("fomatted date is", formattedDate);


      const tokenResponse = await axios.post('https://mcjtfjy4vdxv2ww8bm6y0zn1rpf4.auth.marketingcloudapis.com/v2/token', {
        grant_type: 'client_credentials',
        client_id: 'cvv69pjvucdwkhhpjqbam0gh',
        client_secret: 'GMIZ3FdMYaDnew4T1tCKFxf9'
      });

      const accessToken = tokenResponse.data.access_token;

      const deExternalKey = 'EmailScheduler'; // Replace with your Data Extension external key
      const url = `https://mcjtfjy4vdxv2ww8bm6y0zn1rpf4.rest.marketingcloudapis.com/hub/v1/dataevents/key:${deExternalKey}/rowset`;

      const body = [{
        keys: {
          ContactKey: contactKey,
          journeyId: journeyId,
          activityId: activityId
        },
        values: {
          SendDate: formattedDate
        }
      }];
    
      await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });


      const response = {
        "closestDate": formattedDate
      };
      return res.status(200).json(response);

    } catch (err) {
        console.error('Error in execute endpoint:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        res.status(500).send('Error processing request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Execute endpoint running on port ${PORT}`);
});