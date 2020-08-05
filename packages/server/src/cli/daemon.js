const debug = require('debug')('MyProjectName:daemon')
const Core = require('../core'); //MyProjectName client.
const Components = require('../core/components')
const httpServer = require('../http')

class Daemon {
    constructor(options) {
        this._options = options || {};
        this.repoPath = options.repoPath;
        this.config = new Components.Config(this.repoPath)
    }
    async start() {
        await this.config.open(); //Load config into memory. Use this.config if planning to run custom startup options.

        //Custom start up options here
        debug("starting")
        this.client = new Core(this._options); //Customize at will
        await this.client.start();
        
        //abstract API endpoints for interacting with daemon after startup.
        this.httpServer = new httpServer(this.client)
        await this.httpServer.start();
    }
    async stop() {
        await this.httpServer.stop();
        await this.client.stop();
    }
}
module.exports = Daemon