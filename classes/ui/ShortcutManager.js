class ShortcutManager {
    /**
     * 
     * @param {typeof import("./../../node_modules/@types/nw.gui/index")} gui 
     * @param {{log: function}} options
     */
    constructor(gui, options) {
        this.gui = gui;
        this.options = options;
    }
    debugLog(text) {
        this.options.log(text);
    }

    registerHotKey(key, handler) {
        let self = this;
        let options = {
            key: key,
            active: function () {
                handler();
            },
            failed: function (msg) {
                self.debugLog(msg);
            }
        };
        let shortcut = new this.gui.Shortcut(options);
        this.gui.App.registerGlobalHotKey(shortcut);
    }
}
module.exports = ShortcutManager;