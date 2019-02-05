let fs =  require('fs');
let path = require('path');
let pkg = require('./package.json');
let Classes = require('./classes/index');
let Module = Classes.general.Module;

let System = module.exports;
System.classes = Classes;
System.package = {
    name: pkg.name
}
System.getConfigFilename = function () {
    let production_config_filename = '_modules.json';
    let production_config_filepath = path.resolve(path.join(__dirname, production_config_filename));
    let development_config_filename = 'modules.json';
    let developlent_config_filepath = path.resolve(path.join(__dirname, development_config_filename));
    switch(process.env.NODE_ENV) {
        case 'production':
            if(!fs.existsSync(production_config_filepath)) {
                fs.copyFileSync(developlent_config_filepath, production_config_filepath);
                alert(`New configuration file created!\n\n${developlent_config_filepath}\n\nModify this file to set up your own configuration!`);
            };
            return production_config_filename;
        default:
        case 'developlent':
            return developlent_config_filepath;
    }
}
/**
 * @returns {Object<string, Module>}
 */
System.getModules = function getModules() {
    let config_filename = System.getConfigFilename();
    let modules_data = fs.readFileSync(config_filename);
    let module_configs = JSON.parse(modules_data.toString());
    let modules = Object.keys(module_configs).reduce((last, identifier, idx) => {
        let module_config = module_configs[identifier];
        let mod = new Module(identifier, module_config);
        last[identifier] = mod;
        return last;
    }, {});
    return modules;
}
System.default_module = Object.keys(System.getModules())[0];