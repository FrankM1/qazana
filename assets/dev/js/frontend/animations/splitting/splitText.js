
var root = document;
var createText = root.createTextNode.bind( root );

/**
 *
 * @param e {import('../types').Target}
 * @param parent {HTMLElement}
 * @returns {HTMLElement[]}
 */
function $( e, parent ) {
    return ! e || 0 == e.length ? // null or empty string returns empty array
        [] :
        e.nodeName ? // a single element is wrapped in an array
        [ e ] : // selector and NodeList are converted to Element[]
        [].slice.call( e[ 0 ].nodeName ? e : ( parent || root ).querySelectorAll( e ) );
}

function each( items, fn ) {
    items && items.some( fn );
}

/**
 * @param {Node} el
 * @param {Node} child
 */
function appendChild( el, child ) {
    return el.appendChild( child );
  }

function createElement( parent, key, text, whitespace ) {
    var el = root.createElement( 'span' );
    key && ( el.className = key );

    if ( text ) {
        ! whitespace && el.setAttribute( 'data-' + key, text );
        el.textContent = text;
    }
    return ( parent && appendChild( parent, el ) ) || el;
  }

/**
 * # Splitting.split
 * Split an element's textContent into individual elements
 * @param el {Node} Element to split
 * @param key {string}
 * @param splitOn {string}
 * @param includeSpace {boolean}
 * @returns {HTMLElement[]}
 */
var splitText = function ( el, key, splitOn, includePrevious, preserveWhitespace ) {
    // Combine any strange text nodes or empty whitespace.
    el.normalize();

    // Use fragment to prevent unnecessary DOM thrashing.
    var elements = [];
    var F = document.createDocumentFragment();

    if ( includePrevious ) {
        elements.push( el.previousSibling );
    }

    var allElements = [];
    $( el.childNodes ).some( function( next ) {
        if ( next.tagName && ! next.hasChildNodes() ) {
            // keep elements without child nodes (no text and no children)
            allElements.push( next );
            return;
        }
        // Recursively run through child nodes
        if ( next.childNodes && next.childNodes.length ) {
            allElements.push( next );
            elements.push.apply( elements, splitText( next, key, splitOn, includePrevious, preserveWhitespace ) );
            return;
        }

        // Get the text to split, trimming out the whitespace
        /** @type {string} */
        var wholeText = next.wholeText || '';
        var contents = wholeText.trim();

        // If there's no text left after trimming whitespace, continue the loop
        if ( contents.length ) {
            // insert leading space if there was one
            if ( ' ' === wholeText[ 0 ] ) {
                allElements.push( createText( ' ' ) );
            }

            // Concatenate the split text children back into the full array
            each( contents.split( splitOn ), function( splitText, i ) {
                if ( i && preserveWhitespace ) {
                    allElements.push( createElement( F, 'whitespace ' + key, ' ', preserveWhitespace ) );
                }
                var splitEl = createElement( F, key, splitText );
                elements.push( splitEl );
                allElements.push( splitEl );
            } );
            // insert trailing space if there was one
            if ( ' ' === wholeText[ wholeText.length - 1 ] ) {
                allElements.push( createText( ' ' ) );
            }
        }
    } );

    each( allElements, function( el ) {
        appendChild( F, el );
    } );

    // Clear out the existing element
    el.innerHTML = '';
    appendChild( el, F );
    return elements;
};

module.exports = splitText;