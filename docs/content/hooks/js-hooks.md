# Javascript Hooks

## Frontend Filters

### `frontend/handlers/menu_anchor/scroll_top_distance`
Applied to the Menu Anchor widget, set a custom top distance

#### Arguments

Argument     | Type        | Description
------------ | :---------: | ---------------------------------------------
`scrollTop`  | *`integer`* | The default scrollTop. It takes only the WordPress Admin Bar in account.

#### Example

```javascript
jQuery( function( $ ) {
	// Add space for Qazana Menu Anchor link
	if ( undefined !== window.qazanaFrontend ) {
		qazanaFrontend.hooks.addFilter( 'frontend/handlers/menu_anchor/scroll_top_distance', function( scrollTop ) {
			return scrollTop - 30;
		} );
	}
} );
```

```php
add_action( 'wp_footer', function() {
	if ( ! function_exists( 'qazana' ) ) {
		return;
	}
	?>
	<script>
		jQuery( function( $ ) {
			// Add space for Qazana Menu Anchor link
			if ( undefined !== window.qazanaFrontend ) {
				qazanaFrontend.hooks.addFilter( 'frontend/handlers/menu_anchor/scroll_top_distance', function( scrollTop ) {
					return scrollTop - 30;
				} );
			}
		} );
	</script>
	<?php
} );
```

## Frontend Actions

### `init`
Qazana frontend is loaded

#### Arguments
None

#### Example

 ```javascript
qazanaFrontend.hooks.addAction( 'init', function() {
  // Do something that is based on the qazanaFrontend object.
} );
 ```

### `frontend/element_ready/global`
Runs on every element (includes sections and columns) when it's ready

#### Arguments

Argument    | Type                                        | Description
----------- | :------:                                    | ---------------------------------------------
`$scope`    | *`The current element wrapped with jQuery`* |
`$`         | *`The jQuery instanse`*                     |

#### Example

```javascript
qazanaFrontend.hooks.addAction( 'frontend/element_ready/global', function( $scope ) {
	if ( $scope.data( 'shake' ) ){
		$scope.shake();
	}
} );
```

### `frontend/element_ready/widget`
Runs on every widget when it's ready.

#### Arguments

Argument    | Type                                        | Description
----------- | :------:                                    | ---------------------------------------------
`$scope`    | *`The current element wrapped with jQuery`* |
`$`         | *`The jQuery instanse`*                     |

#### Example

```javascript
qazanaFrontend.hooks.addAction( 'frontend/element_ready/widget', function( $scope ) {
	if ( $scope.data( 'shake' ) ){
		$scope.shake();
	}
} );
```

### `frontend/element_ready/{elementType.skinName}`
Runs on a specific element type and it's skin when it's ready.

#### Arguments

Argument    | Type                                        | Description
----------- | :------:                                    | ---------------------------------------------
`$scope`    | *`The current element wrapped with jQuery`* |
`$`         | *`The jQuery instanse`*                     |

#### Example

```javascript
// For a widget without a skin (skin = default)
qazanaFrontend.hooks.addAction( 'frontend/element_ready/image.default', function( $scope ) {
	if ( $scope.find( 'a' ) ){
		$scope.find( 'a' ).lightbox();
	}
} );

// For a widget with a skin named `satellite`
qazanaFrontend.hooks.addAction( 'frontend/element_ready/google-maps.satellite', function( $scope ) {
	var $iframe = $scope.find( 'iframe' ),
		iframeUrl = $iframe.attr( 'src' );

		$iframe.attr( 'src', iframeUrl + '&maptype=satellite' );
	}
} );
```

## Editor Hooks

### `panel/open_editor/{elementType}`
Applied when the settings panel is opened to edit an element.

#### Arguments

Argument     | Type       | Description
------------ | :------:   | ----------------------
`panel`      | *`object`* | The Panel object
`model`      | *`object`* | The Backbone model instance
`view`       | *`object`* | The Backbone view instance

#### Example

 ```javascript
 qazana.hooks.addAction( 'panel/open_editor/widget', function( panel, model, view ) {
 	if ( 'section' !== model.elType && 'column' !== model.elType ) {
 		return;
 	}
	var $element = view.$el.find( '.qazana-selector' );

	if ( $element.length ) {
		$element.click( function() {
		  alert( 'Some Message' );
		} );
	}
 } );
```

### `panel/open_editor/{elementType}/{elementName}`
Applied when the settings panel is opened to edit a specific element name.

#### Arguments

Argument     | Type       | Description
------------ | :------:   | ----------------------
`panel`      | *`object`* | The Panel object
`model`      | *`object`* | The Backbone model instance
`view`       | *`object`* | The Backbone view instance

#### Example

 ```javascript
qazana.hooks.addAction( 'panel/open_editor/widget/slider', function( panel, model, view ) {
	var $element = view.$el.find( '.qazana-selector' );

	if ( $element.length ) {
		$element.click( function() {
		  alert( 'Some Message' );
		} );
	}
} );
```
