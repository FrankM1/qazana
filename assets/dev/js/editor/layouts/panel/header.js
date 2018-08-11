var PanelHeaderItemView;

PanelHeaderItemView = Marionette.ItemView.extend({
    template: '#tmpl-qazana-panel-header-content',

    id: 'qazana-panel-header',

    ui: {
        menuButton: '#qazana-panel-header-menu-button',
        menuButtons: '.qazana-panel-header-tool',
        menuIcon: '#qazana-panel-header-menu-button i',
        title: '#qazana-panel-header-title',
        addButton: '#qazana-panel-header-add-button',
        saveTemplate: '#qazana-panel-header-saver-button-save-template'
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
        'click @ui.menuButton': 'onClickMenu',
        'click @ui.saveTemplate': 'onClickSaveTemplate',
    },

    behaviors: function () {
        var behaviors = {
            saver: {
                behaviorClass: qazana.modules.components.saver.behaviors.HeaderSaver
            }
        };

        return qazana.hooks.applyFilters('panel/header/behaviors', behaviors, this);
    },

    onPanelClick: function (event) {
        var $target = jQuery(event.target),
            isClickInsideOfTool = $target.closest('.qazana-panel-header-sub-menu-wrapper').length;

        if (isClickInsideOfTool) {
            return;
        }

        var $tool = $target.closest('.qazana-panel-header-tool'),
            isClosedTool = $tool.length && !$tool.hasClass('qazana-open');

        this.ui.menuButtons.filter(':not(.qazana-leave-open)').removeClass('qazana-open');

        if (isClosedTool) {
            $tool.addClass('qazana-open');
        }
    },

    onClickSettings: function () {
        var self = this;

        if ('page_settings' !== qazana.getPanelView().getCurrentPageName()) {
            qazana.getPanelView().setPage('page_settings');

            qazana.getPanelView().getCurrentPageView().once('destroy', function () {
                self.ui.settings.removeClass('qazana-open');
            });
        }
    },

    setTitle: function (title) {
        this.ui.title.html(title);
    },

    onClickAdd: function () {
        qazana.getPanelView().setPage('elements');
    },

    onClickSaveTemplate: function () {
        qazana.templates.startModal({
            onReady: function () {
                qazana.templates.getLayout().showSaveTemplateView();
            }
        });
    },

    onClickMenu: function () {
        var panel = qazana.getPanelView(),
            currentPanelPageName = panel.getCurrentPageName(),
            nextPage = 'menu' === currentPanelPageName ? 'elements' : 'menu';

        if ('menu' === nextPage) {
            var arrowClass = 'eicon-arrow-' + (qazana.config.is_rtl ? 'right' : 'left');

            this.ui.menuIcon.removeClass('eicon-menu-bar').addClass(arrowClass);
        }

        panel.setPage(nextPage);
    },

    onRender: function () {
        var self = this;

        _.defer(function () {
            qazana.getPanelView().$el.on('click', self.onPanelClick.bind(self));
        });
    }
});

module.exports = PanelHeaderItemView;