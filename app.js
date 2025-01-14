const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 443;

app.use(bodyParser.json());

app.post('/execute', (req, res) => {
  const today = new Date();
  const day = today.getDay();
  const isWeekday = day >= 1 && day <= 5;

  res.json({
    sendEmail: isWeekday
  });
});

app.listen(port, () => {
  console.log(`Custom Activity app listening on port ${port}`);
});
