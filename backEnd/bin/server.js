'use strict';
// @ts-check


require('dotenv').config()
require('../helper/readConfig')
    .init()
    .then(() => {
        const app = require('../src/app');
        const http = require('http');
        const https = require('https');
        const fs = require('fs');

        let normalizePort = (val) => {
            const port = parseInt(val, 10);

            if (isNaN(port)) {
                return val;
            }

            if (port >= 0) {
                return port;
            }

            return false;
        }
        const port = normalizePort(process.env.PORT || '3000');

        app.set('port', port);
        const key = fs.readFileSync('./bin/device_id.key', 'utf8');
        const cert = fs.readFileSync('./bin/device_id.cer', 'utf8');


        const server = http.createServer(app);
        const serverHttps = https.createServer({
            key,
            cert
          }, app);
        
        // server.listen(port);
        serverHttps.listen(port);
        server.on('error', (error) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string' ?
                'Pipe ' + port :
                'Port ' + port;

            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;

                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;

                default:
                    console.error(error);
                    throw error;
            }
        });
        server.on('listening', () => {
            const addr = server.address();
            const bind = typeof addr === 'string' ?
                'pipe ' + addr :
                'port ' + addr.port;
            console.log("Listeinig on:" + bind);
        });
        process.on('uncaughtException', (err) => {
            console.error(`Caught exception: ${err}\n\n`);
        });

        process.on('exit', (code) => {
            console.error(`About to exit with code: ${code}\n\n`);
        });

        process.on('unhandledRejection', (reason, p) => {
            console.error(`Unhandled Rejection at: ${p} reason: ${reason}\n\n`);
        });

        process.on('warning', (warning) => {
            console.error(`Name: ${warning.name}\nMessage: ${warning.message}\nStack: ${warning.stack}\n\n`);
        });
    })
    .catch((err) => {
        console.error(`Error: ${err}`);
    });