import { $, appendChild, createElement, createText } from "./dom";
import { each } from "./arrays";

/**
 * # Splitting.split
 * Split an element's textContent into individual elements
 * @param el {Node} Element to split
 * @param key {string}
 * @param splitOn {string}
 * @param includeSpace {boolean}
 * @returns {HTMLElement[]}
 */
export function splitText(el, key, splitOn, includePrevious, preserveWhitespace, exclude) {
    // Combine any strange text nodes or empty whitespace.
    el.normalize();

    // Use fragment to prevent unnecessary DOM thrashing.
    var elements = [];
    var F = document.createDocumentFragment();

    if (includePrevious) {
        elements.push(el.previousSibling);
    }

    $(el.childNodes).some( function(node) {

        if ( node.tagName && ! node.hasChildNodes() ) {
            // keep elements without child nodes (no text and no children)
            return;
        }

        if ( 'SPAN' === node.tagName && node.hasChildNodes() ) {
            // keep elements without child nodes (no text and no children)
            key && (node.className = node.className + ' ' + key);
            elements.push(node);
            return;
        }

        console.log(exclude);
        console.log( node.classList );
        console.log( elements );

        // Recursively run through child nodes
        if ( node.childNodes && node.childNodes.length ) {
            console.log(node.childNodes);
            elements.push.apply(elements, splitText(node, key, splitOn, includePrevious, preserveWhitespace, exclude));
            return;
        }

        // Get the text to split, trimming out the whitespace
        /** @type {string} */
        var wholeText = node.wholeText || '';
        var contents = wholeText.trim();

        // If there's no text left after trimming whitespace, continue the loop
        if ( contents.length ) {
            // Concatenate the split text children back into the full array
            each( contents.split(splitOn), function(splitText, i) {
                var whitespace = '';

                if ( preserveWhitespace ) {
                    whitespace = ' ';
                }

                var splitEl = createElement(F, key, splitText + whitespace);

                elements.push(splitEl);
            });
        }
    });

    // Clear out the existing element
    el.innerHTML = "";
    appendChild(el, F);
    return elements;
}
