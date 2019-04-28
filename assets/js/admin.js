/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../assets/dev/js/admin/admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../assets/dev/js/admin/admin.js":
/*!***************************************!*\
  !*** ../assets/dev/js/admin/admin.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function ($) {
  var ViewModule = __webpack_require__(/*! qazana-utils/view-module */ "../assets/dev/js/utils/view-module.js");

  var QazanaAdmin = ViewModule.extend({
    modules: {
      Module: __webpack_require__(/*! qazana-utils/module */ "../assets/dev/js/utils/module.js")
    },
    maintenanceMode: null,
    config: QazanaAdminConfig,
    getDefaultElements: function getDefaultElements() {
      var elements = {
        $window: $(window),
        $body: $('body'),
        $switchMode: $('#qazana-switch-mode'),
        $goToEditLink: $('#qazana-go-to-edit-page-link'),
        $switchModeInput: $('#qazana-switch-mode-input'),
        $switchModeButton: $('#qazana-switch-mode-button'),
        $qazanaLoader: $('.qazana-loader'),
        $builderEditor: $('#qazana-editor'),
        $importButton: $('#qazana-import-template-trigger'),
        $importArea: $('#qazana-import-template-area'),
        $settingsForm: $('#qazana-settings-form'),
        $settingsTabsWrapper: $('#qazana-settings-tabs-wrapper')
      };
      elements.$settingsFormPages = elements.$settingsForm.find('.qazana-settings-form-page');
      elements.$activeSettingsPage = elements.$settingsFormPages.filter('.qazana-active');
      elements.$settingsTabs = elements.$settingsTabsWrapper.children();
      elements.$activeSettingsTab = elements.$settingsTabs.filter('.nav-tab-active');
      return elements;
    },
    toggleStatus: function toggleStatus() {
      var isQazanaMode = this.isQazanaMode();
      this.elements.$body.toggleClass('qazana-editor-active', isQazanaMode).toggleClass('qazana-editor-inactive', !isQazanaMode);
    },
    bindEvents: function bindEvents() {
      var self = this;
      self.elements.$switchModeButton.on('click', function (event) {
        event.preventDefault();

        if (self.isQazanaMode()) {
          self.elements.$switchModeInput.val('');
        } else {
          self.elements.$switchModeInput.val(true);
          var $wpTitle = $('#title');

          if (!$wpTitle.val()) {
            $wpTitle.val('Qazana #' + $('#post_ID').val());
          }

          if (wp.autosave) {
            wp.autosave.server.triggerSave();
          }

          self.animateLoader();
          $(document).on('heartbeat-tick.autosave', function () {
            self.elements.$window.off('beforeunload.edit-post');
            location.href = self.elements.$goToEditLink.attr('href');
          });
        }

        self.toggleStatus();
      });
      self.elements.$goToEditLink.on('click', function () {
        self.animateLoader();
      });
      $('div.notice.qazana-message-dismissed').on('click', 'button.notice-dismiss, .qazana-button-notice-dismiss', function (event) {
        event.preventDefault();
        $.post(ajaxurl, {
          action: 'qazana_set_admin_notice_viewed',
          notice_id: $(this).closest('.qazana-message-dismissed').data('notice_id')
        });
        var $wrapperElm = $(this).closest('.qazana-message-dismissed');
        $wrapperElm.fadeTo(100, 0, function () {
          $wrapperElm.slideUp(100, function () {
            $wrapperElm.remove();
          });
        });
      });
      $('#qazana-clear-cache-button').on('click', function (event) {
        event.preventDefault();
        var $thisButton = $(this);
        $thisButton.removeClass('success').addClass('loading');
        $.post(ajaxurl, {
          action: 'qazana_clear_cache',
          _nonce: $thisButton.data('nonce')
        }).done(function () {
          $thisButton.removeClass('loading').addClass('success');
        });
      });
      $('#qazana-library-sync-button').on('click', function (event) {
        event.preventDefault();
        var $thisButton = $(this);
        $thisButton.removeClass('success').addClass('loading');
        $.post(ajaxurl, {
          action: 'qazana_reset_library',
          _nonce: $thisButton.data('nonce')
        }).done(function () {
          $thisButton.removeClass('loading').addClass('success');
        });
      });
      $('#qazana-replace-url-button').on('click', function (event) {
        event.preventDefault();
        var $this = $(this),
            $tr = $this.parents('tr'),
            $from = $tr.find('[name="from"]'),
            $to = $tr.find('[name="to"]');
        $this.removeClass('success').addClass('loading');
        $.post(ajaxurl, {
          action: 'qazana_replace_url',
          from: $from.val(),
          to: $to.val(),
          _nonce: $this.data('nonce')
        }).done(function (response) {
          $this.removeClass('loading');

          if (response.success) {
            $this.addClass('success');
          }

          self.getDialogsManager().createWidget('alert', {
            message: response.data
          }).show();
        });
      });
      self.elements.$settingsTabs.on({
        click: function click(event) {
          event.preventDefault();
          event.currentTarget.focus(); // Safari does not focus the tab automatically
        },
        focus: function focus() {
          // Using focus event to enable navigation by tab key
          var hrefWithoutHash = location.href.replace(/#.*/, '');
          history.pushState({}, '', hrefWithoutHash + this.hash);
          self.goToSettingsTabFromHash();
        }
      });
      $('.qazana-rollback-button').on('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        self.getDialogsManager().createWidget('confirm', {
          headerMessage: self.config.i18n.rollback_to_previous_version,
          message: self.config.i18n.rollback_confirm,
          strings: {
            confirm: self.config.i18n.yes,
            cancel: self.config.i18n.cancel
          },
          onConfirm: function onConfirm() {
            $this.addClass('loading');
            location.href = $this.attr('href');
          }
        }).show();
      });
      $('.qazana_css_print_method select').on('change', function () {
        var $descriptions = $('.qazana-css-print-method-description');
        $descriptions.hide();
        $descriptions.filter('[data-value="' + $(this).val() + '"]').show();
      }).trigger('change');
    },
    setMarionetteTemplateCompiler: function setMarionetteTemplateCompiler() {
      if ('undefined' !== typeof Marionette) {
        Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate, options) {
          options = {
            evaluate: /<#([\s\S]+?)#>/g,
            interpolate: /{{{([\s\S]+?)}}}/g,
            escape: /{{([^}]+?)}}(?!})/g
          };
          return _.template(rawTemplate, options);
        };
      }
    },
    onInit: function onInit() {
      ViewModule.prototype.onInit.apply(this, arguments);
      this.setMarionetteTemplateCompiler();
      this.initDialogsManager();
      this.initTemplatesImport();
      this.initMaintenanceMode();
      this.goToSettingsTabFromHash();
      this.roleManager.init();
      this.extensionManager.init();
    },
    initDialogsManager: function initDialogsManager() {
      var dialogsManager;

      this.getDialogsManager = function () {
        if (!dialogsManager) {
          dialogsManager = new DialogsManager.Instance();
        }

        return dialogsManager;
      };
    },
    initTemplatesImport: function initTemplatesImport() {
      if (!this.elements.$body.hasClass('post-type-qazana_library')) {
        return;
      }

      var self = this,
          $importButton = self.elements.$importButton,
          $importArea = self.elements.$importArea;
      self.elements.$formAnchor = $('h1');
      $('#wpbody-content').find('.page-title-action:last').after($importButton);
      self.elements.$formAnchor.after($importArea);
      $importButton.on('click', function () {
        $('#qazana-import-template-area').toggle();
      });
    },
    initMaintenanceMode: function initMaintenanceMode() {
      var MaintenanceMode = __webpack_require__(/*! qazana-admin/maintenance-mode */ "../assets/dev/js/admin/maintenance-mode.js");

      this.maintenanceMode = new MaintenanceMode();
    },
    isQazanaMode: function isQazanaMode() {
      return !!this.elements.$switchModeInput.val();
    },
    animateLoader: function animateLoader() {
      this.elements.$goToEditLink.addClass('qazana-animate');
    },
    goToSettingsTabFromHash: function goToSettingsTabFromHash() {
      var hash = location.hash.slice(1);

      if (hash) {
        this.goToSettingsTab(hash);
      }
    },
    goToSettingsTab: function goToSettingsTab(tabName) {
      var $activePage = this.elements.$settingsFormPages.filter('#' + tabName);

      if (!$activePage.length) {
        return;
      }

      this.elements.$activeSettingsPage.removeClass('qazana-active');
      this.elements.$activeSettingsTab.removeClass('nav-tab-active');
      var $activeTab = this.elements.$settingsTabs.filter('#qazana-settings-' + tabName);
      $activePage.addClass('qazana-active');
      $activeTab.addClass('nav-tab-active');
      this.elements.$settingsForm.attr('action', 'options.php#' + tabName);
      this.elements.$activeSettingsPage = $activePage;
      this.elements.$activeSettingsTab = $activeTab;
    },
    roleManager: {
      selectors: {
        body: 'qazana-role-manager',
        row: '.qazana-role-row',
        label: '.qazana-role-label',
        excludedIndicator: '.qazana-role-excluded-indicator',
        excludedField: 'input[name="qazana_exclude_user_roles[]"]',
        controlsContainer: '.qazana-role-controls',
        toggleHandle: '.qazana-role-toggle',
        arrowUp: 'dashicons-arrow-up',
        arrowDown: 'dashicons-arrow-down'
      },
      toggle: function toggle($trigger) {
        var self = this,
            $row = $trigger.closest(self.selectors.row),
            $toggleHandleIcon = $row.find(self.selectors.toggleHandle).find('.dashicons'),
            $controls = $row.find(self.selectors.controlsContainer);
        $controls.toggleClass('hidden');

        if ($controls.hasClass('hidden')) {
          $toggleHandleIcon.removeClass(self.selectors.arrowUp).addClass(self.selectors.arrowDown);
        } else {
          $toggleHandleIcon.removeClass(self.selectors.arrowDown).addClass(self.selectors.arrowUp);
        }

        self.updateLabel($row);
      },
      updateLabel: function updateLabel($row) {
        var self = this,
            $indicator = $row.find(self.selectors.excludedIndicator),
            excluded = $row.find(self.selectors.excludedField).is(':checked');

        if (excluded) {
          $indicator.html($indicator.data('excluded-label'));
        } else {
          $indicator.html('');
        }

        self.setAdvancedState($row, excluded);
      },
      setAdvancedState: function setAdvancedState($row, state) {
        var self = this,
            $controls = $row.find('input[type="checkbox"]').not(self.selectors.excludedField);
        $controls.each(function (index, input) {
          $(input).prop('disabled', state);
        });
      },
      bind: function bind() {
        var self = this;
        $(document).on('click', self.selectors.label + ',' + self.selectors.toggleHandle, function (event) {
          event.stopPropagation();
          event.preventDefault();
          self.toggle($(this));
        }).on('change', self.selectors.excludedField, function () {
          self.updateLabel($(this).closest(self.selectors.row));
        });
      },
      init: function init() {
        var self = this;

        if (!$('body[class*="' + self.selectors.body + '"]').length) {
          return;
        }

        self.bind();
        $(self.selectors.row).each(function (index, row) {
          self.updateLabel($(row));
        });
      }
    },
    extensionManager: {
      selectors: {
        body: 'qazana-extensions-manager',
        row: '.qazana-extension-row',
        label: '.qazana-extension-indicator',
        activedIndicator: '.qazana-extension-active-indicator',
        activeWidgets: 'input[name="qazana_extension-manage-widgets[]"]',
        controlsContainer: '.qazana-extension-controls',
        toggleHandle: '.qazana-extension-toggle',
        arrowUp: 'dashicons-arrow-up',
        arrowDown: 'dashicons-arrow-down'
      },
      toggle: function toggle($trigger) {
        var self = this,
            $row = $trigger.closest(self.selectors.row),
            $toggleHandleIcon = $row.find(self.selectors.toggleHandle).find('.dashicons'),
            $controls = $row.find(self.selectors.controlsContainer);
        $controls.toggleClass('hidden');

        if ($controls.hasClass('hidden')) {
          $toggleHandleIcon.removeClass(self.selectors.arrowUp).addClass(self.selectors.arrowDown);
        } else {
          $toggleHandleIcon.removeClass(self.selectors.arrowDown).addClass(self.selectors.arrowUp);
        }

        self.updateLabel($row);
      },
      updateLabel: function updateLabel($row) {
        var self = this,
            $indicator = $row.find(self.selectors.activedIndicator),
            active = $row.find(self.selectors.activeWidgets).is(':checked');

        if (active) {
          $indicator.html($indicator.data('label'));
        } else {
          $indicator.html('');
        }

        self.setAdvancedState($row, active);
      },
      setAdvancedState: function setAdvancedState($row, state) {
        var self = this,
            $controls = $row.find('input[type="checkbox"]').not(self.selectors.activeWidgets);
        $controls.each(function (index, input) {
          $(input).prop('disabled', state);
        });
      },
      bind: function bind() {
        var self = this;
        $(document).on('click', self.selectors.label + ',' + self.selectors.toggleHandle, function (event) {
          event.stopPropagation();
          event.preventDefault();
          self.toggle($(this));
        }).on('change', self.selectors.activeWidgets, function () {
          self.updateLabel($(this).closest(self.selectors.row));
        });
      },
      init: function init() {
        var self = this;

        if (!$('body[class*="' + self.selectors.body + '"]').length) {
          return;
        }

        self.bind();
        $(self.selectors.row).each(function (index, row) {
          self.updateLabel($(row));
        });
      }
    }
  });
  $(function () {
    window.qazanaAdmin = new QazanaAdmin();
    qazanaAdmin.elements.$window.trigger('qazana/admin/init');
  });
})(jQuery);

/***/ }),

/***/ "../assets/dev/js/admin/maintenance-mode.js":
/*!**************************************************!*\
  !*** ../assets/dev/js/admin/maintenance-mode.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ViewModule = __webpack_require__(/*! qazana-utils/view-module */ "../assets/dev/js/utils/view-module.js"),
    MaintenanceModeModule;

MaintenanceModeModule = ViewModule.extend({
  getDefaultSettings: function getDefaultSettings() {
    return {
      selectors: {
        modeSelect: '.qazana_maintenance_mode_mode select',
        maintenanceModeTable: '#tab-maintenance_mode table',
        maintenanceModeDescriptions: '.qazana-maintenance-mode-description',
        excludeModeSelect: '.qazana_maintenance_mode_exclude_mode select',
        excludeRolesArea: '.qazana_maintenance_mode_exclude_roles',
        templateSelect: '.qazana_maintenance_mode_template_id select',
        editTemplateButton: '.qazana-edit-template',
        maintenanceModeError: '.qazana-maintenance-mode-error'
      },
      classes: {
        isEnabled: 'qazana-maintenance-mode-is-enabled'
      }
    };
  },
  getDefaultElements: function getDefaultElements() {
    var elements = {},
        selectors = this.getSettings('selectors');
    elements.$modeSelect = jQuery(selectors.modeSelect);
    elements.$maintenanceModeTable = elements.$modeSelect.parents(selectors.maintenanceModeTable);
    elements.$excludeModeSelect = elements.$maintenanceModeTable.find(selectors.excludeModeSelect);
    elements.$excludeRolesArea = elements.$maintenanceModeTable.find(selectors.excludeRolesArea);
    elements.$templateSelect = elements.$maintenanceModeTable.find(selectors.templateSelect);
    elements.$editTemplateButton = elements.$maintenanceModeTable.find(selectors.editTemplateButton);
    elements.$maintenanceModeDescriptions = elements.$maintenanceModeTable.find(selectors.maintenanceModeDescriptions);
    elements.$maintenanceModeError = elements.$maintenanceModeTable.find(selectors.maintenanceModeError);
    return elements;
  },
  bindEvents: function bindEvents() {
    var settings = this.getSettings(),
        elements = this.elements;
    elements.$modeSelect.on('change', function () {
      elements.$maintenanceModeTable.toggleClass(settings.classes.isEnabled, !!elements.$modeSelect.val());
      elements.$maintenanceModeDescriptions.hide();
      elements.$maintenanceModeDescriptions.filter('[data-value="' + elements.$modeSelect.val() + '"]').show();
    }).trigger('change');
    elements.$excludeModeSelect.on('change', function () {
      elements.$excludeRolesArea.toggle('custom' === elements.$excludeModeSelect.val());
    }).trigger('change');
    elements.$templateSelect.on('change', function () {
      var templateID = elements.$templateSelect.val();

      if (!templateID) {
        elements.$editTemplateButton.hide();
        elements.$maintenanceModeError.show();
        return;
      }

      var editUrl = qazanaAdmin.config.home_url + '?p=' + templateID + '&qazana';
      elements.$editTemplateButton.prop('href', editUrl).show();
      elements.$maintenanceModeError.hide();
    }).trigger('change');
  }
});
module.exports = MaintenanceModeModule;

/***/ }),

/***/ "../assets/dev/js/utils/module.js":
/*!****************************************!*\
  !*** ../assets/dev/js/utils/module.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js"));

var Module = function Module() {
  var $ = jQuery,
      instanceParams = arguments,
      self = this,
      settings,
      events = {};

  var ensureClosureMethods = function ensureClosureMethods() {
    $.each(self, function (methodName) {
      var oldMethod = self[methodName];

      if ('function' !== typeof oldMethod) {
        return;
      }

      self[methodName] = function () {
        return oldMethod.apply(self, arguments);
      };
    });
  };

  var initSettings = function initSettings() {
    settings = self.getDefaultSettings();
    var instanceSettings = instanceParams[0];

    if (instanceSettings) {
      $.extend(settings, instanceSettings);
    }
  };

  var init = function init() {
    self.__construct.apply(self, instanceParams);

    ensureClosureMethods();
    initSettings();
    self.trigger('init');
  };

  this.getItems = function (items, itemKey) {
    if (itemKey) {
      var keyStack = itemKey.split('.'),
          currentKey = keyStack.splice(0, 1);

      if (!keyStack.length) {
        return items[currentKey];
      }

      if (!items[currentKey]) {
        return;
      }

      return this.getItems(items[currentKey], keyStack.join('.'));
    }

    return items;
  };

  this.getSettings = function (setting) {
    return this.getItems(settings, setting);
  };

  this.setSettings = function (settingKey, value, settingsContainer) {
    if (!settingsContainer) {
      settingsContainer = settings;
    }

    if ('object' === (0, _typeof2["default"])(settingKey)) {
      $.extend(settingsContainer, settingKey);
      return self;
    }

    var keyStack = settingKey.split('.'),
        currentKey = keyStack.splice(0, 1);

    if (!keyStack.length) {
      settingsContainer[currentKey] = value;
      return self;
    }

    if (!settingsContainer[currentKey]) {
      settingsContainer[currentKey] = {};
    }

    return self.setSettings(keyStack.join('.'), value, settingsContainer[currentKey]);
  };

  this.forceMethodImplementation = function (methodArguments) {
    var functionName = methodArguments.callee.name;
    throw new ReferenceError('The method ' + functionName + ' must to be implemented in the inheritor child.');
  };

  this.on = function (eventName, callback) {
    if ('object' === (0, _typeof2["default"])(eventName)) {
      $.each(eventName, function (singleEventName) {
        self.on(singleEventName, this);
      });
      return self;
    }

    var eventNames = eventName.split(' ');
    eventNames.forEach(function (singleEventName) {
      if (!events[singleEventName]) {
        events[singleEventName] = [];
      }

      events[singleEventName].push(callback);
    });
    return self;
  };

  this.off = function (eventName, callback) {
    if (!events[eventName]) {
      return self;
    }

    if (!callback) {
      delete events[eventName];
      return self;
    }

    var callbackIndex = events[eventName].indexOf(callback);

    if (-1 !== callbackIndex) {
      delete events[eventName][callbackIndex];
    }

    return self;
  };

  this.trigger = function (eventName) {
    var methodName = 'on' + eventName[0].toUpperCase() + eventName.slice(1),
        params = Array.prototype.slice.call(arguments, 1);

    if (self[methodName]) {
      self[methodName].apply(self, params);
    }

    var callbacks = events[eventName];

    if (!callbacks) {
      return self;
    }

    $.each(callbacks, function (index, callback) {
      callback.apply(self, params);
    });
    return self;
  };

  this.getDeviceName = function () {
    return jQuery('body').data('qazana-device-mode');
  };

  init();
};

Module.prototype.__construct = function () {};

Module.prototype.getDefaultSettings = function () {
  return {};
};

Module.extendsCount = 0;

Module.extend = function (properties) {
  var $ = jQuery,
      parent = this;

  var child = function child() {
    return parent.apply(this, arguments);
  };

  $.extend(child, parent);
  child.prototype = Object.create($.extend({}, parent.prototype, properties));
  child.prototype.constructor = child;
  /*
   * Constructor ID is used to set an unique ID
      * to every extend of the Module.
      *
   * It's useful in some cases such as unique
   * listener for frontend handlers.
   */

  var constructorID = ++Module.extendsCount;

  child.prototype.getConstructorID = function () {
    return constructorID;
  };

  child.__super__ = parent.prototype;
  return child;
};

module.exports = Module;

/***/ }),

/***/ "../assets/dev/js/utils/view-module.js":
/*!*********************************************!*\
  !*** ../assets/dev/js/utils/view-module.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Module = __webpack_require__(/*! qazana-utils/module */ "../assets/dev/js/utils/module.js"),
    ViewModule;

ViewModule = Module.extend({
  elements: null,
  getDefaultElements: function getDefaultElements() {
    return {};
  },
  bindEvents: function bindEvents() {},
  onInit: function onInit() {
    this.initElements();
    this.bindEvents();
  },
  initElements: function initElements() {
    this.elements = this.getDefaultElements();
  }
});
module.exports = ViewModule;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/typeof.js":
/*!********************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/typeof.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map