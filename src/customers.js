/* eslint-disable */
exports.handler = async (event, context) => {
    const path = event.path.replace(/\.netlify\/functions\/[^\/]+/, '');
    const segments = path.split('/').filter(e => e);
  
    switch (event.httpMethod) {
      case 'GET':
        // e.g. GET /.netlify/functions/customers
        if (segments.length === 0) {
          return require('./customers/read-all').handler(event, context);
        }
        // e.g. GET /.netlify/functions/customers/123456
        if (segments.length === 1) {
          event.id = segments[0];
          return require('./customers/read').handler(event, context);
        } else {
          return {
            statusCode: 500,
            body:
              'too many segments in GET request, must be either /.netlify/functions/customers or /.netlify/functions/customers/123456'
          };
        }
      case 'POST':
        // e.g. POST /.netlify/functions/customers with a body of key value pair objects, NOT strings
        return require('./customers/create').handler(event, context);
      case 'PUT':
        // e.g. PUT /.netlify/functions/customers/123456 with a body of key value pair objects, NOT strings
        if (segments.length === 1) {
          event.id = segments[0];
          console.log(event.id)
          return require('./customers/update').handler(event, context);
        } else {
          return {
            statusCode: 500,
            body:
              'invalid segments in POST request, must be /.netlify/functions/customers/123456'
          };
        }
      case 'DELETE':
        // e.g. DELETE /.netlify/functions/customers/123456
        if (segments.length === 1) {
          event.id = segments[0];
          return require('./customers/delete').handler(event, context);
        } else {
          return {
            statusCode: 500,
            body:
              'invalid segments in DELETE request, must be /.netlify/functions/customers/123456'
          };
        }
      case 'OPTIONS':
        // To enable CORS
        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
        };
        return {
          statusCode: 200, // <-- Must be 200 otherwise pre-flight call fails
          headers,
          body: 'This was a preflight call!'
        };
    }
    return {
      statusCode: 500,
      body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE/OPTIONS'
    };
  };