define([
    'postmonger'
  ], function (Postmonger) {
    const connection = new Postmonger.Session();
    let payload = {};
  
    connection.on('initActivity', (data) => {
      payload = data;
    });
  
    connection.on('clickedNext', () => {
      // Save payload and go to the next step
      connection.trigger('updateActivity', payload);
    });
  });