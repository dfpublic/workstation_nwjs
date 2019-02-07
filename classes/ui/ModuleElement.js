const Module = require("../general/Module");
const openurl = require('openurl');
/**
 * @typedef {typeof import("../../node_modules/@types/nw.gui/index")} NwGui 
 */
class ModuleElement {
    /**
     * @param {Document} document 
     * @param {Module} _module
     * @param {string} identifier
     * @param {string} module_element_id
     * @param {{log: Function, gui: NwGui}} options
     */
    constructor(document, _module, identifier, module_element_id, options) {
        this.document = document;
        this.module_identifier = identifier;
        this._module = _module;
        this.module_element = this.document.createElement('webview');
        this.module_element_id = module_element_id;
        this.options = options;
        this.init();
    }
    debugLog(text) {
        this.options.log(text);
    }
    init() {
        let { module_element } = this;
        this._initModuleCore(module_element);
        this._initModuleStyles(module_element);
        this._initModulePermissions(module_element);
    }
    _initModuleCore(module_element) {
        let { _module, module_element_id } = this;
        let system_module = _module;
        module_element.id = module_element_id; //Initialize handle
        let url_target = system_module.url;
        module_element.setAttribute('nwdisable', '');
        module_element.setAttribute('nwfaketop', '');
        module_element.setAttribute('src', url_target);
        let data_partition = system_module.data_partition ? system_module.data_partition : 'global';
        module_element.setAttribute('partition', `persist:${data_partition}`); //Set the data partition

    }
    _initModuleStyles(module_element) {
        module_element.style.width = "100%";
        module_element.style.height = "100%";
        module_element.setZoom(0.95);
    }
    _initModulePermissions(module_element) {
        //Open links in new window
        module_element.addEventListener('newwindow', function (event) {
            openurl.open(event.targetUrl, () => { });
        });

        //Request to download files
        module_element.addEventListener('permissionrequest', function (event) {
            switch (event.permission) {
                case 'download':
                    event.request.allow();
                    break;
            }
        });
    }

    getHTMLElement() {
        return this.module_element;
    }
}
module.exports = ModuleElement;