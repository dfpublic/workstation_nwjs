var win = nw.Window.get();
var gui = require('nw.gui');
let System = require("./../system.js");
if (process.env.NODE_ENV === 'development') {
    win.showDevTools();
}
//Class import
let ModuleManager = System.classes.ui.ModuleManager;
let ShortcutManager = System.classes.ui.ShortcutManager;

//Managers and configs
let modules = System.getModules();
let module_manager = new ModuleManager(document, modules, {
    log: console.log
});
let shortcut_manager = new ShortcutManager(gui, document, {log: console.log});
document.addEventListener("DOMContentLoaded", function (event) {
    function init_app_nav() {
        //do work
        let app_nav = document.getElementById("nav");
        let menu_items = ui_generate_menuitems();
        Object.keys(menu_items).map(module_identifier => {
            let menu_item = menu_items[module_identifier];
            app_nav.append(menu_item);
        });
    }
    init_app_nav();
    module_manager.setModuleActive(System.default_module);
    module_manager.preloadModules();
});

/**
 * Generates all the ui elements for the navigation menu
 */
function ui_generate_menuitems() {
    let menu_items = {};
    for (var mod_idx in modules) {
        let mod = modules[mod_idx];
        //Generate the menu items
        let menu_item = module_manager.createActivationButton(mod.identifier, mod.displayname);
        menu_items[mod.identifier] = menu_item;
    }
    return menu_items;
}
/**
 * Initialize any system user interface items
 */
function init_system() {
    //Set the window in full screen mode
    var ngui = require('nw.gui');
    var nwin = ngui.Window.get();
    nwin.maximize();
    init_shortcuts();
}
function init_shortcuts() {
    shortcut_manager.registerHotKey('command+r', () => {
        module_manager.refreshCurrentModule();
    });
    shortcut_manager.registerHotKey('command+shift+r', () => {
        window.location.reload();
    });
    shortcut_manager.registerHotKey('ctrl+r', () => {
        module_manager.refreshCurrentModule();
    });
    shortcut_manager.registerHotKey('ctrl+shift+r', () => {
        window.location.reload();
    });
    shortcut_manager.registerHotKey('ctrl+tab', () => {
        module_manager.cycleForward();
    });
    shortcut_manager.registerHotKey('ctrl+shift+tab', () => {
        module_manager.cycleBackward();
    });
}

init_system();