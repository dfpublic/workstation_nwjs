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
/**
 * @returns {Object<string, Module>}
 */
System.getModules = function getModules() {
    let modules_data = fs.readFileSync('modules.json');
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