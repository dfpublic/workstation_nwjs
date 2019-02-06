let fs = require('fs');
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
    let sample_config_filename = 'modules.json';
    let sample_config_filepath = path.resolve(path.join(__dirname, 'config', sample_config_filename));
    let selected_config_filename = 'user_default.json';
    let selected_config_filepath = null;
    switch (process.env.NODE_ENV) {
        case 'production':
            selected_config_filename = 'user_default.json';
            break;
        case 'work':
            selected_config_filename = 'work.json';
            break;
        default:
        case 'development':
            selected_config_filename = 'modules.json';
        break;
    }

    selected_config_filepath = path.resolve(path.join(__dirname, 'config', selected_config_filename));
    if (!fs.existsSync(selected_config_filepath)) {
        fs.copyFileSync(sample_config_filepath, selected_config_filepath);
        alert(`New configuration file created!\n\n${sample_config_filepath}\n\nModify this file to set up your own configuration!`);
    };
    return selected_config_filepath;
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