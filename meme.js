require('dotenv').config();
const yargs = require('yargs');
yargs.command(require('./fetch')).command(require('./make')).help().argv;
