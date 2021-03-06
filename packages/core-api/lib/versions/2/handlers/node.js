'use strict'

const container = require('@arkecosystem/core-container')
const blockchain = container.resolvePlugin('blockchain')
const config = container.resolvePlugin('config')
const utils = require('../utils')

/**
 * @type {Object}
 */
exports.status = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  async handler (request, h) {
    const lastBlock = blockchain.getLastBlock(true)
    const networkHeight = await blockchain.p2p.getNetworkHeight()

    return {
      data: {
        synced: blockchain.isSynced(),
        now: lastBlock ? lastBlock.height : 0,
        blocksCount: networkHeight - lastBlock.height || 0
      }
    }
  }
}

/**
 * @type {Object}
 */
exports.syncing = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  async handler (request, h) {
    const lastBlock = blockchain.getLastBlock(true)
    const networkHeight = await blockchain.p2p.getNetworkHeight()

    return {
      data: {
        syncing: !blockchain.isSynced(),
        blocks: networkHeight - lastBlock.height || 0,
        height: lastBlock.height,
        id: lastBlock.id
      }
    }
  }
}

/**
 * @type {Object}
 */
exports.configuration = {
  /**
   * @param  {Hapi.Request} request
   * @param  {Hapi.Toolkit} h
   * @return {Hapi.Response}
   */
  async handler (request, h) {
    const feeStatisticsData = await blockchain.database.transactions.getFeeStatistics()

    return {
      data: {
        nethash: config.network.nethash,
        token: config.network.client.token,
        symbol: config.network.client.symbol,
        explorer: config.network.client.explorer,
        version: config.network.pubKeyHash,
        ports: utils.toResource(request, config, 'ports'),
        constants: config.getConstants(blockchain.getLastBlock(true).height),
        feeStatistics: utils.toCollection(request, feeStatisticsData, 'fee-statistics')
      }
    }
  }
}
