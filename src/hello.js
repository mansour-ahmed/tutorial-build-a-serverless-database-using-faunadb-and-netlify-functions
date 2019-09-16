exports.handler = function(
    event, // Netlify event
    context, // Netlify context
    callback // Your callback
  ) {
    callback(null, {
      statusCode: 200, // response status code
      body: 'Hello, World' // response body
    });
  };