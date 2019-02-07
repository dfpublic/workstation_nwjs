const Fs = require('fs');
const http = require('http');
const Module = require("../general/Module");
const ELEMENTID_MODULE_CONTAINER = 'module-container';
const DIRROOT_MODULES = '/client/modules';
const ENTRYFILE_MODULE = 'index.html';
const CLASSNAME_MENU_ACTIVE = 'blue';
const CLASS_NAME_TABITEM = 'tab-item';
const MODULE_CONTAINER_PREFIX = 'module_';
const MODULE_ACTIVATION_BUTTON_PREFIX = 'module_activator_';
const openurl = require('openurl');
const ModuleElement = require("./ModuleElement");
/**
 * @typedef {typeof import("../../node_modules/@types/nw.gui/index")} NwGui 
 */
class ModuleManager {
    /**
     * 
     * @param {Document} document 
     * @param {Object<string, Module>} system_modules
     * @param {{log: Function, gui: NwGui}} options
     */
    constructor(document, system_modules, options) {
        this.document = document;
        this.modules = system_modules;
        this.active_module_identifier = null;
        this.options = options;
    }
    /**
     * Logs a string in the console
     * @param {string} text 
     */
    debugLog(text) {
        this.options.log(text);
    }
    getModuleElementId(module_identifier) {
        return `${MODULE_CONTAINER_PREFIX}${module_identifier}`;
    }
    getModuleActivatorElementId(module_identifier) {
        return `${MODULE_ACTIVATION_BUTTON_PREFIX}${module_identifier}`;
    }
    /**
     * Activate a module in the user interface
     * @param {string} module_identifier 
     */
    setModuleActive(module_identifier) {
        //Disable the currently active module
        this.setModuleInactive(this.active_module_identifier);
        let module_element = this.acquireModuleElement(module_identifier);
        //Display the new module
        if (module_element) { //The module has been loaded before so just show
            module_element.style.display = '';
        }
        else { //There is no such module initialized so we need to create a new page
            this.initModule(module_identifier);
        }
        //Update the navigation indicators
        let activation_button = this.acquireActivationButton(module_identifier);
        activation_button.classList.add(CLASSNAME_MENU_ACTIVE);
        //Update the active modules
        this.active_module_identifier = module_identifier;
    }
    /**
     * Deactivate a module in the user interface
     * @param {string} module_identifier 
     */
    setModuleInactive(module_identifier) {
        if (module_identifier) {
            let activation_button = this.acquireActivationButton(module_identifier);
            activation_button.classList.remove(CLASSNAME_MENU_ACTIVE);
            let current_element = this.acquireModuleElement(module_identifier);
            current_element.style.display = 'none';
        }
        else {
            console.log('No currently active module.');
        }
    }
    /**
     * Initialize modules that are required to be preloaded based on the configuration
     */
    preloadModules() {
        let self = this;
        let modules = this.modules;
        Object.keys(modules).forEach(module_identifier => {
            if (module_identifier === self.active_module_identifier) {
                return; //Do not attempt to load an active module
            }
            let mod = modules[module_identifier];
            if (mod.preload) {
                self.preloadModule(module_identifier);
            }
        });
    }
    /**
     * UI - Generates an activation button element
     * @param {string} module_identifier 
     * @param {string} button_text 
     */
    createActivationButton(module_identifier, button_text = module_identifier) {
        let self = this;
        let menu_item = document.createElement("button");
        menu_item.id = self.getModuleActivatorElementId(module_identifier);
        menu_item.classList.add(CLASS_NAME_TABITEM);
        let button_text_elem = document.createTextNode(button_text);
        menu_item.onclick = function () {
            self.setModuleActive(module_identifier);
        }
        menu_item.appendChild(button_text_elem);


        let {gui} = this.options;
        let menu = new gui.Menu();
        menu.append(new gui.MenuItem({ label: 'Refresh', click: function() {self.refreshModule(module_identifier)} }));
        // menu.append(new gui.MenuItem({ label: 'Edit' }));
        // menu.append(new gui.MenuItem({ label: 'Email' }));
        // menu.append(new gui.MenuItem({ label: 'Play' }));
        // menu.append(new gui.MenuItem({ label: 'Tick' }));
        // menu.append(new gui.MenuItem({ type: 'separator' }));
        // let submenu = new gui.Menu();
        // submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
        // submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'box2' }));
        // submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'box3' }));
        // submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'box4' }));
        // menu.append(new gui.MenuItem({ label: 'Disk', submenu: submenu }));

        menu_item.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            menu.popup(event.x, event.y);
            return false;
        });
        return menu_item;
    }
    /**
     * UI - Attempts to get an existing activation button element
     * @param {string} module_identifier 
     */
    acquireActivationButton(module_identifier) {
        let id = this.getModuleActivatorElementId(module_identifier);
        let elem = this.document.getElementById(id);
        return elem;
    }

    /**
     * Gets a module by the identifier
     * @param {string} module_identifier 
     * @returns {Module}
     */
    getModule(module_identifier) {
        return this.modules[module_identifier];
    }
    /**
     * UI - attempts to get an existing module element by the identifier
     * @param {string} module_identifier 
     */
    acquireModuleElement(module_identifier) {
        let id = this.getModuleElementId(module_identifier);
        let element = this.document.getElementById(id);
        return element;
    }
    /**
     * UI - Generates a new module element by the identifier
     * @param {string} module_identifier 
     */
    createModuleElement(module_identifier) {
        let self = this;
        let _module = self.getModule(module_identifier);
        let module_element_id = this.getModuleElementId(module_identifier); 
        let module_element = new ModuleElement(self.document, _module, module_identifier, module_element_id, self.options);
        let element = module_element.getHTMLElement();
        return element;

    }
    refreshCurrentModule() {
        let self = this;
        self.refreshModule(self.active_module_identifier);
        // let module_id = this.getModuleElementId(this.active_module_identifier);
        // /** @type {*} webview type */
        // let module_element = this.document.getElementById(module_id);
        // module_element.reload();
    }
    refreshModule(module_identifier) {
        let module_id = this.getModuleElementId(module_identifier);
        /** @type {*} webview type */
        let module_element = this.document.getElementById(module_id);
        module_element.reload();
    }
    /**
     * Preloads a module
     * @param {string} module_identifier 
     */
    preloadModule(module_identifier) {
        let module_container = this.document.getElementById(ELEMENTID_MODULE_CONTAINER);
        let module_element_exists = this.document.getElementById(this.getModuleElementId(module_identifier));
        if (!module_element_exists) { //Only preload if the module does not yet exist
            let module_element = this.createModuleElement(module_identifier);
            module_element.style.display = 'none'; //ensure that the preloaded module is hidden
            //Deactivate the old module and insert the current one
            module_container.appendChild(module_element);
        }
    }
    /**
     * Initializes a module for use
     * @param {string} module_identifier 
     */
    initModule(module_identifier) {
        let module_container = this.document.getElementById(ELEMENTID_MODULE_CONTAINER);
        let module_element = this.createModuleElement(module_identifier);
        //Deactivate the old module and insert the current one
        module_container.appendChild(module_element);
    }

    /**
     * Select the next module in the list
     */
    cycleForward() {
        let module_identifiers = Object.keys(this.modules);
        let cur_module_idx = module_identifiers.indexOf(this.active_module_identifier);
        let next_module_idx = (cur_module_idx + 1 + module_identifiers.length) % module_identifiers.length;
        let next_module_identifier = module_identifiers[next_module_idx];
        this.setModuleActive(next_module_identifier);
    }

    /**
     * Select the previous module in the list
     */
    cycleBackward() {
        let module_identifiers = Object.keys(this.modules);
        let cur_module_idx = module_identifiers.indexOf(this.active_module_identifier);
        let next_module_idx = (cur_module_idx - 1 + module_identifiers.length) % module_identifiers.length;
        let next_module_identifier = module_identifiers[next_module_idx];
        this.setModuleActive(next_module_identifier);
    }
}
module.exports = ModuleManager;