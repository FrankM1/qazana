var qazanaTests = {};

qazanaTests.setPanelSelectedElement = function( category, name ) {
	qazana.getPanelView().setPage( 'elements' );

	var elementsPanel = qazana.getPanelView().getCurrentPageView().elements.currentView,
		basicElements = elementsPanel.collection.findWhere( { name: category } ),
		view = elementsPanel.children.findByModel( basicElements ),
		headingWidget = view.children.findByModel( view.collection.findWhere( { widgetType: name } ) );

	qazana.channels.panelElements.reply( 'element:selected', headingWidget );
};

QUnit.module( 'Loading' );

QUnit.test( 'Qazana exist', function( assert ) {
	assert.ok( qazana );
} );

QUnit.test( 'Preview loaded', function( assert ) {
	assert.ok( qazana.$previewContents, 'Preview Exist' );
	assert.equal( 1, qazana.$previewContents.find( '.qazana-editor-active' ).length, 'Qazana area Exist' );
} );

QUnit.test( 'Frontend CSS loaded', function( assert ) {
	assert.equal( qazana.$previewContents.find( '#qazana-frontend-css' ).length, 1 );
} );

function testPreview() {
	QUnit.module( 'Widgets' );
	var previewView = qazana.getPreviewView(),
		firstSectionModel = previewView.collection.first(),
		firstSectionView = previewView.children.findByModel( firstSectionModel ),
		firstColumnModel = firstSectionModel.get( 'elements' ).first(),
		firstColumnView = firstSectionView.children.findByModel( firstColumnModel ),
		elements = [
			// ['basic', ''], // widget columns
			[ 'basic', 'heading' ],
			[ 'basic', 'image' ],
			// ['basic', 'text-editor'],
			[ 'basic', 'video' ],
			[ 'basic', 'button' ],
			[ 'basic', 'divider' ],
			[ 'basic', 'spacer' ],
			[ 'basic', 'google_maps' ],
			[ 'basic', 'icon' ],
			[ 'general', 'image-box' ],
			[ 'general', 'icon-box' ],
			[ 'general', 'image-gallery' ],
			[ 'general', 'image-carousel' ],
			[ 'general', 'icon-list' ],
			[ 'general', 'counter' ],
			[ 'general', 'progress' ],
			[ 'general', 'testimonial' ],
			// ['general', 'tabs'],
			// ['general', 'accordion'],
			// ['general', 'toggle'],
			[ 'general', 'social-icons' ],
			[ 'general', 'alert' ],
			[ 'general', 'audio' ],
			[ 'general', 'shortcode' ],
			[ 'general', 'html' ],
			[ 'general', 'menu-anchor' ],
			[ 'general', 'sidebar' ],
			//,
			// ['wordpress', 'wp-widget-pages'],
			// ['wordpress', 'wp-widget-calendar'],
			// ['wordpress', 'wp-widget-archives'],
			// ['wordpress', 'wp-widget-media_audio'],
			// ['wordpress', 'wp-widget-media_image'],
			// ['wordpress', 'wp-widget-media_video'],
			// ['wordpress', 'wp-widget-meta'],
			// ['wordpress', 'wp-widget-search'],
			// ['wordpress', 'wp-widget-text'],
			// ['wordpress', 'wp-widget-categories'],
			// ['wordpress', 'wp-widget-recent-posts'],
			// ['wordpress', 'wp-widget-recent-comments'],
			// ['wordpress', 'wp-widget-rss'],
			// ['wordpress', 'wp-widget-tag_cloud'],
			// ['wordpress', 'wp-widget-nav_menu'],
			// ['wordpress', 'wp-widget-qazana-library']
		];

	_( elements ).each( function( element ) {
		QUnit.test( 'addElementFromPanel:' + element[ 0 ] + ':' + element[ 1 ], function( assert ) {
			qazanaTests.setPanelSelectedElement( element[ 0 ], element[ 1 ] );
			firstColumnView.addElementFromPanel( { at: 0 } );

			assert.equal( element[ 1 ], firstColumnView.model.get( 'elements' ).first().get( 'widgetType' ) );
		} );
	} );

	QUnit.test( 'Add New Section', function( assert ) {
		// Clear Page
		qazana.getRegion( 'sections' ).currentView.collection.reset();

		// Clear History
		qazana.history.history.getItems().reset();

		// Click on `Add section`
		pQuery( '.qazana-add-section-button' ).click();

		var sectionsCollection = qazana.getPreviewView().collection,
			historyItems = qazana.history.history.getItems(),
			presetsStructureButton = pQuery( '.qazana-add-section-inner [data-structure="10"]' );

		assert.equal( 1, presetsStructureButton.length, 'Presets is shown' );

		QUnit.module( 'Add a Section', function() {
			presetsStructureButton.click();

			assert.ok( sectionsCollection.first(), 'Section Added' );
			assert.equal( sectionsCollection.first().get( 'elements' ).first().get( 'elType' ), 'column', 'Empty Column added' );
			assert.equal( historyItems.length, 2, 'History has one item' ); // the first items is the editing started
			assert.equal( historyItems.first().get( 'elementType' ), 'section', 'History elementType is `section`' );
			assert.equal( historyItems.first().get( 'type' ), 'add', 'History type is `add`' );
		} );

		var sectionView = qazana.getPreviewView().children.first(),
			columnView = sectionView.children.first(),
			columnButtons = {
				trigger: columnView.$el.find( '.qazana-editor-element-edit' ),
				add: columnView.$el.find( '.qazana-editor-element-add' ),
				duplicate: columnView.$el.find( '.qazana-editor-element-duplicate' ),
				remove: columnView.$el.find( '.qazana-editor-element-remove' ),
		};

		QUnit.module( 'Check columns buttons', function() {
			assert.equal( columnButtons.trigger.length, 1, 'Trigger Button exist' );
			assert.equal( columnButtons.add.length, 1, 'Add Button exist' );
			assert.equal( columnButtons.duplicate.length, 1, 'Duplicate Button exist' );
			assert.equal( columnButtons.remove.length, 1, 'Remove Button exist' );
		} );

		QUnit.module( 'Add a Column', function() {
			columnButtons.add.click();

			assert.equal( sectionView.children.length, 2, 'Column was Added' );
			assert.equal( historyItems.length, 3, 'History has 2 item' ); // the first items is the editing started
			assert.equal( historyItems.first().get( 'elementType' ), 'column', 'History elementType is `column`' );
			assert.equal( historyItems.first().get( 'type' ), 'add', 'History type is `add`' );
		} );

		QUnit.module( 'Duplicate a Column', function() {
			columnButtons.duplicate.click();

			assert.equal( sectionView.children.length, 3, 'Column was Duplicated' );
			assert.equal( historyItems.length, 4, 'History has 3 item' ); // the first items is the editing started
			assert.equal( historyItems.first().get( 'elementType' ), 'column', 'History elementType is `column`' );
			assert.equal( historyItems.first().get( 'type' ), 'duplicate', 'History type is `duplicate`' );
		} );

		QUnit.module( 'Add Heading widget', function() {
			qazanaTests.setPanelSelectedElement( 'basic', 'heading' );
			columnView.addElementFromPanel( { at: 0 } );

			assert.equal( columnView.model.get( 'elements' ).first().get( 'widgetType' ), 'heading', 'Heading was Added' );
			assert.equal( historyItems.length, 5, 'History has 4 item' ); // the first items is the editing started
			assert.equal( historyItems.first().get( 'elementType' ), 'widget', 'History elementType is `widget`' );
			assert.equal( historyItems.first().get( 'type' ), 'add', 'History type is `add`' );
		} );
	} );
}

qazana.on( 'preview:loaded', function() {
	window.pQuery = qazana.$preview[ 0 ].contentWindow.jQuery;
	pQuery( qazana.$preview[ 0 ].contentDocument ).ready( testPreview );
} );
