// here is all the code to spin my node.js server
const http = require('http');
const app = require('./app');
// process.env access the nodejs environment variables
const port = process.env.PORT || 3000;
// to create  a server we need to pass a listener
// which is function that gets executed whenever we
// get a new request, and responsible for returning
// the response we live this empty for now, but in the future well change t
// the express app qualifies as a request handler
const server = http.createServer(app);
server.listen(port);
