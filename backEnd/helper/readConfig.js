//@ts-check
'use strict';

const path = require('path');

module.exports.init = () => {
    return new Promise((resolve, reject) => {
        try {

            if (process.env.DISABLE_READ_CONF) {
                return;
            }

            let pwd = process.cwd();
            pwd += "/config/";
            const nodeEnv = process.env.NODE_ENV;
            let fileName = '_local.env';
            let file = '';
            file = pwd + fileName;
            if (typeof nodeEnv === "string" &&
                nodeEnv !== '') {
                switch (nodeEnv) {
                    case 'production':
                        fileName = '_prod.env';
                        break;
                    case 'staging':
                        fileName = '_qa.env';
                        break;
                    case 'development':
                        fileName = '_dev.env';
                        break;
                    default:
                }
                file = pwd + fileName;
            }

            require('dotenv')
                .config({
                    path: path.resolve(file)
                });

            resolve();
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};