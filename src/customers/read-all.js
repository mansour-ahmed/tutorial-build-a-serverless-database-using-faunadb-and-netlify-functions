
require('dotenv').config();

/* configure faunaDB Client with our secret */
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
  console.log('Function `read-all` invoked');
  return client
    .query(q.Paginate(q.Match(q.Ref('indexes/all_customers'))))
    .then(response => {
      const itemRefs = response.data;
      // create new query out of item refs. http://bit.ly/2LG3MLg
      const getAllItemsDataQuery = itemRefs.map(ref => {
        return q.Get(ref);
      });
      // then query the refs.
      return client.query(getAllItemsDataQuery).then(ret => {
        // wellformedData includes customers id in the response.
        const wellformedData = ret.map(malformedResponse => {
          return {
            id: malformedResponse.ts,
            ...malformedResponse.data
          };
        });
        return {
          statusCode: 200,
          body: JSON.stringify(wellformedData)
        };
      });
    })
    .catch(error => {
      console.log('error', error);
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      };
    });
};