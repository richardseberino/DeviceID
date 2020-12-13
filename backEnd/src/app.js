
"use strict";

const express = require("express");
const app = express();
const appUse = require("../helper/app.use")(app);


appUse.use('/v1/dispositivos_restritos/detalhes', require("./routes/v1/dispositivos_restritos/detalhes"));
appUse.use('/v1/dispositivos_restritos', require("./routes/v1/dispositivos_restritos"));
appUse.use('/v1/network_info', require("./routes/v1/network_info"));

module.exports = appUse;
