var HandlerModule = require('qazana-frontend/handler-module'),
	GlobalHandler;

GlobalHandler = HandlerModule.extend({
	getElementName: function () {
		return 'global';
	},
	animate: function () {
		var self = this,
			$element = this.$element,
			animation = this.getAnimation(),
			elementSettings = this.getElementSettings(),
			animationDelay = elementSettings._animation_delay || elementSettings.animation_delay || 0;

		$element.removeClass('animated').removeClass(self.prevAnimation);
		
		setTimeout(function () {
			self.prevAnimation = animation;
			$element.addClass(animation).addClass('animated');
		}, animationDelay);
	},
	getAnimation: function () {
		var elementSettings = this.getElementSettings();

		return elementSettings.animation || elementSettings._animation_in;
	},
	onInit: function () {
		var self = this;

		HandlerModule.prototype.onInit.apply(self, arguments);

		if ( ! self.getAnimation()) {
			return;
		}

		self.$element.addClass('qazana-element-animated');
		
	},
	onElementChange: function (propertyName) {
		if (/^_?animation/.test(propertyName)) {
			this.animate();
		}
	}
});

module.exports = function ($scope) {
	new GlobalHandler({
		$element: $scope
	});
};