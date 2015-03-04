KUNFIG
======
Kunfig is a simplistic **config manager**. This allows you to load a base configuration file for your nodejs application as well as an environmental config at the same time.

## Installation
Start by installing the module via npm:
```bash
$ npm install kunfig
```
Create a folder named ```config/env``` under the root of your project. Inside of the env folder create an ```all.js```, ```dev.js```, and ```prod.js```

From inside your node application you can call the configuration by simply using require!
```javascript
var config = require('kunfig');
```

If you would like to use an alternative configuration directory you can do the following:
```javascript
var config = require('kunfig').configPath('./myConfigs');
```