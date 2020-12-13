"use strict";

const networkService = require("./../services/network-service")

const httpStatus = require("http-status-codes")

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports.get = (req, res, next) => {
    try {
    
   
        networkService.getBlocksInfo("admin", 10).then(resp=>{
            res.status(httpStatus.OK).send({
                codigo:200,
                mensagem: "Blocos recuperados",
                dado: resp
            });
        })
    
        
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send({ error: error })
    }

};