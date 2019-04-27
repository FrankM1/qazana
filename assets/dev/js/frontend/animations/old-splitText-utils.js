function SplitText( identifier, vars ) {
    function duplicateObject( obj ) {
        if ( 'object' === typeof obj && obj !== null ) {
            var ret = {};
            for ( var index in obj ) {
                ret[ index ] = duplicateObject( obj[ index ] );
            }
            return ret;
        }
        return obj;
    }

    String.prototype.replaceAll = function( search, replacement ) {
        var target = this;
        return target.split( search ).join( replacement );
    };

    function hasClass( obj, c ) {
        return new RegExp( '(\\s|^)' + c + '(\\s|$)' ).test( obj.className );
    }

    function addClass( obj, c ) {
        if ( ! hasClass( obj, c ) ) {
            obj.className += ' ' + c;
        }
    }

    function findPos( node ) {
        var node = node;
        var curtop = 0;
        var curtopscroll = 0;
        var curleft = 0;
        var curleftscroll = 0;
        //var needHTML = true;
        if ( node.offsetParent ) {
            do {
                if ( node.offsetParent && node.offsetParent == document.getElementsByTagName( 'html' )[ 0 ] ) {
                    // needHTML = false;
                }
                curtop += node.offsetTop;
                curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
                curleft += node.offsetLeft;
                curleftscroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
            } while ( node = node.offsetParent );

            // if(needHTML){
            // 	curtopscroll += document.getElementsByTagName("html")[0].scrollTop;
            // 	curleftscroll += document.getElementsByTagName("html")[0].scrollLeft;
            // }

            return [ curleft - curleftscroll, curtop - curtopscroll ];
        }
    }

    var identifier = identifier || [];
    var defaults = {
        type: 'chars,words,lines',
        charsClass: undefined,
        linesClass: undefined,
        wordsClass: undefined,
        position: 'relative',
        ignore: 'span',
    };

    this.HTMLobjects = [];
    this.vars = {};
    this.originalHTML = [];

    this.lines = [];
    this.words = [];
    this.chars = [];

    //if the identifier isn't an array, make it one.  If it already is, don't worry.  :)
    if ( ! Array.isArray( identifier ) ) {
        identifier = [ identifier ];
    }

    //iterate through the array
    for ( var i = 0; i < identifier.length; i++ ) {
        //if it is an html element, simply add it
        if ( 1 == identifier[ i ].nodeType ) {
            this.HTMLobjects.push( identifier[ i ] );
        }

        //if jquery Element add each html Element
        if ( window.jQuery && identifier[ i ] && ( identifier[ i ] instanceof jQuery || identifier[ i ].constructor.prototype.jquery ) ) {
            //itterate through array of html elements inside jquery object
            for ( var j = 0; j < identifier[ i ].length; j++ ) {
                //Check that it is an html element before appending it
                if ( 1 == identifier[ i ][ j ].nodeType ) {
                    this.HTMLobjects.push( identifier[ i ][ j ] );
                }
            }
        }

        //if it's a string, try query selector all
        if ( 'string' === typeof identifier[ i ] ) {
            elements = document.querySelectorAll( identifier[ i ] );
            for ( var j = 0; j < elements.length; j++ ) {
                if ( 1 == elements[ j ].nodeType ) {
                    this.HTMLobjects.push( elements[ j ] );
                }
            }
        }
    }

    //if there is an object of variables replace defaults otherwise use defaults
    if ( vars && 'object' === typeof vars && vars !== null ) {
        //if type is passed and it's a string, try and validate otherwise use default

        if ( vars.type && 'string' === typeof vars.type ) {
            vars.type = vars.type.split( ',' );
        }

        if ( vars.type && 'object' === typeof vars.type ) {
            var possible = [ 'chars', 'words', 'lines' ];
            var use = [];
            for ( var i = 0; i < vars.type.length; i++ ) {
                if ( possible.indexOf( vars.type[ i ].toLowerCase() ) != -1 && -1 == use.indexOf( vars.type[ i ].toLowerCase() ) ) {
                    use.push( vars.type[ i ].toLowerCase() );
                } else {
                    console.error( vars.type[ i ] + 'is not a valid type' );
                }
            }

            if ( 0 == use.length ) {
                this.vars.type = defaults.type;
            } else {
                this.vars.type = use.join( ',' );
            }
        } else {
            this.vars.type = defaults.type;
        }

        //if charsClass is set then use it
        this.vars.charsClass = ( vars.charsClass && 'string' === typeof vars.charsClass ) ? vars.charsClass : defaults.charsClass;

        //if wordsClass is set then use it
        this.vars.wordsClass = ( vars.wordsClass && 'string' === typeof vars.wordsClass ) ? vars.wordsClass : defaults.wordsClass;

        //if linesClass is set then use it
        this.vars.linesClass = ( vars.linesClass && 'string' === typeof vars.linesClass ) ? vars.linesClass : defaults.linesClass;

        //greensock's splittext doesn't allow static or null.  null will not set position and leave it to any css on the page
        var allowedPositions = [ 'absolute', 'relative', 'static', 'fixed', 'inherit', 'initial', null ];
        this.vars.position = ( vars.position && allowedPositions.indexOf( vars.position ) != -1 ) ? vars.position : defaults.position;
    } else {
        this.vars = duplicateObject( defaults );
    }

    //Store the original state so we can revert easily
    for ( var i = 0; i < this.HTMLobjects.length; i++ ) {
        this.originalHTML[ i ] = this.HTMLobjects[ i ].innerHTML;
    }

    //add the revert function
    this.revert = function() {
        for ( var i = 0; i < this.HTMLobjects.length; i++ ) {
            this.HTMLobjects[ i ].innerHTML = this.originalHTML[ i ];
        }
    };

    //
    //By now we should have an array at this.HTMLobjects of html objects that need splitting.
    //
    this.vars.type = this.vars.type.split( ',' );

    for ( var i = 0; i < this.HTMLobjects.length; i++ ) {
        var current = this.HTMLobjects[ i ];

        //remove tags from element
        //ideally, this won't be needed in the future
        current.innerHTML = current.innerHTML.replace( /<\/?[^>]+(>|$)/g, '' );

        var currentLists = {
            lines: [],
            words: [],
            chars: [],
        };

        //Split Lines
        if ( this.vars.type.indexOf( 'lines' ) != -1 ) {
            var text = current.innerHTML;
            var words = text.split( ' ' );
            var splitPoints = [];
            current.innerHTML = words[ 0 ];
            var height = current.offsetHeight;

            //work out where the splits are
            for ( var j = 1; j < words.length; j++ ) {
                current.innerHTML = current.innerHTML + ' ' + words[ j ];
                if ( current.offsetHeight > height ) {
                    height = current.offsetHeight;
                    splitPoints.push( current.innerHTML.length - ( words[ j ].length + 1 ) );
                }
            }
            //add the last line
            splitPoints.push( current.innerHTML.length );

            //add the text to the element, adding in the tags

            current.innerHTML = '';

            for ( var j = 0; j < splitPoints.length; j++ ) {
                var lineStart = ( 0 == j ) ? 0 : splitPoints[ j - 1 ] + 1;
                var lineEnd = ( j == splitPoints.length - 1 ) ? text.length : splitPoints[ j ];

                var div = document.createElement( 'div' );

                div.style.display = 'block';
                if ( this.vars.linesClass !== undefined && this.vars.linesClass != 'undefined' ) {
                    this.class = this.vars.linesClass.replace( '++', j + 1 );
                }
                div.innerHTML = text.substring( lineStart, lineEnd );
                current.appendChild( div );

                if ( this.vars.position !== null ) {
                    if ( 'absolute' == this.vars.position ) {
                        div.toBe = {
                            top: div.offsetTop,
                            left: div.offsetLeft,
                        };
                        div.style.position = 'relative';
                    } else if ( 'fixed' == this.vars.position ) {
                        var pos = findPos( div );
                        div.toBe = {
                            top: pos[ 1 ],
                            left: pos[ 0 ],
                        };
                        div.style.position = 'relative';
                    } else {
                        div.style.position = this.vars.position;
                    }
                }

                currentLists.lines.push( div );
            }
        }

        //split the words
        if ( this.vars.type.indexOf( 'words' ) != -1 ) {
            function splitWords( parent, instance ) {
                var startTag = "<div style='display:inline-block;'>";
                var endTag = '</div>';
                parent.innerHTML = startTag + parent.innerHTML.replaceAll( ' ', ( endTag + ' ' + startTag ) ) + endTag;

                var nodes = parent.querySelectorAll( 'div' );

                for ( var j = 0; j < nodes.length; j++ ) {
                    if ( instance.vars.wordsClass !== undefined && instance.vars.wordsClass != 'undefined' ) {
                        addClass( nodes[ j ], instance.vars.wordsClass.replaceAll( '++', j + 1 ) );
                    }

                    if ( instance.vars.position !== null ) {
                        if ( 'absolute' == instance.vars.position ) {
                            nodes[ j ].toBe = {
                                top: nodes[ j ].offsetTop,
                                left: nodes[ j ].offsetLeft,
                            };
                            nodes[ j ].style.position = 'relative';
                        } else if ( 'fixed' == instance.vars.position ) {
                            var pos = findPos( nodes[ j ] );
                            nodes[ j ].toBe = {
                                top: pos[ 1 ],
                                left: pos[ 0 ],
                            };
                            nodes[ j ].style.position = 'relative';
                        } else {
                            nodes[ j ].style.position = instance.vars.position;
                        }
                    }

                    currentLists.words.push( nodes[ j ] );
                }
            }

            //if it has been split by lines, split each line by words
            if ( this.vars.type.indexOf( 'lines' ) != -1 ) {
                for ( var j = 0; j < currentLists.lines.length; j++ ) {
                    splitWords( currentLists.lines[ j ], this );
                }
            } else {
                splitWords( current, this );
            }
        }

        //split the characters
        if ( this.vars.type.indexOf( 'chars' ) != -1 ) {
            function splitChars( parent, instance ) {
                var startTag = "<div style='display:inline-block;'>";
                var endTag = '</div>';
                var specials = ( parent.innerHTML.match( /(&\w+;)/g ) );
                parent.innerHTML = startTag + parent.innerHTML.replace( /&\w+;/g, 'ህ' ).split( '' ).join( endTag + startTag ) + endTag;

                var nodes = parent.querySelectorAll( 'div' );

                for ( var j = 0; j < nodes.length; j++ ) {
                    if ( instance.vars.charsClass !== undefined && instance.vars.charsClass != 'undefined' ) {
                        var newClass = instance.vars.charsClass.replaceAll( '++', j + 1 );
                        if ( j != nodes.length - 1 ) {
                            newClass = newClass.replaceAll( '**', nodes[ j ].innerHTML + nodes[ j + 1 ].innerHTML );
                        } else {
                            newClass = newClass.replaceAll( '**', '' );
                        }
                        addClass( nodes[ j ], newClass );
                    }

                    if ( instance.vars.position !== null ) {
                        if ( 'absolute' == instance.vars.position ) {
                            nodes[ j ].toBe = {
                                top: nodes[ j ].offsetTop,
                                left: nodes[ j ].offsetLeft,
                            };
                            nodes[ j ].style.position = 'relative';
                        } else if ( 'fixed' == instance.vars.position ) {
                            var pos = findPos( nodes[ j ] );
                            nodes[ j ].toBe = {
                                top: pos[ 1 ],
                                left: pos[ 0 ],
                            };
                            nodes[ j ].style.position = 'relative';
                        } else {
                            nodes[ j ].style.position = instance.vars.position;
                        }
                    }

                    if ( 'ህ' == nodes[ j ].innerHTML ) {
                        nodes[ j ].innerHTML = specials[ 0 ];
                        specials.splice( 0, 1 );
                    }

                    currentLists.chars.push( nodes[ j ] );
                }
            }

            //if it has been split by words, split each word by characters
            //if it has only be split by lines, split each line by characters
            if ( this.vars.type.indexOf( 'words' ) != -1 ) {
                for ( var j = 0; j < currentLists.words.length; j++ ) {
                    splitChars( currentLists.words[ j ], this );
                }
            } else if ( this.vars.type.indexOf( 'lines' ) != -1 ) {
                for ( var j = 0; j < currentLists.lines.length; j++ ) {
                    splitChars( currentLists.lines[ j ], this );
                }
            } else {
                splitChars( current, this );
            }
        }

        if ( 'absolute' == this.vars.position || 'fixed' == this.vars.position ) {
            for ( var j = currentLists.chars.length - 1; j >= 0; j-- ) {
                currentLists.chars[ j ].style.width = currentLists.chars[ j ].offsetWidth + 'px';
                currentLists.chars[ j ].style.height = currentLists.chars[ j ].offsetHeight + 'px';
                currentLists.chars[ j ].style.left = currentLists.chars[ j ].toBe.left + 'px';
                currentLists.chars[ j ].style.top = currentLists.chars[ j ].toBe.top + 'px';
            }

            for ( var j = currentLists.words.length - 1; j >= 0; j-- ) {
                currentLists.words[ j ].style.width = currentLists.words[ j ].offsetWidth + 'px';
                currentLists.words[ j ].style.height = currentLists.words[ j ].offsetHeight + 'px';
                currentLists.words[ j ].style.left = currentLists.words[ j ].toBe.left + 'px';
                currentLists.words[ j ].style.top = currentLists.words[ j ].toBe.top + 'px';
            }

            for ( var j = currentLists.lines.length - 1; j >= 0; j-- ) {
                currentLists.lines[ j ].style.width = currentLists.lines[ j ].offsetWidth + 'px';
                currentLists.lines[ j ].style.height = currentLists.lines[ j ].offsetHeight + 'px';
                currentLists.lines[ j ].style.left = currentLists.lines[ j ].toBe.left + 'px';
                currentLists.lines[ j ].style.top = currentLists.lines[ j ].toBe.top + 'px';
            }

            for ( var j = currentLists.chars.length - 1; j >= 0; j-- ) {
                currentLists.chars[ j ].style.position = this.vars.position;
            }

            for ( var j = currentLists.words.length - 1; j >= 0; j-- ) {
                currentLists.words[ j ].style.position = this.vars.position;
            }

            for ( var j = currentLists.lines.length - 1; j >= 0; j-- ) {
                currentLists.lines[ j ].style.position = this.vars.position;
            }
        }

        this.lines = this.lines.concat( currentLists.lines );
        this.words = this.words.concat( currentLists.words );
        this.chars = this.chars.concat( currentLists.chars );
    }
}

module.exports = SplitText;
