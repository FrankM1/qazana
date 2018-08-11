jQuery(function () {

    var fontManager = require('./font-manager'),
        typekitAdmin = require('./typekit');

    new fontManager().init();
    new typekitAdmin();
});