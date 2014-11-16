/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*!
 * jQuery UI Core 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.3",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
/*!
 * jQuery UI Widget 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );



/*!
 * jQuery UI Mouse 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.3",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);




/*!
 * jQuery UI Draggable 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.10.3",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
			this.element[0].style.position = "relative";
		}
		if (this.options.addClasses){
			this.element.addClass("ui-draggable");
		}
		if (this.options.disabled){
			this.element.addClass("ui-draggable-disabled");
		}

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle) {
			return false;
		}

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent();
		this.offsetParent = this.helper.offsetParent();
		this.offsetParentCssPosition = this.offsetParent.css( "position" );

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		//Reset scroll cache
		this.offset.scroll = false;

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart(this, event);
		}

		return true;
	},

	_mouseDrag: function(event, noPropagation) {
		// reset any necessary cached properties (see #5009)
		if ( this.offsetParentCssPosition === "fixed" ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger("drag", event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			dropped = $.ui.ddmanager.drop(this, event);
		}

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		if ( this.options.helper === "original" && !$.contains( this.element[ 0 ].ownerDocument, this.element[ 0 ] ) ) {
			return false;
		}

		if((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop(this, event);
		}

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);

		if(!helper.parents("body").length) {
			helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
		}

		if(helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
			helper.css("position", "absolute");
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		//This needs to be actually done for all browsers, since pageX/pageY includes this information
		//Ugly IE fix
		if((this.offsetParent[0] === document.body) ||
			(this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var over, c, ce,
			o = this.options;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document") {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if( !ce ) {
			return;
		}

		over = c.css( "overflow" ) !== "hidden";

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ) ,
			( over ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) - ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) - this.helperProportions.width - this.margins.left - this.margins.right,
			( over ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) - ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) - ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) - this.helperProportions.height - this.margins.top  - this.margins.bottom
		];
		this.relative_container = c;
	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top ) * mod )
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left ) * mod )
			)
		};

	},

	_generatePosition: function(event) {

		var containment, co, top, left,
			o = this.options,
			scroll = this.cssPosition === "absolute" && !( this.scrollParent[ 0 ] !== document && $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) ? this.offsetParent : this.scrollParent,
			pageX = event.pageX,
			pageY = event.pageY;

		//Cache the scroll
		if (!this.offset.scroll) {
			this.offset.scroll = {top : scroll.scrollTop(), left : scroll.scrollLeft()};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( this.originalPosition ) {
			if ( this.containment ) {
				if ( this.relative_container ){
					co = this.relative_container.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				}
				else {
					containment = this.containment;
				}

				if(event.pageX - this.offset.click.left < containment[0]) {
					pageX = containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < containment[1]) {
					pageY = containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > containment[2]) {
					pageX = containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > containment[3]) {
					pageY = containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																	// The absolute mouse position
				this.offset.click.top	-												// Click offset (relative to the element)
				this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : this.offset.scroll.top )
			),
			left: (
				pageX -																	// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : this.offset.scroll.left )
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		//The absolute position has to be recalculated after plugins
		if(type === "drag") {
			this.positionAbs = this._convertPositionTo("absolute");
		}
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("ui-draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, "ui-sortable");
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("ui-draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: "valid/invalid"
				if(this.shouldRevert) {
					this.instance.options.revert = this.shouldRevert;
				}

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper === "original") {
					this.instance.currentItem.css({ top: "auto", left: "auto" });
				}

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("ui-draggable"), that = this;

		$.each(inst.sortables, function() {

			var innermostIntersecting = false,
				thisSortable = this;

			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if (this !== thisSortable &&
						this.instance._intersectsWith(this.instance.containerCache) &&
						$.contains(thisSortable.instance.element[0], this.instance.element[0])
					) {
						innermostIntersecting = false;
					}
					return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) {
					this.instance._mouseDrag(event);
				}

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger("out", event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) {
						this.instance.placeholder.remove();
					}

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			}

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function() {
		var t = $("body"), o = $(this).data("ui-draggable").options;
		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function() {
		var o = $(this).data("ui-draggable").options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("opacity")) {
			o._opacity = t.css("opacity");
		}
		t.css("opacity", o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._opacity) {
			$(ui.helper).css("opacity", o._opacity);
		}
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function() {
		var i = $(this).data("ui-draggable");
		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
			i.overflowOffset = i.scrollParent.offset();
		}
	},
	drag: function( event ) {

		var i = $(this).data("ui-draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {

			if(!o.axis || o.axis !== "x") {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
				}
			}

			if(!o.axis || o.axis !== "y") {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if(!o.axis || o.axis !== "x") {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}
			}

			if(!o.axis || o.axis !== "y") {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(i, event);
		}

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function() {

		var i = $(this).data("ui-draggable"),
			o = i.options;

		i.snapElements = [];

		$(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
			var $t = $(this),
				$o = $t.offset();
			if(this !== i.element[0]) {
				i.snapElements.push({
					item: this,
					width: $t.outerWidth(), height: $t.outerHeight(),
					top: $o.top, left: $o.left
				});
			}
		});

	},
	drag: function(event, ui) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			inst = $(this).data("ui-draggable"),
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (i = inst.snapElements.length - 1; i >= 0; i--){

			l = inst.snapElements[i].left;
			r = l + inst.snapElements[i].width;
			t = inst.snapElements[i].top;
			b = t + inst.snapElements[i].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
				if(inst.snapElements[i].snapping) {
					(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				}
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode !== "inner") {
				ts = Math.abs(t - y2) <= d;
				bs = Math.abs(b - y1) <= d;
				ls = Math.abs(l - x2) <= d;
				rs = Math.abs(r - x1) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
				}
			}

			first = (ts || bs || ls || rs);

			if(o.snapMode !== "outer") {
				ts = Math.abs(t - y1) <= d;
				bs = Math.abs(b - y2) <= d;
				ls = Math.abs(l - x1) <= d;
				rs = Math.abs(r - x2) <= d;
				if(ts) {
					ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				}
				if(bs) {
					ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				}
				if(ls) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				}
				if(rs) {
					ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
				}
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			}
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		}

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function() {
		var min,
			o = this.data("ui-draggable").options,
			group = $.makeArray($(o.stack)).sort(function(a,b) {
				return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
			});

		if (!group.length) { return; }

		min = parseInt($(group[0]).css("zIndex"), 10) || 0;
		$(group).each(function(i) {
			$(this).css("zIndex", min + i);
		});
		this.css("zIndex", (min + group.length));
	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("ui-draggable").options;
		if(t.css("zIndex")) {
			o._zIndex = t.css("zIndex");
		}
		t.css("zIndex", o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("ui-draggable").options;
		if(o._zIndex) {
			$(ui.helper).css("zIndex", o._zIndex);
		}
	}
});

})(jQuery);





/*!
 * jQuery UI Droppable 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/droppable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */

(function( $, undefined ) {

function isOverAxis( x, reference, size ) {
	return ( x > reference ) && ( x < ( reference + size ) );
}

$.widget("ui.droppable", {
	version: "1.10.3",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope].push(this);

		(o.addClasses && this.element.addClass("ui-droppable"));

	},

	_destroy: function() {
		var i = 0,
			drop = $.ui.ddmanager.droppables[this.options.scope];

		for ( ; i < drop.length; i++ ) {
			if ( drop[i] === this ) {
				drop.splice(i, 1);
			}
		}

		this.element.removeClass("ui-droppable ui-droppable-disabled");
	},

	_setOption: function(key, value) {

		if(key === "accept") {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) {
			this.element.addClass(this.options.activeClass);
		}
		if(draggable){
			this._trigger("activate", event, this.ui(draggable));
		}
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) {
			this.element.removeClass(this.options.activeClass);
		}
		if(draggable){
			this._trigger("deactivate", event, this.ui(draggable));
		}
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
			return;
		}

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) {
				this.element.addClass(this.options.hoverClass);
			}
			this._trigger("over", event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
			return;
		}

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) {
				this.element.removeClass(this.options.hoverClass);
			}
			this._trigger("out", event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
			return false;
		}

		this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, "ui-droppable");
			if(
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) &&
				$.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) {
			return false;
		}

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) {
				this.element.removeClass(this.options.activeClass);
			}
			if(this.options.hoverClass) {
				this.element.removeClass(this.options.hoverClass);
			}
			this._trigger("drop", event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) {
		return false;
	}

	var draggableLeft, draggableTop,
		x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height,
		l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case "fit":
			return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
		case "intersect":
			return (l < x1 + (draggable.helperProportions.width / 2) && // Right Half
				x2 - (draggable.helperProportions.width / 2) < r && // Left Half
				t < y1 + (draggable.helperProportions.height / 2) && // Bottom Half
				y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
		case "pointer":
			draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left);
			draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top);
			return isOverAxis( draggableTop, t, droppable.proportions.height ) && isOverAxis( draggableLeft, l, droppable.proportions.width );
		case "touch":
			return (
				(y1 >= t && y1 <= b) ||	// Top edge touching
				(y2 >= t && y2 <= b) ||	// Bottom edge touching
				(y1 < t && y2 > b)		// Surrounded vertically
			) && (
				(x1 >= l && x1 <= r) ||	// Left edge touching
				(x2 >= l && x2 <= r) ||	// Right edge touching
				(x1 < l && x2 > r)		// Surrounded horizontally
			);
		default:
			return false;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function(t, event) {

		var i, j,
			m = $.ui.ddmanager.droppables[t.options.scope] || [],
			type = event ? event.type : null, // workaround for #2317
			list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();

		droppablesLoop: for (i = 0; i < m.length; i++) {

			//No disabled and non-accepted
			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) {
				continue;
			}

			// Filter out elements in the current dragged item
			for (j=0; j < list.length; j++) {
				if(list[j] === m[i].element[0]) {
					m[i].proportions.height = 0;
					continue droppablesLoop;
				}
			}

			m[i].visible = m[i].element.css("display") !== "none";
			if(!m[i].visible) {
				continue;
			}

			//Activate the droppable if used directly from draggables
			if(type === "mousedown") {
				m[i]._activate.call(m[i], event);
			}

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function() {

			if(!this.options) {
				return;
			}
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance)) {
				dropped = this._drop.call(this, event) || dropped;
			}

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) {
			$.ui.ddmanager.prepareOffsets(draggable, event);
		}

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = $.ui.intersect(draggable, this, this.options.tolerance),
				c = !intersects && this.isover ? "isout" : (intersects && !this.isover ? "isover" : null);
			if(!c) {
				return;
			}

			if (this.options.greedy) {
				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents(":data(ui-droppable)").filter(function () {
					return $.data(this, "ui-droppable").options.scope === scope;
				});

				if (parent.length) {
					parentInstance = $.data(parent[0], "ui-droppable");
					parentInstance.greedyChild = (c === "isover");
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c === "isover") {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = true;
			this[c === "isout" ? "isover" : "isout"] = false;
			this[c === "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c === "isout") {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

})(jQuery);
/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */

(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
/*
    json2.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
//     Backbone.js 1.0.0

//     (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.0.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    _.extend(this, _.pick(options, modelOptions));
    if (options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // A list of options to be attached directly to the model, if provided.
  var modelOptions = ['url', 'urlRoot', 'collection'];

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, merge: false, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.defaults(options || {}, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults(options || {}, setOptions);
      if (options.parse) models = this.parse(models, options);
      if (!_.isArray(models)) models = models ? [models] : [];
      var i, l, model, attrs, existing, sort;
      var at = options.at;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(models[i], options))) continue;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.remove) modelMap[existing.cid] = true;
          if (options.merge) {
            existing.set(model.attributes, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }

        // This is a new model, push it to the `toAdd` list.
        } else if (options.add) {
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
      }

      // Remove nonexistent models if appropriate.
      if (options.remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(toAdd));
        } else {
          push.apply(this.models, toAdd);
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (sort) this.trigger('sort', this, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id != null ? obj.id : obj.cid || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Figure out the smallest index at which a model should be inserted so as
    // to maintain order.
    sortedIndex: function(model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(e.g. model, collection, id, className)* are
    // attached directly to the view.  See `viewOptions` for an exhaustive
    // list.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);
/*!
 *  howler.js v1.1.7
 *  howlerjs.com
 *
 *  (c) 2013, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */


(function() {
  // setup
  var cache = {};

  // setup the audio context
  var ctx = null,
    usingWebAudio = true,
    noAudio = false;
  if (typeof AudioContext !== 'undefined') {
    ctx = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
    ctx = new webkitAudioContext();
  } else if (typeof Audio !== 'undefined') {
    usingWebAudio = false;
  } else {
    usingWebAudio = false;
    noAudio = true;
  }

  // create a master gain node
  if (usingWebAudio) {
    var masterGain = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }

  // create global controller
  var HowlerGlobal = function() {
    this._volume = 1;
    this._muted = false;
    this.usingWebAudio = usingWebAudio;
    this._howls = [];
  };
  HowlerGlobal.prototype = {
    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this;

      // make sure volume is a number
      vol = parseFloat(vol);

      if (vol && vol >= 0 && vol <= 1) {
        self._volume = vol;

        if (usingWebAudio) {
          masterGain.gain.value = vol;
        }

        // loop through cache and change volume of all nodes that are using HTML5 Audio
        for (var key in self._howls) {
          if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === false) {
            // loop through the audio nodes
            for (var i=0; i<self._howls[key]._audioNode.length; i++) {
              self._howls[key]._audioNode[i].volume = self._howls[key]._volume * self._volume;
            }
          }
        }

        return self;
      }

      // return the current global volume
      return (usingWebAudio) ? masterGain.gain.value : self._volume;
    },

    /**
     * Mute all sounds.
     * @return {Howler}
     */
    mute: function() {
      this._setMuted(true);

      return this;
    },

    /**
     * Unmute all sounds.
     * @return {Howler}
     */
    unmute: function() {
      this._setMuted(false);

      return this;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    _setMuted: function(muted) {
      var self = this;

      self._muted = muted;

      if (usingWebAudio) {
        masterGain.gain.value = muted ? 0 : self._volume;
      }

      for (var key in self._howls) {
        if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === false) {
          // loop through the audio nodes
          for (var i=0; i<self._howls[key]._audioNode.length; i++) {
            self._howls[key]._audioNode[i].muted = muted;
          }
        }
      }
    }
  };

  // allow access to the global audio controls
  var Howler = new HowlerGlobal();

  // check for browser codec support
  var audioTest = null;
  if (!noAudio) {
    audioTest = new Audio();
    var codecs = {
      mp3: !!audioTest.canPlayType('audio/mpeg;').replace(/^no$/,''),
      opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,''),
      ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,''),
      wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/,''),
      m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/,''),
      webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,'')
    };
  }

  // setup the audio object
  var Howl = function(o) {
    var self = this;

    // setup the defaults
    self._autoplay = o.autoplay || false;
    self._buffer = o.buffer || false;
    self._duration = o.duration || 0;
    self._format = o.format || null;
    self._loop = o.loop || false;
    self._loaded = false;
    self._sprite = o.sprite || {};
    self._src = o.src || '';
    self._pos3d = o.pos3d || [0, 0, -0.5];
    self._volume = o.volume || 1;
    self._urls = o.urls || [];

    // setup event functions
    self._onload = [o.onload || function() {}];
    self._onloaderror = [o.onloaderror || function() {}];
    self._onend = [o.onend || function() {}];
    self._onpause = [o.onpause || function() {}];
    self._onplay = [o.onplay || function() {}];

    self._onendTimer = [];

    // Web Audio or HTML5 Audio?
    self._webAudio = usingWebAudio && !self._buffer;

    // check if we need to fall back to HTML5 Audio
    self._audioNode = [];
    if (self._webAudio) {
      self._setupAudioNode();
    }

    // add this to an array of Howl's to allow global control
    Howler._howls.push(self);

    // load the track
    self.load();
  };

  // setup all of the methods
  Howl.prototype = {
    /**
     * Load an audio file.
     * @return {Howl}
     */
    load: function() {
      var self = this,
        url = null;

      // if no audio is available, quit immediately
      if (noAudio) {
        self.on('loaderror');
        return;
      }

      var canPlay = {
        mp3: codecs.mp3,
        opus: codecs.opus,
        ogg: codecs.ogg,
        wav: codecs.wav,
        m4a: codecs.m4a,
        weba: codecs.webm
      };

      // loop through source URLs and pick the first one that is compatible
      for (var i=0; i<self._urls.length; i++) {
        var ext;

        if (self._format) {
          // use specified audio format if available
          ext = self._format;
        } else {
          // figure out the filetype (whether an extension or base64 data)
          ext = self._urls[i].toLowerCase().match(/.+\.([^?]+)(\?|$)/);
          ext = (ext && ext.length >= 2) ? ext[1] : self._urls[i].toLowerCase().match(/data\:audio\/([^?]+);/)[1];
        }

        if (canPlay[ext]) {
          url = self._urls[i];
          break;
        }
      }

      if (!url) {
        self.on('loaderror');
        return;
      }

      self._src = url;

      if (self._webAudio) {
        loadBuffer(self, url);
      } else {
        var newNode = new Audio();
        self._audioNode.push(newNode);

        // setup the new audio node
        newNode.src = url;
        newNode._pos = 0;
        newNode.preload = 'auto';
        newNode.volume = (Howler._muted) ? 0 : self._volume * Howler.volume();

        // add this sound to the cache
        cache[url] = self;

        // setup the event listener to start playing the sound
        // as soon as it has buffered enough
        var listener = function() {
          self._duration = newNode.duration;

          // setup a sprite if none is defined
          if (Object.getOwnPropertyNames(self._sprite).length === 0) {
            self._sprite = {_default: [0, self._duration * 1000]};
          }

          if (!self._loaded) {
            self._loaded = true;
            self.on('load');
          }

          if (self._autoplay) {
            self.play();
          }

          // clear the event listener
          newNode.removeEventListener('canplaythrough', listener, false);
        };
        newNode.addEventListener('canplaythrough', listener, false);
        newNode.load();
      }

      return self;
    },

    /**
     * Get/set the URLs to be pulled from to play in this source.
     * @param  {Array} urls  Arry of URLs to load from
     * @return {Howl}        Returns self or the current URLs
     */
    urls: function(urls) {
      var self = this;

      if (urls) {
        self._urls = urls;
        self._loaded = false;
        self.stop();
        self.load();

        return self;
      } else {
        return self._urls;
      }
    },

    /**
     * Play a sound from the current time (0 by default).
     * @param  {String}   sprite   (optional) Plays from the specified position in the sound sprite definition.
     * @param  {Function} callback (optional) Returns the unique playback id for this sound instance.
     * @return {Howl}
     */
    play: function(sprite, callback) {
      var self = this;

      // if no sprite was passed but a callback was, update the variables
      if (typeof sprite === 'function') {
        callback = sprite;
      }

      // use the default sprite if none is passed
      if (!sprite || typeof sprite === 'function') {
        sprite = '_default';
      }

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('load', function() {
          self.play(sprite, callback);
        });

        return self;
      }

      // if the sprite doesn't exist, play nothing
      if (!self._sprite[sprite]) {
        if (typeof callback === 'function') callback();
        return self;
      }

      // get the node to playback
      self._inactiveNode(function(node) {
        // persist the sprite being played
        node._sprite = sprite;

        // determine where to start playing from
        var pos = (node._pos > 0) ? node._pos : self._sprite[sprite][0] / 1000,
          duration = self._sprite[sprite][1] / 1000 - node._pos;

        // determine if this sound should be looped
        var loop = !!(self._loop || self._sprite[sprite][2]);

        // set timer to fire the 'onend' event
        var soundId = (typeof callback === 'string') ? callback : Math.round(Date.now() * Math.random()) + '',
          timerId;
        (function() {
          var data = {
            id: soundId,
            sprite: sprite,
            loop: loop
          };
          timerId = setTimeout(function() {
            // if looping, restart the track
            if (!self._webAudio && loop) {
              self.stop(data.id, data.timer).play(sprite, data.id);
            }

            // set web audio node to paused at end
            if (self._webAudio && !loop) {
              self._nodeById(data.id).paused = true;
            }

            // end the track if it is HTML audio and a sprite
            if (!self._webAudio && !loop) {
              self.stop(data.id, data.timer);
            }

            // fire ended event
            self.on('end', soundId);
          }, duration * 1000);

          // store the reference to the timer
          self._onendTimer.push(timerId);

          // remember which timer to cancel
          data.timer = self._onendTimer[self._onendTimer.length - 1];
        })();

        if (self._webAudio) {
          // set the play id to this node and load into context
          node.id = soundId;
          node.paused = false;
          refreshBuffer(self, [loop, pos, duration], soundId);
          self._playStart = ctx.currentTime;
          node.gain.value = self._volume;

          if (typeof node.bufferSource.start === 'undefined') {
            node.bufferSource.noteGrainOn(0, pos, duration);
          } else {
            node.bufferSource.start(0, pos, duration);
          }
        } else {
          if (node.readyState === 4) {
            node.id = soundId;
            node.currentTime = pos;
            node.muted = Howler._muted;
            node.volume = self._volume * Howler.volume();
            node.play();
          } else {
            self._clearEndTimer(timerId);

            (function(){
              var sound = self,
                playSprite = sprite,
                fn = callback,
                newNode = node;
              var listener = function() {
                sound.play(playSprite, fn);

                // clear the event listener
                newNode.removeEventListener('canplaythrough', listener, false);
              };
              newNode.addEventListener('canplaythrough', listener, false);
            })();

            return self;
          }
        }

        // fire the play event and send the soundId back in the callback
        self.on('play');
        if (typeof callback === 'function') callback(soundId);

        return self;
      });

      return self;
    },

    /**
     * Pause playback and save the current position.
     * @param {String} id (optional) The play instance ID.
     * @param {String} timerId (optional) Clear the correct timeout ID.
     * @return {Howl}
     */
    pause: function(id, timerId) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.pause(id);
        });

        return self;
      }

      // clear 'onend' timer
      self._clearEndTimer(timerId || 0);

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          // make sure the sound has been created
          if (!activeNode.bufferSource) {
            return self;
          }

          activeNode.paused = true;
          activeNode._pos += ctx.currentTime - self._playStart;
          if (typeof activeNode.bufferSource.stop === 'undefined') {
            activeNode.bufferSource.noteOff(0);
          } else {
            activeNode.bufferSource.stop(0);
          }
        } else {
          activeNode._pos = activeNode.currentTime;
          activeNode.pause();
        }
      }

      self.on('pause');

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {String} id  (optional) The play instance ID.
     * @param  {String} timerId  (optional) Clear the correct timeout ID.
     * @return {Howl}
     */
    stop: function(id, timerId) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.stop(id);
        });

        return self;
      }

      // clear 'onend' timer
      self._clearEndTimer(timerId || 0);

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        activeNode._pos = 0;

        if (self._webAudio) {
          // make sure the sound has been created
          if (!activeNode.bufferSource) {
            return self;
          }

          activeNode.paused = true;

          if (typeof activeNode.bufferSource.stop === 'undefined') {
            activeNode.bufferSource.noteOff(0);
          } else {
            activeNode.bufferSource.stop(0);
          }
        } else {
          activeNode.pause();
          activeNode.currentTime = 0;
        }
      }

      return self;
    },

    /**
     * Mute this sound.
     * @param  {String} id (optional) The play instance ID.
     * @return {Howl}
     */
    mute: function(id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.mute(id);
        });

        return self;
      }

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          activeNode.gain.value = 0;
        } else {
          activeNode.volume = 0;
        }
      }

      return self;
    },

    /**
     * Unmute this sound.
     * @param  {String} id (optional) The play instance ID.
     * @return {Howl}
     */
    unmute: function(id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.unmute(id);
        });

        return self;
      }

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          activeNode.gain.value = self._volume;
        } else {
          activeNode.volume = self._volume;
        }
      }

      return self;
    },

    /**
     * Get/set volume of this sound.
     * @param  {Float}  vol Volume from 0.0 to 1.0.
     * @param  {String} id  (optional) The play instance ID.
     * @return {Howl/Float}     Returns self or current volume.
     */
    volume: function(vol, id) {
      var self = this;

      // make sure volume is a number
      vol = parseFloat(vol);

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.volume(vol, id);
        });

        return self;
      }

      if (vol >= 0 && vol <= 1) {
        self._volume = vol;

        var activeNode = (id) ? self._nodeById(id) : self._activeNode();
        if (activeNode) {
          if (self._webAudio) {
            activeNode.gain.value = vol;
          } else {
            activeNode.volume = vol * Howler.volume();
          }
        }

        return self;
      } else {
        return self._volume;
      }
    },

    /**
     * Get/set whether to loop the sound.
     * @param  {Boolean} loop To loop or not to loop, that is the question.
     * @return {Howl/Boolean}      Returns self or current looping value.
     */
    loop: function(loop) {
      var self = this;

      if (typeof loop === 'boolean') {
        self._loop = loop;

        return self;
      } else {
        return self._loop;
      }
    },

    /**
     * Get/set sound sprite definition.
     * @param  {Object} sprite Example: {spriteName: [offset, duration, loop]}
     *                @param {Integer} offset   Where to begin playback in milliseconds
     *                @param {Integer} duration How long to play in milliseconds
     *                @param {Boolean} loop     (optional) Set true to loop this sprite
     * @return {Howl}        Returns current sprite sheet or self.
     */
    sprite: function(sprite) {
      var self = this;

      if (typeof sprite === 'object') {
        self._sprite = sprite;

        return self;
      } else {
        return self._sprite;
      }
    },

    /**
     * Get/set the position of playback.
     * @param  {Float}  pos The position to move current playback to.
     * @param  {String} id  (optional) The play instance ID.
     * @return {Howl/Float}      Returns self or current playback position.
     */
    pos: function(pos, id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('load', function() {
          self.pos(pos);
        });

        return self;
      }

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          if (pos >= 0) {
            activeNode._pos = pos;
            self.pause(id).play(activeNode._sprite, id);

            return self;
          } else {
            return activeNode._pos + (ctx.currentTime - self._playStart);
          }
        } else {
          if (pos >= 0) {
            activeNode.currentTime = pos;

            return self;
          } else {
            return activeNode.currentTime;
          }
        }
      }
    },

    /**
     * Get/set the 3D position of the audio source.
     * The most common usage is to set the 'x' position
     * to affect the left/right ear panning. Setting any value higher than
     * 1.0 will begin to decrease the volume of the sound as it moves further away.
     * NOTE: This only works with Web Audio API, HTML5 Audio playback
     * will not be affected.
     * @param  {Float}  x  The x-position of the playback from -1000.0 to 1000.0
     * @param  {Float}  y  The y-position of the playback from -1000.0 to 1000.0
     * @param  {Float}  z  The z-position of the playback from -1000.0 to 1000.0
     * @param  {String} id (optional) The play instance ID.
     * @return {Howl/Array}   Returns self or the current 3D position: [x, y, z]
     */
    pos3d: function(x, y, z, id) {
      var self = this;

      // set a default for the optional 'y' & 'z'
      y = (typeof y === 'undefined' || !y) ? 0 : y;
      z = (typeof z === 'undefined' || !z) ? -0.5 : z;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.pos3d(x, y, z, id);
        });

        return self;
      }

      if (x >= 0 || x < 0) {
        if (self._webAudio) {
          var activeNode = (id) ? self._nodeById(id) : self._activeNode();
          if (activeNode) {
            self._pos3d = [x, y, z];
            activeNode.panner.setPosition(x, y, z);
          }
        }
      } else {
        return self._pos3d;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes.
     * @param  {Number}   from     The volume to fade from (0.0 to 1.0).
     * @param  {Number}   to       The volume to fade to (0.0 to 1.0).
     * @param  {Number}   len      Time in milliseconds to fade.
     * @param  {Function} callback (optional) Fired when the fade is complete.
     * @param  {String}   id       (optional) The play instance ID.
     * @return {Howl}
     */
    fade: function(from, to, len, callback, id) {
      var self = this,
        diff = Math.abs(from - to),
        dir = from > to ? 'down' : 'up',
        steps = diff / 0.01,
        stepTime = len / steps;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('load', function() {
          self.fade(from, to, len, callback, id);
        });

        return self;
      }

      // set the volume to the start position
      self.volume(from, id);

      for (var i=1; i<=steps; i++) {
        (function() {
          var change = self._volume + (dir === 'up' ? 0.01 : -0.01) * i,
            vol = Math.round(1000 * change) / 1000,
            toVol = to;

          setTimeout(function() {
            self.volume(vol, id);

            if (vol === toVol) {
              if (callback) callback();
            }
          }, stepTime * i);
        })();
      }
    },

    /**
     * [DEPRECATED] Fade in the current sound.
     * @param  {Float}    to      Volume to fade to (0.0 to 1.0).
     * @param  {Number}   len     Time in milliseconds to fade.
     * @param  {Function} callback
     * @return {Howl}
     */
    fadeIn: function(to, len, callback) {
      return this.volume(0).play().fade(0, to, len, callback);
    },

    /**
     * [DEPRECATED] Fade out the current sound and pause when finished.
     * @param  {Float}    to       Volume to fade to (0.0 to 1.0).
     * @param  {Number}   len      Time in milliseconds to fade.
     * @param  {Function} callback
     * @param  {String}   id       (optional) The play instance ID.
     * @return {Howl}
     */
    fadeOut: function(to, len, callback, id) {
      var self = this;

      return self.fade(self._volume, to, len, function() {
        if (callback) callback();
        self.pause(id);

        // fire ended event
        self.on('end');
      }, id);
    },

    /**
     * Get an audio node by ID.
     * @return {Howl} Audio node.
     */
    _nodeById: function(id) {
      var self = this,
        node = self._audioNode[0];

      // find the node with this ID
      for (var i=0; i<self._audioNode.length; i++) {
        if (self._audioNode[i].id === id) {
          node = self._audioNode[i];
          break;
        }
      }

      return node;
    },

    /**
     * Get the first active audio node.
     * @return {Howl} Audio node.
     */
    _activeNode: function() {
      var self = this,
        node = null;

      // find the first playing node
      for (var i=0; i<self._audioNode.length; i++) {
        if (!self._audioNode[i].paused) {
          node = self._audioNode[i];
          break;
        }
      }

      // remove excess inactive nodes
      self._drainPool();

      return node;
    },

    /**
     * Get the first inactive audio node.
     * If there is none, create a new one and add it to the pool.
     * @param  {Function} callback Function to call when the audio node is ready.
     */
    _inactiveNode: function(callback) {
      var self = this,
        node = null;

      // find first inactive node to recycle
      for (var i=0; i<self._audioNode.length; i++) {
        if (self._audioNode[i].paused && self._audioNode[i].readyState === 4) {
          callback(self._audioNode[i]);
          node = true;
          break;
        }
      }

      // remove excess inactive nodes
      self._drainPool();

      if (node) {
        return;
      }

      // create new node if there are no inactives
      var newNode;
      if (self._webAudio) {
        newNode = self._setupAudioNode();
        callback(newNode);
      } else {
        self.load();
        newNode = self._audioNode[self._audioNode.length - 1];
        newNode.addEventListener('loadedmetadata', function() {
          callback(newNode);
        });
      }
    },

    /**
     * If there are more than 5 inactive audio nodes in the pool, clear out the rest.
     */
    _drainPool: function() {
      var self = this,
        inactive = 0,
        i;

      // count the number of inactive nodes
      for (i=0; i<self._audioNode.length; i++) {
        if (self._audioNode[i].paused) {
          inactive++;
        }
      }

      // remove excess inactive nodes
      for (i=self._audioNode.length-1; i>=0; i--) {
        if (inactive <= 5) {
          break;
        }

        if (self._audioNode[i].paused) {
          inactive--;
          self._audioNode.splice(i, 1);
        }
      }
    },

    /**
     * Clear 'onend' timeout before it ends.
     * @param  {Number} timerId The ID of the sound to be cancelled.
     */
    _clearEndTimer: function(timerId) {
      var self = this,
        timer = self._onendTimer.indexOf(timerId);

      // make sure the timer gets cleared
      timer = timer >= 0 ? timer : 0;

      if (self._onendTimer[timer]) {
        clearTimeout(self._onendTimer[timer]);
        self._onendTimer.splice(timer, 1);
      }
    },

    /**
     * Setup the gain node and panner for a Web Audio instance.
     * @return {Object} The new audio node.
     */
    _setupAudioNode: function() {
      var self = this,
        node = self._audioNode,
        index = self._audioNode.length;

      // create gain node
      node[index] = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
      node[index].gain.value = self._volume;
      node[index].paused = true;
      node[index]._pos = 0;
      node[index].readyState = 4;
      node[index].connect(masterGain);

      // create the panner
      node[index].panner = ctx.createPanner();
      node[index].panner.setPosition(self._pos3d[0], self._pos3d[1], self._pos3d[2]);
      node[index].panner.connect(node[index]);

      return node[index];
    },

    /**
     * Call/set custom events.
     * @param  {String}   event Event type.
     * @param  {Function} fn    Function to call.
     * @return {Howl}
     */
    on: function(event, fn) {
      var self = this,
        events = self['_on' + event];

      if (typeof fn === "function") {
        events.push(fn);
      } else {
        for (var i=0; i<events.length; i++) {
          if (fn) {
            events[i].call(self, fn);
          } else {
            events[i].call(self);
          }
        }
      }

      return self;
    },

    /**
     * Remove a custom event.
     * @param  {String}   event Event type.
     * @param  {Function} fn    Listener to remove.
     * @return {Howl}
     */
    off: function(event, fn) {
      var self = this,
        events = self['_on' + event],
        fnString = fn.toString();

      // loop through functions in the event for comparison
      for (var i=0; i<events.length; i++) {
        if (fnString === events[i].toString()) {
          events.splice(i, 1);
          break;
        }
      }

      return self;
    }

  };

  // only define these functions when using WebAudio
  if (usingWebAudio) {

    /**
     * Buffer a sound from URL (or from cache) and decode to audio source (Web Audio API).
     * @param  {Object} obj The Howl object for the sound to load.
     * @param  {String} url The path to the sound file.
     */
    var loadBuffer = function(obj, url) {
      // check if the buffer has already been cached
      if (url in cache) {
        // set the duration from the cache
        obj._duration = cache[url].duration;

        // load the sound into this object
        loadSound(obj);
      } else {
        // load the buffer from the URL
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          // decode the buffer into an audio source
          ctx.decodeAudioData(xhr.response, function(buffer) {
            if (buffer) {
              cache[url] = buffer;
              loadSound(obj, buffer);
            }
          });
        };
        xhr.onerror = function() {
          // if there is an error, switch the sound to HTML Audio
          if (obj._webAudio) {
            obj._buffer = true;
            obj._webAudio = false;
            obj._audioNode = [];
            delete obj._gainNode;
            obj.load();
          }
        };
        try {
          xhr.send();
        } catch (e) {
          xhr.onerror();
        }
      }
    };

    /**
     * Finishes loading the Web Audio API sound and fires the loaded event
     * @param  {Object}  obj    The Howl object for the sound to load.
     * @param  {Objecct} buffer The decoded buffer sound source.
     */
    var loadSound = function(obj, buffer) {
      // set the duration
      obj._duration = (buffer) ? buffer.duration : obj._duration;

      // setup a sprite if none is defined
      if (Object.getOwnPropertyNames(obj._sprite).length === 0) {
        obj._sprite = {_default: [0, obj._duration * 1000]};
      }

      // fire the loaded event
      if (!obj._loaded) {
        obj._loaded = true;
        obj.on('load');
      }

      if (obj._autoplay) {
        obj.play();
      }
    };

    /**
     * Load the sound back into the buffer source.
     * @param  {Object} obj   The sound to load.
     * @param  {Array}  loop  Loop boolean, pos, and duration.
     * @param  {String} id    (optional) The play instance ID.
     */
    var refreshBuffer = function(obj, loop, id) {
      // determine which node to connect to
      var node = obj._nodeById(id);

      // setup the buffer source for playback
      node.bufferSource = ctx.createBufferSource();
      node.bufferSource.buffer = cache[obj._src];
      node.bufferSource.connect(node.panner);
      node.bufferSource.loop = loop[0];
      if (loop[0]) {
        node.bufferSource.loopStart = loop[1];
        node.bufferSource.loopEnd = loop[1] + loop[2];
      }
    };

  }

  /**
   * Add support for AMD (Async Module Definition) libraries such as require.js.
   */
  if (typeof define === 'function' && define.amd) {
    define('Howler', function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    });
  } else {
    window.Howler = Howler;
    window.Howl = Howl;
  }
})();
/*! KineticJS v4.5.4 2013-06-09 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/

var Kinetic={};!function(){Kinetic.version="4.5.4",Kinetic.Filters={},Kinetic.Node=function(a){this._nodeInit(a)},Kinetic.Shape=function(a){this._initShape(a)},Kinetic.Container=function(a){this._containerInit(a)},Kinetic.Stage=function(a){this._initStage(a)},Kinetic.Layer=function(a){this._initLayer(a)},Kinetic.Group=function(a){this._initGroup(a)},Kinetic.Global={stages:[],idCounter:0,ids:{},names:{},shapes:{},isDragging:function(){var a=Kinetic.DD;return a?a.isDragging:!1},isDragReady:function(){var a=Kinetic.DD;return a?!!a.node:!1},_addId:function(a,b){void 0!==b&&(this.ids[b]=a)},_removeId:function(a){void 0!==a&&delete this.ids[a]},_addName:function(a,b){void 0!==b&&(void 0===this.names[b]&&(this.names[b]=[]),this.names[b].push(a))},_removeName:function(a,b){if(void 0!==a){var c=this.names[a];if(void 0!==c){for(var d=0;d<c.length;d++){var e=c[d];e._id===b&&c.splice(d,1)}0===c.length&&delete this.names[a]}}}}}(),function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.returnExports=b()}(this,function(){return Kinetic}),function(){Kinetic.Collection=function(){var a=[].slice.call(arguments),b=a.length,c=0;for(this.length=b;b>c;c++)this[c]=a[c];return this},Kinetic.Collection.prototype=[],Kinetic.Collection.prototype.each=function(a){for(var b=0;b<this.length;b++)a(this[b],b)},Kinetic.Collection.prototype.toArray=function(){for(var a=[],b=0;b<this.length;b++)a.push(this[b]);return a},Kinetic.Collection.mapMethods=function(a){var b,c=a.length;for(b=0;c>b;b++)!function(b){var c=a[b];Kinetic.Collection.prototype[c]=function(){var a,b=this.length;for(args=[].slice.call(arguments),a=0;b>a;a++)this[a][c].apply(this[a],args)}}(b)}}(),function(){Kinetic.Transform=function(){this.m=[1,0,0,1,0,0]},Kinetic.Transform.prototype={translate:function(a,b){this.m[4]+=this.m[0]*a+this.m[2]*b,this.m[5]+=this.m[1]*a+this.m[3]*b},scale:function(a,b){this.m[0]*=a,this.m[1]*=a,this.m[2]*=b,this.m[3]*=b},rotate:function(a){var b=Math.cos(a),c=Math.sin(a),d=this.m[0]*b+this.m[2]*c,e=this.m[1]*b+this.m[3]*c,f=this.m[0]*-c+this.m[2]*b,g=this.m[1]*-c+this.m[3]*b;this.m[0]=d,this.m[1]=e,this.m[2]=f,this.m[3]=g},getTranslation:function(){return{x:this.m[4],y:this.m[5]}},skew:function(a,b){var c=this.m[0]+this.m[2]*b,d=this.m[1]+this.m[3]*b,e=this.m[2]+this.m[0]*a,f=this.m[3]+this.m[1]*a;this.m[0]=c,this.m[1]=d,this.m[2]=e,this.m[3]=f},multiply:function(a){var b=this.m[0]*a.m[0]+this.m[2]*a.m[1],c=this.m[1]*a.m[0]+this.m[3]*a.m[1],d=this.m[0]*a.m[2]+this.m[2]*a.m[3],e=this.m[1]*a.m[2]+this.m[3]*a.m[3],f=this.m[0]*a.m[4]+this.m[2]*a.m[5]+this.m[4],g=this.m[1]*a.m[4]+this.m[3]*a.m[5]+this.m[5];this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g},invert:function(){var a=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]),b=this.m[3]*a,c=-this.m[1]*a,d=-this.m[2]*a,e=this.m[0]*a,f=a*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),g=a*(this.m[1]*this.m[4]-this.m[0]*this.m[5]);this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g},getMatrix:function(){return this.m}}}(),function(){var a="canvas",b="2d",c="[object Array]",d="[object Number]",e="[object String]",f=Math.PI/180,g=180/Math.PI,h="#",i="",j="0",k="Kinetic warning: ",l="rgb(",m={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},n=/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;Kinetic.Util={_isElement:function(a){return!(!a||1!=a.nodeType)},_isFunction:function(a){return!!(a&&a.constructor&&a.call&&a.apply)},_isObject:function(a){return!!a&&a.constructor==Object},_isArray:function(a){return Object.prototype.toString.call(a)==c},_isNumber:function(a){return Object.prototype.toString.call(a)==d},_isString:function(a){return Object.prototype.toString.call(a)==e},_hasMethods:function(a){var b,c=[];for(b in a)this._isFunction(a[b])&&c.push(b);return c.length>0},_isInDocument:function(a){for(;a=a.parentNode;)if(a==document)return!0;return!1},_getXY:function(a){if(this._isNumber(a))return{x:a,y:a};if(this._isArray(a)){if(1===a.length){var b=a[0];if(this._isNumber(b))return{x:b,y:b};if(this._isArray(b))return{x:b[0],y:b[1]};if(this._isObject(b))return b}else if(a.length>=2)return{x:a[0],y:a[1]}}else if(this._isObject(a))return a;return null},_getSize:function(a){if(this._isNumber(a))return{width:a,height:a};if(this._isArray(a))if(1===a.length){var b=a[0];if(this._isNumber(b))return{width:b,height:b};if(this._isArray(b)){if(b.length>=4)return{width:b[2],height:b[3]};if(b.length>=2)return{width:b[0],height:b[1]}}else if(this._isObject(b))return b}else{if(a.length>=4)return{width:a[2],height:a[3]};if(a.length>=2)return{width:a[0],height:a[1]}}else if(this._isObject(a))return a;return null},_getPoints:function(a){var b,c,d=[];if(void 0===a)return[];if(c=a.length,this._isArray(a[0])){for(b=0;c>b;b++)d.push({x:a[b][0],y:a[b][1]});return d}if(this._isObject(a[0]))return a;for(b=0;c>b;b+=2)d.push({x:a[b],y:a[b+1]});return d},_getImage:function(c,d){var e,f,g,h;c?this._isElement(c)?d(c):this._isString(c)?(e=new Image,e.onload=function(){d(e)},e.src=c):c.data?(f=document.createElement(a),f.width=c.width,f.height=c.height,g=f.getContext(b),g.putImageData(c,0,0),h=f.toDataURL(),e=new Image,e.onload=function(){d(e)},e.src=h):d(null):d(null)},_rgbToHex:function(a,b,c){return((1<<24)+(a<<16)+(b<<8)+c).toString(16).slice(1)},_hexToRgb:function(a){a=a.replace(h,i);var b=parseInt(a,16);return{r:255&b>>16,g:255&b>>8,b:255&b}},getRandomColor:function(){for(var a=(16777215*Math.random()<<0).toString(16);a.length<6;)a=j+a;return h+a},getRGB:function(a){var b;return a in m?(b=m[a],{r:b[0],g:b[1],b:b[2]}):a[0]===h?this._hexToRgb(a.substring(1)):a.substr(0,4)===l?(b=n.exec(a.replace(/ /g,"")),{r:parseInt(b[1],10),g:parseInt(b[2],10),b:parseInt(b[3],10)}):{r:0,g:0,b:0}},_merge:function(a,b){var c=this._clone(b);for(var d in a)c[d]=this._isObject(a[d])?this._merge(a[d],c[d]):a[d];return c},_clone:function(a){var b={};for(var c in a)b[c]=this._isObject(a[c])?this._clone(a[c]):a[c];return b},_degToRad:function(a){return a*f},_radToDeg:function(a){return a*g},_capitalize:function(a){return a.charAt(0).toUpperCase()+a.slice(1)},warn:function(a){window.console&&console.warn&&console.warn(k+a)},extend:function(a,b){for(var c in b.prototype)c in a.prototype||(a.prototype[c]=b.prototype[c])},addMethods:function(a,b){var c;for(c in b)a.prototype[c]=b[c]},_getControlPoints:function(a,b,c,d){var e=a.x,f=a.y,g=b.x,h=b.y,i=c.x,j=c.y,k=Math.sqrt(Math.pow(g-e,2)+Math.pow(h-f,2)),l=Math.sqrt(Math.pow(i-g,2)+Math.pow(j-h,2)),m=d*k/(k+l),n=d*l/(k+l),o=g-m*(i-e),p=h-m*(j-f),q=g+n*(i-e),r=h+n*(j-f);return[{x:o,y:p},{x:q,y:r}]},_expandPoints:function(a,b){var c,d,e=a.length,f=[];for(c=1;e-1>c;c++)d=Kinetic.Util._getControlPoints(a[c-1],a[c],a[c+1],b),f.push(d[0]),f.push(a[c]),f.push(d[1]);return f}}}(),function(){var a=document.createElement("canvas"),b=a.getContext("2d"),c=window.devicePixelRatio||1,d=b.webkitBackingStorePixelRatio||b.mozBackingStorePixelRatio||b.msBackingStorePixelRatio||b.oBackingStorePixelRatio||b.backingStorePixelRatio||1,e=c/d;Kinetic.Canvas=function(a){this.init(a)},Kinetic.Canvas.prototype={init:function(a){a=a||{};var b=a.width||0,c=a.height||0,d=a.pixelRatio||e,f=a.contextType||"2d";this.pixelRatio=d,this.element=document.createElement("canvas"),this.element.style.padding=0,this.element.style.margin=0,this.element.style.border=0,this.element.style.background="transparent",this.context=this.element.getContext(f),this.setSize(b,c)},getElement:function(){return this.element},getContext:function(){return this.context},setWidth:function(a){this.width=this.element.width=a*this.pixelRatio,this.element.style.width=a+"px"},setHeight:function(a){this.height=this.element.height=a*this.pixelRatio,this.element.style.height=a+"px"},getWidth:function(){return this.width},getHeight:function(){return this.height},setSize:function(a,b){this.setWidth(a),this.setHeight(b)},clear:function(){var a=this.getContext();this.getElement(),a.clearRect(0,0,this.getWidth(),this.getHeight())},toDataURL:function(a,b){try{return this.element.toDataURL(a,b)}catch(c){try{return this.element.toDataURL()}catch(d){return Kinetic.Util.warn("Unable to get data URL. "+d.message),""}}},fill:function(a){a.getFillEnabled()&&this._fill(a)},stroke:function(a){a.getStrokeEnabled()&&this._stroke(a)},fillStroke:function(a){var b=a.getFillEnabled();b&&this._fill(a),a.getStrokeEnabled()&&this._stroke(a,a.hasShadow()&&a.hasFill()&&b)},applyShadow:function(a,b){var c=this.context;c.save(),this._applyShadow(a),b(),c.restore(),b()},_applyLineCap:function(a){var b=a.getLineCap();b&&(this.context.lineCap=b)},_applyOpacity:function(a){var b=a.getAbsoluteOpacity();1!==b&&(this.context.globalAlpha=b)},_applyLineJoin:function(a){var b=a.getLineJoin();b&&(this.context.lineJoin=b)},_applyAncestorTransforms:function(a){var b,c,d=this.context;a._eachAncestorReverse(function(a){b=a.getTransform(!0),c=b.getMatrix(),d.transform(c[0],c[1],c[2],c[3],c[4],c[5])},!0)},_clip:function(a){var b=this.getContext();b.save(),this._applyAncestorTransforms(a),b.beginPath(),a.getClipFunc()(this),b.clip(),b.setTransform(1,0,0,1,0,0)}},Kinetic.SceneCanvas=function(a){Kinetic.Canvas.call(this,a)},Kinetic.SceneCanvas.prototype={setWidth:function(a){var b=this.pixelRatio;Kinetic.Canvas.prototype.setWidth.call(this,a),this.context.scale(b,b)},setHeight:function(a){var b=this.pixelRatio;Kinetic.Canvas.prototype.setHeight.call(this,a),this.context.scale(b,b)},_fillColor:function(a){var b=this.context,c=a.getFill();b.fillStyle=c,a._fillFunc(b)},_fillPattern:function(a){var b=this.context,c=a.getFillPatternImage(),d=a.getFillPatternX(),e=a.getFillPatternY(),f=a.getFillPatternScale(),g=a.getFillPatternRotation(),h=a.getFillPatternOffset(),i=a.getFillPatternRepeat();(d||e)&&b.translate(d||0,e||0),g&&b.rotate(g),f&&b.scale(f.x,f.y),h&&b.translate(-1*h.x,-1*h.y),b.fillStyle=b.createPattern(c,i||"repeat"),b.fill()},_fillLinearGradient:function(a){var b=this.context,c=a.getFillLinearGradientStartPoint(),d=a.getFillLinearGradientEndPoint(),e=a.getFillLinearGradientColorStops(),f=b.createLinearGradient(c.x,c.y,d.x,d.y);if(e){for(var g=0;g<e.length;g+=2)f.addColorStop(e[g],e[g+1]);b.fillStyle=f,b.fill()}},_fillRadialGradient:function(a){for(var b=this.context,c=a.getFillRadialGradientStartPoint(),d=a.getFillRadialGradientEndPoint(),e=a.getFillRadialGradientStartRadius(),f=a.getFillRadialGradientEndRadius(),g=a.getFillRadialGradientColorStops(),h=b.createRadialGradient(c.x,c.y,e,d.x,d.y,f),i=0;i<g.length;i+=2)h.addColorStop(g[i],g[i+1]);b.fillStyle=h,b.fill()},_fill:function(a,b){var c=this.context,d=a.getFill(),e=a.getFillPatternImage(),f=a.getFillLinearGradientColorStops(),g=a.getFillRadialGradientColorStops(),h=a.getFillPriority();c.save(),!b&&a.hasShadow()&&this._applyShadow(a),d&&"color"===h?this._fillColor(a):e&&"pattern"===h?this._fillPattern(a):f&&"linear-gradient"===h?this._fillLinearGradient(a):g&&"radial-gradient"===h?this._fillRadialGradient(a):d?this._fillColor(a):e?this._fillPattern(a):f?this._fillLinearGradient(a):g&&this._fillRadialGradient(a),c.restore(),!b&&a.hasShadow()&&this._fill(a,!0)},_stroke:function(a,b){var c=this.context,d=a.getStroke(),e=a.getStrokeWidth(),f=a.getDashArray();(d||e)&&(c.save(),a.getStrokeScaleEnabled()||c.setTransform(1,0,0,1,0,0),this._applyLineCap(a),f&&a.getDashArrayEnabled()&&(c.setLineDash?c.setLineDash(f):"mozDash"in c?c.mozDash=f:"webkitLineDash"in c&&(c.webkitLineDash=f)),!b&&a.hasShadow()&&this._applyShadow(a),c.lineWidth=e||2,c.strokeStyle=d||"black",a._strokeFunc(c),c.restore(),!b&&a.hasShadow()&&this._stroke(a,!0))},_applyShadow:function(a){var b=this.context;if(a.hasShadow()&&a.getShadowEnabled()){var c=a.getAbsoluteOpacity(),d=a.getShadowColor()||"black",e=a.getShadowBlur()||5,f=a.getShadowOffset()||{x:0,y:0};a.getShadowOpacity()&&(b.globalAlpha=a.getShadowOpacity()*c),b.shadowColor=d,b.shadowBlur=e,b.shadowOffsetX=f.x,b.shadowOffsetY=f.y}}},Kinetic.Util.extend(Kinetic.SceneCanvas,Kinetic.Canvas),Kinetic.HitCanvas=function(a){Kinetic.Canvas.call(this,a)},Kinetic.HitCanvas.prototype={_fill:function(a){var b=this.context;b.save(),b.fillStyle=a.colorKey,a._fillFuncHit(b),b.restore()},_stroke:function(a){var b=this.context,c=a.getStroke(),d=a.getStrokeWidth();(c||d)&&(this._applyLineCap(a),b.save(),b.lineWidth=d||2,b.strokeStyle=a.colorKey,a._strokeFuncHit(b),b.restore())}},Kinetic.Util.extend(Kinetic.HitCanvas,Kinetic.Canvas)}(),function(){var a=" ",b="",c=".",d="get",e="set",f="Shape",g="Stage",h="X",i="Y",j="kinetic",k="before",l="Change",m="id",n="name",o="mouseenter",p="mouseleave",q="Deg",r="beforeDraw",s="draw",t="RGB",u="r",v="g",w="b",x="R",y="G",z="B",A="#",B="children";Kinetic.Util.addMethods(Kinetic.Node,{_nodeInit:function(a){this._id=Kinetic.Global.idCounter++,this.eventListeners={},this.setAttrs(a)},on:function(d,e){var f,g,h,i,j,k,l=d.split(a),m=l.length;for(f=0;m>f;f++)g=l[f],h=g,i=h.split(c),j=i[0],k=i.length>1?i[1]:b,this.eventListeners[j]||(this.eventListeners[j]=[]),this.eventListeners[j].push({name:k,handler:e});return this},off:function(b){var d,e,f,g,h,i,j=b.split(a),k=j.length;for(d=0;k>d;d++)if(e=j[d],g=e,h=g.split(c),i=h[0],h.length>1)if(i)this.eventListeners[i]&&this._off(i,h[1]);else for(f in this.eventListeners)this._off(f,h[1]);else delete this.eventListeners[i];return this},remove:function(){var a=this.getParent();return a&&a.children&&(a.children.splice(this.index,1),a._setChildrenIndices(),delete this.parent),this},destroy:function(){var a=Kinetic.Global;a._removeId(this.getId()),a._removeName(this.getName(),this._id),this.remove()},getAttr:function(a){var b=d+Kinetic.Util._capitalize(a);return Kinetic.Util._isFunction(this[b])?this[b]():this.attrs[a]},setAttr:function(){var a=Array.prototype.slice.call(arguments),b=a[0],c=e+Kinetic.Util._capitalize(b),d=this[c];return a.shift(),Kinetic.Util._isFunction(d)?d.apply(this,a):this.attrs[b]=a[0],this},getAttrs:function(){return this.attrs||{}},createAttrs:function(){return void 0===this.attrs&&(this.attrs={}),this},setAttrs:function(a){var b,c;if(a)for(b in a)b===B||(c=e+Kinetic.Util._capitalize(b),Kinetic.Util._isFunction(this[c])?this[c](a[b]):this._setAttr(b,a[b]));return this},getVisible:function(){var a=this.attrs.visible,b=this.getParent();return void 0===a&&(a=!0),a&&b&&!b.getVisible()?!1:a},getListening:function(){var a=this.attrs.listening,b=this.getParent();return void 0===a&&(a=!0),a&&b&&!b.getListening()?!1:a},show:function(){return this.setVisible(!0),this},hide:function(){return this.setVisible(!1),this},getZIndex:function(){return this.index||0},getAbsoluteZIndex:function(){function a(g){for(b=[],c=g.length,d=0;c>d;d++)e=g[d],j++,e.nodeType!==f&&(b=b.concat(e.getChildren().toArray())),e._id===i._id&&(d=c);b.length>0&&b[0].getLevel()<=h&&a(b)}var b,c,d,e,h=this.getLevel(),i=(this.getStage(),this),j=0;return i.nodeType!==g&&a(i.getStage().getChildren()),j},getLevel:function(){for(var a=0,b=this.parent;b;)a++,b=b.parent;return a},setPosition:function(){var a=Kinetic.Util._getXY([].slice.call(arguments));return this.setX(a.x),this.setY(a.y),this},getPosition:function(){return{x:this.getX(),y:this.getY()}},getAbsolutePosition:function(){var a=this.getAbsoluteTransform(),b=this.getOffset();return a.translate(b.x,b.y),a.getTranslation()},setAbsolutePosition:function(){var a,b=Kinetic.Util._getXY([].slice.call(arguments)),c=this._clearTransform();return this.attrs.x=c.x,this.attrs.y=c.y,delete c.x,delete c.y,a=this.getAbsoluteTransform(),a.invert(),a.translate(b.x,b.y),b={x:this.attrs.x+a.getTranslation().x,y:this.attrs.y+a.getTranslation().y},this.setPosition(b.x,b.y),this._setTransform(c),this},move:function(){var a=Kinetic.Util._getXY([].slice.call(arguments)),b=this.getX(),c=this.getY();return void 0!==a.x&&(b+=a.x),void 0!==a.y&&(c+=a.y),this.setPosition(b,c),this},_eachAncestorReverse:function(a,b){var c,d,e=[],f=this.getParent();for(b&&e.unshift(this);f;)e.unshift(f),f=f.parent;for(c=e.length,d=0;c>d;d++)a(e[d])},rotate:function(a){return this.setRotation(this.getRotation()+a),this},rotateDeg:function(a){return this.setRotation(this.getRotation()+Kinetic.Util._degToRad(a)),this},moveToTop:function(){var a=this.index;return this.parent.children.splice(a,1),this.parent.children.push(this),this.parent._setChildrenIndices(),!0},moveUp:function(){var a=this.index,b=this.parent.getChildren().length;return b-1>a?(this.parent.children.splice(a,1),this.parent.children.splice(a+1,0,this),this.parent._setChildrenIndices(),!0):!1},moveDown:function(){var a=this.index;return a>0?(this.parent.children.splice(a,1),this.parent.children.splice(a-1,0,this),this.parent._setChildrenIndices(),!0):!1},moveToBottom:function(){var a=this.index;return a>0?(this.parent.children.splice(a,1),this.parent.children.unshift(this),this.parent._setChildrenIndices(),!0):!1},setZIndex:function(a){var b=this.index;return this.parent.children.splice(b,1),this.parent.children.splice(a,0,this),this.parent._setChildrenIndices(),this},getAbsoluteOpacity:function(){var a=this.getOpacity();return this.getParent()&&(a*=this.getParent().getAbsoluteOpacity()),a},moveTo:function(a){return Kinetic.Node.prototype.remove.call(this),a.add(this),this},toObject:function(){var a,b,c=Kinetic.Util,d={},e=this.getAttrs();d.attrs={};for(a in e)b=e[a],c._isFunction(b)||c._isElement(b)||c._isObject(b)&&c._hasMethods(b)||(d.attrs[a]=b);return d.className=this.getClassName(),d},toJSON:function(){return JSON.stringify(this.toObject())},getParent:function(){return this.parent},getLayer:function(){return this.getParent().getLayer()},getStage:function(){return this.getParent()?this.getParent().getStage():void 0},fire:function(a,b,c){return c?this._fireAndBubble(a,b||{}):this._fire(a,b||{}),this},getAbsoluteTransform:function(){var a,b=new Kinetic.Transform;return this._eachAncestorReverse(function(c){a=c.getTransform(),b.multiply(a)},!0),b},_getAndCacheTransform:function(){var a=new Kinetic.Transform,b=this.getX(),c=this.getY(),d=this.getRotation(),e=this.getScaleX(),f=this.getScaleY(),g=this.getSkewX(),h=this.getSkewY(),i=this.getOffsetX(),j=this.getOffsetY();return(0!==b||0!==c)&&a.translate(b,c),0!==d&&a.rotate(d),(0!==g||0!==h)&&a.skew(g,h),(1!==e||1!==f)&&a.scale(e,f),(0!==i||0!==j)&&a.translate(-1*i,-1*j),this.cachedTransform=a,a},getTransform:function(a){var b=this.cachedTransform;return a&&b?b:this._getAndCacheTransform()},clone:function(a){var b,c,d,e,f,g=this.getClassName(),h=new Kinetic[g](this.attrs);for(b in this.eventListeners)for(c=this.eventListeners[b],d=c.length,e=0;d>e;e++)f=c[e],f.name.indexOf(j)<0&&(h.eventListeners[b]||(h.eventListeners[b]=[]),h.eventListeners[b].push(f));return h.setAttrs(a),h},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d=this.getStage(),e=a.x||0,f=a.y||0,g=new Kinetic.SceneCanvas({width:a.width||d.getWidth(),height:a.height||d.getHeight(),pixelRatio:1}),h=g.getContext();return h.save(),(e||f)&&h.translate(-1*e,-1*f),this.drawScene(g),h.restore(),g.toDataURL(b,c)},toImage:function(a){Kinetic.Util._getImage(this.toDataURL(a),function(b){a.callback(b)})},setSize:function(){var a=Kinetic.Util._getSize(Array.prototype.slice.call(arguments));return this.setWidth(a.width),this.setHeight(a.height),this},getSize:function(){return{width:this.getWidth(),height:this.getHeight()}},getWidth:function(){return this.attrs.width||0},getHeight:function(){return this.attrs.height||0},getClassName:function(){return this.className||this.nodeType},getType:function(){return this.nodeType},_get:function(a){return this.nodeType===a?[this]:[]},_off:function(a,b){var c,d=this.eventListeners[a];for(c=0;c<d.length;c++)if(d[c].name===b){if(d.splice(c,1),0===d.length){delete this.eventListeners[a];break}c--}},_clearTransform:function(){var a={x:this.getX(),y:this.getY(),rotation:this.getRotation(),scaleX:this.getScaleX(),scaleY:this.getScaleY(),offsetX:this.getOffsetX(),offsetY:this.getOffsetY(),skewX:this.getSkewX(),skewY:this.getSkewY()};return this.attrs.x=0,this.attrs.y=0,this.attrs.rotation=0,this.attrs.scaleX=1,this.attrs.scaleY=1,this.attrs.offsetX=0,this.attrs.offsetY=0,this.attrs.skewX=0,this.attrs.skewY=0,a},_setTransform:function(a){var b;for(b in a)this.attrs[b]=a[b];this.cachedTransform=null},_fireBeforeChangeEvent:function(a,b,c){this._fire(k+Kinetic.Util._capitalize(a)+l,{oldVal:b,newVal:c})},_fireChangeEvent:function(a,b,c){this._fire(a+l,{oldVal:b,newVal:c})},setId:function(a){var b=this.getId(),c=(this.getStage(),Kinetic.Global);return c._removeId(b),c._addId(this,a),this._setAttr(m,a),this},setName:function(a){var b=this.getName(),c=(this.getStage(),Kinetic.Global);return c._removeName(b,this._id),c._addName(this,a),this._setAttr(n,a),this},_setAttr:function(a,b){var c;void 0!==b&&(c=this.attrs[a],this._fireBeforeChangeEvent(a,c,b),this.attrs[a]=b,this._fireChangeEvent(a,c,b))},_fireAndBubble:function(a,b,c){b&&this.nodeType===f&&(b.targetNode=this),this.getStage(),this.eventListeners;var d=!0;a===o&&c&&this._id===c._id?d=!1:a===p&&c&&this._id===c._id&&(d=!1),d&&(this._fire(a,b),b&&!b.cancelBubble&&this.parent&&(c&&c.parent?this._fireAndBubble.call(this.parent,a,b,c.parent):this._fireAndBubble.call(this.parent,a,b)))},_fire:function(a,b){var c,d,e=this.eventListeners[a];if(e)for(c=e.length,d=0;c>d;d++)e[d].handler.call(this,b)},draw:function(){var a={node:this};return this._fire(r,a),this.drawScene(),this.drawHit(),this._fire(s,a),this},shouldDrawHit:function(){return this.isVisible()&&this.isListening()&&!Kinetic.Global.isDragging()},isDraggable:function(){return!1}}),Kinetic.Node.setPoints=function(a){var b=Kinetic.Util._getPoints(a);this._setAttr("points",b)},Kinetic.Node.addGetterSetter=function(a,b,c,d){this.addGetter(a,b,c),this.addSetter(a,b,d)},Kinetic.Node.addPointGetterSetter=function(a,b,c,d){this.addPointGetter(a,b),this.addPointSetter(a,b),this.addGetter(a,b+h,c),this.addGetter(a,b+i,c),this.addSetter(a,b+h,d),this.addSetter(a,b+i,d)},Kinetic.Node.addPointsGetterSetter=function(a,b){this.addPointsGetter(a,b),this.addPointsSetter(a,b)},Kinetic.Node.addRotationGetterSetter=function(a,b,c,d){this.addRotationGetter(a,b,c),this.addRotationSetter(a,b,d)},Kinetic.Node.addColorGetterSetter=function(a,b){this.addGetter(a,b),this.addSetter(a,b),this.addColorRGBGetter(a,b),this.addColorComponentGetter(a,b,u),this.addColorComponentGetter(a,b,v),this.addColorComponentGetter(a,b,w),this.addColorRGBSetter(a,b),this.addColorComponentSetter(a,b,u),this.addColorComponentSetter(a,b,v),this.addColorComponentSetter(a,b,w)},Kinetic.Node.addColorRGBGetter=function(a,b){var c=d+Kinetic.Util._capitalize(b)+t;a.prototype[c]=function(){return Kinetic.Util.getRGB(this.attrs[b])}},Kinetic.Node.addColorComponentGetter=function(a,b,c){var e=d+Kinetic.Util._capitalize(b),f=e+Kinetic.Util._capitalize(c);a.prototype[f]=function(){return this[e+t]()[c]}},Kinetic.Node.addPointsGetter=function(a,b){var c=d+Kinetic.Util._capitalize(b);a.prototype[c]=function(){var a=this.attrs[b];return void 0===a?[]:a}},Kinetic.Node.addGetter=function(a,b,c){var e=d+Kinetic.Util._capitalize(b);a.prototype[e]=function(){var a=this.attrs[b];return void 0===a?c:a}},Kinetic.Node.addPointGetter=function(a,b){var c=d+Kinetic.Util._capitalize(b);a.prototype[c]=function(){var a=this;return{x:a[c+h](),y:a[c+i]()}}},Kinetic.Node.addRotationGetter=function(a,b,c){var e=d+Kinetic.Util._capitalize(b);a.prototype[e]=function(){var a=this.attrs[b];return void 0===a&&(a=c),a},a.prototype[e+q]=function(){var a=this.attrs[b];return void 0===a&&(a=c),Kinetic.Util._radToDeg(a)}},Kinetic.Node.addColorRGBSetter=function(a,b){var c=e+Kinetic.Util._capitalize(b)+t;a.prototype[c]=function(a){var c=a&&void 0!==a.r?0|a.r:this.getAttr(b+x),d=a&&void 0!==a.g?0|a.g:this.getAttr(b+y),e=a&&void 0!==a.b?0|a.b:this.getAttr(b+z);this._setAttr(b,A+Kinetic.Util._rgbToHex(c,d,e))}},Kinetic.Node.addColorComponentSetter=function(a,b,c){var d=e+Kinetic.Util._capitalize(b),f=d+Kinetic.Util._capitalize(c);a.prototype[f]=function(a){var b={};b[c]=a,this[d+t](b)}},Kinetic.Node.addPointsSetter=function(a,b){var c=e+Kinetic.Util._capitalize(b);a.prototype[c]=Kinetic.Node.setPoints},Kinetic.Node.addSetter=function(a,b,c){var d=e+Kinetic.Util._capitalize(b);a.prototype[d]=function(a){this._setAttr(b,a),c&&(this.cachedTransform=null)}},Kinetic.Node.addPointSetter=function(a,b){var c=e+Kinetic.Util._capitalize(b);a.prototype[c]=function(){var a=Kinetic.Util._getXY([].slice.call(arguments)),d=this.attrs[b],e=0,f=0;a&&(e=a.x,f=a.y,this._fireBeforeChangeEvent(b,d,a),void 0!==e&&this[c+h](e),void 0!==f&&this[c+i](f),this._fireChangeEvent(b,d,a))}},Kinetic.Node.addRotationSetter=function(a,b,c){var d=e+Kinetic.Util._capitalize(b);a.prototype[d]=function(a){this._setAttr(b,a),c&&(this.cachedTransform=null)},a.prototype[d+q]=function(a){this._setAttr(b,Kinetic.Util._degToRad(a)),c&&(this.cachedTransform=null)}},Kinetic.Node.create=function(a,b){return this._createNode(JSON.parse(a),b)},Kinetic.Node._createNode=function(a,b){var c,d,e,f=Kinetic.Node.prototype.getClassName.call(a),g=a.children;if(b&&(a.attrs.container=b),c=new Kinetic[f](a.attrs),g)for(d=g.length,e=0;d>e;e++)c.add(this._createNode(g[e]));return c},Kinetic.Node.addGetterSetter(Kinetic.Node,"x",0,!0),Kinetic.Node.addGetterSetter(Kinetic.Node,"y",0,!0),Kinetic.Node.addGetterSetter(Kinetic.Node,"opacity",1),Kinetic.Node.addGetter(Kinetic.Node,"name"),Kinetic.Node.addGetter(Kinetic.Node,"id"),Kinetic.Node.addRotationGetterSetter(Kinetic.Node,"rotation",0,!0),Kinetic.Node.addPointGetterSetter(Kinetic.Node,"scale",1,!0),Kinetic.Node.addPointGetterSetter(Kinetic.Node,"skew",0,!0),Kinetic.Node.addPointGetterSetter(Kinetic.Node,"offset",0,!0),Kinetic.Node.addSetter(Kinetic.Node,"width"),Kinetic.Node.addSetter(Kinetic.Node,"height"),Kinetic.Node.addSetter(Kinetic.Node,"listening"),Kinetic.Node.addSetter(Kinetic.Node,"visible"),Kinetic.Node.prototype.isListening=Kinetic.Node.prototype.getListening,Kinetic.Node.prototype.isVisible=Kinetic.Node.prototype.getVisible,Kinetic.Collection.mapMethods(["on","off","remove","destroy","show","hide","move","rotate","moveToTop","moveUp","moveDown","moveToBottom","moveTo","fire","draw"])}(),function(){function a(a){window.setTimeout(a,1e3/60)}Kinetic.Animation=function(a,b){this.func=a,this.setLayers(b),this.id=Kinetic.Animation.animIdCounter++,this.frame={time:0,timeDiff:0,lastTime:(new Date).getTime()}},Kinetic.Animation.prototype={setLayers:function(a){var b=[];b=a?a.length>0?a:[a]:[],this.layers=b},getLayers:function(){return this.layers},addLayer:function(a){var b,c,d=this.layers;if(d){for(b=d.length,c=0;b>c;c++)if(d[c]._id===a._id)return!1}else this.layers=[];return this.layers.push(a),!0},isRunning:function(){for(var a=Kinetic.Animation,b=a.animations,c=0;c<b.length;c++)if(b[c].id===this.id)return!0;return!1},start:function(){this.stop(),this.frame.timeDiff=0,this.frame.lastTime=(new Date).getTime(),Kinetic.Animation._addAnimation(this)},stop:function(){Kinetic.Animation._removeAnimation(this)},_updateFrameObject:function(a){this.frame.timeDiff=a-this.frame.lastTime,this.frame.lastTime=a,this.frame.time+=this.frame.timeDiff,this.frame.frameRate=1e3/this.frame.timeDiff}},Kinetic.Animation.animations=[],Kinetic.Animation.animIdCounter=0,Kinetic.Animation.animRunning=!1,Kinetic.Animation._addAnimation=function(a){this.animations.push(a),this._handleAnimation()},Kinetic.Animation._removeAnimation=function(a){for(var b=a.id,c=this.animations,d=c.length,e=0;d>e;e++)if(c[e].id===b){this.animations.splice(e,1);break}},Kinetic.Animation._runFrames=function(){var a,b,c,d,e,f,g,h,i={},j=this.animations;for(d=0;d<j.length;d++){for(a=j[d],b=a.layers,c=a.func,a._updateFrameObject((new Date).getTime()),f=b.length,e=0;f>e;e++)g=b[e],void 0!==g._id&&(i[g._id]=g);c&&c.call(a,a.frame)}for(h in i)i[h].draw()},Kinetic.Animation._animationLoop=function(){var a=this;this.animations.length>0?(this._runFrames(),Kinetic.Animation.requestAnimFrame(function(){a._animationLoop()})):this.animRunning=!1},Kinetic.Animation._handleAnimation=function(){var a=this;this.animRunning||(this.animRunning=!0,a._animationLoop())},RAF=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||a}(),Kinetic.Animation.requestAnimFrame=function(b){var c=Kinetic.DD&&Kinetic.DD.isDragging?a:RAF;c(b)};var b=Kinetic.Node.prototype.moveTo;Kinetic.Node.prototype.moveTo=function(a){b.call(this,a)},Kinetic.Layer.batchAnim=new Kinetic.Animation(function(){0===this.getLayers().length&&this.stop(),this.setLayers([])}),Kinetic.Layer.prototype.batchDraw=function(){var a=Kinetic.Layer.batchAnim;a.addLayer(this),a.isRunning()||a.start()}}(),function(){var a={node:1,duration:1,easing:1,onFinish:1,yoyo:1},b=1,c=2,d=3,e=0;Kinetic.Tween=function(b){var c,d=this,g=b.node,h=g._id,i=b.duration||1,j=b.easing||Kinetic.Easings.Linear,k=!!b.yoyo;this.node=g,this._id=e++,this.onFinish=b.onFinish,this.anim=new Kinetic.Animation(function(){d.tween.onEnterFrame()},g.getLayer()||g.getLayers()),this.tween=new f(c,function(a){d._tweenFunc(a)},j,0,1,1e3*i,k),this._addListeners(),Kinetic.Tween.attrs[h]||(Kinetic.Tween.attrs[h]={}),Kinetic.Tween.attrs[h][this._id]||(Kinetic.Tween.attrs[h][this._id]={}),Kinetic.Tween.tweens[h]||(Kinetic.Tween.tweens[h]={});for(c in b)void 0===a[c]&&this._addAttr(c,b[c]);this.reset()},Kinetic.Tween.attrs={},Kinetic.Tween.tweens={},Kinetic.Tween.prototype={_addAttr:function(a,b){var c,d,e,f,g,h,i,j=this.node,k=j._id;if(e=Kinetic.Tween.tweens[k][a],e&&delete Kinetic.Tween.attrs[k][e][a],c=j.getAttr(a),Kinetic.Util._isArray(b))for(b=Kinetic.Util._getPoints(b),d=[],g=b.length,f=0;g>f;f++)h=c[f],i=b[f],d.push({x:i.x-h.x,y:i.y-h.y});else d=b-c;Kinetic.Tween.attrs[k][this._id][a]={start:c,diff:d},Kinetic.Tween.tweens[k][a]=this._id},_tweenFunc:function(a){var b,c,d,e,f,g,h,i,j,k=this.node,l=Kinetic.Tween.attrs[k._id][this._id];for(b in l){if(c=l[b],d=c.start,e=c.diff,Kinetic.Util._isArray(d))for(f=[],h=d.length,g=0;h>g;g++)i=d[g],j=e[g],f.push({x:i.x+j.x*a,y:i.y+j.y*a});else f=d+e*a;k.setAttr(b,f)}},_addListeners:function(){var a=this;this.tween.onPlay=function(){a.anim.start()},this.tween.onReverse=function(){a.anim.start()},this.tween.onPause=function(){a.anim.stop()},this.tween.onFinish=function(){a.onFinish&&a.onFinish()}},play:function(){return this.tween.play(),this},reverse:function(){return this.tween.reverse(),this},reset:function(){var a=this.node;return this.tween.reset(),(a.getLayer()||a.getLayers()).draw(),this},seek:function(a){var b=this.node;return this.tween.seek(1e3*a),(b.getLayer()||b.getLayers()).draw(),this},pause:function(){return this.tween.pause(),this},finish:function(){var a=this.node;return this.tween.finish(),(a.getLayer()||a.getLayers()).draw(),this},destroy:function(){var a,b=this.node._id,c=this._id,d=Kinetic.Tween.tweens[b];this.pause();for(a in d)delete Kinetic.Tween.tweens[b][a];delete Kinetic.Tween.attrs[b][c]}};var f=function(a,b,c,d,e,f,g){this.prop=a,this.propFunc=b,this.begin=d,this._pos=d,this.duration=f,this._change=0,this.prevPos=0,this.yoyo=g,this._time=0,this._position=0,this._startTime=0,this._finish=0,this.func=c,this._change=e-this.begin,this.pause()};f.prototype={fire:function(a){var b=this[a];b&&b()},setTime:function(a){a>this.duration?this.yoyo?(this._time=this.duration,this.reverse()):this.finish():0>a?this.yoyo?(this._time=0,this.play()):this.reset():(this._time=a,this.update())},getTime:function(){return this._time},setPosition:function(a){this.prevPos=this._pos,this.propFunc(a),this._pos=a},getPosition:function(a){return void 0===a&&(a=this._time),this.func(a,this.begin,this._change,this.duration)},play:function(){this.state=c,this._startTime=this.getTimer()-this._time,this.onEnterFrame(),this.fire("onPlay")
},reverse:function(){this.state=d,this._time=this.duration-this._time,this._startTime=this.getTimer()-this._time,this.onEnterFrame(),this.fire("onReverse")},seek:function(a){this.pause(),this._time=a,this.update(),this.fire("onSeek")},reset:function(){this.pause(),this._time=0,this.update(),this.fire("onReset")},finish:function(){this.pause(),this._time=this.duration,this.update(),this.fire("onFinish")},update:function(){this.setPosition(this.getPosition(this._time))},onEnterFrame:function(){var a=this.getTimer()-this._startTime;this.state===c?this.setTime(a):this.state===d&&this.setTime(this.duration-a)},pause:function(){this.state=b,this.fire("onPause")},getTimer:function(){return(new Date).getTime()}},Kinetic.Easings={BackEaseIn:function(a,b,c,d){var e=1.70158;return c*(a/=d)*a*((e+1)*a-e)+b},BackEaseOut:function(a,b,c,d){var e=1.70158;return c*((a=a/d-1)*a*((e+1)*a+e)+1)+b},BackEaseInOut:function(a,b,c,d){var e=1.70158;return(a/=d/2)<1?c/2*a*a*(((e*=1.525)+1)*a-e)+b:c/2*((a-=2)*a*(((e*=1.525)+1)*a+e)+2)+b},ElasticEaseIn:function(a,b,c,d,e,f){var g=0;return 0===a?b:1==(a/=d)?b+c:(f||(f=.3*d),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),-(e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f))+b)},ElasticEaseOut:function(a,b,c,d,e,f){var g=0;return 0===a?b:1==(a/=d)?b+c:(f||(f=.3*d),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),e*Math.pow(2,-10*a)*Math.sin((a*d-g)*2*Math.PI/f)+c+b)},ElasticEaseInOut:function(a,b,c,d,e,f){var g=0;return 0===a?b:2==(a/=d/2)?b+c:(f||(f=d*.3*1.5),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),1>a?-.5*e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)+b:.5*e*Math.pow(2,-10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)+c+b)},BounceEaseOut:function(a,b,c,d){return(a/=d)<1/2.75?c*7.5625*a*a+b:2/2.75>a?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:2.5/2.75>a?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b},BounceEaseIn:function(a,b,c,d){return c-Kinetic.Easings.BounceEaseOut(d-a,0,c,d)+b},BounceEaseInOut:function(a,b,c,d){return d/2>a?.5*Kinetic.Easings.BounceEaseIn(2*a,0,c,d)+b:.5*Kinetic.Easings.BounceEaseOut(2*a-d,0,c,d)+.5*c+b},EaseIn:function(a,b,c,d){return c*(a/=d)*a+b},EaseOut:function(a,b,c,d){return-c*(a/=d)*(a-2)+b},EaseInOut:function(a,b,c,d){return(a/=d/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},StrongEaseIn:function(a,b,c,d){return c*(a/=d)*a*a*a*a+b},StrongEaseOut:function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b},StrongEaseInOut:function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b},Linear:function(a,b,c,d){return c*a/d+b}}}(),function(){Kinetic.DD={anim:new Kinetic.Animation,isDragging:!1,offset:{x:0,y:0},node:null,_drag:function(a){var b=Kinetic.DD,c=b.node;if(c){var d=c.getStage().getPointerPosition(),e=c.getDragBoundFunc(),f={x:d.x-b.offset.x,y:d.y-b.offset.y};void 0!==e&&(f=e.call(c,f,a)),c.setAbsolutePosition(f),b.isDragging||(b.isDragging=!0,c.fire("dragstart",a,!0)),c.fire("dragmove",a,!0)}},_endDragBefore:function(a){var b,c,d=Kinetic.DD,e=d.node;e&&(b=e.nodeType,c=e.getLayer(),d.anim.stop(),d.isDragging&&(d.isDragging=!1,a&&(a.dragEndNode=e)),delete d.node,(c||e).draw())},_endDragAfter:function(a){a=a||{};var b=a.dragEndNode;a&&b&&b.fire("dragend",a,!0)}},Kinetic.Node.prototype.startDrag=function(){var a=Kinetic.DD,b=this.getStage(),c=this.getLayer(),d=b.getPointerPosition(),e=(this.getTransform().getTranslation(),this.getAbsolutePosition());d&&(a.node&&a.node.stopDrag(),a.node=this,a.offset.x=d.x-e.x,a.offset.y=d.y-e.y,a.anim.setLayers(c||this.getLayers()),a.anim.start())},Kinetic.Node.prototype.stopDrag=function(){var a=Kinetic.DD,b={};a._endDragBefore(b),a._endDragAfter(b)},Kinetic.Node.prototype.setDraggable=function(a){this._setAttr("draggable",a),this._dragChange()};var a=Kinetic.Node.prototype.destroy;Kinetic.Node.prototype.destroy=function(){var b=Kinetic.DD;b.node&&b.node._id===this._id&&this.stopDrag(),a.call(this)},Kinetic.Node.prototype.isDragging=function(){var a=Kinetic.DD;return a.node&&a.node._id===this._id&&a.isDragging},Kinetic.Node.prototype._listenDrag=function(){this._dragCleanup();var a=this;this.on("mousedown.kinetic touchstart.kinetic",function(b){Kinetic.DD.node||a.startDrag(b)})},Kinetic.Node.prototype._dragChange=function(){if(this.attrs.draggable)this._listenDrag();else{this._dragCleanup();var a=this.getStage(),b=Kinetic.DD;a&&b.node&&b.node._id===this._id&&b.node.stopDrag()}},Kinetic.Node.prototype._dragCleanup=function(){this.off("mousedown.kinetic"),this.off("touchstart.kinetic")},Kinetic.Node.addGetterSetter(Kinetic.Node,"dragBoundFunc"),Kinetic.Node.addGetter(Kinetic.Node,"draggable",!1),Kinetic.Node.prototype.isDraggable=Kinetic.Node.prototype.getDraggable;var b=document.getElementsByTagName("html")[0];b.addEventListener("mouseup",Kinetic.DD._endDragBefore,!0),b.addEventListener("touchend",Kinetic.DD._endDragBefore,!0),b.addEventListener("mouseup",Kinetic.DD._endDragAfter,!1),b.addEventListener("touchend",Kinetic.DD._endDragAfter,!1)}(),function(){Kinetic.Util.addMethods(Kinetic.Container,{_containerInit:function(a){this.children=new Kinetic.Collection,Kinetic.Node.call(this,a)},getChildren:function(){return this.children},hasChildren:function(){return this.getChildren().length>0},removeChildren:function(){for(var a,b=this.children;b.length>0;){var a=b[0];a.hasChildren()&&a.removeChildren(),a.remove()}return this},destroyChildren:function(){for(var a=this.children;a.length>0;)a[0].destroy();return this},add:function(a){var b=(Kinetic.Global,this.children);return a.index=b.length,a.parent=this,b.push(a),this._fire("add",{child:a}),this},destroy:function(){this.hasChildren()&&this.destroyChildren(),Kinetic.Node.prototype.destroy.call(this)},get:function(a){var b=new Kinetic.Collection;if("#"===a.charAt(0)){var c=this._getNodeById(a.slice(1));c&&b.push(c)}else if("."===a.charAt(0)){var d=this._getNodesByName(a.slice(1));Kinetic.Collection.apply(b,d)}else{for(var e=[],f=this.getChildren(),g=f.length,h=0;g>h;h++)e=e.concat(f[h]._get(a));Kinetic.Collection.apply(b,e)}return b},_getNodeById:function(a){var b=(this.getStage(),Kinetic.Global),c=b.ids[a];return void 0!==c&&this.isAncestorOf(c)?c:null},_getNodesByName:function(a){var b=Kinetic.Global,c=b.names[a]||[];return this._getDescendants(c)},_get:function(a){for(var b=Kinetic.Node.prototype._get.call(this,a),c=this.getChildren(),d=c.length,e=0;d>e;e++)b=b.concat(c[e]._get(a));return b},toObject:function(){var a=Kinetic.Node.prototype.toObject.call(this);a.children=[];for(var b=this.getChildren(),c=b.length,d=0;c>d;d++){var e=b[d];a.children.push(e.toObject())}return a},_getDescendants:function(a){for(var b=[],c=a.length,d=0;c>d;d++){var e=a[d];this.isAncestorOf(e)&&b.push(e)}return b},isAncestorOf:function(a){for(var b=a.getParent();b;){if(b._id===this._id)return!0;b=b.getParent()}return!1},clone:function(a){var b=Kinetic.Node.prototype.clone.call(this,a);return this.getChildren().each(function(a){b.add(a.clone())}),b},getAllIntersections:function(){for(var a=Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),b=[],c=this.get("Shape"),d=c.length,e=0;d>e;e++){var f=c[e];f.isVisible()&&f.intersects(a)&&b.push(f)}return b},_setChildrenIndices:function(){for(var a=this.children,b=a.length,c=0;b>c;c++)a[c].index=c},drawScene:function(a){var b,c,d,e=this.getLayer(),f=!!this.getClipFunc();if(!a&&e&&(a=e.getCanvas()),this.isVisible()){for(f&&a._clip(this),b=this.children,d=b.length,c=0;d>c;c++)b[c].drawScene(a);f&&a.getContext().restore()}return this},drawHit:function(){var a,b=!!this.getClipFunc()&&"Stage"!==this.nodeType,c=0,d=0,e=[];if(this.shouldDrawHit()){for(b&&(a=this.getLayer().hitCanvas,a._clip(this)),e=this.children,d=e.length,c=0;d>c;c++)e[c].drawHit();b&&a.getContext().restore()}return this}}),Kinetic.Util.extend(Kinetic.Container,Kinetic.Node),Kinetic.Node.addGetterSetter(Kinetic.Container,"clipFunc")}(),function(){function a(a){a.fill()}function b(a){a.stroke()}function c(a){a.fill()}function d(a){a.stroke()}Kinetic.Util.addMethods(Kinetic.Shape,{_initShape:function(e){this.nodeType="Shape",this._fillFunc=a,this._strokeFunc=b,this._fillFuncHit=c,this._strokeFuncHit=d;for(var f,g=Kinetic.Global.shapes;;)if(f=Kinetic.Util.getRandomColor(),f&&!(f in g))break;this.colorKey=f,g[f]=this,this.createAttrs(),Kinetic.Node.call(this,e)},hasChildren:function(){return!1},getChildren:function(){return[]},getContext:function(){return this.getLayer().getContext()},getCanvas:function(){return this.getLayer().getCanvas()},hasShadow:function(){return!!(this.getShadowColor()||this.getShadowBlur()||this.getShadowOffsetX()||this.getShadowOffsetY())},hasFill:function(){return!!(this.getFill()||this.getFillPatternImage()||this.getFillLinearGradientColorStops()||this.getFillRadialGradientColorStops())},_get:function(a){return this.className===a||this.nodeType===a?[this]:[]},intersects:function(){var a=Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),b=this.getStage(),c=b.hitCanvas;c.clear(),this.drawScene(c);var d=c.context.getImageData(0|a.x,0|a.y,1,1).data;return d[3]>0},enableFill:function(){return this._setAttr("fillEnabled",!0),this},disableFill:function(){return this._setAttr("fillEnabled",!1),this},enableStroke:function(){return this._setAttr("strokeEnabled",!0),this},disableStroke:function(){return this._setAttr("strokeEnabled",!1),this},enableStrokeScale:function(){return this._setAttr("strokeScaleEnabled",!0),this},disableStrokeScale:function(){return this._setAttr("strokeScaleEnabled",!1),this},enableShadow:function(){return this._setAttr("shadowEnabled",!0),this},disableShadow:function(){return this._setAttr("shadowEnabled",!1),this},enableDashArray:function(){return this._setAttr("dashArrayEnabled",!0),this},disableDashArray:function(){return this._setAttr("dashArrayEnabled",!1),this},destroy:function(){return Kinetic.Node.prototype.destroy.call(this),delete Kinetic.Global.shapes[this.colorKey],this},drawScene:function(a){a=a||this.getLayer().getCanvas();var b=this.getDrawFunc(),c=a.getContext();return b&&this.isVisible()&&(c.save(),a._applyOpacity(this),a._applyLineJoin(this),a._applyAncestorTransforms(this),b.call(this,a),c.restore()),this},drawHit:function(){var a=this.getAttrs(),b=a.drawHitFunc||a.drawFunc,c=this.getLayer().hitCanvas,d=c.getContext();return b&&this.shouldDrawHit()&&(d.save(),c._applyLineJoin(this),c._applyAncestorTransforms(this),b.call(this,c),d.restore()),this},_setDrawFuncs:function(){!this.attrs.drawFunc&&this.drawFunc&&this.setDrawFunc(this.drawFunc),!this.attrs.drawHitFunc&&this.drawHitFunc&&this.setDrawHitFunc(this.drawHitFunc)}}),Kinetic.Util.extend(Kinetic.Shape,Kinetic.Node),Kinetic.Node.addColorGetterSetter(Kinetic.Shape,"stroke"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"lineJoin"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"lineCap"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"strokeWidth"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"drawFunc"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"drawHitFunc"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"dashArray"),Kinetic.Node.addColorGetterSetter(Kinetic.Shape,"shadowColor"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"shadowBlur"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"shadowOpacity"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillPatternImage"),Kinetic.Node.addColorGetterSetter(Kinetic.Shape,"fill"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillPatternX"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillPatternY"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillLinearGradientColorStops"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartRadius"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndRadius"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillRadialGradientColorStops"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillPatternRepeat"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillEnabled",!0),Kinetic.Node.addGetterSetter(Kinetic.Shape,"strokeEnabled",!0),Kinetic.Node.addGetterSetter(Kinetic.Shape,"shadowEnabled",!0),Kinetic.Node.addGetterSetter(Kinetic.Shape,"dashArrayEnabled",!0),Kinetic.Node.addGetterSetter(Kinetic.Shape,"fillPriority","color"),Kinetic.Node.addGetterSetter(Kinetic.Shape,"strokeScaleEnabled",!0),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"fillPatternOffset",0),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"fillPatternScale",1),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"fillLinearGradientStartPoint",0),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"fillLinearGradientEndPoint",0),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"fillRadialGradientStartPoint",0),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"fillRadialGradientEndPoint",0),Kinetic.Node.addPointGetterSetter(Kinetic.Shape,"shadowOffset",0),Kinetic.Node.addRotationGetterSetter(Kinetic.Shape,"fillPatternRotation",0)}(),function(){function a(a,b){a.content.addEventListener(b,function(c){c.preventDefault(),a[x+b](c)},!1)}var b="Stage",c="string",d="px",e="mouseout",f="mouseleave",g="mouseover",h="mouseenter",i="mousemove",j="mousedown",k="mouseup",l="click",m="dblclick",n="touchstart",o="touchend",p="tap",q="dbltap",r="touchmove",s="div",t="relative",u="inline-block",v="kineticjs-content",w=" ",x="_",y="container",z="",A=[j,i,k,e,n,r,o],B=A.length;Kinetic.Util.addMethods(Kinetic.Stage,{_initStage:function(a){this.createAttrs(),Kinetic.Container.call(this,a),this.nodeType=b,this.dblClickWindow=400,this._id=Kinetic.Global.idCounter++,this._buildDOM(),this._bindContentEvents(),Kinetic.Global.stages.push(this)},setContainer:function(a){return typeof a===c&&(a=document.getElementById(a)),this._setAttr(y,a),this},draw:function(){var a,b,c=this.getChildren(),d=c.length;for(a=0;d>a;a++)b=c[a],b.getClearBeforeDraw()&&(b.getCanvas().clear(),b.getHitCanvas().clear());return Kinetic.Node.prototype.draw.call(this),this},setHeight:function(a){return Kinetic.Node.prototype.setHeight.call(this,a),this._resizeDOM(),this},setWidth:function(a){return Kinetic.Node.prototype.setWidth.call(this,a),this._resizeDOM(),this},clear:function(){var a,b=this.children,c=b.length;for(a=0;c>a;a++)b[a].clear();return this},destroy:function(){var a=this.content;Kinetic.Container.prototype.destroy.call(this),a&&Kinetic.Util._isInDocument(a)&&this.getContainer().removeChild(a)},getMousePosition:function(){return this.mousePos},getTouchPosition:function(){return this.touchPos},getPointerPosition:function(){return this.getTouchPosition()||this.getMousePosition()},getStage:function(){return this},getContent:function(){return this.content},toDataURL:function(a){function b(e){var f=i[e],j=f.toDataURL(),k=new Image;k.onload=function(){h.drawImage(k,0,0),e<i.length-1?b(e+1):a.callback(g.toDataURL(c,d))},k.src=j}a=a||{};var c=a.mimeType||null,d=a.quality||null,e=a.x||0,f=a.y||0,g=new Kinetic.SceneCanvas({width:a.width||this.getWidth(),height:a.height||this.getHeight(),pixelRatio:1}),h=g.getContext(),i=this.children;(e||f)&&h.translate(-1*e,-1*f),b(0)},toImage:function(a){var b=a.callback;a.callback=function(a){Kinetic.Util._getImage(a,function(a){b(a)})},this.toDataURL(a)},getIntersection:function(){var a,b,c=Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),d=this.getChildren(),e=d.length,f=e-1;for(a=f;a>=0;a--)if(b=d[a].getIntersection(c))return b;return null},_resizeDOM:function(){if(this.content){var a,b=this.getWidth(),c=this.getHeight(),e=this.getChildren(),f=e.length;for(this.content.style.width=b+d,this.content.style.height=c+d,this.bufferCanvas.setSize(b,c,1),this.hitCanvas.setSize(b,c),a=0;f>a;a++)layer=e[a],layer.getCanvas().setSize(b,c),layer.hitCanvas.setSize(b,c),layer.draw()}},add:function(a){return Kinetic.Container.prototype.add.call(this,a),a.canvas.setSize(this.attrs.width,this.attrs.height),a.hitCanvas.setSize(this.attrs.width,this.attrs.height),a.draw(),this.content.appendChild(a.canvas.element),this},getParent:function(){return null},getLayer:function(){return null},getLayers:function(){return this.getChildren()},_setPointerPosition:function(a){a||(a=window.event),this._setMousePosition(a),this._setTouchPosition(a)},_bindContentEvents:function(){var b;for(b=0;B>b;b++)a(this,A[b])},_mouseout:function(a){this._setPointerPosition(a);var b=Kinetic.Global,c=this.targetShape;c&&!b.isDragging()&&(c._fireAndBubble(e,a),c._fireAndBubble(f,a),this.targetShape=null),this.mousePos=void 0},_mousemove:function(a){this._setPointerPosition(a);var b,c=Kinetic.Global,d=Kinetic.DD,j=this.getIntersection(this.getPointerPosition());j?(b=j.shape,b&&(c.isDragging()||255!==j.pixel[3]||this.targetShape&&this.targetShape._id===b._id?b._fireAndBubble(i,a):(this.targetShape&&(this.targetShape._fireAndBubble(e,a,b),this.targetShape._fireAndBubble(f,a,b)),b._fireAndBubble(g,a,this.targetShape),b._fireAndBubble(h,a,this.targetShape),this.targetShape=b))):this.targetShape&&!c.isDragging()&&(this.targetShape._fireAndBubble(e,a),this.targetShape._fireAndBubble(f,a),this.targetShape=null),d&&d._drag(a)},_mousedown:function(a){this._setPointerPosition(a);var b,c=Kinetic.Global,d=this.getIntersection(this.getPointerPosition());d&&d.shape&&(b=d.shape,this.clickStart=!0,this.clickStartShape=b,b._fireAndBubble(j,a)),this.isDraggable()&&!c.isDragReady()&&this.startDrag(a)},_mouseup:function(a){this._setPointerPosition(a);var b,c=this,d=Kinetic.Global,e=this.getIntersection(this.getPointerPosition());e&&e.shape&&(b=e.shape,b._fireAndBubble(k,a),this.clickStart&&(d.isDragging()||b._id!==this.clickStartShape._id||(b._fireAndBubble(l,a),this.inDoubleClickWindow&&b._fireAndBubble(m,a),this.inDoubleClickWindow=!0,setTimeout(function(){c.inDoubleClickWindow=!1},this.dblClickWindow)))),this.clickStart=!1},_touchstart:function(a){this._setPointerPosition(a);var b,c=Kinetic.Global,d=this.getIntersection(this.getPointerPosition());d&&d.shape&&(b=d.shape,this.tapStart=!0,this.tapStartShape=b,b._fireAndBubble(n,a)),this.isDraggable()&&!c.isDragReady()&&this.startDrag(a)},_touchend:function(a){this._setPointerPosition(a);var b,c=this,d=Kinetic.Global,e=this.getIntersection(this.getPointerPosition());e&&e.shape&&(b=e.shape,b._fireAndBubble(o,a),this.tapStart&&(d.isDragging()||b._id!==this.tapStartShape._id||(b._fireAndBubble(p,a),this.inDoubleClickWindow&&b._fireAndBubble(q,a),this.inDoubleClickWindow=!0,setTimeout(function(){c.inDoubleClickWindow=!1},this.dblClickWindow)))),this.tapStart=!1},_touchmove:function(a){this._setPointerPosition(a);var b,c=Kinetic.DD,d=this.getIntersection(this.getPointerPosition());d&&d.shape&&(b=d.shape,b._fireAndBubble(r,a)),c&&c._drag(a)},_setMousePosition:function(a){var b=a.clientX-this._getContentPosition().left,c=a.clientY-this._getContentPosition().top;this.mousePos={x:b,y:c}},_setTouchPosition:function(a){var b,c,d;void 0!==a.touches&&1===a.touches.length&&(b=a.touches[0],c=b.clientX-this._getContentPosition().left,d=b.clientY-this._getContentPosition().top,this.touchPos={x:c,y:d})},_getContentPosition:function(){var a=this.content.getBoundingClientRect();return{top:a.top,left:a.left}},_buildDOM:function(){var a=this.getContainer();a.innerHTML=z,this.content=document.createElement(s),this.content.style.position=t,this.content.style.display=u,this.content.className=v,a.appendChild(this.content),this.bufferCanvas=new Kinetic.SceneCanvas,this.hitCanvas=new Kinetic.HitCanvas,this._resizeDOM()},_onContent:function(a,b){var c,d,e=a.split(w),f=e.length;for(c=0;f>c;c++)d=e[c],this.content.addEventListener(d,b,!1)}}),Kinetic.Util.extend(Kinetic.Stage,Kinetic.Container),Kinetic.Node.addGetter(Kinetic.Stage,"container")}(),function(){var a="#";Kinetic.Util.addMethods(Kinetic.Layer,{_initLayer:function(a){this.nodeType="Layer",this.createAttrs(),this.canvas=new Kinetic.SceneCanvas,this.canvas.getElement().style.position="absolute",this.hitCanvas=new Kinetic.HitCanvas,Kinetic.Container.call(this,a)},getIntersection:function(){var b,c,d,e=Kinetic.Util._getXY(Array.prototype.slice.call(arguments));if(this.isVisible()&&this.isListening()){if(b=this.hitCanvas.context.getImageData(0|e.x,0|e.y,1,1).data,255===b[3])return c=Kinetic.Util._rgbToHex(b[0],b[1],b[2]),d=Kinetic.Global.shapes[a+c],{shape:d,pixel:b};if(b[0]>0||b[1]>0||b[2]>0||b[3]>0)return{pixel:b}}return null},drawScene:function(a){return a=a||this.getCanvas(),this.getClearBeforeDraw()&&a.clear(),Kinetic.Container.prototype.drawScene.call(this,a),this},drawHit:function(){var a=this.getLayer();return a&&a.getClearBeforeDraw()&&a.getHitCanvas().clear(),Kinetic.Container.prototype.drawHit.call(this),this},getCanvas:function(){return this.canvas},getHitCanvas:function(){return this.hitCanvas},getContext:function(){return this.getCanvas().getContext()},clear:function(){return this.getCanvas().clear(),this},setVisible:function(a){return Kinetic.Node.prototype.setVisible.call(this,a),a?(this.getCanvas().element.style.display="block",this.hitCanvas.element.style.display="block"):(this.getCanvas().element.style.display="none",this.hitCanvas.element.style.display="none"),this},setZIndex:function(a){Kinetic.Node.prototype.setZIndex.call(this,a);var b=this.getStage();return b&&(b.content.removeChild(this.getCanvas().element),a<b.getChildren().length-1?b.content.insertBefore(this.getCanvas().element,b.getChildren()[a+1].getCanvas().element):b.content.appendChild(this.getCanvas().element)),this},moveToTop:function(){Kinetic.Node.prototype.moveToTop.call(this);var a=this.getStage();a&&(a.content.removeChild(this.getCanvas().element),a.content.appendChild(this.getCanvas().element))},moveUp:function(){if(Kinetic.Node.prototype.moveUp.call(this)){var a=this.getStage();a&&(a.content.removeChild(this.getCanvas().element),this.index<a.getChildren().length-1?a.content.insertBefore(this.getCanvas().element,a.getChildren()[this.index+1].getCanvas().element):a.content.appendChild(this.getCanvas().element))}},moveDown:function(){if(Kinetic.Node.prototype.moveDown.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.getCanvas().element),a.content.insertBefore(this.getCanvas().element,b[this.index+1].getCanvas().element)}}},moveToBottom:function(){if(Kinetic.Node.prototype.moveToBottom.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.getCanvas().element),a.content.insertBefore(this.getCanvas().element,b[1].getCanvas().element)}}},getLayer:function(){return this},remove:function(){var a=this.getStage(),b=this.getCanvas(),c=b.element;return Kinetic.Node.prototype.remove.call(this),a&&b&&Kinetic.Util._isInDocument(c)&&a.content.removeChild(c),this}}),Kinetic.Util.extend(Kinetic.Layer,Kinetic.Container),Kinetic.Node.addGetterSetter(Kinetic.Layer,"clearBeforeDraw",!0)}(),function(){Kinetic.Util.addMethods(Kinetic.Group,{_initGroup:function(a){this.nodeType="Group",this.createAttrs(),Kinetic.Container.call(this,a)}}),Kinetic.Util.extend(Kinetic.Group,Kinetic.Container)}(),function(){Kinetic.Rect=function(a){this._initRect(a)},Kinetic.Rect.prototype={_initRect:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Rect",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getCornerRadius(),d=this.getWidth(),e=this.getHeight();b.beginPath(),c?(b.moveTo(c,0),b.lineTo(d-c,0),b.arc(d-c,c,c,3*Math.PI/2,0,!1),b.lineTo(d,e-c),b.arc(d-c,e-c,c,0,Math.PI/2,!1),b.lineTo(c,e),b.arc(c,e-c,c,Math.PI/2,Math.PI,!1),b.lineTo(0,c),b.arc(c,c,c,Math.PI,3*Math.PI/2,!1)):b.rect(0,0,d,e),b.closePath(),a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.Rect,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Rect,"cornerRadius",0)}(),function(){var a=2*Math.PI-1e-4,b="Circle";Kinetic.Circle=function(a){this._initCircle(a)},Kinetic.Circle.prototype={_initCircle:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className=b,this._setDrawFuncs()},drawFunc:function(b){var c=b.getContext();c.beginPath(),c.arc(0,0,this.getRadius(),0,a,!1),c.closePath(),b.fillStroke(this)},getWidth:function(){return 2*this.getRadius()},getHeight:function(){return 2*this.getRadius()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius(a/2)}},Kinetic.Util.extend(Kinetic.Circle,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Circle,"radius",0)}(),function(){var a=2*Math.PI-1e-4,b="Ellipse";Kinetic.Ellipse=function(a){this._initEllipse(a)},Kinetic.Ellipse.prototype={_initEllipse:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className=b,this._setDrawFuncs()},drawFunc:function(b){var c=b.getContext(),d=this.getRadius();c.beginPath(),c.save(),d.x!==d.y&&c.scale(1,d.y/d.x),c.arc(0,0,d.x,0,a,!1),c.restore(),c.closePath(),b.fillStroke(this)},getWidth:function(){return 2*this.getRadius().x},getHeight:function(){return 2*this.getRadius().y},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius({x:a/2})},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius({y:a/2})}},Kinetic.Util.extend(Kinetic.Ellipse,Kinetic.Shape),Kinetic.Node.addPointGetterSetter(Kinetic.Ellipse,"radius",0)}(),function(){Kinetic.Wedge=function(a){this._initWedge(a)},Kinetic.Wedge.prototype={_initWedge:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Wedge",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath(),b.arc(0,0,this.getRadius(),0,this.getAngle(),this.getClockwise()),b.lineTo(0,0),b.closePath(),a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.Wedge,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Wedge,"radius",0),Kinetic.Node.addRotationGetterSetter(Kinetic.Wedge,"angle",0),Kinetic.Node.addGetterSetter(Kinetic.Wedge,"clockwise",!1)}(),function(){var a="Image",b="crop",c="set";Kinetic.Image=function(a){this._initImage(a)},Kinetic.Image.prototype={_initImage:function(b){Kinetic.Shape.call(this,b),this.className=a,this._setDrawFuncs()},drawFunc:function(a){var b,c,d,e,f,g,h=this.getWidth(),i=this.getHeight(),j=this,k=a.getContext(),l=this.getCrop();this.getFilter()&&this._applyFilter&&(this.applyFilter(),this._applyFilter=!1),g=this.filterCanvas?this.filterCanvas.getElement():this.getImage(),k.beginPath(),k.rect(0,0,h,i),k.closePath(),a.fillStroke(this),g&&(l?(c=l.x||0,d=l.y||0,e=l.width||0,f=l.height||0,b=[g,c,d,e,f,0,0,h,i]):b=[g,0,0,h,i],this.hasShadow()?a.applyShadow(this,function(){j._drawImage(k,b)}):this._drawImage(k,b))},drawHitFunc:function(a){var b=this.getWidth(),c=this.getHeight(),d=this.imageHitRegion,e=a.getContext();d?(e.drawImage(d,0,0,b,c),e.beginPath(),e.rect(0,0,b,c),e.closePath(),a.stroke(this)):(e.beginPath(),e.rect(0,0,b,c),e.closePath(),a.fillStroke(this))},applyFilter:function(){var a,b,c,d=this.getImage(),e=this.getWidth(),f=this.getHeight(),g=this.getFilter();a=this.filterCanvas?this.filterCanvas:this.filterCanvas=new Kinetic.SceneCanvas({width:e,height:f}),b=a.getContext();try{this._drawImage(b,[d,0,0,e,f]),c=b.getImageData(0,0,a.getWidth(),a.getHeight()),g.call(this,c),b.putImageData(c,0,0)}catch(h){this.clearFilter(),Kinetic.Util.warn("Unable to apply filter. "+h.message)}},clearFilter:function(){this.filterCanvas=null,this._applyFilter=!1},setCrop:function(){var a=[].slice.call(arguments),c=Kinetic.Util._getXY(a),d=Kinetic.Util._getSize(a),e=Kinetic.Util._merge(c,d);this._setAttr(b,Kinetic.Util._merge(e,this.getCrop()))},createImageHitRegion:function(a){var b,c,d,e,f,g=this,h=this.getWidth(),i=this.getHeight(),j=new Kinetic.Canvas({width:h,height:i}),k=j.getContext(),l=this.getImage();k.drawImage(l,0,0);try{for(b=k.getImageData(0,0,h,i),c=b.data,d=Kinetic.Util._hexToRgb(this.colorKey),e=0,f=c.length;f>e;e+=4)c[e+3]>0&&(c[e]=d.r,c[e+1]=d.g,c[e+2]=d.b);Kinetic.Util._getImage(b,function(b){g.imageHitRegion=b,a&&a()})}catch(m){Kinetic.Util.warn("Unable to create image hit region. "+m.message)}},clearImageHitRegion:function(){delete this.imageHitRegion},getWidth:function(){var a=this.getImage();return this.attrs.width||(a?a.width:0)},getHeight:function(){var a=this.getImage();return this.attrs.height||(a?a.height:0)},_drawImage:function(a,b){5===b.length?a.drawImage(b[0],b[1],b[2],b[3],b[4]):9===b.length&&a.drawImage(b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7],b[8])}},Kinetic.Util.extend(Kinetic.Image,Kinetic.Shape),Kinetic.Node.addFilterGetterSetter=function(a,b,c){this.addGetter(a,b,c),this.addFilterSetter(a,b)},Kinetic.Node.addFilterSetter=function(a,b){var d=c+Kinetic.Util._capitalize(b);a.prototype[d]=function(a){this._setAttr(b,a),this._applyFilter=!0}},Kinetic.Node.addGetterSetter(Kinetic.Image,"image"),Kinetic.Node.addGetter(Kinetic.Image,"crop"),Kinetic.Node.addFilterGetterSetter(Kinetic.Image,"filter")}(),function(){Kinetic.Polygon=function(a){this._initPolygon(a)},Kinetic.Polygon.prototype={_initPolygon:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Polygon",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getPoints(),d=c.length;b.beginPath(),b.moveTo(c[0].x,c[0].y);for(var e=1;d>e;e++)b.lineTo(c[e].x,c[e].y);b.closePath(),a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.Polygon,Kinetic.Shape),Kinetic.Node.addPointsGetterSetter(Kinetic.Polygon,"points")}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}var c="auto",d="Calibri",e="canvas",f="center",g="Change.kinetic",h="2d",i="-",j="",k="left",l="text",m="Text",n="middle",o="normal",p="px ",q=" ",r="right",s="word",t="char",u="none",v=["fontFamily","fontSize","fontStyle","padding","align","lineHeight","text","width","height","wrap"],w=v.length,x=document.createElement(e).getContext(h);Kinetic.Text=function(a){this._initText(a)},Kinetic.Text.prototype={_initText:function(d){var e=this;this.createAttrs(),this.attrs.width=c,this.attrs.height=c,Kinetic.Shape.call(this,d),this._fillFunc=a,this._strokeFunc=b,this.className=m,this._setDrawFuncs();for(var f=0;w>f;f++)this.on(v[f]+g,e._setTextData);this._setTextData()},drawFunc:function(a){var b=a.getContext(),c=this.getPadding(),d=(this.getFontStyle(),this.getFontSize(),this.getFontFamily(),this.getTextHeight()),e=this.getLineHeight()*d,g=this.textArr,h=g.length,i=this.getWidth();b.font=this._getContextFont(),b.textBaseline=n,b.textAlign=k,b.save(),b.translate(c,0),b.translate(0,c+d/2);for(var j=0;h>j;j++){var l=g[j],m=l.text,o=l.width;b.save(),this.getAlign()===r?b.translate(i-o-2*c,0):this.getAlign()===f&&b.translate((i-o-2*c)/2,0),this.partialText=m,a.fillStroke(this),b.restore(),b.translate(0,e)}b.restore()},drawHitFunc:function(a){var b=a.getContext(),c=this.getWidth(),d=this.getHeight();b.beginPath(),b.rect(0,0,c,d),b.closePath(),a.fillStroke(this)},setText:function(a){var b=Kinetic.Util._isString(a)?a:a.toString();this._setAttr(l,b)},getWidth:function(){return this.attrs.width===c?this.getTextWidth()+2*this.getPadding():this.attrs.width},getHeight:function(){return this.attrs.height===c?this.getTextHeight()*this.textArr.length*this.getLineHeight()+2*this.getPadding():this.attrs.height},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},_getTextSize:function(a){var b,c=x,d=this.getFontSize();return c.save(),c.font=this._getContextFont(),b=c.measureText(a),c.restore(),{width:b.width,height:parseInt(d,10)}},_getContextFont:function(){return this.getFontStyle()+q+this.getFontSize()+p+this.getFontFamily()},_addTextLine:function(a,b){return this.textArr.push({text:a,width:b})},_getTextWidth:function(a){return x.measureText(a).width},_setTextData:function(){var a=this.getText().split("\n"),b=+this.getFontSize(),d=0,e=this.getLineHeight()*b,f=this.attrs.width,g=this.attrs.height,h=f!==c,j=g!==c,k=this.getPadding(),l=f-2*k,m=g-2*k,n=0,o=this.getWrap(),r=o!==u,s=o!==t&&r;this.textArr=[],x.save(),x.font=this.getFontStyle()+q+b+p+this.getFontFamily();for(var v=0,w=a.length;w>v;++v){var y=a[v],z=this._getTextWidth(y);if(h&&z>l)for(;y.length>0;){for(var A=0,B=y.length,C="",D=0;B>A;){var E=A+B>>>1,F=y.slice(0,E+1),G=this._getTextWidth(F);l>=G?(A=E+1,C=F,D=G):B=E}if(!C)break;if(s){var H=Math.max(C.lastIndexOf(q),C.lastIndexOf(i))+1;H>0&&(A=H,C=C.slice(0,A),D=this._getTextWidth(C))
}if(this._addTextLine(C,D),n+=e,!r||j&&n+e>m)break;if(y=y.slice(A),y.length>0&&(z=this._getTextWidth(y),l>=z)){this._addTextLine(y,z),n+=e;break}}else this._addTextLine(y,z),n+=e,d=Math.max(d,z);if(j&&n+e>m)break}x.restore(),this.textHeight=b,this.textWidth=d}},Kinetic.Util.extend(Kinetic.Text,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Text,"fontFamily",d),Kinetic.Node.addGetterSetter(Kinetic.Text,"fontSize",12),Kinetic.Node.addGetterSetter(Kinetic.Text,"fontStyle",o),Kinetic.Node.addGetterSetter(Kinetic.Text,"padding",0),Kinetic.Node.addGetterSetter(Kinetic.Text,"align",k),Kinetic.Node.addGetterSetter(Kinetic.Text,"lineHeight",1),Kinetic.Node.addGetterSetter(Kinetic.Text,"wrap",s),Kinetic.Node.addGetter(Kinetic.Text,l,j),Kinetic.Node.addSetter(Kinetic.Text,"width"),Kinetic.Node.addSetter(Kinetic.Text,"height")}(),function(){Kinetic.Line=function(a){this._initLine(a)},Kinetic.Line.prototype={_initLine:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Line",this._setDrawFuncs()},drawFunc:function(a){var b,c,d=this.getPoints(),e=d.length,f=a.getContext();for(f.beginPath(),f.moveTo(d[0].x,d[0].y),b=1;e>b;b++)c=d[b],f.lineTo(c.x,c.y);a.stroke(this)}},Kinetic.Util.extend(Kinetic.Line,Kinetic.Shape),Kinetic.Node.addPointsGetterSetter(Kinetic.Line,"points")}(),function(){Kinetic.Spline=function(a){this._initSpline(a)},Kinetic.Spline.prototype={_initSpline:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Spline",this._setDrawFuncs()},drawFunc:function(a){var b,c,d,e,f=this.getPoints(),g=f.length,h=a.getContext(),i=this.getTension();if(h.beginPath(),h.moveTo(f[0].x,f[0].y),0!==i&&g>2){for(b=this.allPoints,c=b.length,d=2,h.quadraticCurveTo(b[0].x,b[0].y,b[1].x,b[1].y);c-1>d;)h.bezierCurveTo(b[d].x,b[d++].y,b[d].x,b[d++].y,b[d].x,b[d++].y);h.quadraticCurveTo(b[c-1].x,b[c-1].y,f[g-1].x,f[g-1].y)}else for(d=1;g>d;d++)e=f[d],h.lineTo(e.x,e.y);a.stroke(this)},setTension:function(a){this._setAttr("tension",a),this._setAllPoints()},setPoints:function(a){Kinetic.Node.setPoints.call(this,a),this._setAllPoints()},_setAllPoints:function(){this.allPoints=Kinetic.Util._expandPoints(this.getPoints(),this.getTension())}},Kinetic.Util.extend(Kinetic.Spline,Kinetic.Shape),Kinetic.Node.addGetter(Kinetic.Spline,"tension",1),Kinetic.Node.addPointsGetter(Kinetic.Spline,"points")}(),function(){Kinetic.Blob=function(a){this._initBlob(a)},Kinetic.Blob.prototype={_initBlob:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Blob",this._setDrawFuncs()},drawFunc:function(a){var b,c,d,e,f=this.getPoints(),g=f.length,h=a.getContext(),i=this.getTension();if(h.beginPath(),h.moveTo(f[0].x,f[0].y),0!==i&&g>2)for(b=this.allPoints,c=b.length,d=0;c-1>d;)h.bezierCurveTo(b[d].x,b[d++].y,b[d].x,b[d++].y,b[d].x,b[d++].y);else for(d=1;g>d;d++)e=f[d],h.lineTo(e.x,e.y);h.closePath(),a.fillStroke(this)},setTension:function(a){this._setAttr("tension",a),this._setAllPoints()},setPoints:function(a){Kinetic.Node.setPoints.call(this,a),this._setAllPoints()},_setAllPoints:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=Kinetic.Util,e=d._getControlPoints(a[b-1],a[0],a[1],c),f=d._getControlPoints(a[b-2],a[b-1],a[0],c);this.allPoints=Kinetic.Util._expandPoints(this.getPoints(),this.getTension()),this.allPoints.unshift(e[1]),this.allPoints.push(f[0]),this.allPoints.push(a[b-1]),this.allPoints.push(f[1]),this.allPoints.push(e[0]),this.allPoints.push(a[0])}},Kinetic.Util.extend(Kinetic.Blob,Kinetic.Shape),Kinetic.Node.addGetter(Kinetic.Blob,"tension",1),Kinetic.Node.addPointsGetter(Kinetic.Blob,"points")}(),function(){Kinetic.Sprite=function(a){this._initSprite(a)},Kinetic.Sprite.prototype={_initSprite:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Sprite",this._setDrawFuncs(),this.anim=new Kinetic.Animation;var b=this;this.on("animationChange",function(){b.setIndex(0)})},drawFunc:function(a){var b=this.getAnimation(),c=this.getIndex(),d=this.getAnimations()[b][c],e=a.getContext(),f=this.getImage();f&&e.drawImage(f,d.x,d.y,d.width,d.height,0,0,d.width,d.height)},drawHitFunc:function(a){var b=this.getAnimation(),c=this.getIndex(),d=this.getAnimations()[b][c],e=a.getContext();e.beginPath(),e.rect(0,0,d.width,d.height),e.closePath(),a.fill(this)},start:function(){var a=this,b=this.getLayer();this.anim.setLayers(b),this.interval=setInterval(function(){var b=a.getIndex();a._updateIndex(),a.afterFrameFunc&&b===a.afterFrameIndex&&(a.afterFrameFunc(),delete a.afterFrameFunc,delete a.afterFrameIndex)},1e3/this.getFrameRate()),this.anim.start()},stop:function(){this.anim.stop(),clearInterval(this.interval)},afterFrame:function(a,b){this.afterFrameIndex=a,this.afterFrameFunc=b},_updateIndex:function(){var a=this.getIndex(),b=this.getAnimation(),c=this.getAnimations(),d=c[b],e=d.length;e-1>a?this.setIndex(a+1):this.setIndex(0)}},Kinetic.Util.extend(Kinetic.Sprite,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Sprite,"animation"),Kinetic.Node.addGetterSetter(Kinetic.Sprite,"animations"),Kinetic.Node.addGetterSetter(Kinetic.Sprite,"image"),Kinetic.Node.addGetterSetter(Kinetic.Sprite,"index",0),Kinetic.Node.addGetterSetter(Kinetic.Sprite,"frameRate",17)}(),function(){Kinetic.Path=function(a){this._initPath(a)},Kinetic.Path.prototype={_initPath:function(a){this.dataArray=[];var b=this;Kinetic.Shape.call(this,a),this.className="Path",this._setDrawFuncs(),this.dataArray=Kinetic.Path.parsePathData(this.getData()),this.on("dataChange",function(){b.dataArray=Kinetic.Path.parsePathData(this.getData())})},drawFunc:function(a){var b=this.dataArray,c=a.getContext();c.beginPath();for(var d=0;d<b.length;d++){var e=b[d].command,f=b[d].points;switch(e){case"L":c.lineTo(f[0],f[1]);break;case"M":c.moveTo(f[0],f[1]);break;case"C":c.bezierCurveTo(f[0],f[1],f[2],f[3],f[4],f[5]);break;case"Q":c.quadraticCurveTo(f[0],f[1],f[2],f[3]);break;case"A":var g=f[0],h=f[1],i=f[2],j=f[3],k=f[4],l=f[5],m=f[6],n=f[7],o=i>j?i:j,p=i>j?1:i/j,q=i>j?j/i:1;c.translate(g,h),c.rotate(m),c.scale(p,q),c.arc(0,0,o,k,k+l,1-n),c.scale(1/p,1/q),c.rotate(-m),c.translate(-g,-h);break;case"z":c.closePath()}}a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.Path,Kinetic.Shape),Kinetic.Path.getLineLength=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},Kinetic.Path.getPointOnLine=function(a,b,c,d,e,f,g){void 0===f&&(f=b),void 0===g&&(g=c);var h=(e-c)/(d-b+1e-8),i=Math.sqrt(a*a/(1+h*h));b>d&&(i*=-1);var j,k=h*i;if((g-c)/(f-b+1e-8)===h)j={x:f+i,y:g+k};else{var l,m,n=this.getLineLength(b,c,d,e);if(1e-8>n)return void 0;var o=(f-b)*(d-b)+(g-c)*(e-c);o/=n*n,l=b+o*(d-b),m=c+o*(e-c);var p=this.getLineLength(f,g,l,m),q=Math.sqrt(a*a-p*p);i=Math.sqrt(q*q/(1+h*h)),b>d&&(i*=-1),k=h*i,j={x:l+i,y:m+k}}return j},Kinetic.Path.getPointOnCubicBezier=function(a,b,c,d,e,f,g,h,i){function j(a){return a*a*a}function k(a){return 3*a*a*(1-a)}function l(a){return 3*a*(1-a)*(1-a)}function m(a){return(1-a)*(1-a)*(1-a)}var n=h*j(a)+f*k(a)+d*l(a)+b*m(a),o=i*j(a)+g*k(a)+e*l(a)+c*m(a);return{x:n,y:o}},Kinetic.Path.getPointOnQuadraticBezier=function(a,b,c,d,e,f,g){function h(a){return a*a}function i(a){return 2*a*(1-a)}function j(a){return(1-a)*(1-a)}var k=f*h(a)+d*i(a)+b*j(a),l=g*h(a)+e*i(a)+c*j(a);return{x:k,y:l}},Kinetic.Path.getPointOnEllipticalArc=function(a,b,c,d,e,f){var g=Math.cos(f),h=Math.sin(f),i={x:c*Math.cos(e),y:d*Math.sin(e)};return{x:a+(i.x*g-i.y*h),y:b+(i.x*h+i.y*g)}},Kinetic.Path.parsePathData=function(a){if(!a)return[];var b=a,c=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"];b=b.replace(new RegExp(" ","g"),",");for(var d=0;d<c.length;d++)b=b.replace(new RegExp(c[d],"g"),"|"+c[d]);for(var e=b.split("|"),f=[],g=0,h=0,d=1;d<e.length;d++){var i=e[d],j=i.charAt(0);i=i.slice(1),i=i.replace(new RegExp(",-","g"),"-"),i=i.replace(new RegExp("-","g"),",-"),i=i.replace(new RegExp("e,-","g"),"e-");var k=i.split(",");k.length>0&&""===k[0]&&k.shift();for(var l=0;l<k.length;l++)k[l]=parseFloat(k[l]);for(;k.length>0&&!isNaN(k[0]);){var m=null,n=[],o=g,p=h;switch(j){case"l":g+=k.shift(),h+=k.shift(),m="L",n.push(g,h);break;case"L":g=k.shift(),h=k.shift(),n.push(g,h);break;case"m":g+=k.shift(),h+=k.shift(),m="M",n.push(g,h),j="l";break;case"M":g=k.shift(),h=k.shift(),m="M",n.push(g,h),j="L";break;case"h":g+=k.shift(),m="L",n.push(g,h);break;case"H":g=k.shift(),m="L",n.push(g,h);break;case"v":h+=k.shift(),m="L",n.push(g,h);break;case"V":h=k.shift(),m="L",n.push(g,h);break;case"C":n.push(k.shift(),k.shift(),k.shift(),k.shift()),g=k.shift(),h=k.shift(),n.push(g,h);break;case"c":n.push(g+k.shift(),h+k.shift(),g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="C",n.push(g,h);break;case"S":var q=g,r=h,s=f[f.length-1];"C"===s.command&&(q=g+(g-s.points[2]),r=h+(h-s.points[3])),n.push(q,r,k.shift(),k.shift()),g=k.shift(),h=k.shift(),m="C",n.push(g,h);break;case"s":var q=g,r=h,s=f[f.length-1];"C"===s.command&&(q=g+(g-s.points[2]),r=h+(h-s.points[3])),n.push(q,r,g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="C",n.push(g,h);break;case"Q":n.push(k.shift(),k.shift()),g=k.shift(),h=k.shift(),n.push(g,h);break;case"q":n.push(g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="Q",n.push(g,h);break;case"T":var q=g,r=h,s=f[f.length-1];"Q"===s.command&&(q=g+(g-s.points[0]),r=h+(h-s.points[1])),g=k.shift(),h=k.shift(),m="Q",n.push(q,r,g,h);break;case"t":var q=g,r=h,s=f[f.length-1];"Q"===s.command&&(q=g+(g-s.points[0]),r=h+(h-s.points[1])),g+=k.shift(),h+=k.shift(),m="Q",n.push(q,r,g,h);break;case"A":var t=k.shift(),u=k.shift(),v=k.shift(),w=k.shift(),x=k.shift(),y=g,z=h;g=k.shift(),h=k.shift(),m="A",n=this.convertEndpointToCenterParameterization(y,z,g,h,w,x,t,u,v);break;case"a":var t=k.shift(),u=k.shift(),v=k.shift(),w=k.shift(),x=k.shift(),y=g,z=h;g+=k.shift(),h+=k.shift(),m="A",n=this.convertEndpointToCenterParameterization(y,z,g,h,w,x,t,u,v)}f.push({command:m||j,points:n,start:{x:o,y:p},pathLength:this.calcLength(o,p,m||j,n)})}("z"===j||"Z"===j)&&f.push({command:"z",points:[],start:void 0,pathLength:0})}return f},Kinetic.Path.calcLength=function(a,b,c,d){var e,f,g,h=Kinetic.Path;switch(c){case"L":return h.getLineLength(a,b,d[0],d[1]);case"C":for(e=0,f=h.getPointOnCubicBezier(0,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),t=.01;1>=t;t+=.01)g=h.getPointOnCubicBezier(t,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"Q":for(e=0,f=h.getPointOnQuadraticBezier(0,a,b,d[0],d[1],d[2],d[3]),t=.01;1>=t;t+=.01)g=h.getPointOnQuadraticBezier(t,a,b,d[0],d[1],d[2],d[3]),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"A":e=0;var i=d[4],j=d[5],k=d[4]+j,l=Math.PI/180;if(Math.abs(i-k)<l&&(l=Math.abs(i-k)),f=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],i,0),0>j)for(t=i-l;t>k;t-=l)g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],t,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;else for(t=i+l;k>t;t+=l)g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],t,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],k,0),e+=h.getLineLength(f.x,f.y,g.x,g.y)}return 0},Kinetic.Path.convertEndpointToCenterParameterization=function(a,b,c,d,e,f,g,h,i){var j=i*(Math.PI/180),k=Math.cos(j)*(a-c)/2+Math.sin(j)*(b-d)/2,l=-1*Math.sin(j)*(a-c)/2+Math.cos(j)*(b-d)/2,m=k*k/(g*g)+l*l/(h*h);m>1&&(g*=Math.sqrt(m),h*=Math.sqrt(m));var n=Math.sqrt((g*g*h*h-g*g*l*l-h*h*k*k)/(g*g*l*l+h*h*k*k));e==f&&(n*=-1),isNaN(n)&&(n=0);var o=n*g*l/h,p=n*-h*k/g,q=(a+c)/2+Math.cos(j)*o-Math.sin(j)*p,r=(b+d)/2+Math.sin(j)*o+Math.cos(j)*p,s=function(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1])},t=function(a,b){return(a[0]*b[0]+a[1]*b[1])/(s(a)*s(b))},u=function(a,b){return(a[0]*b[1]<a[1]*b[0]?-1:1)*Math.acos(t(a,b))},v=u([1,0],[(k-o)/g,(l-p)/h]),w=[(k-o)/g,(l-p)/h],x=[(-1*k-o)/g,(-1*l-p)/h],y=u(w,x);return t(w,x)<=-1&&(y=Math.PI),t(w,x)>=1&&(y=0),0===f&&y>0&&(y-=2*Math.PI),1==f&&0>y&&(y+=2*Math.PI),[q,r,g,h,v,y,j,f]},Kinetic.Node.addGetterSetter(Kinetic.Path,"data")}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}var c="",d="Calibri",e="normal";Kinetic.TextPath=function(a){this._initTextPath(a)},Kinetic.TextPath.prototype={_initTextPath:function(c){var d=this;this.createAttrs(),this.dummyCanvas=document.createElement("canvas"),this.dataArray=[],Kinetic.Shape.call(this,c),this._fillFunc=a,this._strokeFunc=b,this.className="TextPath",this._setDrawFuncs(),this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange",function(){d.dataArray=Kinetic.Path.parsePathData(this.attrs.data)});for(var e=["text","textStroke","textStrokeWidth"],f=0;f<e.length;f++){var g=e[f];this.on(g+"Change",d._setTextData)}d._setTextData()},drawFunc:function(a){var b=(this.charArr,a.getContext());b.font=this._getContextFont(),b.textBaseline="middle",b.textAlign="left",b.save();for(var c=this.glyphInfo,d=0;d<c.length;d++){b.save();var e=c[d].p0;c[d].p1,parseFloat(this.attrs.fontSize),b.translate(e.x,e.y),b.rotate(c[d].rotation),this.partialText=c[d].text,a.fillStroke(this),b.restore()}b.restore()},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},setText:function(a){Kinetic.Text.prototype.setText.call(this,a)},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext("2d");c.save(),c.font=this._getContextFont();var d=c.measureText(a);return c.restore(),{width:d.width,height:parseInt(this.attrs.fontSize,10)}},_setTextData:function(){var a=this,b=this._getTextSize(this.attrs.text);this.textWidth=b.width,this.textHeight=b.height,this.glyphInfo=[];for(var c,d,e,f=this.attrs.text.split(""),g=-1,h=0,i=function(){h=0;for(var b=a.dataArray,d=g+1;d<b.length;d++){if(b[d].pathLength>0)return g=d,b[d];"M"==b[d].command&&(c={x:b[d].points[0],y:b[d].points[1]})}return{}},j=function(b){var f=a._getTextSize(b).width,g=0,j=0;for(d=void 0;Math.abs(f-g)/f>.01&&25>j;){j++;for(var k=g;void 0===e;)e=i(),e&&k+e.pathLength<f&&(k+=e.pathLength,e=void 0);if(e==={}||void 0===c)return void 0;var l=!1;switch(e.command){case"L":Kinetic.Path.getLineLength(c.x,c.y,e.points[0],e.points[1])>f?d=Kinetic.Path.getPointOnLine(f,c.x,c.y,e.points[0],e.points[1],c.x,c.y):e=void 0;break;case"A":var m=e.points[4],n=e.points[5],o=e.points[4]+n;0===h?h=m+1e-8:f>g?h+=Math.PI/180*n/Math.abs(n):h-=Math.PI/360*n/Math.abs(n),Math.abs(h)>Math.abs(o)&&(h=o,l=!0),d=Kinetic.Path.getPointOnEllipticalArc(e.points[0],e.points[1],e.points[2],e.points[3],h,e.points[6]);break;case"C":0===h?h=f>e.pathLength?1e-8:f/e.pathLength:f>g?h+=(f-g)/e.pathLength:h-=(g-f)/e.pathLength,h>1&&(h=1,l=!0),d=Kinetic.Path.getPointOnCubicBezier(h,e.start.x,e.start.y,e.points[0],e.points[1],e.points[2],e.points[3],e.points[4],e.points[5]);break;case"Q":0===h?h=f/e.pathLength:f>g?h+=(f-g)/e.pathLength:h-=(g-f)/e.pathLength,h>1&&(h=1,l=!0),d=Kinetic.Path.getPointOnQuadraticBezier(h,e.start.x,e.start.y,e.points[0],e.points[1],e.points[2],e.points[3])}void 0!==d&&(g=Kinetic.Path.getLineLength(c.x,c.y,d.x,d.y)),l&&(l=!1,e=void 0)}},k=0;k<f.length&&(j(f[k]),void 0!==c&&void 0!==d);k++){var l=Kinetic.Path.getLineLength(c.x,c.y,d.x,d.y),m=0,n=Kinetic.Path.getPointOnLine(m+l/2,c.x,c.y,d.x,d.y),o=Math.atan2(d.y-c.y,d.x-c.x);this.glyphInfo.push({transposeX:n.x,transposeY:n.y,text:f[k],rotation:o,p0:c,p1:d}),c=d}}},Kinetic.TextPath.prototype._getContextFont=Kinetic.Text.prototype._getContextFont,Kinetic.Util.extend(Kinetic.TextPath,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.TextPath,"fontFamily",d),Kinetic.Node.addGetterSetter(Kinetic.TextPath,"fontSize",12),Kinetic.Node.addGetterSetter(Kinetic.TextPath,"fontStyle",e),Kinetic.Node.addGetter(Kinetic.TextPath,"text",c)}(),function(){Kinetic.RegularPolygon=function(a){this._initRegularPolygon(a)},Kinetic.RegularPolygon.prototype={_initRegularPolygon:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="RegularPolygon",this._setDrawFuncs()},drawFunc:function(a){var b,c,d,e=a.getContext(),f=this.attrs.sides,g=this.attrs.radius;for(e.beginPath(),e.moveTo(0,0-g),b=1;f>b;b++)c=g*Math.sin(2*b*Math.PI/f),d=-1*g*Math.cos(2*b*Math.PI/f),e.lineTo(c,d);e.closePath(),a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.RegularPolygon,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.RegularPolygon,"radius",0),Kinetic.Node.addGetterSetter(Kinetic.RegularPolygon,"sides",0)}(),function(){Kinetic.Star=function(a){this._initStar(a)},Kinetic.Star.prototype={_initStar:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Star",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.attrs.innerRadius,d=this.attrs.outerRadius,e=this.attrs.numPoints;b.beginPath(),b.moveTo(0,0-this.attrs.outerRadius);for(var f=1;2*e>f;f++){var g=0===f%2?d:c,h=g*Math.sin(f*Math.PI/e),i=-1*g*Math.cos(f*Math.PI/e);b.lineTo(h,i)}b.closePath(),a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.Star,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Star,"numPoints",0),Kinetic.Node.addGetterSetter(Kinetic.Star,"innerRadius",0),Kinetic.Node.addGetterSetter(Kinetic.Star,"outerRadius",0)}(),function(){var a=["fontFamily","fontSize","fontStyle","padding","lineHeight","text"],b="Change.kinetic",c="none",d="up",e="right",f="down",g="left",h="Label",i=a.length;Kinetic.Label=function(a){this._initLabel(a)},Kinetic.Label.prototype={_initLabel:function(a){var b=this;this.createAttrs(),this.className=h,Kinetic.Group.call(this,a),this.on("add",function(a){b._addListeners(a.child),b._sync()})},getText:function(){return this.get("Text")[0]},getTag:function(){return this.get("Tag")[0]},_addListeners:function(c){var d,e=this;for(d=0;i>d;d++)c.on(a[d]+b,function(){e._sync()})},getWidth:function(){return this.getText().getWidth()},getHeight:function(){return this.getText().getHeight()},_sync:function(){var a,b,c,h,i,j,k=this.getText(),l=this.getTag();if(k&&l){switch(a=k.getWidth(),b=k.getHeight(),c=l.getPointerDirection(),h=l.getPointerWidth(),pointerHeight=l.getPointerHeight(),i=0,j=0,c){case d:i=a/2,j=-1*pointerHeight;break;case e:i=a+h,j=b/2;break;case f:i=a/2,j=b+pointerHeight;break;case g:i=-1*h,j=b/2}l.setAttrs({x:-1*i,y:-1*j,width:a,height:b}),k.setAttrs({x:-1*i,y:-1*j})}}},Kinetic.Util.extend(Kinetic.Label,Kinetic.Group),Kinetic.Tag=function(a){this._initTag(a)},Kinetic.Tag.prototype={_initTag:function(a){this.createAttrs(),Kinetic.Shape.call(this,a),this.className="Tag",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getWidth(),h=this.getHeight(),i=this.getPointerDirection(),j=this.getPointerWidth(),k=this.getPointerHeight();this.getCornerRadius(),b.beginPath(),b.moveTo(0,0),i===d&&(b.lineTo((c-j)/2,0),b.lineTo(c/2,-1*k),b.lineTo((c+j)/2,0)),b.lineTo(c,0),i===e&&(b.lineTo(c,(h-k)/2),b.lineTo(c+j,h/2),b.lineTo(c,(h+k)/2)),b.lineTo(c,h),i===f&&(b.lineTo((c+j)/2,h),b.lineTo(c/2,h+k),b.lineTo((c-j)/2,h)),b.lineTo(0,h),i===g&&(b.lineTo(0,(h+k)/2),b.lineTo(-1*j,h/2),b.lineTo(0,(h-k)/2)),b.closePath(),a.fillStroke(this)}},Kinetic.Util.extend(Kinetic.Tag,Kinetic.Shape),Kinetic.Node.addGetterSetter(Kinetic.Tag,"pointerDirection",c),Kinetic.Node.addGetterSetter(Kinetic.Tag,"pointerWidth",0),Kinetic.Node.addGetterSetter(Kinetic.Tag,"pointerHeight",0),Kinetic.Node.addGetterSetter(Kinetic.Tag,"cornerRadius",0)}(),function(){Kinetic.Filters.Grayscale=function(a){for(var b=a.data,c=0;c<b.length;c+=4){var d=.34*b[c]+.5*b[c+1]+.16*b[c+2];b[c]=d,b[c+1]=d,b[c+2]=d}}}(),function(){Kinetic.Filters.Brighten=function(a){for(var b=this.getFilterBrightness(),c=a.data,d=0;d<c.length;d+=4)c[d]+=b,c[d+1]+=b,c[d+2]+=b},Kinetic.Node.addFilterGetterSetter(Kinetic.Image,"filterBrightness",0)}(),function(){Kinetic.Filters.Invert=function(a){for(var b=a.data,c=0;c<b.length;c+=4)b[c]=255-b[c],b[c+1]=255-b[c+1],b[c+2]=255-b[c+2]}}(),function(){function a(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}function b(b,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D=b.data,E=b.width,F=b.height,G=e+e+1,H=E-1,I=F-1,J=e+1,K=J*(J+1)/2,L=new a,M=L,N=null,O=null,P=c[e],Q=d[e];for(h=1;G>h;h++)if(M=M.next=new a,h==J)var R=M;for(M.next=L,l=k=0,g=0;F>g;g++){for(u=v=w=x=m=n=o=p=0,q=J*(y=D[k]),r=J*(z=D[k+1]),s=J*(A=D[k+2]),t=J*(B=D[k+3]),m+=K*y,n+=K*z,o+=K*A,p+=K*B,M=L,h=0;J>h;h++)M.r=y,M.g=z,M.b=A,M.a=B,M=M.next;for(h=1;J>h;h++)i=k+((h>H?H:h)<<2),m+=(M.r=y=D[i])*(C=J-h),n+=(M.g=z=D[i+1])*C,o+=(M.b=A=D[i+2])*C,p+=(M.a=B=D[i+3])*C,u+=y,v+=z,w+=A,x+=B,M=M.next;for(N=L,O=R,f=0;E>f;f++)D[k+3]=B=p*P>>Q,0!=B?(B=255/B,D[k]=(m*P>>Q)*B,D[k+1]=(n*P>>Q)*B,D[k+2]=(o*P>>Q)*B):D[k]=D[k+1]=D[k+2]=0,m-=q,n-=r,o-=s,p-=t,q-=N.r,r-=N.g,s-=N.b,t-=N.a,i=l+((i=f+e+1)<H?i:H)<<2,u+=N.r=D[i],v+=N.g=D[i+1],w+=N.b=D[i+2],x+=N.a=D[i+3],m+=u,n+=v,o+=w,p+=x,N=N.next,q+=y=O.r,r+=z=O.g,s+=A=O.b,t+=B=O.a,u-=y,v-=z,w-=A,x-=B,O=O.next,k+=4;l+=E}for(f=0;E>f;f++){for(v=w=x=u=n=o=p=m=0,k=f<<2,q=J*(y=D[k]),r=J*(z=D[k+1]),s=J*(A=D[k+2]),t=J*(B=D[k+3]),m+=K*y,n+=K*z,o+=K*A,p+=K*B,M=L,h=0;J>h;h++)M.r=y,M.g=z,M.b=A,M.a=B,M=M.next;for(j=E,h=1;e>=h;h++)k=j+f<<2,m+=(M.r=y=D[k])*(C=J-h),n+=(M.g=z=D[k+1])*C,o+=(M.b=A=D[k+2])*C,p+=(M.a=B=D[k+3])*C,u+=y,v+=z,w+=A,x+=B,M=M.next,I>h&&(j+=E);for(k=f,N=L,O=R,g=0;F>g;g++)i=k<<2,D[i+3]=B=p*P>>Q,B>0?(B=255/B,D[i]=(m*P>>Q)*B,D[i+1]=(n*P>>Q)*B,D[i+2]=(o*P>>Q)*B):D[i]=D[i+1]=D[i+2]=0,m-=q,n-=r,o-=s,p-=t,q-=N.r,r-=N.g,s-=N.b,t-=N.a,i=f+((i=g+J)<I?i:I)*E<<2,m+=u+=N.r=D[i],n+=v+=N.g=D[i+1],o+=w+=N.b=D[i+2],p+=x+=N.a=D[i+3],N=N.next,q+=y=O.r,r+=z=O.g,s+=A=O.b,t+=B=O.a,u-=y,v-=z,w-=A,x-=B,O=O.next,k+=E}}var c=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],d=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];Kinetic.Filters.Blur=function(a){var c=0|this.getFilterRadius();c>0&&b(a,c)},Kinetic.Node.addFilterGetterSetter(Kinetic.Image,"filterRadius",0)}(),function(){function a(a,b,c){var d=4*(c*a.width+b),e=[];return e.push(a.data[d++],a.data[d++],a.data[d++],a.data[d++]),e}function b(a,b){return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))}function c(a){for(var b=[0,0,0],c=0;c<a.length;c++)b[0]+=a[c][0],b[1]+=a[c][1],b[2]+=a[c][2];return b[0]/=a.length,b[1]/=a.length,b[2]/=a.length,b}function d(d,e){var f=a(d,0,0),g=a(d,d.width-1,0),h=a(d,0,d.height-1),i=a(d,d.width-1,d.height-1),j=e||10;if(b(f,g)<j&&b(g,i)<j&&b(i,h)<j&&b(h,f)<j){for(var k=c([g,f,i,h]),l=[],m=0;m<d.width*d.height;m++){var n=b(k,[d.data[4*m],d.data[4*m+1],d.data[4*m+2]]);l[m]=j>n?0:255}return l}}function e(a,b){for(var c=0;c<a.width*a.height;c++)a.data[4*c+3]=b[c]}function f(a,b,c){for(var d=[1,1,1,1,0,1,1,1,1],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=2040===k?255:0}return g}function g(a,b,c){for(var d=[1,1,1,1,1,1,1,1,1],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=k>=1020?255:0}return g}function h(a,b,c){for(var d=[1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=k}return g}Kinetic.Filters.Mask=function(a){var b=this.getFilterThreshold(),c=d(a,b);return c&&(c=f(c,a.width,a.height),c=g(c,a.width,a.height),c=h(c,a.width,a.height),e(a,c)),a},Kinetic.Node.addFilterGetterSetter(Kinetic.Image,"filterThreshold",0)}();
(function(window){

  var WORKER_PATH = '/js/recorderWorker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    // this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);

    this.node = (this.context.createScriptProcessor ||
                 this.context.createJavaScriptNode).call(this.context, bufferLen, 2, 2);

    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' })
    }

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    }

    source.connect(this.node);
    this.node.connect(this.context.destination);    //this should not be necessary
  };

  Recorder.forceDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent("Event");
    click.initEvent("click", true, true);
    link.dispatchEvent(click);
  }

  window.Recorder = Recorder;

})(window);
/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.1
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2013-04-08
 * @link    http://jscolor.com
 */



var jscolor = {


	dir : '/images/', // location of jscolor directory (leave empty to autodetect)
	bindClass : 'color', // class name
	binding : true, // automatic binding via <input class="...">
	preloading : true, // use image preloading?


	install : function() {
		jscolor.addEvent(window, 'load', jscolor.init);
	},


	init : function() {
		if(jscolor.binding) {
			jscolor.bind();
		}
		if(jscolor.preloading) {
			jscolor.preload();
		}
	},


	getDir : function() {
		if(!jscolor.dir) {
			var detected = jscolor.detectDir();
			jscolor.dir = detected!==false ? detected : 'jscolor/';
		}
		return jscolor.dir;
	},


	detectDir : function() {
		var base = location.href;

		var e = document.getElementsByTagName('base');
		for(var i=0; i<e.length; i+=1) {
			if(e[i].href) { base = e[i].href; }
		}

		var e = document.getElementsByTagName('script');
		for(var i=0; i<e.length; i+=1) {
			if(e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
				var src = new jscolor.URI(e[i].src);
				var srcAbs = src.toAbsolute(base);
				srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
				srcAbs.query = null;
				srcAbs.fragment = null;
				return srcAbs.toString();
			}
		}
		return false;
	},


	bind : function() {
		var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')\\s*(\\{[^}]*\\})?', 'i');
		var e = document.getElementsByTagName('input');
		for(var i=0; i<e.length; i+=1) {
			var m;
			if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if(m[3]) {
					try {
						prop = (new Function ('return (' + m[3] + ')'))();
					} catch(eInvalidProp) {}
				}
				e[i].color = new jscolor.color(e[i], prop);
			}
		}
	},


	preload : function() {
		for(var fn in jscolor.imgRequire) {
			if(jscolor.imgRequire.hasOwnProperty(fn)) {
				jscolor.loadImage(fn);
			}
		}
	},


	images : {
		pad : [ 181, 101 ],
		sld : [ 16, 101 ],
		cross : [ 15, 15 ],
		arrow : [ 7, 11 ]
	},


	imgRequire : {},
	imgLoaded : {},


	requireImage : function(filename) {
		jscolor.imgRequire[filename] = true;
	},


	loadImage : function(filename) {
		if(!jscolor.imgLoaded[filename]) {
			jscolor.imgLoaded[filename] = new Image();
			jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
		}
	},


	fetchElement : function(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	},


	addEvent : function(el, evnt, func) {
		if(el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if(el.attachEvent) {
			el.attachEvent('on'+evnt, func);
		}
	},


	fireEvent : function(el, evnt) {
		if(!el) {
			return;
		}
		if(document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if(document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on'+evnt, ev);
		} else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
			el['on'+evnt]();
		}
	},


	getElementPos : function(e) {
		var e1=e, e2=e;
		var x=0, y=0;
		if(e1.offsetParent) {
			do {
				x += e1.offsetLeft;
				y += e1.offsetTop;
			} while(e1 = e1.offsetParent);
		}
		while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
			x -= e2.scrollLeft;
			y -= e2.scrollTop;
		}
		return [x, y];
	},


	getElementSize : function(e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	getRelMousePos : function(e) {
		var x = 0, y = 0;
		if (!e) { e = window.event; }
		if (typeof e.offsetX === 'number') {
			x = e.offsetX;
			y = e.offsetY;
		} else if (typeof e.layerX === 'number') {
			x = e.layerX;
			y = e.layerY;
		}
		return { x: x, y: y };
	},


	getViewPos : function() {
		if(typeof window.pageYOffset === 'number') {
			return [window.pageXOffset, window.pageYOffset];
		} else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop];
		} else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		} else {
			return [0, 0];
		}
	},


	getViewSize : function() {
		if(typeof window.innerWidth === 'number') {
			return [window.innerWidth, window.innerHeight];
		} else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight];
		} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		} else {
			return [0, 0];
		}
	},


	URI : function(uri) { // See RFC3986

		this.scheme = null;
		this.authority = null;
		this.path = '';
		this.query = null;
		this.fragment = null;

		this.parse = function(uri) {
			var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = m[3] ? m[2] : null;
			this.authority = m[5] ? m[6] : null;
			this.path = m[7];
			this.query = m[9] ? m[10] : null;
			this.fragment = m[12] ? m[13] : null;
			return this;
		};

		this.toString = function() {
			var result = '';
			if(this.scheme !== null) { result = result + this.scheme + ':'; }
			if(this.authority !== null) { result = result + '//' + this.authority; }
			if(this.path !== null) { result = result + this.path; }
			if(this.query !== null) { result = result + '?' + this.query; }
			if(this.fragment !== null) { result = result + '#' + this.fragment; }
			return result;
		};

		this.toAbsolute = function(base) {
			var base = new jscolor.URI(base);
			var r = this;
			var t = new jscolor.URI;

			if(base.scheme === null) { return false; }

			if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
				r.scheme = null;
			}

			if(r.scheme !== null) {
				t.scheme = r.scheme;
				t.authority = r.authority;
				t.path = removeDotSegments(r.path);
				t.query = r.query;
			} else {
				if(r.authority !== null) {
					t.authority = r.authority;
					t.path = removeDotSegments(r.path);
					t.query = r.query;
				} else {
					if(r.path === '') {
						t.path = base.path;
						if(r.query !== null) {
							t.query = r.query;
						} else {
							t.query = base.query;
						}
					} else {
						if(r.path.substr(0,1) === '/') {
							t.path = removeDotSegments(r.path);
						} else {
							if(base.authority !== null && base.path === '') {
								t.path = '/'+r.path;
							} else {
								t.path = base.path.replace(/[^\/]+$/,'')+r.path;
							}
							t.path = removeDotSegments(t.path);
						}
						t.query = r.query;
					}
					t.authority = base.authority;
				}
				t.scheme = base.scheme;
			}
			t.fragment = r.fragment;

			return t;
		};

		function removeDotSegments(path) {
			var out = '';
			while(path) {
				if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
					path = path.replace(/^\.+/,'').substr(1);
				} else if(path.substr(0,3)==='/./' || path==='/.') {
					path = '/'+path.substr(3);
				} else if(path.substr(0,4)==='/../' || path==='/..') {
					path = '/'+path.substr(4);
					out = out.replace(/\/?[^\/]*$/, '');
				} else if(path==='.' || path==='..') {
					path = '';
				} else {
					var rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					out = out + rm;
				}
			}
			return out;
		}

		if(uri) {
			this.parse(uri);
		}

	},


	//
	// Usage example:
	// var myColor = new jscolor.color(myInputElement)
	//

	color : function(target, prop) {


		this.required = true; // refuse empty values?
		this.adjust = true; // adjust value to uniform notation?
		this.hash = false; // prefix color with # symbol?
		this.caps = true; // uppercase?
		this.slider = true; // show the value/saturation slider?
		this.valueElement = target; // value holder
		this.styleElement = target; // where to reflect current color
		this.onImmediateChange = null; // onchange callback (can be either string or function)
		this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
		this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1
		this.minH = 0; // read-only  0-6
		this.maxH = 6; // read-only  0-6
		this.minS = 0; // read-only  0-1
		this.maxS = 1; // read-only  0-1
		this.minV = 0; // read-only  0-1
		this.maxV = 1; // read-only  0-1

		this.pickerOnfocus = true; // display picker on focus?
		this.pickerMode = 'HSV'; // HSV | HVS
		this.pickerPosition = 'bottom'; // left | right | top | bottom
		this.pickerSmartPosition = true; // automatically adjust picker position when necessary
		this.pickerButtonHeight = 20; // px
		this.pickerClosable = false;
		this.pickerCloseText = 'Close';
		this.pickerButtonColor = 'ButtonText'; // px
		this.pickerFace = 10; // px
		this.pickerFaceColor = 'ThreeDFace'; // CSS color
		this.pickerBorder = 1; // px
		this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
		this.pickerInset = 1; // px
		this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
		this.pickerZIndex = 10000;


		for(var p in prop) {
			if(prop.hasOwnProperty(p)) {
				this[p] = prop[p];
			}
		}


		this.hidePicker = function() {
			if(isPickerOwner()) {
				removePicker();
			}
		};


		this.showPicker = function() {
			if(!isPickerOwner()) {
				var tp = jscolor.getElementPos(target); // target pos
				var ts = jscolor.getElementSize(target); // target size
				var vp = jscolor.getViewPos(); // view pos
				var vs = jscolor.getViewSize(); // view size
				var ps = getPickerDims(this); // picker size
				var a, b, c;
				switch(this.pickerPosition.toLowerCase()) {
					case 'left': a=1; b=0; c=-1; break;
					case 'right':a=1; b=0; c=1; break;
					case 'top':  a=0; b=1; c=-1; break;
					default:     a=0; b=1; c=1; break;
				}
				var l = (ts[b]+ps[b])/2;

				// picker pos
				if (!this.pickerSmartPosition) {
					var pp = [
						tp[a],
						tp[b]+ts[b]-l+l*c
					];
				} else {
					var pp = [
						-vp[a]+tp[a]+ps[a] > vs[a] ?
							(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
							tp[a],
						-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
							(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
							(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
					];
				}
				drawPicker(pp[a], pp[b]);
			}
		};


		this.importColor = function() {
			if(!valueElement) {
				this.exportColor();
			} else {
				if(!this.adjust) {
					if(!this.fromString(valueElement.value, leaveValue)) {
						styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
						styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
						styleElement.style.color = styleElement.jscStyle.color;
						this.exportColor(leaveValue | leaveStyle);
					}
				} else if(!this.required && /^\s*$/.test(valueElement.value)) {
					valueElement.value = '';
					styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
					styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
					styleElement.style.color = styleElement.jscStyle.color;
					this.exportColor(leaveValue | leaveStyle);

				} else if(this.fromString(valueElement.value)) {
					// OK
				} else {
					this.exportColor();
				}
			}
		};


		this.exportColor = function(flags) {
			if(!(flags & leaveValue) && valueElement) {
				var value = this.toString();
				if(this.caps) { value = value.toUpperCase(); }
				if(this.hash) { value = '#'+value; }
				valueElement.value = value;
			}
			if(!(flags & leaveStyle) && styleElement) {
				styleElement.style.backgroundImage = "none";
				styleElement.style.backgroundColor =
					'#'+this.toString();
				styleElement.style.color =
					0.213 * this.rgb[0] +
					0.715 * this.rgb[1] +
					0.072 * this.rgb[2]
					< 0.5 ? '#FFF' : '#000';
			}
			if(!(flags & leavePad) && isPickerOwner()) {
				redrawPad();
			}
			if(!(flags & leaveSld) && isPickerOwner()) {
				redrawSld();
			}
		};


		this.fromHSV = function(h, s, v, flags) { // null = don't change
			if(h !== null) { h = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, h)); }
			if(s !== null) { s = Math.max(0.0, this.minS, Math.min(1.0, this.maxS, s)); }
			if(v !== null) { v = Math.max(0.0, this.minV, Math.min(1.0, this.maxV, v)); }

			this.rgb = HSV_RGB(
				h===null ? this.hsv[0] : (this.hsv[0]=h),
				s===null ? this.hsv[1] : (this.hsv[1]=s),
				v===null ? this.hsv[2] : (this.hsv[2]=v)
			);

			this.exportColor(flags);
		};


		this.fromRGB = function(r, g, b, flags) { // null = don't change
			if(r !== null) { r = Math.max(0.0, Math.min(1.0, r)); }
			if(g !== null) { g = Math.max(0.0, Math.min(1.0, g)); }
			if(b !== null) { b = Math.max(0.0, Math.min(1.0, b)); }

			var hsv = RGB_HSV(
				r===null ? this.rgb[0] : r,
				g===null ? this.rgb[1] : g,
				b===null ? this.rgb[2] : b
			);
			if(hsv[0] !== null) {
				this.hsv[0] = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, hsv[0]));
			}
			if(hsv[2] !== 0) {
				this.hsv[1] = hsv[1]===null ? null : Math.max(0.0, this.minS, Math.min(1.0, this.maxS, hsv[1]));
			}
			this.hsv[2] = hsv[2]===null ? null : Math.max(0.0, this.minV, Math.min(1.0, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
			this.rgb[0] = rgb[0];
			this.rgb[1] = rgb[1];
			this.rgb[2] = rgb[2];

			this.exportColor(flags);
		};


		this.fromString = function(hex, flags) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if(!m) {
				return false;
			} else {
				if(m[1].length === 6) { // 6-char notation
					this.fromRGB(
						parseInt(m[1].substr(0,2),16) / 255,
						parseInt(m[1].substr(2,2),16) / 255,
						parseInt(m[1].substr(4,2),16) / 255,
						flags
					);
				} else { // 3-char notation
					this.fromRGB(
						parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
						parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
						parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
						flags
					);
				}
				return true;
			}
		};


		this.toString = function() {
			return (
				(0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
				(0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
			);
		};


		function RGB_HSV(r, g, b) {
			var n = Math.min(Math.min(r,g),b);
			var v = Math.max(Math.max(r,g),b);
			var m = v - n;
			if(m === 0) { return [ null, 0, v ]; }
			var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
			return [ h===6?0:h, m/v, v ];
		}


		function HSV_RGB(h, s, v) {
			if(h === null) { return [ v, v, v ]; }
			var i = Math.floor(h);
			var f = i%2 ? h-i : 1-(h-i);
			var m = v * (1 - s);
			var n = v * (1 - s*f);
			switch(i) {
				case 6:
				case 0: return [v,n,m];
				case 1: return [n,v,m];
				case 2: return [m,v,n];
				case 3: return [m,n,v];
				case 4: return [n,m,v];
				case 5: return [v,m,n];
			}
		}


		function removePicker() {
			delete jscolor.picker.owner;
			document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
		}


		function drawPicker(x, y) {
			if(!jscolor.picker) {
				jscolor.picker = {
					box : document.createElement('div'),
					boxB : document.createElement('div'),
					pad : document.createElement('div'),
					padB : document.createElement('div'),
					padM : document.createElement('div'),
					sld : document.createElement('div'),
					sldB : document.createElement('div'),
					sldM : document.createElement('div'),
					btn : document.createElement('div'),
					btnS : document.createElement('span'),
					btnT : document.createTextNode(THIS.pickerCloseText)
				};
				for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
					var seg = document.createElement('div');
					seg.style.height = segSize+'px';
					seg.style.fontSize = '1px';
					seg.style.lineHeight = '0';
					jscolor.picker.sld.appendChild(seg);
				}
				jscolor.picker.sldB.appendChild(jscolor.picker.sld);
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);
				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
				jscolor.picker.btn.appendChild(jscolor.picker.btnS);
				jscolor.picker.box.appendChild(jscolor.picker.btn);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
			}

			var p = jscolor.picker;

			// controls interaction
			p.box.onmouseup =
			p.box.onmouseout = function() { target.focus(); };
			p.box.onmousedown = function() { abortBlur=true; };
			p.box.onmousemove = function(e) {
				if (holdPad || holdSld) {
					holdPad && setPad(e);
					holdSld && setSld(e);
					if (document.selection) {
						document.selection.empty();
					} else if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					dispatchImmediateChange();
				}
			};
			if('ontouchstart' in window) { // if touch device
				p.box.addEventListener('touchmove', function(e) {
					var event={
						'offsetX': e.touches[0].pageX-touchOffset.X,
						'offsetY': e.touches[0].pageY-touchOffset.Y
					};
					if (holdPad || holdSld) {
						holdPad && setPad(event);
						holdSld && setSld(event);
						dispatchImmediateChange();
					}
					e.stopPropagation(); // prevent move "view" on broswer
					e.preventDefault(); // prevent Default - Android Fix (else android generated only 1-2 touchmove events)
				}, false);
			}
			p.padM.onmouseup =
			p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
			p.padM.onmousedown = function(e) {
				// if the slider is at the bottom, move it up
				switch(modeID) {
					case 0: if (THIS.hsv[2] === 0) { THIS.fromHSV(null, null, 1.0); }; break;
					case 1: if (THIS.hsv[1] === 0) { THIS.fromHSV(null, 1.0, null); }; break;
				}
				holdSld=false;
				holdPad=true;
				setPad(e);
				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.padM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}
			p.sldM.onmouseup =
			p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
			p.sldM.onmousedown = function(e) {
				holdPad=false;
				holdSld=true;
				setSld(e);
				dispatchImmediateChange();
			};
			if('ontouchstart' in window) {
				p.sldM.addEventListener('touchstart', function(e) {
					touchOffset={
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX':e.touches[0].pageX-touchOffset.X,
						'offsetY':e.touches[0].pageY-touchOffset.Y
					});
				});
			}

			// picker
			var dims = getPickerDims(THIS);
			p.box.style.width = dims[0] + 'px';
			p.box.style.height = dims[1] + 'px';

			// picker border
			p.boxB.style.position = 'absolute';
			p.boxB.style.clear = 'both';
			p.boxB.style.left = x+'px';
			p.boxB.style.top = y+'px';
			p.boxB.style.zIndex = THIS.pickerZIndex;
			p.boxB.style.border = THIS.pickerBorder+'px solid';
			p.boxB.style.borderColor = THIS.pickerBorderColor;
			p.boxB.style.background = THIS.pickerFaceColor;

			// pad image
			p.pad.style.width = jscolor.images.pad[0]+'px';
			p.pad.style.height = jscolor.images.pad[1]+'px';

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.pickerFace+'px';
			p.padB.style.top = THIS.pickerFace+'px';
			p.padB.style.border = THIS.pickerInset+'px solid';
			p.padB.style.borderColor = THIS.pickerInsetColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = '0';
			p.padM.style.top = '0';
			p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
			p.padM.style.height = p.box.style.height;
			p.padM.style.cursor = 'crosshair';

			// slider image
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = jscolor.images.sld[0]+'px';
			p.sld.style.height = jscolor.images.sld[1]+'px';

			// slider border
			p.sldB.style.display = THIS.slider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.right = THIS.pickerFace+'px';
			p.sldB.style.top = THIS.pickerFace+'px';
			p.sldB.style.border = THIS.pickerInset+'px solid';
			p.sldB.style.borderColor = THIS.pickerInsetColor;

			// slider mouse area
			p.sldM.style.display = THIS.slider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.right = '0';
			p.sldM.style.top = '0';
			p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
			p.sldM.style.height = p.box.style.height;
			try {
				p.sldM.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.sldM.style.cursor = 'hand';
			}

			// "close" button
			function setBtnBorder() {
				var insetColors = THIS.pickerInsetColor.split(/\s+/);
				var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = pickerOutsetColor;
			}
			p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
			p.btn.style.position = 'absolute';
			p.btn.style.left = THIS.pickerFace + 'px';
			p.btn.style.bottom = THIS.pickerFace + 'px';
			p.btn.style.padding = '0 15px';
			p.btn.style.height = '18px';
			p.btn.style.border = THIS.pickerInset + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.pickerButtonColor;
			p.btn.style.font = '12px sans-serif';
			p.btn.style.textAlign = 'center';
			try {
				p.btn.style.cursor = 'pointer';
			} catch(eOldIE) {
				p.btn.style.cursor = 'hand';
			}
			p.btn.onmousedown = function () {
				THIS.hidePicker();
			};
			p.btnS.style.lineHeight = p.btn.style.height;

			// load images in optimal order
			switch(modeID) {
				case 0: var padImg = 'hs.png'; break;
				case 1: var padImg = 'hv.png'; break;
			}
			p.padM.style.backgroundImage = "url('"+jscolor.getDir()+"cross.gif')";
			p.padM.style.backgroundRepeat = "no-repeat";
			p.sldM.style.backgroundImage = "url('"+jscolor.getDir()+"arrow.gif')";
			p.sldM.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundImage = "url('"+jscolor.getDir()+padImg+"')";
			p.pad.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundPosition = "0 0";

			// place pointers
			redrawPad();
			redrawSld();

			jscolor.picker.owner = THIS;
			document.getElementsByTagName('body')[0].appendChild(p.boxB);
		}


		function getPickerDims(o) {
			var dims = [
				2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[0] +
					(o.slider ? 2*o.pickerInset + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] : 0),
				o.pickerClosable ?
					4*o.pickerInset + 3*o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight :
					2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[1]
			];
			return dims;
		}


		function redrawPad() {
			// redraw the pad pointer
			switch(modeID) {
				case 0: var yComponent = 1; break;
				case 1: var yComponent = 2; break;
			}
			var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
			jscolor.picker.padM.style.backgroundPosition =
				(THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
				(THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

			// redraw the slider image
			var seg = jscolor.picker.sld.childNodes;

			switch(modeID) {
				case 0:
					var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
					for(var i=0; i<seg.length; i+=1) {
						seg[i].style.backgroundColor = 'rgb('+
							(rgb[0]*(1-i/seg.length)*100)+'%,'+
							(rgb[1]*(1-i/seg.length)*100)+'%,'+
							(rgb[2]*(1-i/seg.length)*100)+'%)';
					}
					break;
				case 1:
					var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
					var i = Math.floor(THIS.hsv[0]);
					var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
					switch(i) {
						case 6:
						case 0: rgb=[0,1,2]; break;
						case 1: rgb=[1,0,2]; break;
						case 2: rgb=[2,0,1]; break;
						case 3: rgb=[2,1,0]; break;
						case 4: rgb=[1,2,0]; break;
						case 5: rgb=[0,2,1]; break;
					}
					for(var i=0; i<seg.length; i+=1) {
						s = 1 - 1/(seg.length-1)*i;
						c[1] = c[0] * (1 - s*f);
						c[2] = c[0] * (1 - s);
						seg[i].style.backgroundColor = 'rgb('+
							(c[rgb[0]]*100)+'%,'+
							(c[rgb[1]]*100)+'%,'+
							(c[rgb[2]]*100)+'%)';
					}
					break;
			}
		}


		function redrawSld() {
			// redraw the slider pointer
			switch(modeID) {
				case 0: var yComponent = 2; break;
				case 1: var yComponent = 1; break;
			}
			var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
			jscolor.picker.sldM.style.backgroundPosition =
				'0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
		}


		function isPickerOwner() {
			return jscolor.picker && jscolor.picker.owner === THIS;
		}


		function blurTarget() {
			if(valueElement === target) {
				THIS.importColor();
			}
			if(THIS.pickerOnfocus) {
				THIS.hidePicker();
			}
		}


		function blurValue() {
			if(valueElement !== target) {
				THIS.importColor();
			}
		}


		function setPad(e) {
			var mpos = jscolor.getRelMousePos(e);
			var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch(modeID) {
				case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
				case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
			}
		}


		function setSld(e) {
			var mpos = jscolor.getRelMousePos(e);
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch(modeID) {
				case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
				case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
			}
		}


		function dispatchImmediateChange() {
			if (THIS.onImmediateChange) {
				var callback;
				if (typeof THIS.onImmediateChange === 'string') {
					callback = new Function (THIS.onImmediateChange);
				} else {
					callback = THIS.onImmediateChange;
				}
				callback.call(THIS);
			}
		}


		var THIS = this;
		var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
		var abortBlur = false;
		var
			valueElement = jscolor.fetchElement(this.valueElement),
			styleElement = jscolor.fetchElement(this.styleElement);
		var
			holdPad = false,
			holdSld = false,
			touchOffset = {};
		var
			leaveValue = 1<<0,
			leaveStyle = 1<<1,
			leavePad = 1<<2,
			leaveSld = 1<<3;

		// target
		jscolor.addEvent(target, 'focus', function() {
			if(THIS.pickerOnfocus) { THIS.showPicker(); }
		});
		jscolor.addEvent(target, 'blur', function() {
			if(!abortBlur) {
				window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
			} else {
				abortBlur = false;
			}
		});

		// valueElement
		if(valueElement) {
			var updateField = function() {
				THIS.fromString(valueElement.value, leaveValue);
				dispatchImmediateChange();
			};
			jscolor.addEvent(valueElement, 'keyup', updateField);
			jscolor.addEvent(valueElement, 'input', updateField);
			jscolor.addEvent(valueElement, 'blur', blurValue);
			valueElement.setAttribute('autocomplete', 'off');
		}

		// styleElement
		if(styleElement) {
			styleElement.jscStyle = {
				backgroundImage : styleElement.style.backgroundImage,
				backgroundColor : styleElement.style.backgroundColor,
				color : styleElement.style.color
			};
		}

		// require images
		switch(modeID) {
			case 0: jscolor.requireImage('hs.png'); break;
			case 1: jscolor.requireImage('hv.png'); break;
		}
		jscolor.requireImage('cross.gif');
		jscolor.requireImage('arrow.gif');

		this.importColor();
	}

};


jscolor.install();
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37775884-1']);
_gaq.push(['_setDomainName', 'jenniferdewalt.com']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
function algaeTank() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 550,
		w = 900,
		cell_size = 10,
		cells = [],
		animation = null;

	canvas.height = h;
	canvas.width = w;

	function Cell(x, y) {
		this.x = x;
		this.y = y;
		this.state = 'dead';

		this.draw = function () {
			ctx.beginPath();

			if (this.state == 'alive') {
				ctx.fillStyle = '#1bbd61';
			} else {
				ctx.fillStyle = '#e8effa'
			}

			ctx.strokeStyle = '#d3e0f5';
			ctx.fillRect(this.x, this.y, cell_size, cell_size);
			ctx.strokeRect(this.x, this.y, cell_size, cell_size);
			ctx.closePath();
		}
	};

	function init() {
		var pos_x = 0;
		var pos_y = 0;

		for (var i = 0; i < h * w / Math.pow(cell_size, 2); i++) {
			cells.push(new Cell(pos_x, pos_y));

			pos_x += cell_size;
			if (pos_x % w / cell_size == 0) {
				pos_x = 0;
				pos_y += cell_size;
			}
		}

		_.each(cells, function (cell) {
			cell.draw();
		});

		$('#run').removeClass('disable').addClass('start');

		$('#run').on('click', function () {
			$('#run').removeClass('start').addClass('disable');
			evolveGame();
			$('#run').off();
		});
	};

	function evolveGame() {
		var new_cells = [];

		_.each(cells, function (cell, i) {
			var neighbors = getNeighbors(cell.x, i);
			var new_cell = $.extend({}, cell, new_cell);
			var live_neighbors = 0;

			_.each(neighbors, function (neighbor) {
				if (neighbor.state == 'alive') {
					live_neighbors += 1;
				}
			});

			if (new_cell.state == 'alive') {
				if (live_neighbors < 2 || live_neighbors > 3) {
					new_cell.state = 'dead';
				}
			} else {
				if (live_neighbors == 3) {
					new_cell.state = 'alive';
				}
			}

			new_cells.push(new_cell);

		});

		cells = new_cells;

		animation = setTimeout(paintScreen, 40);
	};

	function getNeighbors(x, index) {
		var neighbors = [cells[index + 1], cells[index - 1], 									//right, left
						 cells[index + w / cell_size], cells[index - w / cell_size],			//bottom, top
						 cells[index + w / cell_size + 1], cells[index - w / cell_size + 1],	//bottom right, top right
						 cells[index + w / cell_size - 1], cells[index - w / cell_size - 1]];	//bottom left, top left

		if(x == 0) {
			neighbors[1] = undefined;
			neighbors[6] = undefined;
			neighbors[7] = undefined;
		} else if (x == w - cell_size) {
			neighbors[0] = undefined;
			neighbors[4] = undefined;
			neighbors[5] = undefined;
		}

		neighbors = _.reject(neighbors, function (neighbor) {
			return neighbor == undefined;
		});

		return neighbors;
	};

	function paintScreen() {
		ctx.clearRect(0,0,w,h);

		_.each(cells, function (cell) {
			cell.draw();
		});

		evolveGame();
	};

	function selectCell(x, y) {
		_.each(cells, function (cell) {
			if (x > cell.x && x < cell.x + cell_size && 
				y > cell.y && y < cell.y + cell_size ) {
				cell.state = 'alive';

				cell.draw();
			}
		});
	};

	init();

	$('body').on('mousedown', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		selectCell(x, y);

		$('canvas').on('mousemove', function (e) {
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;

			selectCell(x, y);
		});

		$('body').on('mouseup', function () {
			$('canvas').off();
		});
	});

	$('.reset').on('click', function () {
		clearTimeout(animation);
		cells = [];
		init();
	});

	$('body').disableSelection();
};









function assault() {
	var salt = $('#salt');
	var battery = $('#battery');
	var grains = 0;
	var timeout;

	salt.shaking = false;

	salt.on('click', function () {
		if (!salt.shaking) {
			salt.shaking = true;
			rotateImg(0, 180, salt, startShakeSalt);			
		} else {
			salt.shaking = false;
			stopShakeSalt();			
		}
	});

	battery.on('click', function () {
		battery.addClass('battery_shake');
		fireUpBattery(0);
	});

	function rotateImg(start, finish, elm, callback) {
		$({deg: start}).animate({deg: finish}, {
	        duration: 800,
	        step: function(now) {
	            elm.css({
	                transform: 'rotate(' + now + 'deg)'
	            }); 

	            if (now == finish && callback) {
	            	callback();
	            }           
	        }
	    });
	}

	function startShakeSalt() {
	 	salt.addClass('salt_shake');
	 	makeSaltGrains();
	}

	function stopShakeSalt() {
		salt.shaking = false;
	 	salt.removeClass('salt_shake');
		rotateImg(180, 0, salt);
	 	clearTimeout(timeout);
	 	$('#grains').html('');
	 	grains = 0;
	}

	function makeSaltGrains() {
		$('<div>', {
			class: 'grain'
		}).css({
			left: randomInt(130, 170)
		}).animate({
			bottom: -200,
			opacity: 0
		}).appendTo('#grains');

		grains += 1;

		if (salt.shaking && grains < 300) {
			timeout = setTimeout(makeSaltGrains, 15);
		} else {
			stopShakeSalt();
			clearTimeout(timeout);
		} 
	}

	function fireUpBattery(times) {
		var color = randomColorRGB();
		$('body').css('background-color', 'rgb(' + color + ')');

		$('#lightning').css({
			top: randomInt(-400, 200),
			left: randomInt(-300, 300),
		}).show();

		if (times < 12) {
			setTimeout(function () {
				fireUpBattery(times += 1);
			}, 30);
		} else {
			$('body').css('background-color', '#cc0000');
			battery.removeClass('battery_shake');
			$('#lightning').hide();
		}
	}
}
;
function audioGarden() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var notes = [];
	var beats = [];
	var stationary = true;
	var gardenData = $('canvas').data('garden');
	var sound_names = [ { name: 'ukulele_gsharp1', color: '255, 158, 0' },
						{ name: 'ukulele_b2', color: '255, 251, 0' },
						{ name: 'ukulele_asharp2', color: '2178, 255, 0' },
						{ name: 'ukulele_a2', color: '0, 255, 46' },
						{ name: 'ukulele_dsharp1', color: '96, 13, 122' },
						{ name: 'ukulele_d1', color: '0, 255, 159' },
						{ name: 'ukulele_e1', color: '0, 238, 255' },
						{ name: 'ukulele_csharp1', color: '0, 153, 255' },
						{ name: 'ukulele_c2', color: '14, 0, 255' },
						{ name: 'ukulele_f1', color: '99, 0, 255' },
						{ name: 'ukulele_g1', color: '179, 0, 255' },
						{ name: 'ukulele_fsharp1', color: '255, 0, 162' },
						{ name: 'ukulele_c1', color: '255, 0, 50' }];

	canvas.height = height;
	canvas.width = width;

	function Beat(x, y, radius) {
		this.x = Number(x);
		this.y = Number(y);
		this.radius = Number(radius);
		this.playing = false;

		this.draw = function () {
			if (this.playing) {
				this.opacity = 1;
				ctx.shadowBlur = 30;
				ctx.shadowColor = 'rgba(' + this.playing + ', 1)';
				ctx.strokeStyle = 'rgba(' + this.playing + ', 1)';
			} else {
				this.opacity = 0.5;
				ctx.shadowBlur = 0;
				ctx.shadowColor = 'none';
				ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			}
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.closePath();

			this.radius += 1;

			var d = getPointsOnCircle(this.x, this.y, canvas.width, canvas.height);
			if (d < this.radius) {
				this.radius = 0;
			}		
		}
	}

	function Note(x, y, sound_name, color) {
		this.x = Number(x);
		this.y = Number(y);
		this.color = color;
		this.sound_name = sound_name;
		this.radius = 15;
		this.opacity = 0.5;
		this.playing = false;
		this.sound = new Howl ({
			urls: ["/assets/" + this.sound_name + '.mp3', "/assets/" + this.sound_name + '.ogg'],
			volume: 0.5
		});

		this.draw = function () {
			if (this.playing) {
				ctx.shadowBlur = 14;
				ctx.shadowColor = 'rgba(' + this.color + ', 1)';
				this.opacity = 1;
			} else {
				ctx.shadowBlur = 0;
				ctx.shadowColor = 'none';
				this.opacity = 0.5;
			}
			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + this.color + ',' + this.opacity + ')';
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			checkBeats(this);
		};

		this.drag = function (x, y) {
			this.x = x;
			this.y = y;
		};

		function checkBeats(note) {
			_.each(beats, function(beat) {
				var d = getPointsOnCircle(beat.x, beat.y, note.x, note.y);
				if (Math.round(d) == beat.radius) {
					note.sound.play();
					note.playing = true;
					beat.playing = note.color;

					setTimeout(function () {
						note.playing = false;
						beat.playing = false;
					}, 160);
				}
			});
		}
	}

	function saveGarden() {
		var beatsArgs = _.map(beats, function (beat) {
			return {
				x: beat.x,
				y: beat.y,
				radius: beat.radius
			};
		});

		var notesArgs = _.map(notes, function (note) {
			return {
				x: note.x,
				y: note.y,
				sound_name: note.sound_name,
				color: note.color
			};
		});

		var params = {
			beats: beatsArgs,
			notes: notesArgs,
			width: canvas.width,
			height: canvas.height
		}

		$.ajax({
			url: "/audio_garden/gardens",
			type: "POST",
			data: {garden: params},
			dataType: 'json',
			success: function (data) {
				window.location = '/audio_garden/gardens/' + data;
			},
			error: function (xhr, status) {
				alert('There was a problem with your request. Please try again.');
			}
		});
	}

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		_.each(beats, function (beat) {
			beat.draw();
		});

		_.each(notes, function (note) {
			note.draw();
		});
		setTimeout(paintScreen, 10);
	}

	function getPointsOnCircle(cx, cy, px, py) {
		return Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
	}

	if (gardenData) {
		var notes_data = gardenData.notes;
		var beats_data = gardenData.beats;

		canvas.width = gardenData.width;
		canvas.height = gardenData.height;

		_.each(notes_data, function (note) {
			notes.push(new Note(note.x, note.y, note.sound_name, note.color));
		});
		_.each(beats_data, function (beat) {
			beats.push(new Beat(beat.x, beat.y, beat.radius));
		});

		paintScreen();
	} else {
		var sound = sound_names[randomInt(0, sound_names.length - 1)];
		beats.push(new Beat(canvas.width / 2, canvas.height / 2, 0));
		notes.push(new Note(randomInt(30, canvas.width - 30), randomInt(30, canvas.height - 30), sound.name, sound.color));
		paintScreen();

		$('canvas').on('mousedown', function (e) {
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;

			var grabbed_note = _.find(notes, function (note) {
				var d = getPointsOnCircle(note.x, note.y, x, y);
				return d < note.radius;
			});
			stationary = true;

			if (grabbed_note) {
				stationary = false;

				if (e.shiftKey) {
					notes = _.reject(notes, function (note) {
						var d = getPointsOnCircle(note.x, note.y, x, y);
						return d < note.radius;
					});
				} else {
					$('canvas').on('mousemove', function (e) {
						var x = e.pageX - canvas.offsetLeft;
						var y = e.pageY - canvas.offsetTop;

						grabbed_note.drag(x, y);
					});

					$('canvas').on('mouseup', function () {
						$('canvas').off('mousemove');
					});
				}
			}
		});

		$('canvas').on('click', function (e) {
			if (stationary) {
				var x = e.pageX - canvas.offsetLeft;
				var y = e.pageY - canvas.offsetTop;

				var sound = sound_names[randomInt(0, sound_names.length - 1)];

				notes.push(new Note(x, y, sound.name, sound.color));
			}
		});

		$('canvas').on('contextmenu', function (e) {
			e.preventDefault();
			beats.push(new Beat(canvas.width / 2, canvas.height / 2, 0));
		});

		$('.reset').on('click', function () {
			beats = [];
			notes = [];
			beats.push(new Beat(canvas.width / 2, canvas.height / 2, 0));
		});

		$('.save').on('click', function () {
			saveGarden();
		});
		
		$('body').disableSelection();
	}


}
;
function audioRecorder() {
	var audio_context;
	var recorder;
	var title = 'my_recording.wav'

	init();

	$('#start').on('click', function (e) {
		startRecording();
		updateTitle();
	});

	$('#stop').on('click', function (e) {
		stopRecording();
	});

	function init() {
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			window.URL = window.URL || window.webkitURL;

			audio_context = new AudioContext;

			if (navigator.getUserMedia) {
				navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
					alert('This app requires access to your microphone.');
				});
			} else {
				showReplacementPage();
			}
		} catch (e) {
			showReplacementPage();
		}
	}

	function updateTitle() {
		var new_title = $.trim($('#title_input').val());

		if (new_title) {
			title = new_title + '.wav';
		}
	}

	function showReplacementPage() {
		$('#container').html('');
		$('#replacement_container').show();
	}

	function startUserMedia(stream) {
		var input = audio_context.createMediaStreamSource(stream);

		input.connect(audio_context.destination);

		recorder = new Recorder(input);

		$('#start').attr('disabled', false);
	}

	function startRecording() {
		recorder && recorder.record();
		$('#start').attr('disabled', true);
		$('#stop').attr('disabled', false);

		$('.rec_light_bulb').addClass('recording');
	}

	function stopRecording() {
		recorder && recorder.stop();
		$('#stop').attr('disabled', true);
		$('#start').attr('disabled', false);
		$('.rec_light_bulb').removeClass('recording');

		createDownloadLink();
	}

	function createDownloadLink() {
		recorder && recorder.exportWAV(function (blob) {
			var url = URL.createObjectURL(blob);
			var li = document.createElement('li');
			var audio = document.createElement('audio');
			var sound_title = document.createElement('p');
			var anchor = document.createElement('a');
			var list = document.getElementById('recordings_list');

			audio.controls = true;
			audio.src = url;
			sound_title.innerHTML = title;
			anchor.href = url;
			anchor.className = 'btn';
			anchor.download = title;
			anchor.innerHTML = 'Download';
			li.appendChild(audio);
			li.appendChild(sound_title);
			li.appendChild(anchor);
			list.appendChild(li);
		});

		recorder.clear();
	}
}










;
function balloon() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var acceleration = -2.5;
	var damper = 0.6;
	var friction = 0.06;

	var stage = new Kinetic.Stage({
		container: 'container',
		width: width,
		height: height
	});

	var layer = new Kinetic.Layer();
	var image = new Image();
	
	image.onload = function() {
		var balloon_w = image.width;
		var balloon_h = image.height;
        var balloon = new Kinetic.Image({
          x: width / 4,
          y: height / 2,
          image: image,
          width: balloon_w,
          height: balloon_h,
          draggable: true
        });

        balloon.vx = 2;
        balloon.vy = 0;
	
		balloon.createImageHitRegion(function () {
        	layer.draw();
        });

        layer.add(balloon);
        stage.add(layer);

        balloon.on("dragstart", function(){
            balloon.vx = 0;
            balloon.vy = 0;
        });

        balloon.on("mouseover", function(){
            document.body.style.cursor = "pointer";
        });

        balloon.on("mouseout", function(){
            document.body.style.cursor = "default";
        });

        var date = new Date();
        var time = date.getTime();
        animate(time, balloon);
    };

    function animate(last_time, balloon) {
    	var date = new Date();
        var time = date.getTime();
        var delta_time = time - last_time;

        layer.draw();

        evolveBalloon(delta_time, balloon);

        requestAnimFrame(function () {
        	animate(time, balloon);
        });
    }

    function evolveBalloon(delta_time, balloon) {
    	var balloon_x = balloon.getX();
    	var balloon_y = balloon.getY();
    	var mouse = stage.getMousePosition();

    	if (balloon.isDragging()) {
    		if (mouse) {
    			var mouse_y = mouse.y;
    			var mouse_x = mouse.x;

    			balloon.vx = friction * (mouse_x - balloon.last_mouse_x);
    			balloon.vy = friction * (mouse_y - balloon.last_mouse_y);
    			balloon.last_mouse_x = mouse_x;
    			balloon.last_mouse_y = mouse_y;
    		}
    	} else {
    		balloon.vy += acceleration * delta_time / 1000;
    		balloon.setX(balloon_x + balloon.vx);
    		balloon.setY(balloon_y + balloon.vy);

    		if (balloon_x < 0) {
    			balloon.setX(0);
    			balloon.vx *= -1 * damper;
    		}
    		if (balloon_x > width - balloon.getWidth()) {
    			balloon.setX(width - balloon.getWidth());
    			balloon.vx *= -1 * damper;
    		}

    		if (balloon_y < 0) {
    			balloon.setY(0);
    			balloon.vy *= -1 * damper;
    			balloon.vx *= damper / 1.3;
    		}

    		if (balloon_y > height - balloon.getHeight()) {
    			balloon.setY(height - balloon.getHeight());
    			balloon.vy *= -1 * damper;
    		}
    	}
    }

    image.src = '/assets/blue_balloon.png';
}
;
function boomPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');

	var part_canvas = $('canvas')[1];
	var part_ctx = canvas.getContext('2d');

	var window_height = window.innerHeight;
	var window_width = window.innerWidth;
	var frames = [];
	var time_interval = 40;
	var mouse = {};
	var scale_adjust = 300;

	var particles = [];
	var	color = '#ebf9ff';
	var	part_time_interval = 10;
	var	acceleration = 0.0001;

	var bells = new Howl({
		urls: ['/assets/bells.mp3', '/assets/bells.ogg'],
		volume: 0.5
	});
	var boom = new Howl({
		urls: ['/assets/boom.mp3', '/assets/boom.ogg'],
		volume: 0.75
	});
	
	canvas.height = window_height;
	canvas.width = window_width;	
	part_canvas.height = window_height;
	part_canvas.width = window_width;

	function Frame(width, height, scale) {
		this.orig_width = this.width = width;
		this.orig_height = this.height = height;

		this.x = (canvas.width - width) / 2;
		this.y = (canvas.height - height) / 2;
		this.x_offset = (canvas.width - width) / 2;
		this.y_offset = (canvas.height - height) / 2;

		this.time = 1;
		this.orbs = [];

		this.makeOrb = function () {
			var orb = {};
			var x_offset = randomNumWithGap(0, 20, 80, 100) / 100;
			var y_offset = randomNumWithGap(0, 20, 80, 100) / 100;
		
			orb.radius = 400;
			orb.x_offset = x_offset
			orb.y_offset = y_offset
			orb.x = this.width * x_offset - this.x_offset;
			orb.y = this.height * y_offset - this.y_offset;
			this.orbs.push(orb);
		};

		this.evolve = function () {
			evolveFrame(this);
		}

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = 'transparent';
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.closePath();

			_.each(this.orbs, function (orb) {
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,255,255,0.4)';
				ctx.arc(orb.x, orb.y, orb.radius, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
				
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,255,255,0.85)';
				ctx.arc(orb.x, orb.y, orb.radius / 1.2, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
			});
		};

		function evolveFrame(frame) {
			frame.width = frame.orig_width / (frame.time * frame.time) * scale_adjust;
			frame.height = frame.orig_height / (frame.time * frame.time) * scale_adjust;

			frame.x = (frame.orig_width - frame.width) / 2 + frame.x_offset;
			frame.y = (frame.orig_height - frame.height) / 2 + frame.y_offset;

			frame.time += 1;

			_.each(frame.orbs, function (orb) {
				orb.x = frame.x + frame.width * orb.x_offset;
				orb.y = frame.y + frame.height * orb.y_offset;
				orb.radius = 250 / (frame.time * frame.time) * scale_adjust;
			});

			frame.draw();
		}

		for (var i = 0; i < randomInt(1, 3); i++) {
			this.makeOrb();
		}
	}

	function makeFrame() {
		frames.push(new Frame(canvas.width * 2, canvas.height * 2, 2));		
	}

	function makeParticles(x, y, scale) {
		for (var i = 0; i < 100; i++) {
						
			particles.push(new Particle(x, y, color, Math.random()*5.2 / (scale * 0.002), scale));
		}
	};

	function Particle(x, y, color, size, scale) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0 = Math.random() / (scale * 0.003);
		this.angle = Math.random() * (360 * Math.PI / 180);
		this.time = 0;
		this.r = size,
		this.color = color;
		this.scale = scale;
	};

	function drawParticles() {
		_.each(particles, function (part) {
			part_ctx.fillStyle = part.color;
			part_ctx.beginPath();
			part_ctx.arc(part.x, part.y, part.r, 0, 2 * Math.PI);
			part_ctx.fill();
			part_ctx.closePath();
		});

		evolveParticles();
	};

	function evolveParticles() {
		particles = _.reject(particles, function (part, i) {
			var v0x = part.v0 * Math.sin(part.angle);
			var v0y = part.v0 * Math.cos(part.angle);

			part.time += part_time_interval;

			part.x = part.x0 + v0x * part.time; 
			part.y = part.y0 - v0y * part.time + acceleration * Math.pow(part.time, 2);

			if (part.time > randomInt(500, 1200)) {
				return true;
			}
		});
	};
	
	function paintScreen() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		_.each(frames, function (frame, i) {
			frame.evolve();

			if (frame.width < 10) {
				frames[i] = new Frame(canvas.width * 2, canvas.height * 2, 2);
			}
		});

		drawParticles();

		setTimeout(paintScreen, time_interval);
	}

	function intersects(x, y, cx, cy, r) {
	    var dx = x - cx;
	    var dy = y - cy;
	    return dx * dx + dy * dy <= r * r;
	}

	function init() {
		makeFrame();

		if (frames.length < 10) {
			setTimeout(init, 3000);
		}
	}

	init();
	paintScreen();

	$('canvas').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;
	});

	document.addEventListener('touchmove', function (e) {
    	e.preventDefault();
    	mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageX - canvas.offsetTop;
	}, false);

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		_.each(frames, function (frame) {
			var scale = frame.time * frame.time;
			frame.orbs = _.reject(frame.orbs, function (orb) {
				if (intersects(x, y, orb.x, orb.y, orb.radius)) {
					makeParticles(orb.x, orb.y, scale);
					bells.play();
					boom.play();
					return true;
				}
			});
		});
	});

	$('body').disableSelection();
}










;
function brickSmasher() {
	var width = 600;
	var height = 500;
	var random_direction = randomInt(0, 1) * 2 - 1;
	var speed_x = 3 * random_direction;
	var speed_y = -3;
	var paddle_width = 150;
	var paddle_height = 10;
	var brick_width = 50;
	var brick_height = 30;
	var bricks = [];
	var brick_hits = 0;
	var init_num_bricks = width / brick_width * 8;
	var colors = ['#e8566c', '#e8566c', '#1CCFC7', '#1CCFC7', '#FFC54A', '#FFC54A', '#19E1B2', '#19E1B2'];

	var ball_layer = new Kinetic.Layer();
	var paddle_layer = new Kinetic.Layer();
	var brick_layer = new Kinetic.Layer();

	var stage = new Kinetic.Stage({
        container: 'game',
        width: width,
        height: height
    });

	var ball = new Kinetic.Circle({
		x: randomInt(30, stage.getWidth() - 30),
		y: stage.getHeight() - 30,
		radius: 10,
		fill: '#0f0b7a',
		id: 'ball'
	});

	var paddle = new Kinetic.Rect({
		x: stage.getWidth() / 2,
		y: stage.getHeight() - 10,
		width: paddle_width,
		height: paddle_height,
		offsetX: paddle_width / 2, 
		fill: '#e8566c',
		id: 'paddle'
	});

	var frame_rate = 20;

	makeBricks();

	ball_layer.add(ball);
	paddle_layer.add(paddle);
	stage.add(ball_layer);
	stage.add(paddle_layer);
	stage.add(brick_layer);

	animate();

	$('body').on('mousemove', function (e) {
		var mouse = stage.getMousePosition();

		if (mouse) {
			paddle.setX( mouse.x);
			paddle_layer.draw();
		}
	});

	function animate() {
		ball.move(speed_x, speed_y);
		ball_layer.draw();

		if (ball.getY() > stage.getHeight() + ball.getRadius()) {
			$('h2').text('Bricks Smashed: ' + brick_hits);
			$('.modal').fadeIn(500);
		} else {
			checkCollisions();
		}
	}

	function Brick(x, y, color, i) {
		this.x = x;
		this.y = y;
		this.i = i;
		this.color = color;
		this.top = y;
		this.bottom = y + brick_height;
		this.left = x;
		this.right = x + brick_width;
		this.dead = false;

		var brick = new Kinetic.Rect({
			x: this.x,
			y: this.y,
			width: brick_width,
			height: brick_height,
			fill: this.color,
			id: 'brick' + i		
		});

		brick_layer.add(brick);
	}

	function makeBricks() {
		var i = 0;
		var color = colors[i];
		var pos_x = 0;
		var pos_y = 50;

		_.each(_.range(init_num_bricks), function (num) {
			bricks.push(new Brick(pos_x, pos_y, color, num));

			pos_x += brick_width;

			if (pos_x >= stage.getWidth()) {
				pos_x = 0;
				pos_y += brick_height + 3;
				i += 1;
				color = colors[i]
			}
		});
	}

	function checkCollisions() {
		var ball_radius = ball.getRadius();
		var ball_x = ball.getX();
		var ball_y = ball.getY();
		var paddle_x = paddle.getX();
		var paddle_y = paddle.getY();

		// Check walls
		if (ball_x < 0 + ball_radius || ball_x > stage.getWidth() - ball_radius) {
			speed_x *= -1;
		} 
		if (ball_y + ball_radius < 0 + ball_radius) {
			speed_y *= -1;
		} 

		// Check paddle
		if (ball_x - ball_radius > paddle_x - paddle.getOffsetX() && ball_x + ball_radius < paddle_x + paddle.getOffsetX() && ball_y + ball_radius >= paddle_y) {

			ball.setY(paddle_y - 1 - ball_radius);
			speed_y *= -1;
			if (ball_x < paddle_x) {
				speed_x = Math.abs(speed_x) * -1;
			} else if (ball_x >= paddle_x) {
				speed_x = Math.abs(speed_x);
			}
		}

		// Check Bricks
		bricks = _.reject(bricks, function (brick) {
			// Check Top & Bottom
			if (brick.left <= ball_x && ball_x <= brick.right) {
				if ((brick.top <= ball_y - ball_radius && ball_y - ball_radius <= brick.bottom) || (brick.top <= ball_y - ball_radius && ball_y - ball_radius <= brick.bottom)) {

					speed_y *= -1;
					stage.get('#brick' + brick.i).destroy();

					brick_layer.draw();
					brick_hits += 1;
					updateGame();
					return true;
				}
			}	
			// Check left and right
			if (brick.top <= ball_y && ball_y <= brick.bottom) {
                if ((brick.left <= ball_x - ball_radius && ball_x - ball_radius <= brick.right) || (brick.left <= ball_x - ball_radius && ball_x - ball_radius <= brick.right)) {	

                	speed_y *= -1;
					stage.get('#brick' + brick.i).destroy();

					brick_layer.draw();
					brick_hits += 1;
					updateGame();
					return true;
                }
            }	
            return false;	
		});	
		setTimeout(animate, frame_rate);
	}

	function updateGame() {
		if (brick_hits % 4 == 0 && brick_hits != 0) {
			frame_rate *= 0.85;
		}
	}
}
;
function buttonMaker() {
	var css_properties = ['border', 'cursor', 'padding', 'text-decoration', 'font-family', 'font-size', 'line-height', 'color', 'background-color', 'border-radius', 'border-top', 'border-bottom', 'border-left', 'border-right', 'text-shadow', 'box-shadow'];

	var showing = false;

	$('#arrow').on('click', function () {
		if (showing) {
			$('.css_code').animate({
				opacity: 0
			}, 500);
			$(this).text('\u25B2');
		} else {
			$(this).text('\u25BC');
			$('.css_code').animate({
				opacity: 1
			}, 500);
		}
		showing = !showing;
	});

	$('.button').on('click', function (e) {
		e.preventDefault();
	});

	$('#background-color').on('change', function () {
		$('.button').css('background-color', '#' + this.color);
	});

	$('#font-color').on('change', function () {
		$('.button').css('color', '#' + this.color);
	});

	$('#box-shadow').on('change', function () {
		$('.button').css('box-shadow', $(this).val());
	});

	$('#text-shadow').on('change', function () {
		$('.button').css('text-shadow', $(this).val());
	});

	$('#font-size').on('change', function () {
		$('.button').css('font-size', $(this).val());
	});

	$('#line-height').on('change', function () {
		$('.button').css('line-height', $(this).val());
	});

	$('#border-left').on('change', function () {
		$('.button').css('border-left', $(this).val());
	});

	$('#border-right').on('change', function () {
		$('.button').css('border-right', $(this).val());
	});

	$('#border-top').on('change', function () {
		$('.button').css('border-top', $(this).val());
	});

	$('#border-bottom').on('change', function () {
		$('.button').css('border-bottom', $(this).val());
	});

	$('#border-radius').on('change', function () {
		$('.button').css('border-radius', $(this).val());
	});

	$('#padding').on('change', function () {
		$('.button').css('padding', $(this).val());
	});

	$('#line-height').on('change', function () {
		$('.button').css('line-height', $(this).val());
	});
}
;
function captureGame() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 500,
		w  = 700,
		balls = [],
		blasts = [],
		total_captured = 0,
		current_captured = 0,
		time_int = 50,
		level = 0,
		running = false,

		levels = [
			{
				num_balls: 3,
				target: 1
			},
			{
				num_balls: 8,
				target: 2
			},
			{
				num_balls: 12,
				target: 4
			},
			{
				num_balls: 20,
				target: 6
			},
			{
				num_balls: 25,
				target: 8
			},
			{
				num_balls: 25,
				target: 10
			},
			{
				num_balls: 40,
				target: 13
			},
			{
				num_balls: 40,
				target: 15
			},
			{
				num_balls: 45,
				target: 20
			},
			{
				num_balls: 40,
				target: 25
			},
			{
				num_balls: 50,
				target: 30
			},
			{
				num_balls: 50,
				target: 35
			},
			{
				num_balls: 55,
				target: 40
			},
			{
				num_balls: 58,
				target: 45
			},
			{
				num_balls: 65,
				target: 55
			},
			{
				num_balls: 73,
				target: 65
			},
			{
				num_balls: 80,
				target: 70
			},
			{
				num_balls: 80,
				target: 75
			},
			{
				num_balls: 80,
				target: 78
			}
		];

	canvas.height = h;
	canvas.width = w;
	
	$('body').disableSelection();

	setInterval(function () {
		paintScreen();
	}, time_int);

	startLevel();

	$('.retry').on('click', function () {
		$('.modal').fadeOut('300');
	});

	function paintScreen() {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0,0,w,h);
		drawScorePanel();

		_.each(balls, function (ball) {
			ball.move();
		});
		_.each(blasts, function (blast) {
			blast.draw();
		});

		if (running) {
			balls = checkCollisions();
			blasts = checkBlasts();
			checkIfGameEnded();
		}
	};

	function startLevel() {
		balls = [];
		current_captured = 0;

		_.each(_.range(levels[level].num_balls), function (i) {
			makeBall(randomInt(20, w - 20), randomInt(20, h - 42));
		});

		$('canvas').on('click', function (e) {
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;

			makeBlast(x, y, '100, 100, 100');
			running = true;
			$('canvas').off();
		});
	};

	function Ball(x, y, vx, vy) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = 8;
		this.color = randomColorRGB();

		this.move = function () {
			if(this.x > w - 8) {
				this.x = w - 8;
				this.vx = -this.vx;
			} else if(this.x < 8) {
				this.x = 8;
				this.vx = -this.vx;
			}

			if(this.y > h - 8) {
				this.y = h - 8;
				this.vy = -this.vy;
			} else if(this.y < 38) {
				this.y = 38;
				this.vy = -this.vy;
			}

			this.x+= this.vx;
			this.y+= this.vy;

			ctx.fillStyle = 'rgba('+ this.color + ', 1)';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		};
	};

	function Blast(x, y, color) {
		this.x = x;
		this.y = y;
		this.r = 40;
		this.color = color;
		this.time = time_int;

		this.draw = function () {
			ctx.fillStyle = 'rgba('+ this.color + ', 0.75)';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();

			this.time += 50;
		};
	};

	function makeBall(x, y) {
		var vx = randomFloat(-5, 5);
		var vy = randomFloat(-5, 5);

		if (vx < 3 && vx > 0) {
			vx += 3;
		} else if (vx > -3 && vx < 0) {
			vx -= 3;
		}

		if (vy < 3 && vy > 0) {
			vy += 3;
		} else if (vy > -3 && vy < 0) {
			vy -= 3;
		}

		balls.push(new Ball(x, y, vx, vy));
	};

	function makeBlast(x, y, color) {
		blasts.push(new Blast(x, y, color));
	};		

	function checkCollisions() {
	    return _.reject(balls, function (ball) {
	        var remove = false;
	        _.each(blasts, function (blast) {
	            if (ball.x - ball.r > blast.x - blast.r && ball.x + ball.r < blast.x + blast.r && 
	            	ball.y - ball.r > blast.y - blast.r && ball.y +	ball.r < blast.y + blast.r) {
	                makeBlast(ball.x, ball.y, ball.color);
	                current_captured = levels[level].num_balls - balls.length;
	                remove = true;
	            }
	        });
	        return remove;
	    });
	};

	function checkBlasts() {
    	return _.reject(blasts, function (blast) {
        	return (blast.time > 1500);
	    });
	};

	function checkIfGameEnded() {
		current_captured = levels[level].num_balls - balls.length;

		if (blasts.length == 0) {
			running = false;
			if (current_captured < levels[level].target) {
				setTimeout(function () {
					flashFail();
					startLevel();						
				}, 300);
			} else {
				total_captured += current_captured
				level++;

				if (level <= levels.length - 1) {
					setTimeout(function () {
						flashNextLevel();
						startLevel();							
					}, 300);
				} else {
					showWin();
				}
			}
		}
	};

	function drawScorePanel() {
		ctx.fillStyle = '#eb7405';
		ctx.fillRect(0, 0, w, 30);
		ctx.fillStyle = '#fff';
		ctx.font = '16px Open Sans';
		ctx.fillText('Target: ' + levels[level].target, 20, 20);
		ctx.fillText('Captured: ' + current_captured, 120, 20);
		ctx.fillText('Score: ' + total_captured * 100, 250, 20);
	};


	function flashFail() {
		$('.fail').fadeIn('300');
	};

	function flashNextLevel() {
		$('.next h2').text('Target: ' + levels[level].target);
		$('.next').fadeIn('300');
		setTimeout(function () {
			$('.next').fadeOut('300');
		}, 800);
	};

	function showWin() {
		$('.win').fadeIn('300');
	};
};


function catWall() {
	var cats = ['INscMGmhmX4', '0M7ibPk37_U', 'R7ssVT6T3mQ', '2CNd6OGdMO8', 'bzvUyu3zOmE', 'pwHy4gMO6sU', 'fzzjgBAaWZw', 'C_S5cXbXe-4', 'hPzNl6NKAG0', 'REQRHdMRimw', '0Bmhjf0rKe8', 'SaOqf2d-y30'];

	var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var player;

	window.onYouTubePlayerAPIReady = function() {
		// onYouTubePlayerAPIReady needs to be global. If statement to specify Cat Wall specific code
		if (window.location.pathname == '/cat_wall/page') {

			_.each(cats, function (videoId, i) {
				$('<div />', {
					id: 'player' + i,
					class: 'video'
				}).appendTo('#video_container');

				player = new YT.Player('player' + i, {
					playerVars: { 
						'autohide': 1,
						'wmode': 'opaque', 
						'controls': 0,
				    	'playlist': videoId,
						'loop': 1
					},
				    videoId: videoId,
				    events: {
				    	'onReady': onPlayerReady
				    }
				});
			});
		}
	}

	// 4. The API will call this function when the video player is ready.
	function onPlayerReady(event) {
		event.target.mute();
		event.target.playVideo();
	}
}
;
function checkSketch() {
	var height = window.innerHeight;
	var width = window.innerWidth;
	var num_boxes = ((height * width ) / (18 * 18));
	var turbo = false;

	$('#sketch_pad').css({
		height: height,
		width: width
	});
	
	_.each(_.range(1, num_boxes), function (num) {
		$('<input>', {
			type: 'checkbox'
		}).on('mouseover', function () {
			if (turbo) {
				this.setAttribute('checked', 'checked');
			}
		}).appendTo('#sketch_pad');
	});

	$('#turbo').on('click', function () {
		if (!turbo) {
			$(this).text('Turbo Mode On').removeClass('turbo_off');
		} else {
			$(this).text('Turbo Mode Off').addClass('turbo_off');			
		}
		turbo = !turbo;
	});

	$('#reset').on('click', function () {
		window.location = "/check_sketch/page";
	});
};
function chromatones() {
	if ($('#recent_palettes').length > 0) {
		palettes = $('.palette_container');

		_.each(palettes, function (palette, i) {
			var colors = $(palette).data('colors');
			for (var i = 0; i < 10; i++) {
				color = colors[i]
				if (color) {
					staticSwatch(color.color, palette);
				}
			};

			if (colors.length > 10) {
				$(palette).append('<div class="more">and ' + (colors.length - 10) + ' more colors.</div>')
			}
		});
	}

	if ($('#swatch_container_show').length > 0) { 
		var colors = $('#palette_data').data('palette');

		_.each(colors, function (color) {
			staticSwatch(color.color, '#swatch_container_show');
		});
	}

	if ($('#swatch_container_new').length > 0) {	
		var swatches = [];

		function Swatch() {
			this.color = randomColorHex();

			this.buildSwatch = function () {
				var swatch = this;

				var div = $('<div>', {
					class: 'swatch',
				});

				var swatch_color = $('<div>', {
					class: 'swatch_color',
					style: 'background-color:' + swatch.color
				});

				var close = $('<div />', {
					class: "close",
					text: 'X'
				}).on('click', function () {
					swatches = _.reject(swatches, function (s) {
						return s == swatch;
					});

					$(this).parent().remove();
				});

				var swatch_info = $('<div>', {
					class: 'swatch_info',
				}).append('<label>Color: </label>');

				var color_input = $('<input>', {
					class: 'color',
					value: swatch.color
				}).on('change', function () {
					swatch.color = '#' + $(this).val();
					$(swatch_color).css('background-color', swatch.color);
				}).appendTo(swatch_info);

				new jscolor.color(color_input.get(0));

				$(div).append(close)
					  .append(swatch_color)
					  .append(swatch_info)
					  .appendTo('#swatch_container_new');
			}

			this.buildSwatch();
		}
		
		for (var i = 0; i < 5; i++) {
			swatches.push(new Swatch());
		}

		$('#add').on('click', function (e) {
			e.preventDefault();
			swatches.push(new Swatch());
		});

		$('#save').on('click', function (e) {
			e.preventDefault();
			savePalette(swatches);
		});
	}

	function staticSwatch( color, elm ) {
		this.color = color;

		this.buildSwatch = function () {
			var swatch = this;

			var div = $('<div>', {
				class: 'swatch',
			});

			var swatch_color = $('<div>', {
				class: 'swatch_color',
				style: 'background-color:' + swatch.color
			});

			var swatch_info = $('<div>', {
				class: 'swatch_info',
			}).append('<label>Color: ' + swatch.color + '</label>');

			$(div).append(swatch_color)
				  .append(swatch_info)
				  .appendTo(elm);
		}

		this.buildSwatch();
	}

	function formatPaletteData(swatches) {
		var title = $.trim($('#title').val());
		var name = $.trim($('#name').val());

		if (title.length > 100 || name.length > 100) {
			alert('Character limit for title and name is 100.');
		} else {
			var palette = _.map(swatches, function (swatch) {
				return {
					color: swatch.color,
				};
			});

			palette.push({title: title});
			palette.push({name: name});
			return palette;					
		}
	}

	function savePalette(swatches) {
		var data = formatPaletteData(swatches);

		if (data) {
			$('#throbber').show();

			$.ajax({
				url: "/chromatones/palettes",
				type: "POST",
				data: {colors: data},
				dataType: 'json',
				success: function (data) {
					window.location = '/chromatones/palettes/';
				},
				error: function (xhr, status) {
					$('#throbber').hide();
					alert('There was a problem with your request. Please try again.');
				}
			});
		}
	}
}
;
(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

function clickCounter() {
	$('button').on('click', function (e) {
		e.preventDefault();
		$(this).attr('disabled', 'disabled');

		$.ajax({
			type: 'PUT',
			url: '/click_counter/buttons/1'
		});

		updateClicks();

		setTimeout($.proxy(removeDisabled, this), 400);

		function removeDisabled () {
			$(this).removeAttr('disabled');
		};
	});

	function updateClicks() {
		var clicks = $('#click_num').text();
		clicks++;
		$('#click_num').text(clicks);
	};
	
	$('body').disableSelection();
};
function codedMessages() {
	var character_list = ['A', 'B', 'C', 'D', 'E', 
						  'F', 'G', 'H', 'I', 'J', 
						  'K', 'L', 'M', 'N', 'O', 
						  'P', 'Q', 'R', 'S', 'T', 
						  'U', 'V', 'W', 'X', 'Y', 'Z', 
						  '1', '2', '3', '4', '5',
						  '6', '7', '8', '9', '0', 
						  '!', '@', '#', '%', '$',
						  '^', '&', '*', '(', ')',
						  '?', '.', ',', '\'', '/', ' '];

	if ($('form').length) {
		$('form').on('submit', function (e) {
			var message = $.trim($('#message_input').val());
			var title = $.trim($('#title_input').val());

			if (message.length < 1) {
				e.preventDefault();
				alert('Please enter a message.');
			} else if (message.length > 40) {
				e.preventDefault();
				alert('Your message is too long. Limit is 140 characters.');
			} else if (title.length < 1) {
				e.preventDefault();
				alert('Please enter a hint or title.');
			} else if (title.length > 255) {
				e.preventDefault();
				alert('Your title is too long. Limit is 255 characters.');
			} else {
				message = utf8_to_b64(message);
				$('#message').val(message);
			}
		});		
	}

	if ($('canvas').length) {
		var canvas = $('canvas')[0];
		var ctx = canvas.getContext('2d');
		var coded_message = $('#message').data('message');
		var message = b64_to_utf8(coded_message).toUpperCase();
		var column_spacing = 30;
		var char_spacing = 38;
		var width = message.length * column_spacing;
		var height = 10 * char_spacing;
		var columns = [];
		var pos_x = 0;

		canvas.width = width;
		canvas.height = height;

		function paintScreen() {
			ctx.beginPath();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#00cc99';
			ctx.fillRect(0, canvas.height - char_spacing, canvas.width, char_spacing);
			ctx.closePath();

			_.each(columns, function (col) {
				col.draw();
			});
		}

		function Column(x, char) {
			this.x = x;
			this.y = 0;
			this.char = char;
			this.chars = [];
			this.char_spacing = char_spacing;
			this.width = column_spacing;
			this.rotating = false;

			this.init = function () {
				this.chars.push(this.char);
				for (var i = 0; i < 9; i += 1) {
					this.chars.push(character_list[randomInt(0, character_list.length - 1)]);
				}
				this.chars = _.shuffle(this.chars);
			};

			this.draw = function () {
				var column = this;
				var pos_y = this.y + 5;
				ctx.beginPath();
				ctx.fillStyle = '#222';
				ctx.strokeStyle = '#888';
				ctx.textBaseline = 'top'; 
				ctx.textAlign = 'center';
				ctx.font = '20px monospace';
				
				_.each(column.chars, function (char) {
					ctx.fillText(char, column.x + column.width / 2, pos_y);
					pos_y += column.char_spacing;
				});

				ctx.moveTo(this.x, 0);
				ctx.lineTo(this.x, canvas.height);
				ctx.moveTo(this.x + this.width, 0);
				ctx.lineTo(this.x + this.width, canvas.height);

				ctx.stroke();
				ctx.closePath();
			};

			this.rotate = function (times) {
				var column = this;
				column.rotating = true;
				times = times ? times : 0;

				if (times < column.char_spacing) {
					column.y += 1;
					paintScreen();

					setTimeout(function () {
						column.rotate(times + 1);
					}, 7);
				} else {
					var bottom_char = column.chars.pop();
					column.chars.unshift(bottom_char);
					column.y = 0;
					paintScreen();
					column.rotating = false;
				}				 
			}

			this.init();
		}

		function checkGuess() {
			var guess = []
			_.each(columns, function (col, i) {
				guess.push(col.chars[col.chars.length - 1]);
			});

			if (guess.join('') == message) {
				alert('CORRECT! Excellent decoding work!');
			} else {
				alert('NOPE! ' + guess.join('') + ' is not the correct answer.');
			}
		}
		_.each(message.split(''), function (char) {
			columns.push(new Column(pos_x, char));
			pos_x += column_spacing;
		});

		paintScreen();

		$('canvas').on('click', function (e) {
			var mouse_x = e.pageX - canvas.offsetLeft;

			_.each(columns, function (col) {
				if (mouse_x > col.x && mouse_x < col.x + col.width && !col.rotating) {
					col.rotate();
				}
			});
		});

		$('#solve').on('click', checkGuess);

		$('body').disableSelection();
	}
}
;
function colorPickerPage() {
	var main_canvas = $('canvas')[0];
	var main_ctx = main_canvas.getContext('2d');
	var hue_canvas = $('canvas')[1];
	var hue_ctx = hue_canvas.getContext('2d');
	var main_width = 300;
	var main_height = 300;

	var hue_width = 40;
	var hue_height = 300;
	var color_gradient = new Image();

	main_canvas.width = main_width;
	main_canvas.height = main_height;

	hue_canvas.width = hue_width;
	hue_canvas.height = hue_height;

	var colorPicker = {
		color: { r:255, g:0, b:0 },
			
		makePalette: function () {
			var hue_gradient = hue_ctx.createLinearGradient(0,0,0,hue_canvas.height);

			hue_gradient.addColorStop(0,    "rgb(255,   0,   0)");
			hue_gradient.addColorStop(0.02,    "rgb(255,   0,   0)");
			hue_gradient.addColorStop(0.15, "rgb(255,   0, 255)");
			hue_gradient.addColorStop(0.33, "rgb(0,     0, 255)");
			hue_gradient.addColorStop(0.49, "rgb(0,   255, 255)");
			hue_gradient.addColorStop(0.67, "rgb(0,   255,   0)");
			hue_gradient.addColorStop(0.84, "rgb(255, 255,   0)");
			hue_gradient.addColorStop(0.98,    "rgb(255,   0,   0)");
			hue_gradient.addColorStop(1,    "rgb(255,   0,   0)");

			hue_ctx.fillStyle = hue_gradient;
			hue_ctx.fillRect(0,0,hue_canvas.width,hue_canvas.height);

			color_gradient.onload = function () {
				main_ctx.fillStyle = 'rgb(255, 0, 0)';
				main_ctx.fillRect(0,0,main_canvas.width, main_canvas.height);
				main_ctx.drawImage(color_gradient, 0, 0, main_canvas.width, main_canvas.height);
			};

			$('#hue').on('mousedown', function (e) {
				$('#hue').on('mousemove', function (e) {
					var mouse_x = e.pageX - hue_canvas.offsetLeft;
					var mouse_y = e.pageY - hue_canvas.offsetTop;
					var color = colorPicker.color;
					var img_data = hue_ctx.getImageData(mouse_x, mouse_y, 1, 1);

					$(document).css('cursor', 'crosshair');

					colorPicker.color = { r: img_data.data[0], g: img_data.data[1], b: img_data.data[2] };
					colorPicker.drawMainCanvas('rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')');
				});

				$(document).on('mouseup', function () {
					$('canvas').off('mousemove');
				});
			});

			$('#main').on('mousedown', function (e) {
				$('#main').on('mousemove', function (e) {
					var mouse_x = e.pageX - main_canvas.offsetLeft;
					var mouse_y = e.pageY - main_canvas.offsetTop;
					var img_data = main_ctx.getImageData(mouse_x, mouse_y, 1, 1);

					$(document).css('cursor', 'crosshair');

					colorPicker.color = { r: img_data.data[0], g: img_data.data[1], b: img_data.data[2] };
					colorPicker.updateSwatch();
				});

				$(document).on('mouseup', function () {
					$('canvas').off('mousemove');
				});
			});
		},

		drawMainCanvas: function (hue) {
			var color = colorPicker.color;
			main_ctx.clearRect(0,0,main_ctx.width, main_ctx.height);
			main_ctx.fillStyle = hue;
			main_ctx.fillRect(0,0,main_canvas.width, main_canvas.height);
			main_ctx.drawImage(color_gradient, 0, 0, main_canvas.width, main_canvas.height);

			colorPicker.updateSwatch();
		},

		colorAsRGB: function () {
			var color = colorPicker.color;
			return color.r + ', ' + color.g + ', ' + color.b;
		},

		colorAsHex: function () {
			var color = colorPicker.color;
			var r = rgbComponentToHex(color.r);
			var g = rgbComponentToHex(color.g);
			var b = rgbComponentToHex(color.b);

			return r + g + b;
		},

		updateSwatch: function () {
			$('#swatch').css('background-color', '#' + colorPicker.colorAsHex());
			$('#rgb').val(colorPicker.colorAsRGB);
			$('#hex').val(colorPicker.colorAsHex);
		}
	}

	$('input').on('change', function () {
		var input = $(this).val().replace(' ', '');
		if (this.id == 'hex') {
			input = hexToRgb(input.replace('#', ''));

			if (input) {
				var hue = 180 / Math.PI * Math.atan2((Math.sqrt(3)*(input.g - input.b)), 2 * input.r - input.g - input.b) + 360;

				colorPicker.color = input;
				colorPicker.updateSwatch();
				colorPicker.drawMainCanvas('hsl(' + hue + ', 100%, 50%)');
			}
		} else if (this.id == 'rgb') {
			var rgb_color = [];
			input = input.replace(' ', '').split(',');

			_.each(input, function (val) {
				var num = parseInt(val);
				if (num <= 255 && num >= 0) {
					rgb_color.push(num)
				}
			});

			if (rgb_color.length == 3) {
				var hue = 180 / Math.PI * Math.atan2((Math.sqrt(3)*(input[1] - input[2])), 2 * input[0] - input[1] - input[2]) + 360;

				colorPicker.color.r = rgb_color[0];
				colorPicker.color.g = rgb_color[1];
				colorPicker.color.b = rgb_color[2];
				colorPicker.updateSwatch();
				colorPicker.drawMainCanvas('hsl(' + hue + ', 100%, 50%)');
			}
		}
	});

	colorPicker.makePalette();

	$('button').on('click', function () {
		pushSwatchToPalette(colorPicker.color);
	});

	$('canvas').disableSelection();

	function pushSwatchToPalette(color) {
		var div = $('<div />', {
				class: 'swatch_container'
			});

		var swatch = $('<div />', {
			class: "swatch",
			style: 'background-color: rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')'
		});

		var close = $('<div />', {
			class: "close",
			text: 'X'
		}).on('click', function () {
			$(this).parent().remove();
		});

		$(div).append(close)
			  .append(swatch)
			  .append('<div class="swatch_info"><div class="label">RGB: ' +  color.r + ', ' + color.g + ', ' + color.b + '</div><div class="label">HEX: #' + rgbComponentToHex(color.r) + rgbComponentToHex(color.g) + rgbComponentToHex(color.b) + '</div>')
			  .prependTo('#palette_container');
	};

	color_gradient.src = '/assets/color_picker_gradient.png';

}
;
function colorWalk() {
	var blocks = [];
	var colors = ['#14b19f', '#0e274e', '#ec5257', '#6c2275', '#f9ac00'];
	var grid_length = 30;
	var grid_height = 20;
	var block_size = 20;
	var moves = 0;
	var dead = 1;

	makeBlocks();

	_.each(colors, function (color) {
		new Control(color);
	});

	$('.close').on('click', function () {
		$('.modal').fadeOut(300);
	});

	function Block(x, y, color, i, isDead) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.position = i;
		this.isDead = isDead;

		this.init = function () {
			$('<div>', {
				id: 'block' + this.position,
				class: "block",
				style: "left:" + this.x + "px; top: " + this.y + 'px; background-color:' + this.color
			}).appendTo('#gameboard');
		};

		this.init();
	}

	function Control(color) {
		this.color = color;

		var that = this;

		this.init = function () {
			$('<div>', {
				class: "control btn",
				style: "background-color:" + this.color
			}).on('click', function (e) {
				updateGameBoard(that);
			}).appendTo('#control_container');
		};

		this.init();

		function updateGameBoard(control) {
			var color = control.color;
			_.each(blocks, function (block) {
				if (block.isDead) {
					getNeighbors(block, color);
				}
			});

			moves += 1;
			$('.score').text(moves);
		}

		function getNeighbors(block, color) {
			var i = block.position;
			var neighbor_positions = [i - 1, i + 1, i - grid_length, i + grid_length];

			if (i % grid_length == 0) {
				neighbor_positions[0] = false;
			} else if (i % grid_length == (grid_length - 1)) {
				neighbor_positions[1] = false;
			}

			neighbor_positions = _.reject(neighbor_positions, function (pos, i) {
				if (pos < 0 || pos > grid_length * grid_height - 1) {
					return true;
				} else if (pos === false) {
					return true;
				}
			});

			checkNeighbors(neighbor_positions, color);
		}

		function checkNeighbors(positions, color) {
			_.each(positions, function (position) {
				var block = blocks[position];
				if (block.color == color && !block.isDead) {
					block.isDead = true;
					$('#block' + position).css('background-color', '#d9d9d9');
					checkIfFinished(block, color);
				}
			});
		}
		
		function checkIfFinished(block, color) {
			var game_continues = _.some(blocks, function (block) {
				return block.isDead == false
			});

			if (game_continues) {
				getNeighbors(block, color);
			} else {
				$('#game_over').fadeIn(300);
			}
		}	

	}

	function makeBlocks() {
		var x = 0;
		var y = 0; 

		blocks = [];
		moves = 0;

		$('#gameboard').html('');
		$('#wrapper').css({
			'width': block_size * grid_length,
			'height': block_size * grid_height
		});
		$('#score').text('Moves: ' + moves);

		_.each(_.range(grid_length * grid_height), function (num) {
			var color = colors[randomInt(0, 4)];
			var dead = false;

			if (num == 0) {
				dead = true;
				color = "#d9d9d9";
			}
			
			blocks.push(new Block(x, y, color, num, dead));

			x += block_size;
			if (x >= grid_length * block_size) {
				y += block_size;
				x = 0;
			}
		});
	};
}


;
function colorWorks() {
	$('#color_input').on('keyup', function () {
		checkInput();
	});

	$('#color_input').on('change', function () {
		checkInput();
	});

	$('form').on('submit', function (e) {
		e.preventDefault();

		var hex_color = $('#color').val();

		if (/^([0-9a-fA-F]{6})?$/.test(hex_color) && hex_color != '') {
			var adjustment = $('input:radio:checked').val();
			var percent = $('#percent').val().replace('%', '') * 0.01;
			var rgb = hexToRGB(hex_color);
			var hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
			var new_colors;

			if (adjustment == 'darken' || adjustment == 'desaturate') {
				percent *= -1;
			}

			if (adjustment == 'darken' || adjustment == 'lighten') {
				new_colors = lightAdjustedColors(hsl, percent);
			} else if (adjustment == 'saturate' || adjustment == 'desaturate') {
				new_colors = satAdjustedColors(hsl, percent);
			}

			makeSwatches(new_colors);
		} else {
			alert('Please enter a 6 digit hex number.');
		}
	});

	$('#reset').on('click', function () {
		$('#swatch_section').html('');
		$('#submit').attr('disabled', 'disabled');
	});

	function checkInput() {
		var color = $('#color').val();
		
		if (/^([0-9a-fA-F]{6})?$/.test(color) && color != '') {
			$('#submit').removeAttr('disabled');
		} else {
			$('#submit').attr('disabled', 'disabled');
		}
	};

	function hexToRGB(hex) {
		var parsed_hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return { r: parseInt(parsed_hex[1], 16),
				 g: parseInt(parsed_hex[2], 16),
				 b: parseInt(parsed_hex[3], 16) }
	}

	function rgbToHSL(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return [h, s, l];  // returns values between 0 and 1;
	};

	function lightAdjustedColors(hsl, percent) {
		var h = hsl[0];
		var s = hsl[1];
		var l = hsl[2];
		var label = 'Lightened';
		var new_colors = [];

		if (percent < 0) {
			label = 'Darkened'
		}

		_.each(_.range(5), function (num) {
			var new_l = (l + percent * num);
			new_l = new_l < 1.0 ? new_l : 1.0;
			new_l = new_l > 0.0 ? new_l : 0.0;

			new_colors.push({h: h, s: s, l: new_l, label: label, percent: (percent * num * 100).toFixed(2)});
		});
		return new_colors;
	};

	function satAdjustedColors(hsl, percent) {
		var h = hsl[0];
		var s = hsl[1];
		var l = hsl[2];
		var label = 'Saturated';
		var new_colors = [];

		if (percent < 0) {
			label = 'Desaturated'
		}

		_.each(_.range(5), function (num) {
			var new_s = (s + percent * num);
			new_s = new_s < 1.0 ? new_s : 1.0;
			new_s = new_s > 0.0 ? new_s : 0.0;

			new_colors.push({h: h, s: new_s, l: l, label: label, percent: (percent * num * 100).toFixed(2)});
		});
		return new_colors;
	};

	function hslToHex(h, s, l){
	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return Math.round(r * 255 + 0x10000).toString(16).substr(-2) + Math.round(g * 255 + 0x10000).toString(16).substr(-2) + Math.round(b * 255 + 0x10000).toString(16).substr(-2);	    
	}

	function makeSwatches(colors) {
		var row = $('<div />', {
			class: 'swatch_row'
		}).prependTo('#swatch_section');

		_.each(colors, function (color) {
			var color_as_hex = hslToHex(color.h, color.s, color.l);
			var div = $('<div />', {
				class: 'swatch_container'
			});

			var swatch = $('<div />',{
				class: "swatch",
				'data-color': color_as_hex,
				style: 'background-color: #' + color_as_hex
			}).on('click', function () {
				$('#color').val($(this).data('color'));
				$('#color').focus();
			});

			$(div).append(swatch)
				  .append('<div class="swatch_info"><div class="label">HEX: ' + color_as_hex + '</div><div class="label">'+ color.label + ': ' + Math.abs(color.percent) + '%</div></div>')
				  .appendTo(row);
		});
	}

};







function commerce() {
	var products;

	$('#keyword').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();

		var keyword = $('#keyword').val();

		$('#loading').css('opacity', '1');

		getProducts(keyword);
	});

	function getProducts(keyword) {
		$.ajax({
			type: 'POST',
			url: document.location.pathname,
			dataType: 'json',
			data: {keyword: keyword},
			success: function (data) {
				checkData(data);
			},
			error: function () {
				$('#loading').css('opacity', '0');
				alert('There was a problem with your request. Please try again.');
			}
		});
	}

	function checkData(data) {
		products = data;

		if (products[0].error != null) {
			$('#loading').css('opacity', '0');
			alert(products[0].error);
		} else if (products.length <= 1) {
			$('#loading').css('opacity', '0');
			alert('No results found.');
		} else {
			displayProducts();
		}
	}

	function displayProducts() {
		_.each(products, function (product) {
			if (product.image) {
				var available = product.availability == null ? 'unknown' :  product.availability;

				$('<div>', {
					class: 'product_container'
				}).html('<div class="info"><p>' + product.title + '</p><a href="' + product.url + '"></a></div><img class="product_img" src='+ product.image +'><div class="availability">Available '+ available +'</div>'). prependTo('#item_container');
			}
		});

		$('#loading').css('opacity', '0');
	}
}
;
function confusedTwitter() {}
;
function countdownClock() {
	var secs = 0,
		mins = 0,
		hours = 0,
		days = 0,
		end_date,
		event_name,
		interval;

	init();

	$('form').on('submit', function (e) {
		e.preventDefault();
		init();


		var year = Number($('.year').val()),
			month = Number($('.month').val()),
			day = Number($('.day').val()),
			name = $('.name').val();

		if (_.isNaN(year)){
			alert('Not a valid year.');
		} else if (_.isNaN(month)) {
			alert('Please enter the month as a number, e.g. enter 3 for March.');
		} else if (_.isNaN(day)) {
			alert('You haven\'t learned your days yet?');
		} else {
			end_date = new Date(year, month - 1, day);
			dateDiff();
			$('.modal').fadeOut('600');
			$('#event_name').text(name);
			$('#container').fadeIn('600');
		}

	});

	function resetOnError() {
		$('#container').hide();
		$('.modal').show();
	};


	function dateDiff() {
		var now = new Date(),
			diff = end_date - now;

		days = Math.floor(diff/(3600 * 24 * 1000));
		var remainder =  diff % (3600 * 24 * 1000);

		hours = Math.floor(remainder / (3600 * 1000));
		remainder = diff % (3600 * 1000);

		mins = Math.floor(remainder / (60 * 1000));
		remainder = diff % (60 * 1000);

		secs = Math.floor(remainder / (1000));

		if (days > 9999) {
			init();
			alert('Date too far in the future.');
		} else {
			displayTime();
			setTimeout(dateDiff, 500);
		}
	};

	function displayTime() {
		makeDigitalOnes(secs, 'sec_ones');			
		makeDigitalOnes(mins, 'min_ones');			
		makeDigitalOnes(hours, 'hour_ones');
		makeDigitalOnes(days, 'day_ones');

		makeDigitalTens(secs, 'sec_tens');			
		makeDigitalTens(mins, 'min_tens');			
		makeDigitalTens(hours, 'hour_tens');		
		makeDigitalTens(days, 'day_tens');	

		makeDigitalHundreds(days, 'day_hundreds');		
		makeDigitalThousands(days, 'day_thousands');	
	};

	function makeDigitalOnes(time, unit) {
		var ones = time % 10;
		
		makeNum(ones, unit);
	};

	function makeDigitalTens(time, unit) {
		var tens = Math.floor(time/10);
		
		makeNum(tens, unit);
	};

	function makeDigitalHundreds(time, unit) {
		var hundreds = Math.floor(time/100);

		$('.hundreds').show();

		if (hundreds === 0) {
			$('.hundreds').hide();
		}
		
		makeNum(hundreds, unit);
	};

	function makeDigitalThousands(time, unit) {
		var thousands = Math.floor(time/1000);
		
		$('.thousands').show();

		if (thousands === 0) {
			$('.thousands').hide();
		}
		makeNum(thousands, unit);
	};

	function init() {
		makeDigitalOnes(0, 'sec_ones');			
		makeDigitalOnes(0, 'min_ones');			
		makeDigitalOnes(0, 'hour_ones');
		makeDigitalOnes(0, 'day_ones');

		makeDigitalTens(0, 'sec_tens');			
		makeDigitalTens(0, 'min_tens');			
		makeDigitalTens(0, 'hour_tens');		
		makeDigitalTens(0, 'day_tens');	

		makeDigitalHundreds(0, 'day_hundreds');		
		makeDigitalThousands(0, 'day_thousands');	
	}

	function makeNum(num, unit) {
		var unit = '.' + unit;

		if (num == 0) {
			$(unit + '.bar').show();
			$(unit + '.hor.mid').hide();			
		} 
		if (num == 1) {
			$(unit + '.bar').hide();
			$(unit + '.ver.top.right,' + unit + '.ver.bottom.right').show();			
		}
		if (num == 2) {
			$(unit + '.bar').show();
			$(unit + '.ver.top.left,' + unit + '.ver.bottom.right').hide();			
		}
		if (num == 3) {
			$(unit + '.bar').show(),
			$(unit + '.ver.top.left,' + unit + '.ver.bottom.left').hide();			
		}
		if (num == 4) {
			$(unit + '.bar').show();
			$(unit + '.hor.top,' + unit +  '.hor.bottom,' + unit + '.ver.bottom.left').hide();			
		}
		if (num == 5) {
			$(unit + '.bar').show();
			$(unit + '.ver.top.right,' + unit + '.ver.bottom.left').hide();			
		}
		if (num == 6) {
			$(unit + '.bar').show();
			$(unit + '.ver.top.right').hide();			
		}
		if (num == 7) {
			$(unit + '.bar').hide();
			$(unit + '.ver.top.right,' + unit + '.ver.bottom.right,' + unit + '.hor.top').show();			
		}
		if (num == 8) {
			$(unit + '.bar').show();			
		}
		if (num == 9) {
			$(unit + '.bar').show();
			$(unit + '.ver.bottom.left').hide();			
		};
	};
}
;
function downTheWeight() {
	var height_range = _.range(54, 85);
	var male_stats = {};
	var female_stats = {};

	_.each(height_range, function (height, i) {
		male_stats[String(height)] = 55.7 + i * 4.7;

		female_stats[String(height)] = 55.7 + i * 3.9;
	});

	$('form').on('submit', function (e) {
		e.preventDefault();

		$('input').blur();

		calculateWeights();
	});

	$('.print').on('click', function () {
		window.print();
	});

	$('#reset').on('click', function () {
		$('#chart_container').hide();
		$('.modal').fadeIn(300);
		$('tbody').remove();
	});

	function calculateWeights() {
		var w0 = $('#current_weight').val().replace(' ', '');
		var wf = $('#goal_weight').val().replace(' ', '');
		var delta_t = $('#diet_length').val().replace(' ', '');
		var height = $('#height').val();
		var gender_stats = $('input:radio:checked').val()== 'male' ? male_stats : female_stats;
		var w_min = gender_stats[height];

		if (w0 <= 0 || wf <= 0 || delta_t <= 0 || 
			isNaN(w0) || isNaN(wf) || isNaN(delta_t)) {
			alert('All fields must be filled in with values greater than 0.');
		} else {
			var A = (w0 - w_min);
			var lambda = (-1/delta_t) * Math.log((wf - w_min) / (w0 - w_min));
			var days = _.range(0, Number(delta_t) + 1);

			var weights = _.map(days, function (t) {
				return (A * Math.exp(-lambda * t) + w_min).toFixed(2);
			});	

			if (weights[0] == 'NaN') {
				alert('You\'re goal weight is too low. Please enter a higher number for your goal weight.');
			} else {
				createChart(weights);		
			}
		}
	};

	function createChart(weights) {
		var lbs_lost = 0;
		var last_weight = weights[0];
		var today = new Date();

		_.each(weights, function (weight, i) {
			var date = getNextDay(today, i);
			lbs_lost += last_weight - weight;

			$('<tr />').append('<td>' + date + '</td>')
					   .append('<td>' + weight + '</td>')
					   .append('<td>' + lbs_lost.toFixed(2) + '</td>')
					   .appendTo('#weight_chart');

			last_weight = weight;
		});

		$('#chart_container').fadeIn(300);
		$('.modal').fadeOut(300);
	};

	function getNextDay(start_date, days) {
		new_date = new Date(start_date.getTime() + days*24*60*60*1000);
		return (new_date.getMonth() + 1) + '/' + new_date.getDate() + '/' + new_date.getFullYear()
	};

};
function dryingPaint() {
	setTimeout(function() {
		$('#paint').removeClass('drying').addClass('dry');
		$('#cracks').show();
	}, 7200000);
}
;
function effects() {
	var images = ['bam.png', 'boom.png', 'crunch.png', 'kaboom.png', 'klang.png',
				  'krack.png', 'oomph.png', 'ow.png', 'phoomph.png', 'ping.png',
				  'pow.png', 'skreech.png', 'splat.png', 'thwack.png', 'wham.png',
				  'zazam.png', 'zoom.png'];

	images = _.map(images, function (image_name) {
		var image_path = '/assets/' + image_name;
		$('<img/>')[0].src = image_path;
		return image_path;
	});

	$('body').on('click', function (e) {
		var x = e.pageX;
		var y = e.pageY;

		var image_path = images[randomInt(0, 16)];
		$('<img src=' + image_path +'>').load(function () {
			$(this).css({
    			top: y - this.height / 2,
    			left: x - this.width / 2,
    			position: 'absolute'
        	}).appendTo('#image_container');
		});
	});

	$('body').disableSelection();	
};
function electroBounce() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var nodes = [];
	var picker = '#ffffff';
	var monochrome;
	var distance;
	var speed;
	var line_width;
	var timeout;

	canvas.height = height;
	canvas.width = width;

	initNodes();
	paintScreen();

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		var color = monochrome ? '#' + picker : randomColorHex();

		nodes.push(new Node(x, y, color));
	});

	$('body').on('mousemove', function () {
		clearTimeout(timeout);
		$('#control_container').show();

		timeout = setTimeout(function () {
			$('#control_container').fadeOut(500);
		}, 5000);
	});

	$('#control_container').on('click', function () {
		clearTimeout(timeout);
	});

	$('#reset').on('click', function () {
		nodes = [];
		initNodes();
	});

	$('.speed').on('click', function () {
		speed *= this.id == 'speed_inc' ? 1.1 : 0.9;
	});

	$('.dist').on('click', function () {
		distance += this.id == 'dist_inc' ? 10 : -10;

		distance = distance > 0 ? distance : 0;
	});

	$('.width').on('click', function () {
		line_width += this.id == 'width_inc' ? 1 : -1;

		line_width = line_width > 1 ? line_width : 1;
	});

	$('#color_toggle').on('click', function () {
		if (monochrome) {
			monochrome = false;

			_.each(nodes, function (node) {
				node.color = randomColorHex();
			});
			$('#color_toggle').text('GO MONO');
			$('#color_picker').hide();
		} else {
			monochrome = true;

			_.each(nodes, function (node) {
				node.color = picker;
			});

			$('#color_toggle').text('GO MULTI');
			$('#color_picker').show();
		}
	});

	$('.picker').on('change', function () {
		picker = '#' + this.value;

		_.each(nodes, function (node) {
			node.color = picker;
		});
	});

	$('body').disableSelection();

	function initNodes() {
		var y = Math.random() * canvas.height;
		var color = randomColorHex();
		var x = Math.random() * canvas.width;

		if (nodes.length == 0) {
			if (monochrome) {
				monochrome = false;

				_.each(nodes, function (node) {
					node.color = randomColorHex();
				});
				$('#color_toggle').text('GO MONO');
				$('#color_picker').hide();
			}			

			distance = 150;
			speed = 1;
			line_width = 1;
		}

		nodes.push(new Node(x, y, color));

		if (nodes.length < 30) {
			initNodes();
		}
	}

	function Node(x, y, color) {
		this.x = x;
		this.y = y;
		this.vx = randomInt(-2, 2);
		this.vy = randomInt(-2, 2);
		this.color = color;

		this.draw = function () {
			var node = this;

			_.each(nodes, function (other_node) {
				dx = node.x - other_node.x;
				dy = node.y - other_node.y;
				dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < distance) {
					ctx.beginPath();
					ctx.strokeStyle = node.color;
					ctx.lineWidth = line_width;
					ctx.lineCap = 'round';
					ctx.moveTo(node.x, node.y);
					ctx.lineTo(other_node.x, other_node.y);
					ctx.stroke();
					ctx.closePath();
				}
			});

			this.evolve();
		};

		this.evolve = function () {
			if (this.x >= canvas.width || this.x <= 0) {
				this.vx *= -1;
			}
			if (this.y >= canvas.height || this.y <= 0) {
				this.vy *= -1;
			}

			this.x += this.vx * speed;
			this.y += this.vy * speed;
		}
	}

	function paintScreen() {
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(0,0,canvas.width, canvas.height);

		_.each(nodes, function (node) {
			node.draw();
		});

		requestAnimFrame(paintScreen);
	}
}
;
function elevationPage() {
	var geocoder = new google.maps.Geocoder();
	var elevator = new google.maps.ElevationService();
	var path = [];
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = 750;
	var height = 450;
	var sample_size = 250;
	var drawing;

	canvas.width = width;
	canvas.height = height;

	$('#start').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		path = [];
		var start_loc = $('#start').val();
		var end_loc = $('#end').val();

		var locations = [
			start_loc,
			end_loc
		];

		clearTimeout(drawing);

		$('#form_container').fadeOut(300, function () {
			$('h1').remove();
			$('p').remove();
			$('.btn').css('display', 'inline-block');
			$('.input').css({
				'margin': 5
			});

			$('#start').focus();

			$('#form_container').css({
				'width': 720,
				'padding': 10
			}).fadeIn(300);

			$('#graph_container').fadeIn(300, function () {
				getLatLng(locations);
			});
		});
	});

	function getLatLng(locations) {
		_.each(locations, function (loc, i) {
			geocoder.geocode( {'address': loc}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// var latlng = new google.maps.LatLng(results[0].geometry.location.lb, results[0].geometry.location.mb);
					var latlng = results[0].geometry.location;
					path.push(latlng);

					if (i == 0){
						$('#start').attr('placeholder', results[0].formatted_address).val('');						
					} else {
						$('#end').attr('placeholder', results[0].formatted_address).val('');						
					}

					if (path.length == 2) {
						getElevations();
					} 
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});
		});
	}

	function getElevations() {
		var path_request = {
			'path': path,
			'samples': sample_size
		}

		elevator.getElevationAlongPath(path_request, plotElevation);
	}

	function plotElevation(results, status) {
		ctx.clearRect(0,0,width,height);
		if (status == google.maps.ElevationStatus.OK) {
			getAdjustedPoints(results);
		} else {
			alert("Unable to plot elevations for the following reason: " + status);
		}
	}

	function getAdjustedPoints(locations) {
		var elevations = _.map(locations, function(elev) {
			return elev.elevation;
		});

		var high = Math.max.apply( Math, elevations );
		var low = Math.min.apply( Math, elevations );

		var adj_elev = _.map(elevations, function(elev) {
			return height - ((elev - low) / (high - low) * height);
		});

		$('#min').text('Min Elevation: ' + low.toFixed(2) + ' m');
		$('#max').text('Max Elevation: ' + high.toFixed(2) + ' m');

		drawPlotLine(0, adj_elev, 1);
	}

	function drawPlotLine(x, elevations, i) {
		var spacing = width / sample_size;

		if (elevations.length >= i + 1) {
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#fff';
			ctx.moveTo(x, elevations[i - 1])
			x += spacing;
			ctx.lineTo(x, elevations[i]);
			ctx.lineJoin = 'miter';
			ctx.stroke();
			ctx.closePath();

			drawing = setTimeout(function () {
				drawPlotLine(x, elevations, i+1);
			}, 50);
		}
	}
}
;
function emergencyOff() {
	var length = 10;

	$('button').on('click', function () {
		$('.modal').fadeIn(800);
		setTimeout(startProgressBar, 800);
	});

	function startProgressBar() {
		$('.inner_modal.progress_bar').fadeIn(300);
		setTimeout(function () {
			$('.inner_bar').css('width', length);

			incrementBar();
		}, 100);
	};

	function incrementBar() {
		length++;

		if (length > 395) {
			length = 10;
			shutDown();
		} else {
			$('.inner_bar').css('width', length);
			setTimeout(incrementBar, 20);
		}
	};

	function shutDown() {
		$('.inner_modal.progress_bar').hide();
		$('.inner_modal.shut_down').show();
		$('#content').addClass('flicker');

		setTimeout(function () {
			$('#content').html('');
			$('body').css('background-color', 'black');
			$('.shut_down').addClass('flicker');
			
			setTimeout(function () {
				$('body').html('');
			}, 1000);

		}, 400);
	}
}
;
function fishyFriend() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight,
		w = window.innerWidth,
		fish_left = new Image(),
		fish_right = new Image(),
		mouseX = 0, 
		mouseY = 0,
		bubbles =[];

	canvas.height = h;
	canvas.width = w;

	$(document).on('mousemove', function (e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	document.addEventListener('touchmove', function(e) {
    	e.preventDefault();

    	mouseX = e.pageX;
		mouseY = e.pageY;
	}, false);

	function Bubble() {
		this.x = randomInt(0, w);
		this.y = randomInt((h + 70), (h + 100));
		this.speed = Math.random() * 2;
		this.size = Math.random() * 6;
	};

	function drawBubble() {
		_.each(bubbles, function (b, i){
			var grd=ctx.createRadialGradient(b.size + b.x, b.size + b.y, b.size*3, b.size + b.x, b.size + b.y, b.size);
			grd.addColorStop(0,"rgba(91,174,252,0.7)");
			grd.addColorStop(.7,"rgba(207,231,254,0.5)");

			ctx.fillStyle = grd;
			ctx.shadowBlur = 2;
			ctx.shadowColor = "rgba(255,255,255, 0.3)"
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
			ctx.fill();
			
			if (b.y < 0 - b.size * 2) {
				bubbles[i] = new Bubble;
			}
			b.y -= b.speed;
		});
		drawFish();
	};


	function drawFish() {
		if (fish_left.horizontal + 100 > mouseX) {
			ctx.drawImage(fish_left, fish_left.horizontal, fish_left.vertical);						
		} else {
			ctx.drawImage(fish_right, fish_right.horizontal, fish_right.vertical);					
		}


		setTimeout(paintScreen, 50);
	};

	function evolveFish() {
		fish_left.horizontal += (mouseX - fish_left.horizontal - 100) / 40;
		fish_left.vertical += (mouseY - fish_left.vertical - 61.5) / 40;

		fish_right.horizontal += (mouseX - fish_right.horizontal - 100) / 40;
		fish_right.vertical += (mouseY - fish_right.vertical - 61.5) / 40;
		drawBubble();
	};

	function paintScreen() {
		ctx.clearRect(0,0,w,h);
		evolveFish();
	};


	fish_right.onload = function () {
		paintScreen();

		for (var i = 0; i < 40; i++) {
			bubbles.push(new Bubble());
		}
	};
	
	fish_left.horizontal = 0;
	fish_left.vertical = 0;
	fish_right.horizontal = 0;
	fish_right.vertical = 0;

	fish_left.src = '/assets/fishy_friend.png';
	fish_right.src = '/assets/fishy_friend_right.png';


}
;
function forest() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight;
	var current_color = '#592718';
	var brush = 'tree';

	canvas.width = width;
	canvas.height = height;

	function makeLeaf(x, y) {
		ctx.fillStyle = current_color;
		ctx.strokeStyle = 'rgba(255,255,255,0.1)';
		ctx.save();
		ctx.beginPath();
		ctx.translate(x, y);
	    ctx.rotate(randomInt(0, 360) * (Math.PI / 180));
	    ctx.translate(-x, -y);
	    
		ctx.moveTo(x, y);
		ctx.quadraticCurveTo(x + 7, y - 7, x + 14, y);
		ctx.moveTo(x, y);
		ctx.quadraticCurveTo(x + 7, y + 7, x + 14, y);
		ctx.lineJoin = 'round'
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	function makeBranch(x0, y0, angle, length, size) {
		if (size > 0) {
			var xf = x0 + length * Math.cos(angle);
			var yf = y0 + length * Math.sin(angle);
			var num_sub_branch = randomInt(2,5);
			var new_length = length * 0.5 + randomInt(-5, 10);

			ctx.lineWidth = size * 0.6;
			ctx.strokeStyle = current_color;
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(xf, yf);
			ctx.lineJoin = 'miter';
			ctx.stroke();

			_.each(_.range(num_sub_branch), function (num) {
				var new_angle = angle + Math.random() * 3 * Math.PI / 4 - 3 * Math.PI / 4 / 2;
				var new_size = size - 1;

				setTimeout(function () {
					makeBranch(xf, yf, new_angle, new_length, new_size);
				}, 70); 
			});
		}
	}

	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,width,height);

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		if (brush == 'tree') {
			makeBranch(x, y, -Math.PI / 2, randomInt(50, 80), 5);
		} else {
			makeLeaf(x, y);
		}	
	});

	$('canvas').on('mousedown', function () {
		if (brush == 'leaf') {
			$('canvas').on('mousemove', function (e) {
				var x = e.pageX - canvas.offsetLeft;
				var y = e.pageY - canvas.offsetTop;

				makeLeaf(x, y);
			});

			$('canvas').on('mouseup', function () {
				$('canvas').off('mousemove');
			});
		}
	});

	$('.color').on('change', function () {
		current_color = '#' + this.color;
	});

	$('#tree_btn').on('click', function () {
		brush = 'tree';
	});

	$('#leaf_btn').on('click', function () {
		brush = 'leaf';
	});

	$('body').disableSelection();
}
;
function googleFontsBrowser () {
	var url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDgafgp1DZT6I464W9r4FDiD25HfC3a1zc';
	var api_url_prefix = 'https://fonts.googleapis.com/css?family=';
	var family_list = [];
	var fonts = [];
	var font_input = $('#font_input');
	var autocomplete = $('#autocomplete');

	$.ajax({
		url: url,
		type: "GET",
		dataType: 'json',
		success: function (data) {
			extractFonts(data);
		},
		error: function (xhr, status) {
			alert('There was a problem retrieving the fonts.');
		}
	});

	font_input.on('keyup', function () {
		getFontList($(this).val());
	}).on('focus', function () {
		autocomplete.show();
	});

	$('form').on('submit', function (e) {
		e.preventDefault();
		applyFont(font_input.val());
	});

	function extractFonts(data) {
		_.each(data.items, function (font_data) {
			font = {
				family: font_data.family,
				subsets: font_data.subsets,
				variants: font_data.variants
			};

			family_list.push(font.family);
			fonts.push(font);
		});
	}

	function getFontList(input) {
		length = input.length;
		autocomplete.show();
		autocomplete.html('');

		if (input.length) {
			_.each(family_list, function (family) {
				if (family.slice(0, length).toLowerCase() == input.toLowerCase()) {
					$('<li>', {
						text: family
					}).on('click', function() {
						font_input.val(family);
						applyFont(family);
					}).appendTo(autocomplete);
				}
			});
		}
	}

	function applyFont(req_font) {
		req_font = $.trim(req_font);
		autocomplete.hide();

		var formatted_font = _.find(family_list, function (family) {
			return family.toLowerCase() == req_font.toLowerCase();
		});

		if (formatted_font) {
			var font = _.findWhere(fonts,  { family: formatted_font });
			var api_url = api_url_prefix + font.family.replace(/ /g, '+') + ':' + font.variants.join() + '&subset=' + font.subsets.join();

			$('.google_font').remove();
			$(font_input).attr('placeholder', font.family).val('');
			$('.sample').css('font-family', font.family);
			$('#api_tag').text('<link href="' + api_url + '" rel="stylesheet" type="text/css">')
			$('head').append('<link href="' + api_url + '" rel="stylesheet" type="text/css" class="google_font">');
		}
	}
}
;
function globGlob() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var globs = [];
	var r_min = 5;
	var winner_color = { h:336.8, s:50, l:44.7 };
	var challenger_color = { h:163, s:80, l:45.1 };
	var game_length = 10;
	var display_time = game_length;
	var running = false;
	var start;
	var	elapsed = 0;

	var last_glob_size = $('canvas').data('size');

	canvas.height = height;
	canvas.width = width;

	function Glob(x, y, radius, color) {
		this.opacity = 0.9 / (color.l + 1);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = 'hsl(' + this.color.h + ',' + this.color.s + '%, ' + this.color.l + '%)';
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();

			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 3, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		};
	}

	function endGame() {
		$('body').off();
		$('.score').text(globs[1].radius + ' awesome units!');

		if (globs[1].radius > globs[0].radius) {
			$('#kudos').text('Nice work beating the last glob grower!');
		} else {
			$('#kudos').text('Too bad you couldn\'t beat the last glob grower, though.');
		}

		$('.end').fadeIn(400);
		$.ajax({
			type: 'PUT',
			url: '/glob_glob/globs/1',
			data: {
				size: globs[1].radius
			}
		});
	}

	function paintScreen() {
		elapsed = new Date().getTime() - start;
		display_time = Math.ceil(game_length - elapsed / 1000);

		ctx.clearRect(0, 0, width, height);

		_.each(globs, function (glob) {
			glob.draw();
		});

		ctx.fillStyle = '#eb7405';
		ctx.font = '30px Futura';
		ctx.textAlign = 'center';
		ctx.fillText(display_time, width / 2, 80);

		if (elapsed >= game_length * 1000) {
			endGame();
			return;
		}
		setTimeout(paintScreen, 30);
	}

	function init() {
		globs.push(new Glob(width/3, height/2, last_glob_size, winner_color));
		globs.push(new Glob(width * (2/3), height/2, 10, challenger_color));

		_.each(globs, function (glob) {
			glob.draw();
		});

		ctx.fillStyle = '#eb7405';
		ctx.font = '30px Futura';
		ctx.textAlign = 'center';
		ctx.fillText(display_time, width / 2, 80);
	}

	init();

	$('body').on('keydown', function (e) {
		var key = e.charCode || e.keyCode;
		if (key == 32 && !running) {
			running = true;
			start = new Date().getTime();
			$('.start').fadeOut(200);
			paintScreen();
		}
	});

	$('body').on('keyup', function (e) {
		var key = e.charCode || e.keyCode;
		if (key == 32) {
			globs[1].radius += 1;
		}
	});

	$('body').disableSelection();
}
;
function globulator() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		width = window.innerWidth,
		height = window.innerHeight,
		globs = [],
		stationary = true,
		r_min = 5,
		mousedown_coodinates = {x: 0, y: 0};

	var selectedGlob = null;

	canvas.height = height;
	canvas.width = width;

	function Glob(x, y, radius, color) {
		this.opacity = 0.9 / (color.l + 1);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.tracking = false;

		this.volume = function () {
			return (Math.PI * this.radius) * ((Math.PI * r_min * r_min)/4 + r_min * (this.radius - r_min));
		};

		this.trackMouse = function (x, y) {
			if (this.tracking) {
				this.x = x;
				this.y = y;
			}
		};

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = 'hsl(' + this.color.h + ',' + this.color.s + '%, ' + this.color.l + '%)';
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();

			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 3, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		};
		this.drag = function (x, y) {
			this.x = x;
			this.y = y;
		};
	};

	function makeGlob(x, y, radius, color) {
		globs.push(new Glob(x, y, radius, color));
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(globs, function (glob) {
			glob.draw();
		});

		requestAnimFrame(paintScreen);
	};

	function checkIfGlobGrabbed(x, y) {
		_.each(globs, function (glob) {
			if (x > glob.x - glob.radius && x < glob.x + glob.radius && 
				y > glob.y - glob.radius && y < glob.y + glob.radius) {

				selectedGlob = glob;
				selectedGlob.tracking = true;			
			}
		});

		return null;
	};

	function combinedRadius(v1, v2) {
		var A = Math.PI * r_min;
		var B = Math.PI * Math.PI * r_min * r_min / 4 - Math.PI * r_min * r_min;
		var C = -v1 - v2;

		return ((-B + Math.pow(B * B - 4 * A * C, 0.5)) / (2 * A))
	};

	function newPosition(glob_1, glob_2) {
		var vt = glob_1.volume() + glob_2.volume();
		var xf = glob_1.volume() / vt * glob_1.x + glob_2.volume() / vt * glob_2.x;
		var yf = glob_1.volume() / vt * glob_1.y + glob_2.volume() / vt * glob_2.y;

		return {x: xf, y: yf};
	};

	function newColor(glob_1, glob_2) {
		var vt = glob_1.volume() + glob_2.volume();
		var hue = (glob_1.color.h + glob_2.color.h) % 360;
		var sat = (glob_1.volume() / vt * glob_1.color.s + glob_2.volume() / vt * glob_2.color.s);
		var light = (glob_1.volume() / vt * glob_1.color.l + glob_2.volume() / vt * glob_2.color.l);


		return {h: hue, s: sat, l: light};
	}

	function checkIfGlobCombined() {
		var new_radius;
		var new_position;
		var new_color;

		globs = _.reject(globs, function (glob) {
			var distance = Math.sqrt(Math.pow(selectedGlob.x - glob.x, 2) + Math.pow(selectedGlob.y - glob.y , 2));
			if (selectedGlob != glob &&	distance < selectedGlob.radius + glob.radius - 4) {

				new_radius = combinedRadius(selectedGlob.volume(), glob.volume());
				new_position = newPosition(selectedGlob, glob);
				new_color = newColor(selectedGlob, glob);
				
				return true;
			}
		});

		if (new_radius) {
			selectedGlob.x = new_position.x;
			selectedGlob.y = new_position.y;
			selectedGlob.radius = new_radius;
			selectedGlob.color = new_color;
			selectedGlob.opacity = 0.9 / (new_color.l + 1);
		}
		
	}

	$('canvas').on('mousedown', function (e) {
		mouse_x = e.pageX - canvas.offsetLeft;
		mouse_y = e.pageY - canvas.offsetTop;

		checkIfGlobGrabbed(mouse_x, mouse_y);
		stationary = true;
		mousedown_coodinates = {x: mouse_x, y: mouse_y};
	});

	$('canvas').on('mousemove', function (e) {
		mouse_x = e.pageX - canvas.offsetLeft;
		mouse_y = e.pageY - canvas.offsetTop;

		if (Math.abs(mousedown_coodinates.x - mouse_x) > 10 || Math.abs(mousedown_coodinates.y - mouse_y) > 10) {
			stationary = false;
		}

		if (selectedGlob) {
			selectedGlob.trackMouse(mouse_x, mouse_y);

			checkIfGlobCombined();
		}
	});

	$('canvas').on('mouseup', function (e) {
		if (selectedGlob) {
			selectedGlob.tracking = false;
			selectedGlob = null;
		}
	});

	$('canvas').on('click', function (e) {
		var inside_circle = false,
			mouse_x = e.pageX - canvas.offsetLeft,
			mouse_y = e.pageY - canvas.offsetTop;

		_.each(globs, function (glob) {
			if (mouse_x > glob.x - glob.radius && mouse_x < glob.x + glob.radius && 
				mouse_y > glob.y - glob.radius && mouse_y < glob.y + glob.radius) {

				inside_circle = true;
			}
		});

		if (stationary && !inside_circle) {
			makeGlob(mouse_x, mouse_y, randomInt(5, 50), randomColorHSL());		
		}
	});

	paintScreen();

	$('body').disableSelection();

};








function hangmanGame() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 300,
		width = 700,
		letters = ("abcdefghijklmnopqrstuvwxyz").split(""),
		word = getWord(),
		bad_guesses = 0,
		good_guesses = 0,
		running = true;

		canvas.height = height;
		canvas.width = width;

	function drawGallows() {
		ctx.strokeStyle = "#7f8c8d";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(250, 300);
		ctx.lineTo(250, 50);
		ctx.lineTo(350, 50);
		ctx.stroke();
		ctx.closePath();
	};

	function drawHead() {
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(350.5, 80, 30, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};
	function drawBody() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 110);
		ctx.lineTo(350.5, 190);
		ctx.closePath();
		ctx.stroke();
	};
	function drawArm1() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 135);
		ctx.lineTo(290, 100);
		ctx.closePath();
		ctx.stroke();
	};
	function drawArm2() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 135);
		ctx.lineTo(410, 100);
		ctx.closePath();
		ctx.stroke();
	};
	function drawLeg1() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 189.5);
		ctx.lineTo(385, 250);
		ctx.closePath();
		ctx.stroke();
	};
	function drawLeg2() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 189.5);
		ctx.lineTo(315, 250);
		ctx.closePath();
		ctx.stroke();
	};

	function makeWordSlots() {
		var word_array = word.split('');
		_.each(word_array, function (letter, i) {
			$('<div/>', {
				class: "letter_slot",
				id: i
			}).appendTo('#word_container');			
		});
	};

	function updateWordSlot(array, letter) {
		_.each(array, function (num) {
			$('#' + num).text(letter);
			good_guesses++;
		});

		if (good_guesses == word.length && running) {
			$('.win').fadeIn(300);
		}
	};

	function makeLetterButtons() {
		_.each(letters, function(letter) {
			$('<button/>', {
				text: letter,
				id: "btn_" + letter
			}).on('click', function () {
				$(this).attr('disabled','disabled').off();

				checkGuess($(this).text());
			}).appendTo('#btn_container');
		});
	};

	function checkGuess(letter) {
		var check_word = word;
		var indices = [];
		
		while (_.indexOf(check_word, letter) != -1) {
			var i = _.lastIndexOf(check_word, letter);
			indices.push(i);
			check_word = check_word.slice(0, i);			
		}

		if (indices.length > 0) {
			updateWordSlot(indices, letter);
		} else {
			switch (bad_guesses) {
				case 0:
					drawHead();
					break;
				case 1:
					drawBody();
					break;
				case 2:
					drawArm1();
					break;
				case 3:
					drawArm2();
					break;
				case 4:
					drawLeg1();
					break;
				case 5:
					drawLeg2();
					gameOver();
					break;
			}
			bad_guesses++;
		}
	};

	function gameOver() {
		running = false;
		$('.game_over').fadeIn(500);

		_.each(word, function(letter, i) {
			if ($('#'+i).text() == '') {
				$('#'+i).addClass('fail').text(letter);
			}
		});
	};

	function init() {
		makeWordSlots();
		drawGallows();
		makeLetterButtons();
	};

	init();

	$('body').on('keypress', function (e) {
		var key = e.charCode || e.keyCode;
		if (key >= 97 && key <= 122) {
			var letter = String.fromCharCode(key);
			$('#btn_' + letter).click();
		}
	});
	
	function getWord() {
	  var a = new Array('abate','aberrant','abscond','accolade','acerbic','acumen','adulation','adulterate','aesthetic','aggrandize','alacrity','alchemy','amalgamate','ameliorate','amenable','anachronism','anomaly','approbation','archaic','arduous','ascetic','assuage','astringent','audacious','austere','avarice','aver','axiom','bolster','bombast','bombastic','bucolic','burgeon','cacophony','canon','canonical','capricious','castigation','catalyst','caustic','censure','chary','chicanery','cogent','complaisance','connoisseur','contentious','contrite','convention','convoluted','credulous','culpable','cynicism','dearth','decorum','demur','derision','desiccate','diatribe','didactic','dilettante','disabuse','discordant','discretion','disinterested','disparage','disparate','dissemble','divulge','dogmatic','ebullience','eccentric','eclectic','effrontery','elegy','eloquent','emollient','empirical','endemic','enervate','enigmatic','ennui','ephemeral','equivocate','erudite','esoteric','eulogy','evanescent','exacerbate','exculpate','exigent','exonerate','extemporaneous','facetious','fallacy','fawn','fervent','filibuster','flout','fortuitous','fulminate','furtive','garrulous','germane','glib','grandiloquence','gregarious','hackneyed','halcyon','harangue','hedonism','hegemony','heretical','hubris','hyperbole','iconoclast','idolatrous','imminent','immutable','impassive','impecunious','imperturbable','impetuous','implacable','impunity','inchoate','incipient','indifferent','inert','infelicitous','ingenuous','inimical','innocuous','insipid','intractable','intransigent','intrepid','inured','inveigle','irascible','laconic','laud','loquacious','lucid','luminous','magnanimity','malevolent','malleable','martial','maverick','mendacity','mercurial','meticulous','misanthrope','mitigate','mollify','morose','mundane','nebulous','neologism','neophyte','noxious','obdurate','obfuscate','obsequious','obstinate','obtuse','obviate','occlude','odious','onerous','opaque','opprobrium','oscillation','ostentatious','paean','parody','pedagogy','pedantic','penurious','penury','perennial','perfidy','perfunctory','pernicious','perspicacious','peruse','pervade','pervasive','phlegmatic','pine','pious','pirate','pith','pithy','placate','platitude','plethora','plummet','polemical','pragmatic','prattle','precipitate','precursor','predilection','preen','prescience','presumptuous','prevaricate','pristine','probity','proclivity','prodigal','prodigious','profligate','profuse','proliferate','prolific','propensity','prosaic','pungent','putrefy','quaff','qualm','querulous','query','quiescence','quixotic','quotidian','rancorous','rarefy','recalcitrant','recant','recondite','redoubtable','refulgent','refute','relegate','renege','repudiate','rescind','reticent','reverent','rhetoric','salubrious','sanction','satire','sedulous','shard','solicitous','solvent','soporific','sordid','sparse','specious','spendthrift','sporadic','spurious','squalid','squander','static','stoic','stupefy','stymie','subpoena','subtle','succinct','superfluous','supplant','surfeit','synthesis','tacit','tenacity','terse','tirade','torpid','torque','tortuous','tout','transient','trenchant','truculent','ubiquitous','unfeigned','untenable','urbane','vacillate','variegated','veracity','vexation','vigilant','vilify','virulent','viscous','vituperate','volatile','voracious','waver','zealous');
	  return a[parseInt(Math.random()* a.length)];
	};
};
function herePage() {
	navigator.geolocation.getCurrentPosition(requestLocalImages, handleError);

	function requestLocalImages(position) {
		$('#loading').fadeIn(300);
		$.ajax({
			type: 'POST',
			url: '/here/page',
			dataType: "json",
			data: {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			},
			complete: function (data) {
				loadPhotos(data.responseText)
			},
			error: function () {
				$('#error p').html('Looks like there was a problem finding your location. <br> Maybe <a href="/here/page">try again</a>?');
				$('#error').show();
			}
		});
	}

	function handleError(err) {
		$('#start').hide();
		if (err.code == 1) {
			$('#error p').html('This website requires location services. <br> Please allow geolocation and <a href="/here/page">reload</a> to continue.');
		} else {
			$('#error p').html('Looks like there was a problem finding your location. <br> Maybe <a href="/here/page">try again</a>?');			
		}
		$('#error').show();
	}

	function loadPhotos(response) {
		var images = $.parseJSON(response)

		if (images.length < 1) {
			$('#info, #loading').hide();
			$('#error p').text('Oh dear, this is unfortunate. We can\'t seem to find any Instagram photos near you.')
			$('#error').fadeIn();
		} else {
			_.each(images, function (img) {
				$('<img />', {
					src: img.img_url
				}).appendTo('#img_container');
			});

			showPhotos();
		}
	}

	function showPhotos() {
		$('#info, #loading').fadeOut(200, function () {
			$('#here').fadeIn(800, function () {
				setTimeout(function () {
					$('.modal').fadeOut(1000);
				}, 1200);
			});
		});
	}
}
;
function hollywoodSign() {
	$('#l0').on('click', function () {
		var delay = 0,
			time_step = 150,
			blink;

		_.each(_.range(9), function (id, i) {
			setTimeout(function () {
				$('#l' + id).addClass('wave');
			}, i * time_step);
	
			setTimeout(function() {
				$('#l' + id).removeClass('wave');
			}, i * time_step + 700);
		});
	});

	$('#l4').on('click', function () {
		makeBlink();
		$(this).off();
	});

	$('#l5').on('click', function () {
		clearInterval(blink);
		$('.letter').css('color', '#ebe0d1');

		$('#l4').on('click', function () {
			makeBlink();
			$(this).off();
		});
	});

	$('#l8').on('click', function () {
		$(this).addClass('dangle');
		setTimeout(function () {
			$('#l8').removeClass('dangle');
		}, 4000);
	});

	$('body').disableSelection();

	function makeBlink() {
		blink = setInterval(function () {
			$('.letter').css('color', randomColorHex());
		}, 500);
	}
};
function hourglass() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 400,
		width = 201,
		mask = new Image(),
		time = 10000,
		interval = 50,
		top_sand = {
			y: -110
		},
		bottom_sand = {
			y: 0
		};

	canvas.height = height;
	canvas.width = width;

	function evolveSand() {
		var increment = 110 / (time/interval)
		top_sand.y += increment;
		bottom_sand.y -= increment;

		setTimeout(paintScreen, interval);
	};

	function drawCanvas() {
		ctx.fillStyle = '#1abc9c';
		ctx.strokeStyle = '#1abc9c';
		ctx.fillRect(0, 200, width, top_sand.y);
		ctx.fillRect(0, 397, width, bottom_sand.y);

		if (top_sand.y >= 0){
			top_sand.y = 0;
			$('.times_up').show();
		} else {
			drawStream();
			evolveSand();
		}	

		ctx.drawImage(mask, mask.horizontal, mask.vertical);
	};

	function drawStream() {
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.moveTo(width / 2, 200);
		ctx.lineTo(width /2, height);
		ctx.closePath();
		ctx.stroke();

	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		drawCanvas();
	};

	$('form').on('submit', function (e) {
		e.preventDefault();

		var entry = Number($('.time').val());

		if (_.isNaN(entry)) {
			alert("Time limit must be a number.");
		} else {
			time = entry * 60000;
			$('.modal').hide();
			paintScreen();
		}
	});

	mask.horizontal = 0;
	mask.vertical = 0;

	mask.src = '/assets/hourglass.png';
};
function imageEditor() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth - 160;
	var height = window.innerHeight - 100;
	var img = document.createElement('img');
	var hiddenCanvas = document.createElement('canvas');
    var hidden_ctx = hiddenCanvas.getContext('2d');
    var canvas_clear = true;
    var body = $('body')[0];

	canvas.width = width;
	canvas.height = height;

	img.addEventListener('load', function () {
		clearCanvas();
		drawImportedImage();
	}, false);

	body.addEventListener('dragover', function (e) {
		$('.modal').fadeOut(300);
		e.preventDefault();
	}, false);

	body.addEventListener('drop', function (e) {
		var files = e.dataTransfer.files;

		if (files.length > 0) {
			var file = files[0];
			if(typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = function (e) {
					img.src = e.target.result;
					drawImportedImage();
				}
				reader.readAsDataURL(file); 
			}
		}
		e.preventDefault();
	}, false);

	$('#image_loader').on('change', function (e) {
		$('.modal').fadeOut(300);
		var reader = new FileReader();
  		reader.onload = function(event){
	        img.src = event.target.result;
	        drawImportedImage();
	    }
	    reader.readAsDataURL(e.target.files[0]);
	});

	$('#grayscale').on('click', function () {
		grayscaleFilter();
	});

	$('#vintage').on('click', function () {
		vintageFilter();
	});

	$('.bright').on('click', function () {
		var adjustment = $(this).data('value');
		brightnessFilter(adjustment * 3);
	});

	$('.rgba').on('click', function () {
		var adjustment = $(this).data('value');
		var color = $(this).data('color');
		rgbaFilter(color, adjustment * 3);
	});

	$('.resize').on('change', function () {
		var scale = $(this).val();

		if ($.isNumeric(scale)) {
			hidden_ctx.clearRect(0,0, hiddenCanvas.width, hiddenCanvas.height);
			hiddenCanvas.width = canvas.width;
			hiddenCanvas.height = canvas.height;
			hidden_ctx.drawImage(canvas, 0, 0);

			clearCanvas();
			canvas.height *= scale;
			canvas.width *= scale;
			ctx.drawImage(hiddenCanvas, 0, 0, canvas.width, canvas.height);
		} else {
			alert('Resize percentage must be a decimal number.');
		}
		$(this).val('');
	});

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('#reset').on('click', function () {
		clearCanvas();
		if (!canvas_clear) {
			drawImportedImage();
		}
	});

	$('#clear').on('click', function () {
		clearCanvas();
		canvas.width = width;
		canvas.height = height;
		canvas_clear = true;
		$('.modal').show();
	});

	$('body').disableSelection();

	function clearCanvas() {
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}

	function grayscaleFilter() {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			var brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

			data[i] = brightness;
    		data[i+1] = brightness;
    		data[i+2] = brightness;
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function vintageFilter() {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			data[i] = 0.393 * data[i] + 0.769 * data[i+1] + 0.189 * data[i+2];
    		data[i+1] = 0.349 * data[i] + 0.686 * data[i+1] + 0.168 * data[i+2];
    		data[i+2] = 0.272 * data[i] + 0.534 * data[i+1] + 0.131 * data[i+2];
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function brightnessFilter(adjustment) {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			data[i] += adjustment;
    		data[i+1] += adjustment;
    		data[i+2] += adjustment;
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function rgbaFilter(color, adjustment) {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			if (color == 'red') {
				data[i] += adjustment;
			} else if (color == 'green'){
    			data[i+1] += adjustment;
			} else if (color == 'blue') {
    			data[i+2] += adjustment;
			} else if (color == 'alpha') {
				data[i+3] += adjustment;
			}
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function drawImportedImage() {
		canvas_clear = false;
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
	}
}
;
function imagePalette() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var img = document.createElement('img');
	var w = 300;
	var h = 200;

	canvas.width = w;
	canvas.height = h;

	var has_text = true;
	var clearCanvas = function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		has_text = false;
	};

	ctx.font = '16px Geneva';
	ctx.textAlign = 'center';
	ctx.fillStyle = '#999';

	ctx.fillText("Drag an image from your", w/2, h/2 - 60);
	ctx.fillText("computer into this box.", w/2, h/2 - 35);
	ctx.fillText("Click on the image to add", w/2, h/2 + 35);
	ctx.fillText("the color to the color palette.", w/2, h/2 + 60);

	// Img loading
	img.addEventListener('load', function () {
		clearCanvas();
		canvas.width = img.width;
		canvas.height = img.height;
		$('canvas').css('cursor', 'crosshair');
		ctx.drawImage(img, 0, 0);
	}, false);

	// To enable drag and drop
	canvas.addEventListener('dragover', function (e) {
		e.preventDefault();
	}, false);

	// handle dropped img file
	canvas.addEventListener('drop', function (e) {
		var files = e.dataTransfer.files;

		if (files.length > 0) {
			var file = files[0];
			if(typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = function (e) {
					img.src = e.target.result;
				}
				reader.readAsDataURL(file);
			}
		}
		e.preventDefault();
	}, false);

	$('canvas').on('click', function (e) {
		if (!has_text) {
			var canvas_x = (e.pageX - canvas.offsetLeft);
			var canvas_y = (e.pageY - canvas.offsetTop);
			var imageData = ctx.getImageData(canvas_x, canvas_y, 1, 1);
			var colors = imageData.data;

			$('button').show();

			pushSwatchToPalette(colors);
		}
	});

	$('button').on('click', function () {
		$('button').hide();
		$('#palette').html('');
	});

	function pushSwatchToPalette(color) {
		var div = $('<div />', {
				class: 'swatch_container'
			});

		var swatch = $('<div />', {
			class: "swatch",
			style: 'background-color: rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')'
		});

		$(div).append(swatch)
			  .append('<div class="swatch_info"><div class="label">RGB: ' +  color[0] + ', ' + color[1] + ', ' + color[2] + '</div><div class="label">HEX: #' + rgbComponentToHex(color[0]) + rgbComponentToHex(color[1]) + rgbComponentToHex(color[2]) + '</div>')
			  .prependTo('#palette');
	};

	function rgbComponentToHex(c) {
    	var hex = c.toString(16);
    	return hex.length == 1 ? "0" + hex : hex;
    };
};
function infiniteDescent() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = window.innerHeight,
		width = window.innerWidth,
		center_x = width / 2,
		center_y = height / 2,
		max_dimension = width > height ? width : height;

	var audio = new Howl({
		urls: ['/assets/infinite_descent.mp3', '/assets/infinite_descent.ogg'],
		loop: true,
		autoplay: true,
		volume: 0.85,
	});

	canvas.height = height;
	canvas.width = width;

	function drawSpiral() {
		var angle = Math.PI;
		var radius = 0;

		ctx.clearRect(-max_dimension / 2, -max_dimension / 2, max_dimension * 2, max_dimension * 2);
		
		ctx.beginPath();
	    ctx.translate(center_x, center_y);
	    ctx.rotate(0.1);

		while (radius < max_dimension) {
			angle += 0.1;
			radius = 0.07 * Math.pow(angle, 2);

			x = 0 + radius * Math.cos(angle);
			y = 0 + radius * Math.sin(angle);

			ctx.lineTo(x, y);
		}

		ctx.strokeStyle = "#f0f0f0";
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
	    ctx.translate(-center_x, -center_y);
		
		setTimeout(drawSpiral, 40);
	};

	drawSpiral();
}
;
function keepItUpGame() {
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          window.oRequestAnimationFrame      ||
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight * 0.8,
		w = 500,
		bounces = 0,
		time_interval = 30,
		acceleration = 0.00025,
		running,
		repaint,
		ball = {
			x: w / 2,
			y: h - 30,
			x0: w / 2,
			y0: h - 30,
			v0y: 0.23,
			time: 0,
			r: 20
		};

	canvas.height = h;
	canvas.width = w;

	function paintScreen() {
		ctx.clearRect(0, 0, w, h);
		drawBall();
		updateBounceScore();
	};

	function drawBall() {
		ctx.fillStyle = '#17b078'
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();

		evolveBall();
	};

	function evolveBall() {
		ball.y = ball.y0 - ball.v0y * ball.time + acceleration * Math.pow(ball.time, 2);

		ball.time += time_interval;

		if (ball.y > h + ball.r * 2) {
			clearInterval(repaint);
			$('input.score').val(bounces);
			$('h2.score').text('Your score is ' + bounces);
			$('#game_over').show();
		}
	};

	function checkIfHit(mouseX, mouseY) {
		if (mouseX > ball.x - ball.r && mouseX < ball.x + ball.r && mouseY > ball.y - ball.r && mouseY < ball.y + ball.r) {
			return true;
		}
	};

	function bounceBall() {
		ball.time = 0;
		ball.y0 = ball.y;
		ball.v0y += 0.025;
	};

	function updateBounceScore() {
		ctx.fillStyle = '#de1d91';
		ctx.font = 'bold 18px Lucida Grande';
		ctx.fillText('Score: ' + bounces, 30, 30);
	};

	paintScreen();

	$('.start_btn').on('click', function () {
		$('#start').fadeOut('400');		
	});

	$('canvas').on('mousedown', function (e) {
		var mouseX = e.pageX - canvas.offsetLeft;
		var mouseY = e.pageY - canvas.offsetTop;

		if (checkIfHit(mouseX, mouseY)){
			if (running === undefined) {
				repaint = setInterval(paintScreen, time_interval);
				running = true;
				bounces++;
			} else {
				bounceBall();
				bounces++;
			}
		}
	});

	$('form').on('submit', function (e) {
		if ($('#enter_name').val().length > 30) {
			e.preventDefault();

			$('#enter_name').val('');
			alert('Your name is too long. Better think of a nickname.');
		
		} else if ($('#enter_name').val().trim() == '') {
			e.preventDefault();

			$('#enter_name').val('');
			alert('Too embarrassed to enter a name, huh? TOO BAD! Name can\'t be empty!');
			
		} else {
			$('#enter_name').val($('#enter_name').val().trim());
			$('input.score').val(bounces);
		}
	});

	$('body').disableSelection();
};















function kingOfComments() {
	$('.comment_entry').focus();

	$('#comment_entry_form').on('submit', function (e) {
		if ($('.name_entry').val().length > 30) {
			e.preventDefault();

			$('#enter_name').val('');
			alert('Name limit is 30 characters');
		
		} else if ($('.comment_entry').val().trim() == '') {
			e.preventDefault();

			$('.comment_entry').val('');
			alert('You really have nothing to say except nothing?');
			
		} else {
			$('.comment_entry').val($('.comment_entry').val().trim());
			$('.name_entry').val($('.name_entry').val().trim());
		}
	});

	$('.voter').on('keypress', function (e) {
		if (e.which == 13) {
			e.preventDefault();
		}
	});

};
function letterStorm() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = 800;
	var height = 580;
	var time_interval = 100;
	var letters = [];

	var characters = 'eeeeeeaaaaiiiioooonnnnrrrrttttlllssssuuudddgggbbbcccmmmppffhhvvvwwwyyykkjjxxqqzz'.toUpperCase().split('');
	var guessContainer = {
		x: width / 3,
		y: height - 25,
		word: '',
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#0e1343";
			ctx.fillRect(0, canvas.height - 50, canvas.width, canvas.height);
			ctx.fillStyle = "#fff";
			ctx.font = '28px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillText(this.word, this.x, this.y);
			ctx.closePath();
		}
	};

	var submitBtn = {
		x: width - 200,
		y: height - 50,
		width: 100,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#04acff";
			ctx.fillRect(this.x, this.y, this.width, canvas.height);
			ctx.fillStyle = "#fff";
			ctx.font = '18px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillText('Submit', this.x + this.width / 2, guessContainer.y);
			ctx.closePath();
		}
	};

	var clearBtn = {
		x: width - 100,
		y: height - 50,
		width: 100,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#ff6600";
			ctx.fillRect(this.x, this.y, this.width, canvas.height);
			ctx.fillStyle = "#fff";
			ctx.font = '18px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillText('Clear', this.x + this.width / 2, guessContainer.y);
			ctx.closePath();
		}
	};

	var scoreBoard = {
		x: 30,
		y: 20,
		score: 0,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#0e1343";
			ctx.font = '14px Futura';
     		ctx.textAlign = 'top';
     		ctx.textBaseline = 'middle';
			ctx.fillText('Score: ' + this.score, this.x, this.y);
			ctx.closePath();
		}
	};

	var timer = {
		x: width - 20,
		y: 20,
		time: 300,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = '#04acff';
			ctx.fillRect(this.x, this.y, -1 * this.time, 16);
			ctx.closePath();
			timer.time -= 0.1;
		}
	};

	canvas.height = height;
	canvas.width = width;

	$('#start_btn').on('click', function () {
		$('#start').hide();
		makeLetters();
		paintScreen();		
	});

	$('canvas').on('mousedown', function (e) {
		var mouse_x = e.pageX - canvas.offsetLeft; 
		var mouse_y = e.pageY - canvas.offsetTop; 

		if (mouse_y >= canvas.height - 50) {
			console.log('in cont')
			if (mouse_x > submitBtn.x && mouse_x < submitBtn.x + submitBtn.width) {
				checkSubmission(guessContainer.word);
			} else if (mouse_x > clearBtn.x && mouse_x < clearBtn.x + clearBtn.width) {
				guessContainer.word = '';
			}
		} else {
			checkForHit(mouse_x, mouse_y);
		}
	});

	$(document).on('keypress', function (e) {
		e.preventDefault();
		var key = (e.keyCode ? e.keyCode : e.which);
		var character = String.fromCharCode(e.charCode);

		if (key == 13) {
			checkSubmission(guessContainer.word);
		} else if (key == 32) {
			guessContainer.word = '';
		} else {
			checkKeyPressHit(character);
		}
	});

	function makeLetters() {
		letters.push(new Letter());

		if (letters.length < 12) {
			setTimeout(makeLetters, 600);
		}
	}

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width,canvas.height);

		scoreBoard.draw();
		timer.draw();

		for (var i = 0; i < letters.length; i++) {
			letters[i].draw();
		}
		guessContainer.draw();
		submitBtn.draw();
		clearBtn.draw();

		if (timer.time <= 0) {
			$('#game_over p').text('Your score: ' + scoreBoard.score);
			$('#game_over').show();
		} else {
			requestAnimFrame(paintScreen);
		}
	}

	function Letter() {
		this.init = function () {
			this.character = characters[randomInt(0, characters.length - 1)];
			this.x = randomInt(10, canvas.width - 10);
			this.y = -20;
			this.y0 = -20;
			this.v0y = 0;
			this.time = 0;
			this.acceleration = 0.000003;			
			this.radius = 20;
		}

		this.draw = function () {
			var xoff = this.x - 22;
			var yoff = this.y - 40;

			ctx.beginPath();
			ctx.fillStyle = '#d4eefb';
			ctx.moveTo(20 + xoff, 1 + yoff);
			ctx.bezierCurveTo(7 + xoff, 21 + yoff, 1 + xoff, 31 + yoff, 1 + xoff, 43 + yoff);
			ctx.bezierCurveTo(1 + xoff, 47 + yoff, 6 + xoff, 60 + yoff, 23 + xoff, 60 + yoff);
			ctx.bezierCurveTo(40 + xoff, 60 + yoff, 44 + xoff, 46 + yoff, 44 + xoff, 42 + yoff);
			ctx.bezierCurveTo(44 + xoff, 31 + yoff, 37 + xoff, 21 + yoff, 21 + xoff, 1 + yoff);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.font = '28px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillStyle = "#0e1343";
			ctx.fillText(this.character, this.x, this.y);
			ctx.closePath();

			this.evolve();
		}

		this.evolve = function () {
			this.y += 1.6;

			if (this.y > canvas.height + this.radius + 70) {
				this.init();
			}
		}
		this.init();
	}

	function checkForHit(x, y) {
		_.some(letters, function (letter) {
			if (intersects(x, y, letter.x, letter.y, letter.radius)) {
				updateWord(letter.character);
				letter.init();
				return true;
			} else {
				return false;
			}
		});
	}

	function checkKeyPressHit(character) {
		character = character.toUpperCase();

		_.some(letters, function (letter) {
			if (character == letter.character) {
				updateWord(letter.character);
				letter.init();
				return true;				
			} else {
				return false;
			}
		});
	}

	function updateWord(letter) {
		guessContainer.word += letter;
	}

	function intersects(x, y, cx, cy, r) {
		var dx = x - cx;
		var dy = y - cy;
		return dx * dx + dy * dy <= r * r;
	}

	function checkSubmission(word) {
		word = word.toLowerCase();
		if (_.indexOf(big_word_list, word) != -1) {
			scoreBoard.score += Math.round(Math.pow(word.length, 1.5));
			timer.time += (word.length * 8);

			$('#status h1').text('CORRECT').addClass('correct');
		} else {
			$('#status h1').text('WRONG').addClass('wrong');
		}
		$('#status').show();
		setTimeout(function () {
			$('#status').fadeOut(300);
		}, 1200);

		guessContainer.word = '';
	}

	$('body').disableSelection();
}
;
function lightsOn() {
	var lights = [];
	var level = 1;
	var grid_size = 3;
	var moves = 0;

	makeLights();

	$('#start_btn').on('click', function () {
		$('#start').fadeOut(500);
	});

	$('#goto').on('click', function () {
		var input = Number($.trim($('input').val()));
		console.log(input, grid_size, grid_size + input)

		if (input > 0) {
			level = input;
			grid_size += input - 1;
			makeLights();
		}
		$('#start').fadeOut(500);
	});

	function Light(x, y, i) {
		this.x = x;
		this.y = y;
		this.radius = 20;
		this.on = false;
		this.position = i;

		this.init = function () {
			var that = this;
			$('<div>', {
				id: 'light' + this.position,
				class: "light off",
				style: "left:" + this.x + "px; top: " + this.y + 'px;'
			}).on('click', function (e) {
				updateGameBoard(e, that);
			}).appendTo('#lights_container');
		};

		this.flip = function () {
			this.on = !this.on;

			if (this.on) {
				$('#light'+this.position).removeClass('off').addClass('on');
			} else {
				$('#light'+this.position).removeClass('on').addClass('off');
			}
		};

		function updateGameBoard(e, light) {
			var i = light.position;
			var neighbors = [i - 1, i + 1, i - grid_size, i + grid_size];

			if (i % grid_size == 0) {
				neighbors[0] = false;
			} else if (i % grid_size == (grid_size - 1)) {
				neighbors[1] = false;
			}

			_.each(neighbors, function (pos, i) {
				if (pos < 0 || pos > grid_size * grid_size - 1) {
					neighbors[i] = false;
				}
			});

			light.flip();
			_.each(neighbors, function (neighbor) {
				if (neighbor !== false) {
					lights[neighbor].flip();
				}
			});

			moves += 1;
			$('#score').text('Moves: ' + moves);

			checkForWin();
		};

		function checkForWin() {
			var lights_off = _.some(lights, function (light) {
				if (light.on == false) {
					return true
				}
			});

			if (!lights_off) {
				updateLevel();
			}
		}

		function updateLevel() {
			level += 1;
			grid_size += 1;
			$('#win h2').text('Level completed in ' + moves + ' moves.');
			$('#level').text('Next Level: ' + level);

			$('#win').fadeIn(500, function () {
				makeLights();
				setTimeout(function () {
					$('#win').fadeOut(500);
				}, 3000);
			});
		}

		this.init();
	}

	function makeLights() {
		var x = 0;
		var y = 0; 
		var size = 45;

		lights = [];
		moves = 0;

		$('#lights_container').html('');
		$('#wrapper').css('width', size * grid_size);
		$('#score').text('Moves: ' + moves);

		_.each(_.range(grid_size * grid_size), function (num) {
			lights.push(new Light(x, y, num));

			x += size;
			if (x >= grid_size * size) {
				y += size;
				x = 0;
			}
		});
	}
}
;
function liquorLikes() {
	$('.liquor').on('click', function (e) {
		if (e.target.className == 'like_btn') {
			var $like_count = $(this).find('.like_count span');
			$like_count.html(Number($like_count.html()) + 1);
			$(e.target).attr('disabled', 'disabled').html('Liked!');
			if (Number($like_count.html()) == 1) {
				$(this).find('.people').html('person');
			} else {
				$(this).find('.people').html('people');				
			}

			$.ajax({
				type: 'POST',
				url: '/liquor_likes/likes',
				data: {
					liquor_id: e.target.id
				},
				error: function (xhr) {
					if (xhr.status == 401) {
						window.location = '/users/sign_in';
					}
				}
			});
		}
	});
};
function lunarPhase() {
	var age = $('#age').data('age');
	var percent = $('#percent').data('percent');
	var direction;
	var quarter;
	var image

	if (age <= 29.53/2) {
		direction = "Waxing";
		quarter = "First";
	} else {
		direction = "Waning";
		quarter = "Last";
	}

	if (percent < 1) {
		$('#stage').text('New Moon');
		image = '/assets/new_moon.png';
	} else if (percent <= 49) {
		$('#stage').text(direction + ' Crescent');
	} else if (percent < 51) {
		$('#stage').text(quarter + ' Quarter');
		if (quarter == 'First') {
			image = '/assets/first_quarter.png';
		} else {
			image = '/assets/last_quarter.png';			
		}
	} else if (percent < 99) {
		$('#stage').text(direction + ' Gibbous');
	} else {
		$('#stage').text('Full Moon');
		image = '/assets/full_moon.png';
	}

	if (percent <= 49 && percent >= 1) {
		var prefix;
		prefix = age <= 29.53/2 ? "wax" : "wan";

		if (percent > 35) {
			image = '/assets/' + prefix + '_crescent5.png';
		} else if (percent > 25) {
			image = '/assets/' + prefix + '_crescent4.png';
		} else if (percent > 15) {
			image = '/assets/' + prefix + '_crescent3.png';
		} else if (percent > 9) {
			image = '/assets/' + prefix + '_crescent2.png';			
		} else if (percent > 3) {
			image = '/assets/' + prefix + '_crescent1.png';
		} else {
			image = '/assets/new_moon.png';
		}
	}

	if (percent >= 51 && percent <= 99) {
		var prefix;
		prefix = age <= 29.53/2 ? "wax" : "wan";

		if (percent > 95) {
			image = '/assets/full_moon.png';
		} else if (percent > 85) {
			image = '/assets/' + prefix + '_gib5.png';
		} else if (percent > 75) {
			image = '/assets/' + prefix + '_gib4.png';
		} else if (percent > 65) {
			image = '/assets/' + prefix + '_gib3.png';
		} else if (percent > 55) {
			image = '/assets/' + prefix + '_gib2.png';			
		} else {
			image = '/assets/' + prefix + '_gib1.png';
		}
	}

	$('#moon').attr('src', image);
}
;
function makeADude() {
	$('#make_a_dude_dude_name').on('keyup', function () {
		$('.dude_name').text($(this).val());
	});	

	$('#make_a_dude_dude_message').on('keyup', function () {
		$('.dude_message').text($(this).val());
	});	

	$('.color').on('change', function () {
		$('.head').css('backgroundColor', '#' + this.color);
	});

	$('input').on('keypress', function (e) {
		if (e.which == 13) {
			e.preventDefault();		
		}
	});
}
;
function mastermindGame() {
	var colors = ['#eb1144', '#11d3ed', '#f2680c', '#c111ed', 
		 		  '#0ee307', '#3375e8'];
	var code = [];
	var guesses = 8;
	var cur_guess = [];

	for (var i = 0; i < 6; i++) {
		$('<div />', {
			class: 'guess peg color',
			id: i
		}).draggable({
			helper: 'clone',
			snap: '.peg',
		}).appendTo('#c' + i).css({'background-color': colors[i] });
	}

	for (var i = 0; i < 4; i++) {
		code.push(colors[randomInt(0, colors.length - 1)]);
	}

	$('.start').on('click', function() {
		$('.info').fadeOut('500');
	});

	$('.submit').on('click', function () {
		if (cur_guess.length == 4) {
			checkGuess();
		} else {
			alert('Guess cannot have empty slots.')
		}
	});
		
	makeDroppable();
	$('body').disableSelection();

	function makeDroppable () {
		$('#row_' + guesses + ' .peg.hole').droppable({
			drop: function(e, ui) {
				var color = ui.helper.context.id;

				cur_guess[$(this).data('index')] = colors[color];
				$(this).css({'background-color': colors[color]});
			}
		});

		highlightRow();		
	};

	function highlightRow() {
		var prev_row = parseInt(guesses) + 1;
		$('#row_' + guesses).addClass('active');
		
		$('#row_' + prev_row).removeClass('active');
	};

	function generateCheckHash() {
		var hash = {};

		_.each(code, function(color) {
			hash[color] = hash[color] ? hash[color] + 1 : 1;
		});

		return hash;
	};

	function checkGuess() {
		var keys = {red_marks: 0, white_marks: 0};
		var	color_count = generateCheckHash();

		_.each(cur_guess, function (guess, i) {
			if (color_count[guess]) {
				color_count[guess] -= 1;
				keys.white_marks += 1;
			}

			if (guess == code[i]) {
				keys.red_marks += 1;
			}
		});

		fillInKeys(keys);
	};

	function fillInKeys(hash) {
		_.each(_.range(hash['white_marks']), function (num) {
			$('#row_' + guesses + ' .key[data-index="'+ num +'"]').css('background-color', 'white');
		});			
		
		_.each(_.range(hash['red_marks']), function (num) {
			$('#row_' + guesses + ' .key[data-index="'+ num +'"]').css('background-color', '#dd0000');
		});

		if (hash['red_marks'] == 4) {
			alert('You cracked the code!');
			showCode();
			$('button').off();
		} else {
			moveToNextGuess();
		}
	};

	function moveToNextGuess() {
		$('#row_' + guesses + ' .peg.hole').droppable('destroy');

		guesses -= 1;
		cur_guess = [];

		if (guesses == 0) {
			$('button').off();
			alert('You lose!');
			showCode();
		} else {
			makeDroppable();
		}
	};

	function showCode() {
		_.each(code, function (color, i) {
			$('.code .peg[data-index="'+ i +'"]').css('background-color', color).fadeIn(500);
		});
	}
}
;
function minesweeper() {
	var timer;
	var clock;
	var game = new Game(8, 10);
	var running = false;

	game.init();

	$('.new_game').on('click', function () {
		var level = $(this).val();

		if (level == 1) {
			game = new Game(8, 10);
		}
		if (level == 2) {
			game = new Game(16, 40);
		}
		if (level == 3) {
			game = new Game(22, 99);
		}
		game.init();
	});


	function Game(size, mines) {
		var gameData = [];
		var size = size;
		var mines = mines;
		var exposed = 0;

		this.init = function () {
			var element;
			running = false;
			$('.board').html('');
			$('#container').css('width', size * 36 + 6);
			$('#mines').text('Mines: ' + mines);
			$('#status').text('\u2620').hide()

			timer = new Timer();

			for (var i = 0; i < size; i++) {
				gameData[i] = [];

				for (var j = 0; j < size; j++) {
					element = $('<div class="square">').appendTo('.board');
					gameData[i][j] = new Square(element, i, j);
					element.data('position', {x: i, y: j});
				}
				$('<br class="clear">').appendTo('.board');
			}

			// Set the mines
			var mines_set = 0;

			while (mines_set < mines) {
				var x = randomInt(0, size - 1);
				var y = randomInt(0, size - 1);

				if (!gameData[x][y].isMine) {
					gameData[x][y].isMine = true;
					mines_set += 1;
				}
			}

			// Set the number of mine neighbors for each square
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					var square = gameData[i][j];
					var neighbor_mines = checkNeighbors(square, function (sq) {	
						return !sq.isMine
					});

					square.mineCount = neighbor_mines.length;
				}
			}
		};

		this.expose = function (square) {
			if (square.isMine) {
				gameOver('lose');
				return
			} else if (square.mineCount > 0 && square.isHidden) {
				exposed += 1;
				square.isHidden = false;
				square.element.text(square.mineCount).addClass('exposed').removeClass('flagged');
			} else if (square.isHidden) {
				var neighbors = checkNeighbors(square);
				var game = this;

				exposed += 1;
				square.isHidden = false;
				square.element.addClass('exposed');

				_.each(neighbors, function (n) {
					game.expose(n);
				});			
			}

			if (exposed == size * size - mines) {
				gameOver('win');
			}
		};

		function checkNeighbors (square, condition) {
			var neighbors = [];

			if (square.y > 0) {		// Top
				neighbors.push(gameData[square.x][square.y - 1]);
			}
			if (square.y < size - 1) {		// Bottom
				neighbors.push(gameData[square.x][square.y + 1]);
			}	
			if (square.x > 0) {		// Left
				neighbors.push(gameData[square.x - 1][square.y]);
			}		
			if (square.x < size - 1) {		// Right
				neighbors.push(gameData[square.x + 1][square.y]);
			}
			
			if (square.y > 0 && square.x > 0) {		// Top Left
		        neighbors.push(gameData[square.x - 1][square.y - 1]);
		    }
		    if (square.y > 0 && square.x < size - 1) { 	// Top Right
		        neighbors.push(gameData[square.x + 1][square.y - 1]);
		    }
		    if (square.y < size - 1 && square.x > 0) { 	// Bottom Left
		        neighbors.push(gameData[square.x - 1][square.y + 1]);
		    }
		    if (square.y < size - 1 && square.x < size - 1) {		// Bottom Right
		        neighbors.push(gameData[square.x + 1][square.y + 1]);
    		}

    		condition = condition != undefined ? condition : function (s) { return false };

		    return _.reject(neighbors, condition);
		}

		function gameOver(status) {
			timer.stop();

			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) { 
					var square = gameData[i][j];
					square.element.off();

					if (square.isMine) {
						square.element.addClass('mine');
					}
				}
			}

			if (status == 'win') {
				$('#status').text("\u263B").show();
			} else {
				$('#status').text('\u2620').show();
			}
		}
	}

	function Square (element, x, y) {
		this.x = x;
		this.y = y;
		this.element = element;
		this.isMine = false;
		this.isHidden = true;
		this.isFlagged = false;

		var that = this
		that.element.on('click', function () {
			if (!running) {
				running = true;
				timer.start();
			}

			game.expose(that);
		}).on('contextmenu', function (e) {
			e.preventDefault();
			if (that.isFlagged) {
				that.element.removeClass('flagged').text('');
			} else {
				that.element.text('\u2691').addClass('flagged');			
			}
			that.isFlagged = !that.isFlagged;
		});
	}

	function Timer() {
		var start_time;
		var elapsed = 0;
		this.running = false;

		this.start = function () {
			start_time = new Date().getTime();
			elapsed = 0;
			this.running = true;
			this.run();
		};

		this.run = function () {
			var time = new Date().getTime() - start_time;

			elapsed = Math.floor(time / 1000);
			formatTime(elapsed);

			var that = this;
			setTimeout(function () {
				if (that.running) {
					that.run();
				}
			}, 500);
		};

		this.stop = function () {
			this.running = false;
			elapsed = 0;
		};
	}

	function formatTime(seconds) {
		var min = Math.floor(seconds / 60);
		var	sec = seconds % 60;

		if (sec < 10) {
			sec = '0' + sec;
		}
		if (min < 10) {
			min = '0' + min;
		}

		cur_time = min + ':' + sec;
		$('#timer').text(cur_time);
	};

	$('#game').disableSelection();
}
;
function mishmosh() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var container = document.getElementById('container');
	var mouse = {}

	var stage = new Kinetic.Stage({
        container: 'container',
        width: width,
        height: height
    });
	var layer = new Kinetic.Layer();

	$(document).on('mousemove', function (e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});

	container.addEventListener('dragover', function (e) {
		e.preventDefault();
		$('.modal').fadeOut(400);
	}, false);

	container.addEventListener('drop', function (e) {
		var files = e.dataTransfer.files;
		var image = new Image();
		var mouse_x = e.pageX - container.offsetLeft;
		var mouse_y = e.pageY - container.offsetTop;

		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = function (e) {

					image.onload = function() {
						var img_w = image.width * 0.5;
						var img_h = image.height * 0.5;

				        var picture = new Kinetic.Image({
				          x: mouse_x,
				          y: mouse_y,
				          image: image,
				          width: img_w,
				          height: img_h,
				          draggable: true,
				        });

				        picture.setOffset(img_w / 2, img_h / 2);

				        picture.on('dblclick', function (e) {
				        		picture.remove();
				        		layer.draw();				        		
				        });

				        picture.on('mousedown', function (e) {
				 

				           	if (e.altKey) {
				           		picture.on('mousemove', function (e) {
					           		var delta_x = this.attrs.x - mouse.x;
					           		var delta_y = this.attrs.y - mouse.y;

					           		var angle = Math.atan2(delta_x, delta_y)

				        			picture.setRotation(-angle - Math.PI / 2);
				        			layer.draw();
				           		});
				        	}
				        	if (e.shiftKey) {
				        		var delta_x = (this.attrs.x - mouse.x);
					           	var delta_y = (this.attrs.y - mouse.y);
					           	var original_dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
					           	var original_scale = picture.getScale().x;

				        		picture.on('mousemove', function (e) {
									delta_x = (this.attrs.x - mouse.x);
					           		delta_y = (this.attrs.y - mouse.y);
					           		var new_dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
					           		var new_scale = picture.getScale().x;	
					           		
					           		picture.setScale(original_scale * new_dist / original_dist);
					           		layer.draw();
				        		});
				        	}
				        });

				        $('body').on('mouseup', function () {
				        	picture.off('mousemove');
				        });

				        $('body').on('keydown', function (e) {
				        	picture.setDraggable(false);
				        });

				        $('body').on('keyup', function (e) {
				        	picture.setDraggable(true);
				        	picture.off('mousemove');
				        });

				        layer.add(picture);
				        stage.add(layer);
		      		};
					image.src = e.target.result;
				}
				reader.readAsDataURL(file);
			}
		}
		e.preventDefault();
	}, false);


	$('#save').on('click', function () {
		var canvas = $('canvas')[0];
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});
}
;
function momentOfPeace() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var bubbles = [];
	var sound = new Howl({
		urls: ['/assets/moments_peace.mp3', '/assets/moments_peace.ogg'],
		volume: 0.7,
		loop: true
	});

	canvas.height = height;
	canvas.width = width;

	makeBubbles(canvas.width / 50);
	paintScreen();

	$('.time_container').on('click', function () {
		var time = this.id;
		sound.fadeIn(0.7, 1000);

		$('.start').fadeOut(1000, function () {
			$('canvas').fadeIn(1000);
			startTimer(time);
		});
	});

	function startTimer (goal_time) {
		var start = new Date().getTime();
		var time = 0;
		var elapsed = '0.0';

		function instance() {
			time += 100;
			elapsed = Math.floor(time / 100) / 10;
			var diff = (new Date().getTime() - start) - time;

			if (elapsed < goal_time * 60) {
				setTimeout(instance, (100 - diff));
			} else {
				endSession();
			}
		}
		setTimeout(instance, 100);
	}

	function endSession() {
		sound.fadeOut(0.0, 2000);

		$('canvas').fadeOut(1000, function () {
			$('.headline_container h1').text('Your Moment Is Complete');
			$('.headline_container p').text('Feel free to take another moment if you wish.');
			$('.headline_container p').text('Feel free to take another moment if you wish.');
			$('.start').fadeIn(1000);
		});
	}

	function Bubble() {

		this.init = function () {
			this.x = randomInt(0, canvas.width);
			this.y = -50;
			this.radius = randomInt(1, 8);
			this.vx = randomFloat(-0.7, 0.7);
			this.vy = randomFloat(0.2, 1.5);
			this.opactity = randomFloat(0.05, 0.2)
			this.color = 'rgba(255, 255, 255, ';			
		}

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = this.color + this.opactity;
			ctx.shadowBlur = 10;
			ctx.shadowColor = this.color + this.opactity;
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color + this.opactity;
			ctx.fill();
			ctx.closePath();

			this.evolve();
		}

		this.evolve = function () {
			this.x += this.vx;
			this.y += this.vy;
			this.radius += 0.02;

			if (this.x > canvas.width + this.radius || 
			    this.x < 0 - this.radius || 
				this.y > canvas.height + this.radius) {
				this.init();
			}
		}

		this.init();
	}

	function makeBubbles(num) {
		bubbles.push(new Bubble());

		if (bubbles.length < num) {
			setTimeout(function () {
				makeBubbles(num)
			}, 500);
		}
	}

	function paintScreen() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		_.each(bubbles, function (bubble) {
			bubble.draw();
		});

		requestAnimFrame(paintScreen)
	}
}
;
function moreDropShadow() {
	$('body').disableSelection();
}
;
function morseCoder() {
	var time_unit = 100;
	var element_gap = time_unit;
	var letter_gap = time_unit * 2;
	var word_gap = time_unit * 3;
	var dot = new Howl({
		urls: ['/assets/dot.mp3', '/assets/dot.ogg'],
		volume: 0.6,
		onend: function () {
			setTimeout(checkIfMoreSounds, element_gap);
		}
	});
	var dash = new Howl({
		urls: ['/assets/dash.mp3', '/assets/dash.ogg'],
		volume: 0.6,
		onend: function () {
			setTimeout(checkIfMoreSounds, element_gap);
		}
	});

	var characters = {
		'a': [dot, dash],
		'b': [dash, dot, dot, dot],
		'c': [dash, dot, dash, dot],
		'd': [dash, dot, dot],
		'e': [dot],
		'f': [dot, dot, dash, dot],
		'g': [dash, dash, dot],
		'h': [dot, dot, dot, dot],
		'i': [dot, dot],
		'j': [dot, dash, dash, dash],
		'k': [dash, dot, dash],
		'l': [dot, dash, dot, dot],
		'm': [dash, dash],
		'n': [dash, dot],
		'o': [dash, dash, dash],
		'p': [dot, dash, dash, dot],
		'q': [dash, dash, dot, dash],
		'r': [dot, dash, dot],
		's': [dot, dot, dot],
		't': [dash],
		'u': [dot, dot, dash],
		'v': [dot, dot, dot, dash],
		'w': [dot, dash, dash],
		'x': [dash, dot, dot, dash],
		'y': [dash, dot, dash, dash],
		'z': [dash, dash, dot, dot],
		'0': [dash, dash, dash, dash, dash],
		'1': [dot, dash, dash, dash, dash],
		'2': [dot, dot, dash, dash, dash],
		'3': [dot, dot, dot, dash, dash],
		'4': [dot, dot, dot, dot, dash],
		'5': [dot, dot, dot, dot, dot],
		'6': [dash, dot, dot, dot, dot],
		'7': [dash, dash, dot, dot, dot],
		'8': [dash, dash, dash, dot, dot],
		'9': [dash, dash, dash, dash, dot],
		'.': [dot, dash, dot, dash, dot, dash],
		',': [dash, dash, dot, dot, dash, dash],
		'?': [dot, dot, dash, dash, dot, dot],
		'\'': [dot, dash, dash, dash, dash, dot],
		'!': [dash, dot, dash, dot, dash, dash],
		'(': [dash, dot, dash, dash, dot],
		')': [dash, dot, dash, dash, dot, dash],
		':': [dash, dash, dash, dot, dot, dot],
		';': [dash, dot, dash, dot, dash, dot],
		'+': [dot, dash, dot, dash, dot],
		'-': [dash, dot, dot, dot, dot, dash],
		'_': [dot, dot, dash, dash, dot, dash],
		'"': [dot, dash, dot, dot, dash, dot]
	};
	var cur_character_array;
	var cur_character_index;
	var cur_sound_array;
	var cur_sound_index;

	$('.btn').on('click', function () {
		cur_character_array = $('textarea').val().trim().toLowerCase().split('');

		cur_character_index = 0;

		checkIfMoreCharacters();
	});
	
	function checkIfMoreCharacters() {
		if (cur_character_array.length > cur_character_index) {
			cur_character_index += 1;
			cur_sound_array = characters[cur_character_array[cur_character_index - 1]];

			cur_sound_index = 0;

			if (cur_sound_array == undefined) {
				setTimeout(checkIfMoreCharacters, word_gap);
			} else {
				checkIfMoreSounds();				
			}
		}
	}

	function checkIfMoreSounds() {
		if (cur_sound_array.length > cur_sound_index) {
			cur_sound_index += 1;
			cur_sound_array[cur_sound_index - 1].play();
		} else {
			setTimeout(checkIfMoreCharacters, letter_gap);
		}
	}
}




;
function mousingPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var current_color = '#090912';
	var mouse_image = new Image();
	var mouse = {
		x: width / 4,
		y: height / 4,
		size: 0.5,
		image: mouse_image
	}
	var explosion = new Howl({
		urls: ['/assets/aggressive.mp3', '/assets/aggressive.ogg'],
		volume: 0.7
	});

	canvas.height = height;
	canvas.width = width;

	mouse.image.onload = function() {
		moveMouse();
	};

	$('body').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		moveMouse();
	});

	$('body').on('click', function () {
		explode();
	});

	function moveMouse() {
		mouse.size = mouse.y * 0.001;

		var offset_x = mouse.image.width / 2;
		var position_y = ((mouse.y/height) * (height / 4)) + (height / 4) * 3 - (mouse.image.height * mouse.size);

		offset_x *= mouse.size;

		(height / 2) * (mouse.y / height)

		ctx.clearRect(0,0,width,height);
		ctx.drawImage(mouse.image, mouse.x - offset_x, position_y, mouse.image.width * mouse.size, mouse.image.height * mouse.size);
	}

	function explode() {
		var times = 0;
		explosion.play();

		changeBackground(times);
	}

	function changeBackground(times) {
		var color = randomColorRGB();
		$('#sky').css('background-color', 'rgba(' + color + ', 0.95)').show();

		if (times < 25) {
			setTimeout(function () {
				changeBackground(times += 1);
			}, 30);
		} else {
			$('#sky').hide();
		}
	}

	mouse.image.src = "/assets/mouse.png";

	$('body').disableSelection();
}
;
function mustWrite() {
	if($('#show_container').length ) {
		var this_page = window.location.pathname;
		var gentle_sound = new Howl({
		  urls: ['/assets/bb2.mp3', '/assets/bb2.ogg'],
		  volume: 0.7
		});
		var aggressive_sound = new Howl({
		  urls: ['/assets/aggressive.mp3', '/assets/aggressive.ogg'],
		  loop: true
		});
		var typing = false;
		var minder = {
			time: 0,
			last_type: 0,
			reminds: 0
		};

		$('body').on('keypress', function () {
			minder.typing = true;
			minder.last_type = minder.time;
		});

		$('#show_save').on('click', function (e) {
			e.preventDefault();
			var content = $('.page_content').val();

			$.ajax({
				type: 'PUT',
				dataType: "json",
				url: this_page,
				data: {
					content: content
				}
			});	
		});


		function runMinder() {
			minder.time += 0.5;
			if (minder.time > minder.last_type + 20 && minder.reminds >= 3) {
				runReminder(aggressive_sound);
			} else if (minder.time > minder.last_type + 20) {
				runReminder(gentle_sound);
			} else {
				setTimeout(runMinder, 500);				
			}
		}

		function runReminder(sound) {
			sound.play();
			minder.reminds += 1;
			minder.time = 0;
			alert('You should probably get back to writing now.');
			sound.stop();
			runMinder();
		}	
		runMinder();
	}
}
;
function needDrink() {
	var map;
	var service;
	var infowindow;
	var bar_results;

	navigator.geolocation.getCurrentPosition(getResults, handleError);

	$('.btn').on('click', function () {
		if (bar_results.length > 0) {
			showABar();
		} else {
			$('#bar_result').text('No more search results');
		}
	});
	
	function getResults(position) {
		var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		map = new google.maps.Map(document.getElementById('map'), {
	    	mapTypeId: google.maps.MapTypeId.ROADMAP,
	    	center: location,
	    	zoom: 15
	    });

	    var request = {
	    	location: location,
	    	radius: '500',
	    	types: ['bar', 'night_club'],
	    	openNow: true,
	    	radius: 700
	    };

	    infowindow = new google.maps.InfoWindow();
	    service = new google.maps.places.PlacesService(map);
  		service.nearbySearch(request, callback);
	}

	function callback(results, status) {
		bar_results = results;
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			showABar();
		} else {
			$('.inner_modal').fadeOut(300, function () {
				$('.inner_modal').html('<h1>Sorry. No results found.</h1><h2>Looks like you\'re on your own. Good luck thirsty one!</h2>').fadeIn(300);
			});
		}
	}

	function showABar() {
		if (bar_results.length == 0) {
			$('.inner_modal').fadeOut(300, function () {
				$('.inner_modal').html('<h1>Sorry. No results found.</h1><h2>Looks like you\'re on your own. Good luck thirsty one!</h2>').fadeIn(300);
			});
		} else {
			var bar = bar_results[randomInt(0, bar_results.length - 1)];
			var barLoc = bar.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				position: barLoc
			});

			google.maps.event.addListener(marker, 'click', function () {
				var content = bar.name + '<br>' + bar.vicinity
				infowindow.setContent(content);
				infowindow.open(map, this);
			});

			$('#bar_result').text(bar.name + ' is open for drinks!');

			bar_results = _.reject(bar_results, function (bar_result) {
				if (bar_result == bar) {
					return true;
				}
			});

			$('.modal').fadeOut(500);
		}
	}

	function handleError(err) {
		$('#start').hide();
		if (err.code == 1) {
			$('#error p').html('This website requires location services. <br> Please allow geolocation and <a href="/here/page">reload</a> to continue.');
		} else {
			$('#error p').html('Looks like there was a problem finding your location. <br> Maybe <a href="/here/page">try again</a>?');			
		}
		$('#error').show();
	}
}
;
function noOneWatching() {
	var height = $(window).height(),
		width = $(window).width();

	function playVWebCamVideo() {
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                          	  navigator.mozGetUserMedia || navigator.msGetUserMedia;

		var video = document.querySelector('video');

		var onDenial = function(e) {
	    	;
	  	};

		if (navigator.getUserMedia) {
		  navigator.getUserMedia({audio: false, video: true}, function(stream) {
		    video.src = window.URL.createObjectURL(stream);
		  }, onDenial);
		} 		
	};

	function flashMessageIn() {
		$('#message').fadeIn(300);

		setTimeout(flashMessageOut, 300);
	};

	function flashMessageOut() {
		$('#message').fadeOut(randomInt(300));

		setTimeout(flashMessageIn, randomInt(8000, 20000));
	};

	$('video')[0].width = width;

	playVWebCamVideo();

	setTimeout(flashMessageIn, 10000);

}
;
function nothing() {}
;
function onePage() {
	$('textarea').focus();
};
function openNote() {}
;
function otherSide() {
	var geocoder = new google.maps.Geocoder();
	var input_map;
	var other_map;
	var markers = [];
	var map_zoom = 3;
	var first = true;

	$('#address_input').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var address = $('#address_input').val().replace(/^\s+|\s+$/g, '');

		if (address == '') {
			alert('Please enter a valid address or zipcode.');
		} else {
			$('#address_input').val('').attr('placeholder', address).focus();
			clearMarkers(address);			
		}
	});

	function getLocations(address) {
		geocoder.geocode( {'address': address}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var input_location = results[0].geometry.location;
				var lat = input_location.lat();
				var lng = input_location.lng();

				// var lat = results[0].geometry.location.lb;
				// var lng = results[0].geometry.location.mb;

				// var input_location = new google.maps.LatLng(lat, lng);
				// var other_location = new google.maps.LatLng(lat * -1, lng > 0 ? (180 - lng) * -1 : 180 - Math.abs(lng));
				var other_location = new google.maps.LatLng(lat * -1, lng > 0 ? (180 - lng) * -1 : 180 - Math.abs(lng));

				if (first) {
					var inputMapOptions = {
						zoom: map_zoom,
						center: input_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var otherMapOptions = {
						zoom: map_zoom,
						center: other_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					input_map = new google.maps.Map($('#input_map')[0], inputMapOptions);
					other_map = new google.maps.Map($('#other_map')[0], otherMapOptions);
				}

				setNewMarker(input_location, input_map);
				setNewMarker(other_location, other_map);
			} else {
				alert('We could not find any results. Please check your input and try again.');
			}
		});
	}

	function setNewMarker(location, map) {
		map.setCenter(location);
		map.setZoom = map_zoom;
		var marker = new google.maps.Marker({
			map: map,
			position: location
		});
		markers.push(marker);

		if (first) {
			showMaps();
			first = false;
		}
	}

	function clearMarkers(address) {
		_.each(markers, function (marker) {
			marker.setMap(null);
		});
		markers = [];

		getLocations(address);
	}

	function showMaps() {
		$('#headlines').animate({'opacity': 0}, 200, function () {
			$('#headlines').remove();
			$('header').animate({'opacity': 1}, 400);

			$('form').animate({
				'top': 60,
			}, 400, function () {
				$('#map_container').animate({'opacity': 1}, 400);
			});
		});
	}
}
;
function pathsImages() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var phrase = "The quick brown fox jumps over the lazy dog.".split('');
	var cur_index = 0;
	var min_size = 6;
	var opacity = 1.00;
	var font_color = '#000000';
	var font = 'serif'
	var timeout;
	var mouse = {
		lastX: 0,
		lastY: 0,
		drawing: false
	}
		
	canvas.height = height;
	canvas.width = width;

	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	$('body').disableSelection();

	$('canvas').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		if (!mouse.drawing) {
			clearTimeout(timeout);
			$('#control_container').show();

			timeout = setTimeout(function () {
				$('#control_container').fadeOut(500);
			}, 3000);
		} else {
			$('#control_container').hide();
		}

		drawLetter();
	});

	$('canvas').on('click', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		ctx.globalAlpha = opacity;
		ctx.fillStyle = font_color;
		ctx.font = min_size + 'px ' + font;
		ctx.fillText(phrase[cur_index], mouse.x, mouse.y);

		cur_index += 1 

		if (cur_index > phrase.length - 1) {
			cur_index = 0;
		}
	});

	$('#control_container').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		clearTimeout(timeout);
	});

	$('.opacity').on('click', function () {
		opacity += this.id == 'opacity_inc' ? 0.05 : -0.05;
		opacity = opacity > 0 ? opacity : 0;
		opacity = opacity <= 1.00 ? opacity : 1.00;

		$('#cur_opacity').text(opacity.toFixed(2));
	});

	$('.size').on('click', function () {
		min_size += this.id == 'size_inc' ? 2 : -2;
		min_size = min_size >= 0 ? min_size : 0;
		$('#cur_size').text(min_size);
	});

	$('#text').on('change', function () {
		phrase = this.value;
		cur_index = 0;
	});

	$('.picker').on('change', function () {
		font_color = '#' + this.value;
	});

	$('#font').on('change', function (e) {
		e.stopPropagation();
		font = $("#font option:selected").val();
	});

	$('#clear').on('click', function () {
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,canvas.width,canvas.height);
	});

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('canvas').on('mousedown', function (e) {
		mouse.drawing = true;
		mouse.lastX = e.pageX - canvas.offsetLeft;
		mouse.lastY = e.pageY - canvas.offsetTop;
	});

	$('canvas').on('mouseup', function () {
		mouse.drawing = false;
	});

	function drawLetter(click) {
		if (mouse.drawing || click) {
			var dx = mouse.x - mouse.lastX;
			var dy = mouse.y - mouse.lastY;
			var distance = Math.sqrt(dx * dx + dy * dy);
			var angle = Math.atan2(dy, dx);
			var font_size = min_size + distance / 3;
			var letter = phrase[cur_index];
			var letter_width;

			ctx.font = font_size + "px " + font;
			letter_width = ctx.measureText(letter).width;

			if (letter_width < distance) {
				ctx.save();
				ctx.beginPath();
				ctx.translate(mouse.lastX, mouse.lastY);
				ctx.rotate(angle);
				ctx.globalAlpha = opacity;
				ctx.fillStyle = font_color;
				ctx.fillText(letter,0,0);
				ctx.rotate(-angle);
				ctx.translate(-mouse.lastX, -mouse.lastY);
				ctx.restore();
				ctx.closePath();

				cur_index += 1;
				if (cur_index > phrase.length - 1) {
					cur_index = 0;
				}

				mouse.lastX = mouse.lastX + Math.cos(angle) * letter_width;
				mouse.lastY = mouse.lastY + Math.sin(angle) * letter_width;
			}
		}
	}
}
;
function photobooth() {
	var vid_canvas = $('#video_capture')[0];
	var vid_ctx = vid_canvas.getContext('2d');

	var final_canvas = $('#final_canvas')[0];
	var final_ctx = final_canvas.getContext('2d');

	var width = 600;
	var height = 400;

	var cur_y = 0;
	var num_photos = 0;
	var count = 3;
	var scale_factor = 0.35;

	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                      	  navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var video = $('video')[0];

	$('.start_btn').on('click', function () {
		$('.start').hide();
		$('#countdown_container').show();
		$('.access').show();
		startVideo();
	});

	$('#save').on('click', function () {
		var image = final_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('#reset').on('click', function () {
		cur_y = 0;
		num_photos = 0;
		count = 3;
		$('#photo_container').hide();
		$('#container').show();
		$('#countdown_container').show();
		updateVidCanvas();
		countdown();
	});

	function startVideo() {
		var onDenial = function(e) {
			alert('Sorry. This website requires camera access.');
		};

		if (navigator.getUserMedia) {
		  navigator.getUserMedia({audio: false, video: true}, function(stream) {
		    video.src = window.URL.createObjectURL(stream);
		    video.play();
		    updateVidCanvas();
		    $('.access').hide();
		    countdown();
		  }, onDenial);
		}
	} 	

	function updateVidCanvas() {
		processVideoFrame();

		if (num_photos < 4) {
			requestAnimFrame(updateVidCanvas);
		}
	}

	function processVideoFrame() {
		if (vid_ctx && video.videoWidth > 0 && video.videoHeight > 0) {
			if (vid_canvas.width != video.videoWidth * scale_factor) {
				vid_canvas.width= video.videoWidth * scale_factor;
				final_canvas.width = video.videoWidth * scale_factor;
			}
			if (vid_canvas.height != video.videoHeight * scale_factor) {
				vid_canvas.height = video.videoHeight * scale_factor;
				final_canvas.height = video.videoHeight * scale_factor * 4;		
			}	
		}
		vid_ctx.drawImage(video, 0, 0, vid_canvas.width, vid_canvas.height);
	}		

	function countdown() {
		if (count >= 0) {
			$('#countdown').text(count);
			setTimeout(countdown, 1000);
		} else {
			$('#countdown_container').hide();
			takeSnapshots();
		}
		count -= 1;
	}

	function takeSnapshots() {
		flash();
		var url = vid_canvas.toDataURL();
		var image = new Image();

		image.onload = function () {
			final_ctx.drawImage(image, 0, cur_y); 
			cur_y += image.height;
			num_photos += 1;
		};
		image.src = url;

		if (num_photos < 3) {
			setTimeout(takeSnapshots, 3000);
		} else {
			showPhotoStrip();
		}
	}

	function showPhotoStrip() {
		$('#container').hide();
		$('#photo_container').fadeIn(400);
	}

	function flash() {
		$('#flash').fadeIn(20);

		setTimeout(function () {
			$('#flash').fadeOut(20);
		}, 50);
	}
}
;
function picnic() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight;
	var bugs = [];
	var squishes = [];
	var num_bugs = 30;
	var mouse = {
		x: width / 2,
		y: height / 2
	}

	canvas.height = height;
	canvas.width = width;

	function Bug(x, y) {
		this.x = x;
		this.y = y;
		this.radius = 10;
		this.color = '#222222';
		this.vx = (Math.random() - 0.5) * 4;
		this.vy = (Math.random() - 0.5) * 4;
		this.legs_in = randomInt(0, 1);

		this.draw = function () {
			var c = this.legs_in ? 1.63 : 1.75;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y);

			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y + this.radius * 0.65);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y + this.radius * 0.65);

			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y - this.radius * 0.65);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y - this.radius * 0.65);
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = 'white'
			ctx.arc(this.x + this.radius*0.4, this.y + this.radius*0.5, this.radius * 0.2, 0, 2 * Math.PI);
			ctx.arc(this.x - this.radius*0.4, this.y + this.radius*0.5, this.radius * 0.2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			this.legs_in = !this.legs_in;
		}
	}

	function makeBugs() {
		_.each(_.range(num_bugs), function (num) {
			bugs.push(new Bug(randomInt(0, width), randomInt(0, height), '#222222'));
		});
	}

	function evolveBugs() {
		_.each(bugs, function (bug) {
			var delta_x = bug.x - mouse.x;
			var delta_y = bug.y - mouse.y;
			var mouse_dist = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
			var force_range = 50;
			var mouse_vy = delta_y/mouse_dist * force_range;
			var mouse_vx = delta_x/mouse_dist * force_range;

			bug.vx += mouse_vx / Math.pow(mouse_dist, 1.6);
			bug.vy += mouse_vy / Math.pow(mouse_dist, 1.6);

			bug.x += bug.vx;
			bug.y += bug.vy;

			_.each(bugs, function (other_bug) {
				var dx = bug.x - other_bug.x;
				var dy = bug.y - other_bug.y;
				var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy , 2));
			
				if (bug != other_bug && distance < bug.radius + other_bug.radius) {
					var bvx = bug.vx;
					var bvy = bug.vy;

					bug.vx = other_bug.vx;
					bug.vy = other_bug.vy;

					other_bug.vx = bvx;
					other_bug.vy = bvy;
				}
			});

			if (bug.x < bug.radius * -2) {
				bug.x = bug.radius * -2;
				bug.vx = Math.random() * 2;
				bug.vy = (Math.random() - 0.5) * 4;
			}
			
			if (bug.x > width + bug.radius * 2) {
				bug.x = width + bug.radius * 2;
				bug.vx = -1 * Math.random() * 2;
				bug.vy = (Math.random() - 0.5) * 4;
			} 
			if (bug.y < bug.radius * -2) {
				bug.y = bug.radius * -2;
				bug.vx = (Math.random() - 0.5) * 4;
				bug.vy = Math.random() * 2;
			}
			if (bug.y > height + bug.radius * 2) {
				bug.y = height + bug.radius * 2;
				bug.vx = (Math.random() - 0.5) * 4;
				bug.vy = -1 * Math.random() * 2;
			}
		});

		setTimeout(paintScreen, 40);
	}

	function Squish(x, y) {
		this.time = 0;
		this.x = x - 10;
		this.y = y - 10;

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = "rgba(0,0,0,0.75)"
			ctx.moveTo(this.x, this.y);
			// Subtractions to adjust for offset in generator. Needs to be caluclated out after finalized in future.
			ctx.bezierCurveTo(76 - (77) + this.x, 87 - (94) + this.y, 80 - (77) + this.x, 80 - (94) + this.y, 90 - (77) + this.x, 86 - (94) + this.y);
			ctx.bezierCurveTo(96 - (77) + this.x, 90 - (94) + this.y, 98 - (77) + this.x, 90 - (94) + this.y, 103 - (77) + this.x, 83 - (94) + this.y);
			ctx.bezierCurveTo(120 - (77) + this.x, 78 - (94) + this.y, 104 - (77) + this.x, 90 - (94) + this.y, 122 - (77) + this.x, 91 - (94) + this.y);
			ctx.bezierCurveTo(134 - (77) + this.x, 100 - (94) + this.y, 120 - (77) + this.x, 108 - (94) + this.y, 106 - (77) + this.x, 100 - (94) + this.y);
			ctx.bezierCurveTo(100 - (77) + this.x, 104 - (94) + this.y, 107 - (77) + this.x, 117 - (94) + this.y, 89 - (77) + this.x, 104 - (94) + this.y);
			ctx.bezierCurveTo(75 - (77) + this.x, 110 - (94) + this.y, 65 - (77) + this.x, 103 - (94) + this.y, this.x, this.y);
			ctx.fill();

			this.time += 1;			
		}
	}

	function evolveSquishes() {
		squishes = _.reject(squishes, function (squish) {
			if (squish.time > 20) {
				return true;
			}
		});
	}

	function paintScreen() {
		ctx.clearRect(0,0,width, height);

		_.each(squishes, function (squish) {
			squish.draw();
		});
		_.each(bugs, function (bug) {
			bug.draw();
		});
		
		evolveBugs();
		evolveSquishes();
	}

	makeBugs();
	paintScreen();

	$('body').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;
	});

	$('canvas').on('click', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		bugs = _.reject(bugs, function (bug) {
			var dx = bug.x - mouse.x;
			var dy = bug.y - mouse.y;
			
			if (dx*dx + dy*dy <= 5 * bug.radius * bug.radius) {
				squishes.push(new Squish(bug.x, bug.y));
				return true;
			}
		});
		
		if (bugs.length < 30) {
			var new_y = randomInt(0, 1) ? 0 : height + 10 * 2;
			var new_x = randomInt(0, 1) ? 0 : width + 10 * 2;

			bugs.push(new Bug(new_y, new_x));
		}
	});

	$('body').disableSelection();
}
;
function picturePen() {

	if ($('#new_container').length) {
		var canvas = $('canvas')[0];
		var ctx = canvas.getContext('2d');
		var img = document.createElement('img');
		var width = 500;
		var height = 400;
		var cur_color = '#000';
		var cur_size = 5;
		var hiddenCanvas = document.createElement('canvas');
	    var hidden_ctx = hiddenCanvas.getContext('2d');
		var points = [];
		var max_image_size = 600;

		canvas.width = width;
		canvas.height = height;
		hiddenCanvas.height = height;
	    hiddenCanvas.width = width;

		var has_text = true;
		var clearCanvas = function () {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.drawing = false;
			points = [];
			
			if (has_text) {
				has_text = false;
			}
		};

		var setCanvas = function () {
			var img_h = img.height;
			var img_w = img.width;
			var scale = 1;
			clearCanvas();

			if (img.width > max_image_size) {
				scale = max_image_size / img.width;
			} else if (img.width > max_image_size) {
				scale = max_image_size / img.height;
			}

			img_h *= scale;
			img_w *= scale;

			hiddenCanvas.width = canvas.width = img_w; 
			hiddenCanvas.height = canvas.height = img_h;
			$('canvas').css('cursor', 'crosshair');
			hidden_ctx.drawImage(img, 0, 0, img_w, img_h);
			ctx.drawImage(img, 0, 0, img_w, img_h);
		}

		ctx.font = '16px Geneva';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#999';

		ctx.fillText("Drag an image from your", width / 2, height / 2 - 60);
		ctx.fillText("computer into this box.", width / 2, height / 2 - 35);

		img.addEventListener('load', function (e) {
			setCanvas();
		}, false);

		canvas.addEventListener('dragover', function (e) {
			e.preventDefault();
		}, false);

		canvas.addEventListener('drop', function (e) {
			var files = e.dataTransfer.files;

			if (files.length > 0) {
				var file = files[0];
				if(typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
					var reader = new FileReader();
					reader.onload = function (e) {
						var old_src = img.src;
						img.src = e.target.result;
						
						if (old_src == img.src) {
							setCanvas();
						}
					}
					reader.readAsDataURL(file);
				}
			}
			e.preventDefault();
		}, false);

		
		$(canvas).on('mousedown', function (e) {
			points.push({
				x: e.pageX - canvas.offsetLeft,
				y: e.pageY - canvas.offsetTop
			});
			this.drawing = true;
		});

		$(canvas).on('mousemove', function (e) {
			mouse_x = e.pageX - canvas.offsetLeft;
			mouse_y = e.pageY - canvas.offsetTop;

			if (this.drawing) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(hiddenCanvas, 0, 0);
				points.push({
					x: mouse_x,
					y: mouse_y
				});

				drawPoints();
			}
		});

		$(canvas).on('mouseup', function (e) {
			this.drawing = false;
			$('canvas').css('cursor', 'default');
			points = [];
			hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
			hidden_ctx.drawImage(canvas, 0, 0);
		});
		
		$('.color').on('change', function () {
			cur_color = '#' + this.color;
		});

		$('.size').on('change', function () {
			var size = $('.size').val();

			if (!($.isNumeric(size))){
				alert('Size must be a number')
			} else {
				cur_size = size;
			}
		});

		$('#clear_all').on('click', function () {
			clearCanvas();
		});

		$('#clear_pen').on('click', function () {
			setCanvas();
		});

		$('#download').on('click', function () {
			var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			window.location.href = image;
		});

		$('#save').on('click', function () {
			if (img.src) {
				saveNewPortrait();
			}
		});

		$('body').disableSelection();


		function drawPoints() {
			ctx.beginPath();
			ctx.moveTo(points[0].x, points[0].y);
			for (i = 1; i < points.length - 2; i++) {
				var new_x = (points[i].x + points[i + 1].x) / 2;
				var new_y = (points[i].y + points[i + 1].y) / 2;
				ctx.quadraticCurveTo(points[i].x, points[i].y, new_x, new_y);
				ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
			}
			ctx.strokeStyle = cur_color;
			ctx.lineWidth = cur_size;
	    	ctx.lineCap = 'round';
			ctx.stroke();
		}

		function saveNewPortrait() {
			var file = dataURLtoBlob(canvas.toDataURL());
			var form_data = new FormData();

			form_data.append('image', file);

			$.ajax({
				url: "/picture_pen/pictures",
				type: "POST",
				data: form_data,
				processData: false,
				contentType: false,
				success: function (data) {
					window.location = '/picture_pen/pictures/' + data
				},
				error: function (xhr, status) {
					alert('There was a problem with your request. Please try again.');
				}
			});
		}

		function dataURLtoBlob(dataURL) {
			var binary = atob(dataURL.split(',')[1]);
			var array = [];

			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {type: 'image/png'});
		}
		
	}
}
;
function pinwheel() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 500,
		w = 500,
		animation,
		top_petal_color = '#b15be3',
		top_petal_color_top = '#a33ede',
		right_petal_color = '#44e886',
		right_petal_color_top = '#1bde69',
		bottom_petal_color = '#fc8f29',
		bottom_petal_color_top = '#ef7503',
		left_petal_color = '#3c99f0',
		left_petal_color_top = '#1280e7';

	canvas.height = h;
	canvas.width = w;

	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	(function( pinwheel, $, undefined ) {
	    //Private Property
	 	var cur_rotation = 0.3;

	    //Public Property
	    pinwheel.rotation_speed = 0;
	     
	    //Public Method
	    pinwheel.draw = function() {
	        // Rear Petals

			// Top Petal
			ctx.beginPath();
	        ctx.fillStyle = top_petal_color;
			ctx.moveTo(250, 200);
			ctx.lineTo(250, 0);
			ctx.lineTo(350, 100);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Right Petal
			ctx.beginPath();
	        ctx.fillStyle = right_petal_color;
			ctx.lineTo(450, 200);
			ctx.lineTo(350, 300);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Bottom Petal
			ctx.beginPath();
			ctx.fillStyle = bottom_petal_color;
			ctx.lineTo(250, 400);
			ctx.lineTo(150, 300);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Left Petal
			ctx.beginPath();
			ctx.fillStyle = left_petal_color;
			ctx.lineTo(50, 200);
			ctx.lineTo(150, 100);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			ctx.shadowColor = 'rgba(0,0,0,0.3)';
		    ctx.shadowBlur = 5;
		    ctx.shadowOffsetX = 2;
		    ctx.shadowOffsetY = 2;

			// Front Petals
			
			// Top Right
			ctx.beginPath();
	        ctx.fillStyle = top_petal_color_top;
			ctx.moveTo(250, 200);
			ctx.lineTo(350, 100);
			ctx.lineTo(350, 200);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Bottom Right
			
			ctx.beginPath();
	        ctx.fillStyle = right_petal_color_top;
			ctx.lineTo(350, 300);
			ctx.lineTo(250, 300);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Bottom Left
			ctx.beginPath();
			ctx.fillStyle = bottom_petal_color_top;
			ctx.lineTo(150, 300);
			ctx.lineTo(150, 200);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Top Left
			ctx.beginPath();
			ctx.fillStyle = left_petal_color_top;
			ctx.lineTo(150, 100);
			ctx.lineTo(250, 100);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			ctx.shadowColor = 'rgba(0,0,0,0.7)';
		    ctx.shadowBlur = 3;
		    ctx.shadowOffsetX = 3;
		    ctx.shadowOffsetY = 3;

			ctx.closePath();

			// Center Pin
			ctx.fillStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(0,0,0,0.2)';
			ctx.beginPath();
			ctx.arc(250, 200, 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
	    };

	    pinwheel.spin = function () {
	    	ctx.clearRect(0,0,w,h);
	    	drawStick();
	    	ctx.save();
	    	ctx.translate(250, 200);
	    	ctx.rotate(cur_rotation);
	    	ctx.translate(-250, -200);
	    	pinwheel.draw();
	    	ctx.restore();

	    	cur_rotation += 0.05 * pinwheel.rotation_speed; 
	    	pinwheel.rotation_speed *= 0.996;
	    };
	     
	    //Private Method
		    function drawStick() {
		    	ctx.fillStyle = '#946f4b';
		    	ctx.fillRect(244, 200, 12, 500);

		    	ctx.shadowColor = 'rgba(0,0,0,0.3)';
			    ctx.shadowBlur = 3;
			    ctx.shadowOffsetX = 2;
			    ctx.shadowOffsetY = 2;
		    };

	}( window.pinwheel = window.pinwheel || {}, jQuery ));

	(function animloop(){
		animation = requestAnimFrame(animloop);
	  	pinwheel.spin();
	})();

	$('canvas').on('click', function () {
		pinwheel.rotation_speed += 1.5;
	});

	$('body').disableSelection();
};
function pixShow() {
	;
}
;
function plinky() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 600;
	var width = 400;
	var pegs = [];
	var wins = [];
	var acceleration = 10;

	canvas.height = height;
	canvas.width = width;

	var disk = {
		radius: 14,
		x: 14,
		y: 14,
		vx: 0,
		vy: 0,
		color: '#51bdfc',
		tracking: true,

		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = disk.color;
			ctx.arc(disk.x, disk.y, disk.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	function Peg(x, y) {
		this.x = x,
		this.y = y,
		this.radius = 2,
		this.color = 'white',

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	function makePegs() {
		var pos_x = 0;
		var pos_y = 100;
		var even_row = true;

		_.each(_.range(105), function (num) {
			pegs.push(new Peg(pos_x, pos_y));

			pos_x += 40;

			if (pos_x > 400) {
				pos_y += 40;
				pos_x = even_row ? 20 : 0;
				even_row = !even_row;
			}
		});	
	} 

	function ResultBin(x, y, width, result) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.result

		if (result == 'win') {
			this.color = "#35d49a";
		} else {
			this.color = "#d42a2a"
		}

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.width,height);
			ctx.fill();
			ctx.closePath();
		};
	}

	function makeWins () {
		var y = height - 15;
		var w = 50;

		wins.push(new ResultBin(75, y, w, 'win'));
		wins.push(new ResultBin(175, y, w, 'win'));
		wins.push(new ResultBin(275, y, w, 'win'));
	}

	function evolveDisk(delta_time) {
		disk.vy += acceleration * delta_time / 1000;
		disk.x += disk.vx;
		disk.y += disk.vy;

		_.each(pegs, function (peg) {
			var distance = Math.sqrt(Math.pow(disk.x - peg.x, 2) + Math.pow(disk.y - peg.y, 2));

			if (distance <= disk.radius) {
				var vx_temp = disk.vx;
				var vy_temp = disk.vy;
				var r = disk.radius;
				var delta_x = (disk.x - peg.x) / distance * r;
				var delta_y = (disk.y - peg.y) / distance * r;

				disk.x = peg.x + delta_x * 1.05;
				disk.y = peg.y + delta_y * 1.05;

				disk.vx = -0.7 * (vx_temp * delta_x * delta_x / (r*r) + vy_temp * delta_x * delta_y / (r*r));
				disk.vy = -0.7 * (vy_temp * delta_y * delta_y / (r*r) + vx_temp * delta_x * delta_y / (r*r));
			}
		});

		if (disk.y > height + disk.radius) {
			disk.tracking = true;
			disk.y = disk.radius;
			disk.vx = 0;
			disk.vy = 0;

			_.each(wins, function (win) {
				if (disk.x > win.x && disk.x < win.x + win.width) {
					$('#win').fadeIn(500);

					setTimeout(function () {
						$('#win').fadeOut(500);
					}, 2000);
				} 
			});

			$('canvas').on('mousemove', function (e) {
				var mouse_x = e.pageX - canvas.offsetLeft;

				disk.x = mouse_x;
			});	
		}
	}

	function animate(last_time) {
		var date = new Date();
        var time = date.getTime();
        var delta_time = time - last_time;

		ctx.clearRect(0,0,width,height);

		ctx.fillStyle = '#d42a2a';
		ctx.fillRect(0, height - 15, width, height);

		_.each(pegs, function (peg) {
			peg.draw();
		});

		_.each(wins, function (bin) {
			bin.draw();
		});

		disk.draw();

		if (!disk.tracking) {
			evolveDisk(delta_time)
		}

		requestAnimFrame(function () {
			animate(time);
		});	
	}

	var date = new Date();
    var time = date.getTime();
	
	makePegs();
	makeWins();
    animate(time);


	$('canvas').on('mousemove', function (e) {
		var mouse_x = e.pageX - canvas.offsetLeft;

		disk.x = mouse_x;
	});	
	
	$('canvas').on('click', function () {
		$('canvas').off('mousemove');

		if (disk.tracking) {
			disk.tracking = false;
		}
	});

}
;
function pollsie() {
}
;
function polychrome() {
	var player;
	var timeout;

	if ($('#show_data_show').length > 0) {
		var show_data = $('#show_data_show').data('show');
		var header = $('header');

		header.hide();

		$('body').on('mousemove', function () {
			clearTimeout(timeout);
			header.show();

			timeout = setTimeout(function () {
				header.fadeOut(500);
			}, 3800);
		});

		playShow(0, show_data, 'body');
	}

	if ($('#swatch_container').length > 0) {	
		var swatches = [];

		function Swatch() {
			this.color = randomColorHex();
			this.duration = 60;

			this.buildSwatch = function () {
				var swatch = this;

				var div = $('<div>', {
					class: 'swatch',
				});

				var swatch_color = $('<div>', {
					class: 'swatch_color',
					style: 'background-color:' + swatch.color
				});

				var close = $('<div />', {
					class: "close",
					text: 'X'
				}).on('click', function () {
					swatches = _.reject(swatches, function (s) {
						return s == swatch;
					});


					$(this).parent().remove();
				});

				var swatch_info = $('<div>', {
					class: 'swatch_info',
				}).append('<label>Color: </label>');

				var color_input = $('<input>', {
					class: 'color',
					value: swatch.color
				}).on('change', function () {
					swatch.color = '#' + $(this).val();
					$(swatch_color).css('background-color', swatch.color);
				}).appendTo(swatch_info);

				new jscolor.color(color_input.get(0));

				swatch_info.append('<label>Duration: </label>');

				var duration_input = $('<input>', {
					class: 'duration',
					value: swatch.duration
				}).on('change', function () {
					var input = Number($(this).val()) ? $(this).val() : 60;
					swatch.duration = input;
				}).appendTo(swatch_info);

				$(div).append(close)
					  .append(swatch_color)
					  .append(swatch_info)
					  .appendTo('#swatch_container');
			}

			this.buildSwatch();
		}
		
		for (var i = 0; i < 5; i++) {
			swatches.push(new Swatch());
		}

		$('#add').on('click', function (e) {
			e.preventDefault();
			swatches.push(new Swatch());
		});

		$('#preview').on('click', function (e) {
			e.preventDefault();
			var show_data = formatShowData(swatches);
			$('#preview_container').show();
			playShow(0, show_data, '#preview_container');
		});

		$('#back').on('click', function () {
			clearTimeout(player);
			$('#preview_container').hide();
		});

		$('#save').on('click', function (e) {
			e.preventDefault();
			saveShow(swatches);
		});
	}

	function playShow(i, data, element) {
		$(element).css('background-color', data[i].color);

		player = setTimeout(function () {
			i = i + 1 < data.length ? i += 1 : 0;
			playShow(i, data, element);
		}, data[i].duration * 1000);
	}

	function formatShowData(swatches) {
		var show = _.map(swatches, function (swatch) {
			return {
				color: swatch.color,
				duration: swatch.duration
			};
		});

		return show;		
	}

	function saveShow(swatches) {
		var data = formatShowData(swatches);

		$('#throbber').show();

		$.ajax({
			url: "/polychrome/shows",
			type: "POST",
			data: {show: data},
			dataType: 'json',
			success: function (data) {
				window.location = '/polychrome/shows/' + data;
			},
			error: function (xhr, status) {
				$('#throbber').hide();
				alert('There was a problem with your request. Please try again.');
			}
		});
	}
}
;
function portraitPhotos() {
	if ($('#video_canvas').length) {
		var video_canvas = $('#video_canvas')[0];
		var video_ctx = video_canvas.getContext('2d');
		var image_canvas = $('#image_canvas')[0];
		var image_ctx = image_canvas.getContext('2d');
		var width = 400;
		var height = 550;
		var scale_factor = 0.35;
		var video = $('video')[0];
		var photo_taken = false;
		var base_image = new Image();
		var new_image = new Image();

		video_canvas.width = image_canvas.width = width;
		video_canvas.height = image_canvas.height = height;

		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                      	      navigator.mozGetUserMedia || navigator.msGetUserMedia;

	    if (navigator.getUserMedia) {
		  	navigator.getUserMedia({audio: false, video: true}, function(stream) {
		    video.src = window.URL.createObjectURL(stream);
		    video.play();
		    $('#shoot_btn').attr('disabled', false);
		    updateVideoCanvas();
		  }, function () {
		  	alert("This app requires access to your camera.")
		  });
		} else {
			$('#no_support').show();
		}

		$('#shoot_btn').one('click', function () {
			photo_taken = true;
			$('#save_btn').attr('disabled', false);
		});

		$('#shoot_btn').on('click', function () {
			snapPhoto();
		});

		$('#save_btn').on('click', function () {
			if (photo_taken) {
				saveNewPortrait();
			}
		});

		base_image.onload = function () {
			image_ctx.clearRect(0, 0, image_canvas.width, image_canvas.height);
			image_ctx.drawImage(base_image, 0, 0);
		};

		function updateVideoCanvas() {
			if (video.videoWidth) {
				var scale = image_canvas.height / video.videoHeight;
				var vid_w = video.videoWidth * scale;
				var vid_h = video.videoHeight * scale;
				var offset = -1 * ((vid_w / 2) - (image_canvas.width / 2));
				
				video_ctx.drawImage(video, offset, 0, vid_w, vid_h);				
			}

			requestAnimFrame(updateVideoCanvas);
		}

		function snapPhoto() {
			var url = video_canvas.toDataURL();

			new_image.onload = function () {
				image_ctx.clearRect(0, 0, image_canvas.width, image_canvas.height);
				image_ctx.drawImage(base_image, 0, 0);

				var new_img_data = video_ctx.getImageData(0, 0, video_canvas.width, video_canvas.height);
				var base_img_data = image_ctx.getImageData(0, 0, image_canvas.width, image_canvas.height);
				blendImages(new_img_data, base_img_data);
			}

			new_image.src = url;
		}

		function blendImages(new_img, old_img) {
			var new_data = new_img.data;
			var old_data = old_img.data;
			console.log(new_data[1], old_data[1])

			for (var i = 0; i < new_data.length; i += 4) {
				new_data[i] = (new_data[i] + old_data[i]) / 2;
				new_data[i+1] = (new_data[i+1] + old_data[i+1]) / 2;
				new_data[i+2] = (new_data[i+2] + old_data[i+2]) / 2;
			}
			console.log(new_data[1], old_data[1])

			image_ctx.clearRect(0, 0, image_canvas.width, image_canvas.height);
			image_ctx.putImageData(new_img, 0, 0);
		}

		function saveNewPortrait() {
			var file = dataURLtoBlob(image_canvas.toDataURL());
			var form_data = new FormData();

			form_data.append('image', file);

			$.ajax({
				url: "/portrait/photos",
				type: "POST",
				data: form_data,
				processData: false,
				contentType: false,
				success: function (data) {
					window.location = '/portrait/photos/' + data
				},
				error: function () {
					alert('There was a problem with your request. Please try again.');
				}
			});
		}

		function dataURLtoBlob(dataURL) {
			var binary = atob(dataURL.split(',')[1]);
			var array = [];

			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {type: 'image/png'});
		}

		base_image.src = $('#data-img').data('img');
	}
}
;
function postbored() {
	$('.notice').fadeOut(4000);
	$('.alert').fadeOut(4000);
	$('form').focus();

	$('form').on('submit', function (e) {
		if ($('#url_form').val().trim() == '') {
			e.preventDefault();
			alert('URL cannot be blank.');
			$('#url_form').focus();
		}

		if ($('#title_form').val().trim() == '') {
			e.preventDefault();
			alert('Title cannot be blank.');
			$('#title_form').focus();
		}
		
		if ($('#title_form').val().length > 255) {
			e.preventDefault();
			alert('Let\'s not write a book here! Keep it to 255 characters or less.');
			$('#title_form').focus();
		}
	});
};
function pvCalculator() {
	var revenue_field = '<tr class="year_rev"><td class="label">Yearly Revenue:</td><td><input type="text" class="revenue"></td></tr>'

	$('.tab').on('click', function () {
		$('.tab').removeClass('active');
		$(this).addClass('active');

		$('.calc_container').hide();
		$('#' + this.id + '_calc').show();
	});
	
	$('#basic_years').on('change', function (e) {
		e.preventDefault();
		var num_years = $('#basic_years').val();
		if (!$.isNumeric(num_years)) {
			$('#basic_years').val('10');
			num_years = 10;
		}
		
		addRevenueFields(num_years);
	});

	$('#basic_calc form').on('change', function (e) {
		e.preventDefault();
		calculateBasic();		
	});

	$('#basic_calc form').on('submit', function (e) {
		e.preventDefault();
		calculateBasic();		
	});

	$('#compounding_calc form').on('submit', function (e) {
		e.preventDefault();
		calculateCompound();						
	});

	$('#compounding_calc form').on('change', function (e) {
		e.preventDefault();
		calculateCompound();						
	});

	$('#offset_calc form').on('submit', function (e) {
		e.preventDefault();
		calculateOffset();					
	});

	$('#offset_calc form').on('change', function (e) {
		e.preventDefault();
		calculateOffset();					
	});

	function calculateOffset() {
		var r = parseFloat($('#offset_calc .int_rate').val()),
			y = parseFloat($('#offset_calc .num_years').val()),
			x = parseFloat($('#offset_calc .num_years_no_rev').val()),
			c = parseFloat($('#offset_calc .revenue').val()),
			g = parseFloat($('#offset_calc .growth').val()),
			t = y - x,
			answer = 0;

		answer = (c / (r - g) - c / (r - g) * Math.pow((1 + g), t) / Math.pow((1 + r), t)) / Math.pow((1+r), x);


		updateAnswer(answer, '#offset_calc');
	};

	function calculateCompound() {
		var r = parseFloat($('#compounding_calc .int_rate').val()),
			t = parseFloat($('#compounding_calc .num_years').val()),
			c = parseFloat($('#compounding_calc .revenue').val()),
			g = parseFloat($('#compounding_calc .growth').val()),
			answer = 0;

		answer = (c / (r - g)) - (c / (r - g)) * (Math.pow((1 + g), t) / Math.pow((1 + r), t));

		updateAnswer(answer, '#compounding_calc');
	};

	function calculateBasic() {
		var r = parseFloat($('#basic_calc .int_rate').val()),
			revs = $('.year_rev input'),
			answer = 0;

		_.each(revs, function (rev, i) {
			var c = $(rev).val();

			answer = answer + (c / (Math.pow((1 + r), i+1)));
		});

		updateAnswer(answer, '#basic_calc');
	};

	function updateAnswer(ans, id) {
		if ($.isNumeric(ans)) {
			$(id + ' .answer').text(ans.toFixed(2));
		} else {
			$(id + ' .answer').text('00.00');			
		}
			$(id + ' .answer_container').show();		
	};

	function addRevenueFields(num) {
		var existing_fields = $('.year_rev').length;
		var diff = existing_fields - num;

		if (diff > 0) {
			$('#basic_calc').find('.year_rev:nth-last-child(-n+' + diff + ')').remove();	
		} else if (diff < 0) {
			_.each(_.range(diff * -1), function (i) {
				$(revenue_field).appendTo('#basic_calc table');
			});	
		}
	};
};
function quickCompliments() {
	var colors = ['#EC8E8E', '#FFAC52', '#A39F7F', '#95AA7A', 
				  '#3A9C0C', '#70A584', '#27B48D', '#27B4B4', 
				  '#85A4AD', '#34AED1', '#3397E5', '#7381B9',
				  '#6D6B81', '#8966A8', '#CB5BD5', '#E05EC1', 
				  '#D1396A', '#F5286A', '#E72D35'];

	$('body').css('background-color', colors[randomInt(0, colors.length - 1)]);
}
;
function quickWords() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 400,
		width = 240,
		letters = 'eeeeeeeeeeeeaaaaaaaaaiiiiiiiiioooooooonnnnnnrrrrrrttttttllllssssuuuuddddgggbbccmmppffhhvvwwyykjxqz'.toUpperCase().split(''),
		positions = [[0,0], [80, 0], [160, 0],
					 [0,80], [80, 80], [160, 80],
					 [0,160], [80, 160], [160, 160]]
		tiles = [],
		stage = '',
		score = 0;

	canvas.height = height;
	canvas.width = width;

	function init() {
		_.each(positions, function (pos, i) {
			makeTile(pos[0], pos[1], letters[randomInt(0, 97)]);
		});

		paintScreen();
	};

	function Tile(x, y, letter) {
		this.x = x;
		this.y = y;
		this.letter = letter;
		this.used = false;

		this.draw = function () {
			if (this.used) {
				ctx.fillStyle = '#aaa'
			} else {
				ctx.fillStyle = '#333'				
			}

			ctx.fillRect(this.x, this.y, 80, 80);
			ctx.font = "26px Futura";
	    	ctx.textBaseline = 'middle';
	    	ctx.textAlign = 'center'
	    	ctx.fillStyle = '#fff';
	    	ctx.fillText(this.letter, this.x + 40, this.y +40);
		};
	};

	function makeTile(x, y, letter) {
		tiles.push(new Tile(x, y, letter));
	};

	function drawStage() {
		ctx.font = "26px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#333';
    	ctx.fillText(stage, width / 2, 280);		
	};

	function drawScore() {
		ctx.font = "16px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#333';
    	ctx.fillText('Score: ' + score, width / 2, 380);
	};

	function drawClearBtn() {
		ctx.fillStyle = "#333";
		ctx.fillRect(40, 310, 80, 30);
		ctx.font = "13px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#fff';
    	ctx.fillText('Clear', 80, 325);
	};

	function drawSubmitBtn() {
		ctx.fillStyle = "#16a085";
		ctx.fillRect(120, 310, 80, 30);
		ctx.font = "14px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#fff';
    	ctx.fillText('Submit', 160, 325);
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(tiles, function(tile) {
			tile.draw();
		});

		drawStage();
		drawScore();
		drawClearBtn();
		drawSubmitBtn();
	};

	function addLetterToStage(tile) {
		stage = stage + tile.letter;
		tile.used = true;
		paintScreen();
	};

	function registerLetter(x, y) {
		_.each(tiles, function (tile) {
			if (x > tile.x && x < tile.x + 80 &&
				y > tile.y && y < tile.y + 80 && !tile.used) {
				addLetterToStage(tile);
			}
		});
	};

	function flashModal(state, score) {
		var msg;
		if (state == 'win') {
			msg = 'Correct! Points: ' + score;
		} else {
			msg = 'Wrong!'
		}

		$('.modal').text(msg).fadeIn('500');
		setTimeout(function () {
			$('.modal').fadeOut('1000');
		}, 1500);
	};

	function resetLevel() {
		_.each(tiles, function (tile) {
			if (tile.used) {
				tile.used = false;
			}
		});
		stage = '';
		paintScreen();
	};

	function advanceLevel() {
		_.each(tiles, function (tile) {
			if (tile.used) {
				tile.used = false;
				tile.letter = letters[randomInt(0, 97)];
			}
		});

		score += Math.pow(stage.length, 2);
		flashModal('win', Math.pow(stage.length, 2));
		stage = '';
		paintScreen();
	};

	function checkSubmission() {
		var word = stage.toLowerCase();
		if (_.indexOf(big_word_list, word) != -1) {
			advanceLevel();
		} else {
			resetLevel();
			flashModal('lose');
		}
	};
	
	init();

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft,
			y = e.pageY - canvas.offsetTop;

		if (y <= 240) {
			registerLetter(x,y);
		} else if (x > 40 && x < 120 && y > 310 && y < 340) {
			resetLevel();
		} else if (x > 120 && x < 200 && y > 310 && y < 340) {
			checkSubmission();
		}
	});
};












function ransomNote() {
	$('#note_text').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var note = $('#note_text').val().split('');

		$('.loading_container').show();
		$('#note_container').hide();

		$.ajax({
			type: 'POST',
			url: '/ransom_note/page',
			dataType: "json",
			data: {
				note: note
			},
			complete: function (data) {
				loadPhotos(data.responseText);
			},
			error: function () {
				alert('There was a problem!');
			}
		});
	});

	function loadPhotos(response) {
		var urls = $.parseJSON(response);
		$('#note_container').html('');

		var begin = true;
		var html = '';
		_.each(urls, function (url) {
			style = 'style="transform: rotate(' + randomInt(-10, 10) + 'deg); -ms-transform: rotate(' + randomInt(-10, 10) + 'deg); -webkit-transform: rotate(' + randomInt(-10, 10) + 'deg);"';

			if (begin) {
				begin = false;
				html += '<div class="word">' + '<img src="' + url + '" class="char"' + ' ' + style + '>'
			} else if (url == '/assets/ransom_space.png') {
				begin = true;
				html += '<img src="' + url + '" class="char"' + ' ' + style + '></div>'
			} else {
				html += '<img src="' + url + '" class="char"' + ' ' + style + '>'
			}
		});

		_.each($('.char'), function (image) {
			
			image.css({
				'transform': 'rotate(' + randomInt(-10, 10) + 'deg)',
				'-ms-transform': 'rotate(' + randomInt(-10, 10) + 'deg)',
				'-webkit-transform': 'rotate(' + randomInt(-10, 10) + 'deg)',
			});
		});

		$('.loading_container').hide();
		$('#note_container').html(html + '</div><br class="clear">').show();
	}
}
;
function salonGalleries() {
	var body = $('body')[0];
	var this_page = window.location.pathname.replace(/\/edit.*$/, '');
	console.log

	if ($('#edit_photo_container').length) {
		body.addEventListener('dragover', function (e) {
			e.preventDefault();
		}, false);	

		body.addEventListener('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();

			var files = e.dataTransfer.files;
			$('#throbber').show();
			checkFiles(files);
			return false
		}, false);

		function checkFiles(files) {
			files = _.reject(files, function (file) {
				return file.type.indexOf('image') == -1;
			});

			uploadFiles(files);
		}

		function uploadFiles(files) {
			var form_data = new FormData();
			var pos = 0;
			var max = files.length;
			var gallery_title = $('input.title').val();

			if (typeof form_data != 'undefined') {
				function queue() {
					var file = files[pos];

					if (max >= 1 && pos <= max - 1) {
						form_data.append('file', file);
						upload();
					} else {
						location.reload();
					}
				}

				function upload() {
					$.ajax({
						url: this_page,
						data: form_data,
						type: 'PUT',
						processData: false,
	              		contentType: false,
						success: function (data) {
							pos += 1;
							queue();
						},
						error: function () {
							location.reload();
						}
					});
				}

				queue();
			}
		}
	}

}
;
function screwdriver() {
	;
}
;
function seriousQuestion() {}
;
 function shareASecret() {
	var last_secret = '';

	$('.secret_input').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var secret = $('.secret_input').val().replace(/^\s+|\s+$/g, '');

		if (secret.length < 10 || secret.length > 255) {
			alert("Your secret is either too long or too short. Write in a secret between 10 and 255 characters.");
		} else if (secret == last_secret) {
			alert("You can't think of another secret? I'm sure you have at least a few more secrets to share.");
		} else {
			last_secret = secret;
			$('.secret_input').val('');
			
		    $.ajax({
				type: 'POST',
				dataType: "json",
				url: "/share_a_secret/secrets",
				data: {
					new_secret: secret
				},
				complete: function (data) {
		        	insertResponse(data.responseText);
		        }
			});	
		}
	});

	function insertResponse(response) {
		$('#retrieved_secret_text').hide().text(response).fadeIn(500);
	}
};
function sharks() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var screen_center = {x: width/2, y: height/2};
	var sharks = [];
	var sources = ['/assets/shark_0.png', '/assets/shark_1.png', '/assets/shark_2.png', '/assets/shark_3.png', '/assets/shark_4.png']

	canvas.height = height;
	canvas.width = width;

	function Shark(x_prime, y_prime, img_src) {
		var shark_img = new Image;

		this.x_prime = x_prime;
		this.y_prime = y_prime;
		this.img = shark_img;
		this.time = 1;
		this.x = screen_center.x;
		this.y = screen_center.y;

		var that = this;

		shark_img.onload = function () {
			that.height = shark_img.height;
			that.width = shark_img.width;
		}

		this.draw = function () {
			var scale = 0.005 * this.time;
			var cur_width = this.width * scale;
			var cur_height = this.height * scale;
			var offset_x = cur_width / 2;
			var offset_y = cur_height / 2;

			this.time += 2;
			this.x = screen_center.x + (this.x_prime / 10000) * Math.pow(this.time, 2);
			this.y = screen_center.y + (this.y_prime / 10000) * Math.pow(this.time, 2);

			ctx.drawImage(this.img, this.x - offset_x, this.y - offset_y, cur_width, cur_height);
		}
		shark_img.src = img_src;
	} 

	function makeShark(x_prime, y_prime, img_src) {
		sharks.push(new Shark(x_prime, y_prime, img_src));
	}

	function checkSharks() {
		_.each(sharks, function (shark) {
			if (shark.x > width * 2 || shark.x < 0 - shark.width ||
				shark.y > height * 2 || shark.y < 0 - shark.height) {

				var angle = Math.random() * Math.PI * 2;
				var x = Math.cos(angle) * height * 0.2;
				var y = Math.sin(angle) * height * 0.2;

				shark.x_prime = x;
				shark.y_prime = y;
				shark.time = 1;
				shark.img.src = sources[randomInt(0, sources.length - 1)];
				shark.x = screen_center.x;
				shark.y = screen_center.y;
			}
		});

		requestAnimFrame(paintScreen);
	}

	function paintScreen() {
		ctx.clearRect(0,0,width, height);

		_.each(sharks, function (shark) {
		 	shark.draw();
		});
		checkSharks();
	}

	function addSharks() {
		if (sharks.length < 10) {
			var angle = Math.random() * Math.PI * 2;
			var x = Math.cos(angle) * height * 0.2;
			var y = Math.sin(angle) * height * 0.2;

			makeShark(x, y, sources[randomInt(0, sources.length - 1)]);
		}
		setTimeout(addSharks, randomInt(500, 2000));
	}

	addSharks();

	paintScreen();
}
;
function signature() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 400;
	var width = 700;
	var cur_color = '#000';
	var cur_size = 5;
	var hiddenCanvas = document.createElement('canvas');
    var hidden_ctx = hiddenCanvas.getContext('2d');
	var points = [];

	canvas.height = height;
	canvas.width = width;

    hiddenCanvas.height = height;
    hiddenCanvas.width = width;

	$(canvas).on('mousedown', function (e) {
		points.push({
			x: e.pageX - canvas.offsetLeft,
			y: e.pageY - canvas.offsetTop
		});
		this.drawing = true;
	});

	$(canvas).on('mousemove', function (e) {
		mouse_x = e.pageX - canvas.offsetLeft;
		mouse_y = e.pageY - canvas.offsetTop;

		if (this.drawing) {
			ctx.clearRect(0,0,width,height);
			ctx.drawImage(hiddenCanvas, 0, 0);
			points.push({
				x: mouse_x,
				y: mouse_y
			});

			drawPoints();
		}
	});

	$(canvas).on('mouseup', function () {
		this.drawing = false;
		$('canvas').css('cursor', 'default');
		points = [];
		hidden_ctx.clearRect(0,0,width,height);
		hidden_ctx.drawImage(canvas, 0, 0);
	});

	$('#clear').on('click', function () {
		ctx.clearRect(0,0,width,height);
		hidden_ctx.clearRect(0,0,width,height);
		canvas.drawing = false;
		points = [];
	});

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('.color').on('change', function () {
		cur_color = '#' + this.color;
	});

	$('.size').on('change', function () {
		var size = $('.size').val();

		if (!($.isNumeric(size))){
			alert('Size must be a number')
		} else {
			cur_size = size;
		}
	});

	$('body').disableSelection();

	function drawPoints() {
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for (i = 1; i < points.length - 2; i++) {
			var new_x = (points[i].x + points[i + 1].x) / 2;
			var new_y = (points[i].y + points[i + 1].y) / 2;
			ctx.quadraticCurveTo(points[i].x, points[i].y, new_x, new_y);
			ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
		}
		ctx.strokeStyle = cur_color;
		ctx.lineWidth = cur_size;
    	// ctx.lineJoin = 'round';  Doesn't work right in FF or Safari?
    	ctx.lineCap = 'round';
		ctx.stroke();
	}
}
;
function skinnyDrinks() {
	$('form').on('submit', function (e) {
		e.preventDefault();

		var name = $('.name').val().replace(/^\s+|\s+$/g, '');
		var abv = $('.abv').val().replace(/^\s+|\s+$/g, '');
		var calories = $('.calories').val().replace(/^\s+|\s+$/g, '');
		var ounces = $('.ounces').val().replace(/^\s+|\s+$/g, '');

		if (name === '') {
			name = "beverage"
		}

		if (_.isNaN(Number(abv))) {
			abv = abv.replace('%', '').replace(/^\s+|\s+$/g, '');
			if (_.isNaN(Number(abv))) {
				alert('Please enter the ABV as a numerical percent (e.g. 40%).');
			}
		} else if (_.isNaN(Number(calories))) {
			alert('Please enter the calories as a number (e.g. 99).');			
		} else if (_.isNaN(Number(abv))) {
			alert('Please enter the ounces as a number (e.g. 1.5).');
		} else {
			var skinny_factor = calculateSkinnyFactor(abv, calories, ounces);

			if (_.isNaN(skinny_factor)) {
				skinny_factor = 0;
			}

			if (skinny_factor > 100) {
				alert('Error: Skinny Factor out of range. Please check that the calories in your beverage and the beverage size in ounces are correct.');
			}
			 else {
				skinny_factor = skinny_factor.toFixed(2);
				$('.result').html('The Skinny Factor for ' + name + ' is');
				$('.skinny_factor').html(skinny_factor);
				$('#result_container').show();
			}
		}
	});

	function calculateSkinnyFactor(abv, cal, oz) {
		var cal_per_oz_alcohol = cal / (oz * abv / 100);

		var cal_per_oz_in_pure_alcohol = 245 / 1.5;

		return cal_per_oz_in_pure_alcohol / cal_per_oz_alcohol * 100;
	};
}
;
function snare() {
	$('.circle').on('click', function () {
		$('#container').addClass('shrink');

		setTimeout(function () {
			$('#container').html('');
			$('#container').css({
				backgroundImage: 'none',
				height: 0
			});
			setTimeout(function () {
				$('#error').show();
			}, 500);
		}, 1800);
	});
}
;
function songMachine() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		file_names = ['ab1','bb1','c1','db1','eb1','f1','g1','ab2','bb2','c2','db2','eb2','f2','g2','ab3'],
		notes = [],
		h = window.innerHeight - 40,
		w = 750;

	canvas.height = h;
	canvas.width = w;

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		var sound = getSound(x);
		makeNote(x, y, sound);
	});

	paintScreen();

	function getSound(x) {
		var sound;

		if (x > 700) {
			sound = file_names[0];
		} else if (x > 650) {
			sound = file_names[1];
		} else if (x > 600) {
			sound = file_names[2];
		} else if (x > 550) {
			sound = file_names[3];
		} else if (x > 500) {
			sound = file_names[4];
		} else if (x > 450) {
			sound = file_names[5];
		} else if (x > 400) {
			sound = file_names[6];
		} else if (x > 350) {
			sound = file_names[7];
		} else if (x > 300) {
			sound = file_names[8];
		} else if (x > 250) {
			sound = file_names[9];
		} else if (x > 200) {
			sound = file_names[10];
		} else if (x > 150) {
			sound = file_names[11];
		} else if (x > 100) {
			sound = file_names[12];
		} else if (x > 50) {
			sound = file_names[13];
		} else if (x > -1) {
			sound = file_names[14];
		}

		return sound;
	}; 

	function Note(x, y, sound) {
		this.x = x;
		this.y = y;
		this.color = '36,39,51';
		this.played = false;
		this.sound = new Howl({
			urls: ["/assets/" + sound + '.mp3', "/assets/" + sound + '.ogg'],
			volume: 0.5
		});

		this.draw = function () {

			if (this.played) {
				ctx.fillStyle = 'rgba(' + this.color + ', 0.3)';
			} else {
				ctx.fillStyle = 'rgba(' + this.color + ', 1)';				
			}

			ctx.beginPath();
			ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		};

		this.play = function () {
			this.sound.play();
		};
	};

	function makeNote(x, y, sound) {
		notes.push(new Note(x, y, sound));
	};

	function evolveNotes() {
		_.each(notes, function (note) {
			note.y -= 5;

			if (note.y < 150 && note.played == false) {
				note.play();
				note.played = true;
			}

			if (note.y < -20){
				note.y = h + 20;				
				note.played = false;
			}
		});
	};

	function paintScreen() {
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = "rgba(0,0,0,0.2)";
		ctx.lineWidth = 3;
		ctx.fillRect(0,0,w,h);
		ctx.strokeRect(0,0,w,h);
		ctx.closePath();

		_.each(notes, function (note) {
			note.draw();
		});

		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#242733";
		ctx.fillStyle = "#242733";
		ctx.shadowOffsetY = 10;
		ctx.shadowColor="rgba(0,0,0,0.4)";
		ctx.shadowBlur = 3;
		ctx.lineWidth = 2;
		ctx.moveTo(-10, 130.5);
		ctx.lineTo(-10, 170.5);
		ctx.lineTo(20, 150.5);
		ctx.lineTo(-10, 130.5);
		ctx.moveTo(20, 150.5);
		ctx.lineTo(w - 20, 150.5);
		ctx.moveTo(w + 10, 130.5);
		ctx.lineTo(w + 10, 170.5);
		ctx.lineTo(w - 20, 150.5);
		ctx.lineTo(w + 10, 130.5);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.restore();


		evolveNotes();
		requestAnimFrame(paintScreen);
	};

	$('body').disableSelection();

};
function sparklers() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight,
		w = window.innerWidth,
		particles = [],
		color = '#ffe0ab',
		time_interval = 10,
		acceleration = 0.0001,
		sparkler = {
			x: w / 2,
			y: h / 2,
			x0: w / 2,
			y0: h / 2
		},
		mouse = {
			x: w / 2,
			y: h / 2
		};

	canvas.height = h;
	canvas.width = w;

	paintScreen();

	makeParticles(mouse.x, mouse.y);

	$('body').disableSelection();

	$('canvas').on('mousemove', function (e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});

	document.addEventListener('touchmove', function (e) {
    	e.preventDefault();

    	mouse.x = e.pageX;
		mouse.y = e.pageY;
	}, false);

	function paintScreen() {
		ctx.fillStyle = 'rgba(0,0,0,0.15)';
		ctx.fillRect(0, 0, w, h);

		drawSparkler();

		requestAnimFrame(paintScreen);		
	};

	function makeParticles(x, y) {
		for (var i = 0; i < 100; i++) {
			particles.push(new Particle(x, y, color, Math.random()*1.2));
		}
	};

	function Particle(x, y, color, size) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0 = Math.random()/4;
		this.angle = Math.random() * (360 * Math.PI / 180);
		this.time = 0;
		this.r = size,
		this.color = color;
	};

	function drawSparkler() {
		ctx.beginPath();
		ctx.strokeStyle = '#222';
		ctx.lineWidth = 1;
		ctx.moveTo(sparkler.x, sparkler.y);
		ctx.lineTo(sparkler.x + 20, sparkler.y + 100);
		ctx.stroke();
		ctx.closePath();

		ctx.strokeStyle = 'rgba(255,224,171, 0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(sparkler.x0, sparkler.y0);
		ctx.lineTo(sparkler.x, sparkler.y);
		ctx.stroke();
		ctx.closePath();

		sparkler.x0 = sparkler.x;			
		sparkler.y0 = sparkler.y;	

		sparkler.x += (mouse.x - sparkler.x) / 2;
		sparkler.y += (mouse.y - sparkler.y) / 2;		

		drawParticles();
	};

	function drawParticles() {
		_.each(particles, function (part) {
			ctx.fillStyle = part.color;
			ctx.beginPath();
			ctx.arc(part.x, part.y, part.r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		});

		evolveParticles();
	};

	function evolveParticles() {
		_.each(particles, function (part, i) {
			var v0x = part.v0 * Math.sin(part.angle);
			var v0y = part.v0 * Math.cos(part.angle);

			part.time += time_interval;

			part.x = part.x0 + v0x * part.time; 
			part.y = part.y0 - v0y * part.time + acceleration * Math.pow(part.time, 2);

			if (part.time > randomInt(300, 1000)) {
				particles[i] = new Particle(sparkler.x, sparkler.y, color, Math.random()*1.2);
			}
		});
	};
};
function splodinBacon() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var bacon_full = new Image;
	var bacon_top_left = new Image;
	var bacon_top_right = new Image;
	var bacon_bottom_left = new Image;
	var bacon_bottom_right = new Image;
	var bacons = [];
	var bacon_parts = [];
	var flashes = [];
	
	canvas.width = width;
	canvas.height = height;

	setInterval(function () {
		if (bacons.length < 20) {
			makeBacon();
		}
	}, randomInt(50, 2000));

	function makeBacon() {
		bacons.push(new Bacon());
	};

	function Bacon() {
		this.x = randomInt(0, width);
		this.y = -145;
		this.vy = randomInt(2,5);

		this.draw = function () {
			ctx.drawImage(bacon_full, this.x, this.y);
			this.y += this.vy;
		}
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(bacons, function (bacon, i) {
			bacon.draw();

			if (bacon.y > height) {
				bacons[i] = new Bacon();
			}
		});

		_.each(bacon_parts, function (part) {
			part.draw();	
		});

		_.each(flashes, function (flash) {
			flash.draw();	
		});

		bacon_parts = _.reject(bacon_parts, function (part) {
			return (part.x < -30 || part.x > width || part.y < -145 || part.y > height);
		});

		flashes = _.reject(flashes, function (flash) {
			return flash.time <= 0;
		});

		requestAnimFrame(paintScreen);
	};

	function BaconPart(x, y, img) {
		this.x = x;
		this.y = y;
		this.vx = randomInt(-20, 20);
		this.vy = randomInt(-20, 20);

		this.draw = function () {
			ctx.drawImage(img, this.x, this.y);

			this.x += this.vx;
			this.y += this.vy;
		}
	}


	$('canvas').on('click', function (e) {
		var mouse_x = e.pageX;
		var mouse_y = e.pageY;

		_.each(bacons, function (bacon, i) {
			if (mouse_x > bacon.x && mouse_x < bacon.x + 30 && 
				mouse_y > bacon.y && mouse_y < bacon.y + 144) {

				bacon_parts.push(new BaconPart(bacon.x, bacon.y, bacon_top_left));
				bacon_parts.push(new BaconPart(bacon.x + 15, bacon.y, bacon_top_right));
				bacon_parts.push(new BaconPart(bacon.x, bacon.y + 72, bacon_bottom_left));
				bacon_parts.push(new BaconPart(bacon.x + 15, bacon.y + 72, bacon_bottom_right));

				flashes.push(new Flash(mouse_x, mouse_y));

				bacons[i] = new Bacon();
			}
		});
	});

	function Flash(x, y) {
		this.x = x;
		this.y = y;
		this.time = 10;

		this.draw = function () {
			ctx.fillStyle = 'rgba(255,219,74, 0.5)';
			ctx.beginPath();
			ctx.arc(this.x, this.y, 40, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#ffcc00';
			ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#ff7b00';
			ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#e00000';
			ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#1e00ff';
			ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			
			this.time -= 1;
		}
	};

	paintScreen();

	bacon_full.src = '/assets/bacon_full.png';
	bacon_top_left.src = '/assets/bacon_1.png';
	bacon_top_right.src = '/assets/bacon_2.png';
	bacon_bottom_left.src = '/assets/bacon_3.png';
	bacon_bottom_right.src = '/assets/bacon_4.png';

};
function swivelGame() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 500,
		w = 500,
		animation,
		flips = 0,
		tiles= [];

	canvas.height = h;
	canvas.width = w;

	function Tile(x, y, direction, edge) {
		this.x = x;
		this.y = y;
		this.radius = 10;
		this.direction = direction;
		this.isEdge = edge;

		this.flip = function (flipper) {
			this.direction += 1;
			flips += 1;

			if (this.direction > 4) {
				this.direction = 1;
			}

			var tile = this;
			setTimeout(function () {
				checkNeighbors(tile, flipper);

			}, 70)
		};

		this.draw = function () {

			var startAngle,
				endAngle;

			ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.shadowBlur = 2;
			ctx.shadowColor = "rgba(0,0,0,0.3)";
			ctx.closePath();

			ctx.beginPath();
			
			if (this.direction == 1) {
				ctx.fillStyle = '#e74c3c';
				startAngle = Math.PI;
				endAngle = Math.PI * 1.5;
			} else if (this.direction == 2) {
				ctx.fillStyle = '#3498db';
				startAngle = Math.PI * 1.5;
				endAngle = Math.PI * 2;
			} else if (this.direction == 3) {
				ctx.fillStyle = '#8e44ad';
				startAngle = Math.PI * 2;
				endAngle = Math.PI * 0.5;
			} else if (this.direction == 4) {
				ctx.fillStyle = '#2ecc71';
				startAngle = Math.PI * 0.5;
				endAngle = Math.PI;
			}
			ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, false);
			ctx.lineTo(this.x, this.y);

			ctx.fill();
			ctx.closePath();

		}

		function checkNeighbors(tile, flipper) {
			var i = _.indexOf(tiles, tile),
				raw_neighbors = [i - 25, i + 1, i + 25, i - 1], // top, right, bottom, left
				neighbors = [];


			_.each(raw_neighbors, function (pos) {
				if (pos < 0 || pos > 624) {
					neighbors.push(false);
				} else {
					neighbors.push(pos);
				}
			});

			if (tile.direction == 1 || tile.direction == 2) {
				if (neighbors[0] && (tiles[neighbors[0]].direction == 3 || tiles[neighbors[0]].direction == 4)) {
					triggerFlip(tiles[neighbors[0]], i);
				}
			}
			if (tile.direction == 3 || tile.direction == 4) {
				if (neighbors[2] && (tiles[neighbors[2]].direction == 1 || tiles[neighbors[2]].direction == 2)) {
					triggerFlip(tiles[neighbors[2]], i);
				}
			}
			if ((tile.direction == 1 || tile.direction == 4) && tile.isEdge != 'left') {
				if (neighbors[3] !== false && (tiles[neighbors[3]].direction == 2 || tiles[neighbors[3]].direction == 3)) {
					triggerFlip(tiles[neighbors[3]], i);
				}
			}
			if ((tile.direction == 2 || tile.direction == 3) && tile.isEdge != 'right') {
				if (neighbors[1] && (tiles[neighbors[1]].direction == 1 || tiles[neighbors[1]].direction == 4)) {
					triggerFlip(tiles[neighbors[1]], i);
				}
			}
		};

		function triggerFlip(tile, flipper) {
				tile.flip(flipper);
		}
	};

	function makeTile(x, y, direction, edge) {
		tiles.push(new Tile(x, y, direction, edge));
	}

	function paintScreen() {
		ctx.clearRect(0,0,w,h);

		_.each(tiles, function (tile) {
			tile.draw();
		});
		
		$('#flips').text("Swivels: " + flips);
	};

	function init() {
		var x = 10,
			y = 10;
		
		for (var i = 0; i < 625; i++) {
			var edge = false;
			if (x > 490) {
				x = 10;
				y += 20;
				edge = 'left';
			} else if (x == 490) {
				edge = 'right';
			}

			makeTile(x, y, randomInt(1, 4), edge);

			x += 20;

		}
		paintScreen();
	};

	init();

	$('canvas').on('click', function (e) {
		var mouseX = e.pageX - canvas.offsetLeft,
			mouseY = e.pageY - canvas.offsetTop;

		_.each(tiles, function (tile, i) {
			if (mouseX > tile.x - tile.radius && mouseX < tile.x + tile.radius &&
				mouseY > tile.y - tile.radius && mouseY < tile.y + tile.radius) {
				tile.flip(i);
			}
		});
	});

	animation = setInterval(paintScreen, 80);


	$('body').disableSelection();
};
function teammates() {
	var users = [];
	
	$('form').on('submit', function (e) {
		e.preventDefault();
		var username = $.trim($('#username_input').val());
		username = username != '' ? username : 'dribbble';

		$('#form_container').fadeOut(300, function () {
			$('#start_over').fadeIn(300);
		});

		getUserData(username);
	});

	function getUserData(user) {
		var username = user.username ? user.username : user;
		var success = false;

		$.getJSON('http://api.dribbble.com/players/' + username + '/shots/following?per_page=10&callback=?', function (data) {
			var followers = data.shots;

			if (users.length == 0) {
				$.getJSON('http://api.dribbble.com/players/' + username + '/shots?per_page=1&callback=?', function (data) {
					success = true;
					formatUserData(followers, data.shots[0]);
				});
			} else {
				success = true;
				users = [];
				user.user_type = 'main';
				users.push(user);
				formatUserData(followers);
			}
		});

		setTimeout(function () {
			if (!success) {
				alert('Oops! Something went wrong. Please check your request and try again.');
				$('#form_container').show(300);
			}
		}, 5000);
	}

	function formatUserData(followers, user) {
		if (user) {
			extractUserData(user, 'main');
		}

		_.each(followers, function (follower) {
			extractUserData(follower, 'follower')
		});

		displayUsers();
	}

	function extractUserData(user, type) { 
		var user_obj = {}
		user_obj.image_url = user.image_teaser_url;
		user_obj.shot_url = user.url;
		user_obj.username = user.player.username;
		user_obj.user_url = user.player.url;
		user_obj.user_type = type;

		users.push(user_obj);
	}

	function displayUsers() {
		var num = users.length - 1;
		var angle_delta = (360 * Math.PI / 180) / num;
		var angle = 0;

		$('.plot_container').remove();

		var plot_container = $('<div>', {
				class: 'plot_container'
			});

		_.each(users, function (user) {
			var container = $('<div>', {
					class: 'user_container ' + user.user_type
				});

			var image = $('<img>', {
					class: 'image',
					src: user.image_url
				}).on('click', function () {
					$('#teams_container').fadeOut(200);
					getUserData(user);
				});

			var name = $('<a>', {
					href: user.user_url,
					class: 'username',
					target: '_blank'
				}).text(user.username);

			if (user.user_type == 'follower') {
				var x = 240 + 240 * Math.cos(angle);
				var y = 240 + 240 * Math.sin(angle);

				container.css({
					top: x,
					left: y
				});
				angle += angle_delta;
			}

			container.append(image).append(name).appendTo(plot_container);
		});

		$('#teams_container').append(plot_container);

		setTimeout(function () {
			$('#teams_container').fadeIn(500);
		}, 800);
	}
}
;
function textScroller() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 60,
		w = window.innerWidth,
		phrases = [];

	canvas.height = h;
	canvas.width = w;

	function Phrase(phrase, x, y, vx, color, direction) {
		this.phrase = phrase;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.color = color;
		this.opacity = Math.random();
		this.direction = direction;

		this.move = function () {
			if(this.direction == 'right' & this.x > w) {
				this.x = 0 - this.phrase.length * 30;
			} 
			if(this.direction == 'left' & this.x < 0 - this.phrase.length * 30) {
				this.x = w;
			} 

			this.x+= this.vx;

			ctx.font = '50px Courier New';
			ctx.fillStyle = 'rgba('+ this.color + ', ' + this.opacity + ')';
			ctx.fillText(this.phrase, this.x, this.y);

		};
	};
	
	function makePhrase(phrase) {
		var vx = randomFloat(-5, 5),
			direction,
			x;


		if (vx < 1.5 && vx > 0) {
			vx += 1.5;
		} else if (vx > -1.5 && vx < 0) {
			vx -= 1.5;
		}

		if (vx >= 0){
			direction = 'right';
			x = phrase.length * 30 * -1;
		} else {
			direction = 'left';
			x = w;
		}
		phrases.push(new Phrase(phrase, x, 50, vx, randomColorRGB(), direction))
	}

	function paintScreen() {
		ctx.clearRect(0,0,w,h);
		_.each(phrases, function (phrase) {
			phrase.move();
		});

		setTimeout(paintScreen, 50);
	};

	paintScreen();

	$('input[type=text]').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();

		var phrase = $(this).find('#phrase_text').val();

		$(this).find('#phrase_text').val('');

		makePhrase(phrase);
	});

	var form_state = true;

	$('.close').on('click', function () {
		if (form_state) {
			$('form').animate({top: '-100px'}, 500);
			$('.close').html('&#9660').css('color', '#222');
			form_state = !form_state
		} else {
			$('form').animate({top: '0'}, 500);
			$('.close').html('&#9650').css('color', '#666');
			form_state = !form_state
		}
	})

};













function textToBraille() {
	var characters = {
		'a': [1],
		'b': [1, 3],
		'c': [1, 2],
		'd': [1, 2, 4],
		'e': [1, 4],
		'f': [1, 2, 3],
		'g': [1, 2, 3, 4],
		'h': [1, 3, 4],
		'i': [2, 3],
		'j': [2, 3, 4],
		'k': [5, 1],
		'l': [5, 1, 3],
		'm': [5, 1, 2],
		'n': [5, 1, 2, 4],
		'o': [5, 1, 4],
		'p': [5, 1, 2, 3],
		'q': [5, 1, 2, 3, 4],
		'r': [5, 1, 3, 4],
		's': [5, 2, 3],
		't': [5, 2, 3, 4],
		'u': [5, 6, 1],
		'v': [5, 6, 1, 3],
		'w': [5, 6, 3, 4],
		'x': [5, 6, 1, 2],
		'y': [5, 6, 1, 2, 4],
		'z': [5, 6, 1, 4],
		'1': [1],
		'2': [1, 3],
		'3': [1, 2],
		'4': [1, 2, 4],
		'5': [1, 4],
		'6': [1, 2, 3],
		'7': [1, 2, 3, 4],
		'8': [1, 3, 4],
		'9': [2, 3],
		'0': [2, 3, 4],
		'!': [3, 4, 5],
		'\'': [5],
		',': [3],
		'-': [5, 6],
		'.': [3, 4, 6],
		'?': [3, 5, 6],
		'^': [6],
		'#': [2, 4, 5, 6],
		' ': [] 
	};

	$('textarea').focus();

	$('textarea').on('keyup', function() {
		var text = $.trim($('textarea').val()),
			output = $('#braille_container').empty(),
			cur_braille = [];

			text = text.replace(/(\d+)/g, '#$1').replace(/(\d)([a-j])/g, '$1 $2')
					   .replace(/([A-Z])/g, '^$1').toLowerCase(); 

		_.each(text, function (c) {
			if (_.has(characters, c)) {
				cur_braille.push(characters[c]);
			} else {
				cur_braille.push(characters[' ']);
			}
		});

		_.each(cur_braille, function (char_array) {
			var cell = $('<div />', {
				class: 'cell'
			}).appendTo(output);

			_.each(char_array, function (pos) {
				cell.append('<div class="dot d' + pos + '"></div>');
			});
		});
	});
};


function tinyNotes() {
	$('form').focus();

	$('form').on('submit', function (e) {
		if ($('input[type=text]').val().trim() == '') {
			e.preventDefault();
			alert('This is Tiny Notes, not Non-Existent Notes!');
			$('input[type=text]').focus();
		}
		
		if ($('input[type=text]').val().length > 255) {
			e.preventDefault();
			alert('This is Tiny Notes, not Insanely Long Notes! Keep it to 255 characters or less.');
			$('input[type=text]').focus();
		}
	});
}
;
function tos() {
	var tos = "Terms of Service:   The following terms and conditions govern all use of the jenniferdewalt.com website and all content, services and products available at or through the website (the Website). The Website is owned and operated by Jennifer Dewalt. (“Jennifer Dewalt”). The Website is offered subject to your acceptance without modification of all of the terms and conditions contained herein and all other operating rules, policies (including, without limitation, Jennifer Dewalt’s Privacy Policy) and procedures that may be published from time to time on this Site by Jennifer Dewalt (collectively, the “Agreement”). Please read this Agreement carefully before accessing or using the Website. By accessing or using any part of the web site, you agree to become bound by the terms and conditions of this agreement. If you do not agree to all the terms and conditions of this agreement, then you may not access the Website or use any services. If these terms and conditions are considered an offer by Jennifer Dewalt, acceptance is expressly limited to these terms. The Website is available only to individuals who are at least 13 years old. Your jenniferdewalt.com Account and Site. If you create an account on the Website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account and any other actions taken in connection with the account. You must not describe or assign keywords to your account in a misleading or unlawful manner, including in a manner intended to trade on the name or reputation of others, and Jennifer Dewalt may change or remove any description or keyword that it considers inappropriate or unlawful, or otherwise likely to cause Jennifer Dewalt liability. You must immediately notify Jennifer Dewalt of any unauthorized uses of your account, your account or any other breaches of security. Jennifer Dewalt will not be liable for any acts or omissions by You, including any damages of any kind incurred as a result of such acts or omissions. Responsibility of Contributors. If you operate an account, comment on a account, post material to the Website, post links on the Website, or otherwise make (or allow any third party to make) material available by means of the Website (any such material, “Content”), You are entirely responsible for the content of, and any harm resulting from, that Content. That is the case regardless of whether the Content in question constitutes text, graphics, an audio file, or computer software. By making Content available, you represent and warrant that: the downloading, copying and use of the Content will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark or trade secret rights, of any third party; if your employer has rights to intellectual property you create, you have either (i) received permission from your employer to post or make available the Content, including but not limited to any software, or (ii) secured from your employer a waiver as to all rights in or to the Content; you have fully complied with any third-party licenses relating to the Content, and have done all things necessary to successfully pass through to end users any required terms; the Content does not contain or install any viruses, worms, malware, Trojan horses or other harmful or destructive content; the Content is not spam, is not machine- or randomly-generated, and does not contain unethical or unwanted commercial content designed to drive traffic to third party sites or boost the search engine rankings of third party sites, or to further unlawful acts (such as phishing) or mislead recipients as to the source of the material (such as spoofing); the Content is not pornographic, does not contain threats or incite violence, and does not violate the privacy or publicity rights of any third party; your account is not getting advertised via unwanted electronic messages such as spam links on newsgroups, email lists, other accounts and web sites, and similar unsolicited promotional methods; your account is not named in a manner that misleads your readers into thinking that you are another person or company. For example, your account’s URL or name is not the name of a person other than yourself or company other than your own; and you have, in the case of Content that includes computer code, accurately categorized and/or described the type, nature, uses and effects of the materials, whether requested to do so by Jennifer Dewalt or otherwise. By submitting Content to Jennifer Dewalt for inclusion on your Website, you grant Jennifer Dewalt a world-wide, royalty-free, and non-exclusive license to reproduce, modify, adapt and publish the Content solely for the purpose of displaying, distributing and promoting your account. If you delete Content, Jennifer Dewalt will use reasonable efforts to remove it from the Website, but you acknowledge that caching or references to the Content may not be made immediately unavailable. Without limiting any of those representations or warranties, Jennifer Dewalt has the right (though not the obligation) to, in Jennifer Dewalt’s sole discretion (i) refuse or remove any content that, in Jennifer Dewalt’s reasonable opinion, violates any Jennifer Dewalt policy or is in any way harmful or objectionable, or (ii) terminate or deny access to and use of the Website to any individual or entity for any reason, in Jennifer Dewalt’s sole discretion. Jennifer Dewalt will have no obligation to provide a refund of any amounts previously paid. Responsibility of Website Visitors. Jennifer Dewalt has not reviewed, and cannot review, all of the material, including computer software, posted to the Website, and cannot therefore be responsible for that material’s content, use or effects. By operating the Website, Jennifer Dewalt does not represent or imply that it endorses the material there posted, or that it believes such material to be accurate, useful or non-harmful. You are responsible for taking precautions as necessary to protect yourself and your computer systems from viruses, worms, Trojan horses, and other harmful or destructive content. The Website may contain content that is offensive, indecent, or otherwise objectionable, as well as content containing technical inaccuracies, typographical mistakes, and other errors. The Website may also contain material that violates the privacy or publicity rights, or infringes the intellectual property and other proprietary rights, of third parties, or the downloading, copying or use of which is subject to additional terms and conditions, stated or unstated. Jennifer Dewalt disclaims any responsibility for any harm resulting from the use by visitors of the Website, or from any downloading by those visitors of content there posted. Content Posted on Other Websites. We have not reviewed, and cannot review, all of the material, including computer software, made available through the websites and webpages to which jenniferdewalt.com links, and that link to jenniferdewalt.com. Jennifer Dewalt does not have any control over those non-jenniferdewalt.com websites and webpages, and is not responsible for their contents or their use. By linking to a non-jenniferdewalt.com website or webpage, Jennifer Dewalt does not represent or imply that it endorses such website or webpage. You are responsible for taking precautions as necessary to protect yourself and your computer systems from viruses, worms, Trojan horses, and other harmful or destructive content. Jennifer Dewalt disclaims any responsibility for any harm resulting from your use of non-jenniferdewalt.com websites and webpages. Copyright Infringement and DMCA Policy. As Jennifer Dewalt asks others to respect its intellectual property rights, it respects the intellectual property rights of others. If you believe that material located on or linked to by jenniferdewalt.com violates your copyright, you are encouraged to notify Jennifer Dewalt in accordance with Jennifer Dewalt’s Digital Millennium Copyright Act (“DMCA”) Policy. Jennifer Dewalt will respond to all such notices, including as required or appropriate by removing the infringing material or disabling all links to the infringing material. Jennifer Dewalt will terminate a visitor’s access to and use of the Website if, under appropriate circumstances, the visitor is determined to be a repeat infringer of the copyrights or other intellectual property rights of Jennifer Dewalt or others. In the case of such termination, Jennifer Dewalt will have no obligation to provide a refund of any amounts previously paid to Jennifer Dewalt. Intellectual Property. This Agreement does not transfer from Jennifer Dewalt to you any Jennifer Dewalt or third party intellectual property, and all right, title and interest in and to such property will remain (as between the parties) solely with Jennifer Dewalt. Jennifer Dewalt, jenniferdewalt, jenniferdewalt.com, the jenniferdewalt.com logo, and all other trademarks, service marks, graphics and logos used in connection with jenniferdewalt.com, or the Website are trademarks or registered trademarks of Jennifer Dewalt or Jennifer Dewalt’s licensors. Other trademarks, service marks, graphics and logos used in connection with the Website may be the trademarks of other third parties. Your use of the Website grants you no right or license to reproduce or otherwise use any Jennifer Dewalt or third-party trademarks. Advertisements. Jennifer Dewalt reserves the right to display advertisements on your account. Changes. Jennifer Dewalt reserves the right, at its sole discretion, to modify or replace any part of this Agreement. It is your responsibility to check this Agreement periodically for changes. Your continued use of or access to the Website following the posting of any changes to this Agreement constitutes acceptance of those changes. Jennifer Dewalt may also, in the future, offer new services and/or features through the Website (including, the release of new tools and resources). Such new features and/or services shall be subject to the terms and conditions of this Agreement. Termination. Jennifer Dewalt may terminate your access to all or any part of the Website at any time, with or without cause, with or without notice, effective immediately. If you wish to terminate this Agreement or your jenniferdewalt.com account (if you have one), you may simply discontinue using the Website. All provisions of this Agreement which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. Disclaimer of Warranties. The Website is provided “as is”. Jennifer Dewalt and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement. Neither Jennifer Dewalt nor its suppliers and licensors, makes any warranty that the Website will be error free or that access thereto will be continuous or uninterrupted. You understand that you download from, or otherwise obtain content or services through, the Website at your own discretion and risk. Limitation of Liability. In no event will Jennifer Dewalt, or its suppliers or licensors, be liable with respect to any subject matter of this agreement under any contract, negligence, strict liability or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of procurement for substitute products or services; (iii) for interruption of use or loss or corruption of data; or (iv) for any amounts that exceed the fees paid by you to Jennifer Dewalt under this agreement during the twelve (12) month period prior to the cause of action. Jennifer Dewalt shall have no liability for any failure or delay due to matters beyond their reasonable control. The foregoing shall not apply to the extent prohibited by applicable law. General Representation and Warranty. You represent and warrant that (i) your use of the Website will be in strict accordance with the Jennifer Dewalt with this Agreement and with all applicable laws and regulations (including without limitation any local laws or regulations in your country, state, city, or other governmental area, regarding online conduct and acceptable content, and including all applicable laws regarding the transmission of technical data exported from the United States or the country in which you reside) and (ii) your use of the Website will not infringe or misappropriate the intellectual property rights of any third party. Indemnification. You agree to indemnify and hold harmless Jennifer Dewalt, its contractors, and its licensors, and their respective directors, officers, employees and agents from and against any and all claims and expenses, including attorneys’ fees, arising out of your use of the Website, including but not limited to your violation of this Agreement. Miscellaneous. This Agreement constitutes the entire agreement between Jennifer Dewalt and you concerning the subject matter hereof, and they may only be modified by a written amendment signed by an authorized executive of Jennifer Dewalt, or by the posting by Jennifer Dewalt of a revised version. Except to the extent applicable law, if any, provides otherwise, this Agreement, any access to or use of the Website will be governed by the laws of the state of California, U.S.A., excluding its conflict of law provisions, and the proper venue for any disputes arising out of or relating to any of the same will be the state and federal courts located in San Francisco County, California. Except for claims for injunctive or equitable relief or claims regarding intellectual property rights (which may be brought in any competent court without the posting of a bond), any dispute arising under this Agreement shall be finally settled in accordance with the Comprehensive Arbitration Rules of the Judicial Arbitration and Mediation Service, Inc. (“JAMS”) by three arbitrators appointed in accordance with such Rules. The arbitration shall take place in San Francisco, California, in the English language and the arbitral decision may be enforced in any court. The prevailing party in any action or proceeding to enforce this Agreement shall be entitled to costs and attorneys’ fees. If any part of this Agreement is held invalid or unenforceable, that part will be construed to reflect the parties’ original intent, and the remaining portions will remain in full force and effect. A waiver by either party of any term or condition of this Agreement or any breach thereof, in any one instance, will not waive such term or condition or any subsequent breach thereof. You may assign your rights under this Agreement to any party that consents to, and agrees to be bound by, its terms and conditions; Jennifer Dewalt may assign its rights under this Agreement without condition. This Agreement will be binding upon and will inure to the benefit of the parties, their successors and permitted assigns.".split(' '); 

	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = window.innerHeight,
		width = window.innerWidth,
		words = [],
		acceleration = 0.0001,
		time_interval = 70;

	canvas.height = height;
	canvas.width = width;

	function Word(word) {
		this.word = word;
		this.y = 100;
		this.y0 = 100;
		this.x = width / 2;
		this.color = '#03020f',
		this.time = 0;

		this.draw = function () {
			ctx.textBaseline = 'middle';
	    	ctx.textAlign = 'center';
			ctx.fillStyle = this.color;
	 		ctx.font = '20px Open Sans';
  			ctx.fillText(this.word, this.x, this.y);
		};
	};

	function makeWord(word) {
		words.push(new Word(word));
	};

	function evolveWords() {
		_.each(words, function (word) {
			if (word.y >= height - 50) {
				word.y = height - 30;
			} else {
				word.y = word.y0 + 0.5 * acceleration * Math.pow(word.time, 2);
				word.time += time_interval;
				word.color = 'rgba(0,0,0,0.3)';
			}
		});
	};

	function drawWords() {
		_.each(words, function (word) {
			word.draw();
		});

		evolveWords();
	};

	function paintScreen() {
		if (words.length < tos.length) {
			makeWord(tos[words.length]);
		}

		ctx.clearRect(0,0,width, height);
		drawWords();
		setTimeout(paintScreen, time_interval);
	};

	paintScreen();
};
function tweetTime() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var radius = 7;
	var padded_height = 400;
	var height = padded_height + radius * 2 + 30;
	var width = 720 + radius * 2;
	var markers = [];
	var drawing;

	canvas.width = width;
	canvas.height = height;

	$('#username_input').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var username = $('#username_input').val();
		clearTimeout(drawing);

		$('#container h1').animate({opacity: 0}, 200, function () {
			$('form').animate({top: 0}, 400);
			$('#container').remove();
		});

		$.ajax({
			type: 'POST',
			url: '/tweet_time/page',
			dataType: "json",
			data: {
				username: username
			},
			complete: function (data) {
				startPlot(data.responseText);
			},
			error: function (xhr, status, error) {
				console.log(error)
				alert('Sorry, there seems to have been a problem with your search.');
			}
		});
	});

	$('body').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		_.each(markers, function (marker) {
			if (intersects(x, y, marker.x, marker.y, marker.radius)) {
				$('.tweet').text(marker.tweet);
			}
		});
	});

	function startPlot(response) {
		var tweets = $.parseJSON(response);

		if (tweets.length > 0) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			markers = [];

			$('body').css({'background-color': '#222'});
			$('#canvas_container').fadeIn(400, function () {
				makeMarkers(tweets);
			});		
		} else {
			alert('This person doesn\'t have any tweets!');
		}
	}

	function drawTimeScale() {
		var times = ['4 am', '8 am', '12 pm', '4 pm', '8 pm'];
		var spacing = canvas.width / 6;
		var pos = spacing;

		_.each(times, function (time, i) {
			ctx.beginPath();
			ctx.fillStyle = '#ff9800';

			ctx.font = '16px Arial Rounded MT Bold';
			ctx.textAlign = 'center';
			ctx.fillText(time, pos, canvas.height - 5);
			ctx.closePath();
			pos += spacing;
		});
	}

	function makeMarkers(tweets) {
		drawTimeScale();

		_.each(tweets, function (tweet) {
			markers.push(new Marker(tweet));
		});

		drawMarker(markers[0], 0, radius);
	}

	function Marker(tweet) {
		this.tweet = tweet.text;
		this.time = new Date(tweet.time);
		this.hours = new Date(tweet.time).getHours();
		this.mins = new Date(tweet.time).getMinutes();
		this.color = 'rgba(0, 183, 252, 0.7)';
		this.shadow = 'rgba(110, 215, 255, 0.15)';
		this.radius = radius;
	}

	function drawMarker(marker, i, y) {
		var spacing = padded_height / (markers.length + 1);
		var j = i + 1;

		if (markers.length >= j) {
			marker.x = (marker.hours * 60 + marker.mins) / 2 + marker.radius;
			marker.y = y;

			ctx.beginPath();
			ctx.fillStyle = marker.shadow;
			ctx.arc(marker.x, marker.y, marker.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = marker.color;
			ctx.arc(marker.x, marker.y, marker.radius / 1.5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			drawing = setTimeout(function () {
				drawMarker(markers[j], j, y + spacing);
			}, 150);			
		}
	}

	function intersects(x, y, cx, cy, r) {
	    var dx = x - cx;
	    var dy = y - cy;
	    return dx * dx + dy * dy <= r * r;
	}
}
;
function typingTest() {
	var p0 = "<p>Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.</p><br><p>Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battlefield of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.</p><br><p>But, in a larger sense, we cannot dedicate -- we cannot consecrate -- we cannot hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.</p>",
		
		p1 = "<p>Fans, for the past two weeks you have been reading about a bad break I got. Yet today I consider myself the luckiest man on the face of the earth. I have been in ballparks for seventeen years and have never received anything but kindness and encouragement from you fans.</p><br><p>Look at these grand men. Which of you wouldn't consider it the highlight of his career to associate with them for even one day?</p><br><p>Sure, I'm lucky. Who wouldn't consider it an honor to have known Jacob Ruppert -- also the builder of baseball's greatest empire, Ed Barrow -- to have spent the next nine years with that wonderful little fellow Miller Huggins -- then to have spent the next nine years with that outstanding leader, that smart student of psychology -- the best manager in baseball today, Joe McCarthy!</p><br><p>Sure, I'm lucky. When the New York Giants, a team you would give your right arm to beat, and vice versa, sends you a gift, that's something! When everybody down to the groundskeepers and those boys in white coats remember you with trophies, that's something.</p><br><p>When you have a wonderful mother-in-law who takes sides with you in squabbles against her own daughter, that's something. When you have a father and mother who work all their lives so that you can have an education and build your body, it's a blessing! When you have a wife who has been a tower of strength and shown more courage than you dreamed existed, that's the finest I know.</p><br><p>So I close in saying that I might have had a tough break -- but I have an awful lot to live for!</p>",

		p2 = "<p>We observe today not a victory of party, but a celebration of freedom -- symbolizing an end, as well as a beginning -- signifying renewal, as well as change. For I have sworn before you and Almighty God the same solemn oath our forebears prescribed nearly a century and three-quarters ago.</p><br><p>The world is very different now. For man holds in his mortal hands the power to abolish all forms of human poverty and all forms of human life. And yet the same revolutionary beliefs for which our forebears fought are still at issue around the globe -- the belief that the rights of man come not from the generosity of the state, but from the hand of God.</p><br><p>We dare not forget today that we are the heirs of that first revolution. Let the word go forth from this time and place, to friend and foe alike, that the torch has been passed to a new generation of Americans -- born in this century, tempered by war, disciplined by a hard and bitter peace, proud of our ancient heritage, and unwilling to witness or permit the slow undoing of those human rights to which this nation has always been committed, and to which we are committed today at home and around the world.</p><br><p>Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe, to assure the survival and the success of liberty.</p><br><p>This much we pledge -- and more.</p>",

		p3 = "<p>We've grown used to wonders in this century. It's hard to dazzle us. But for 25 years the United States space program has been doing just that. We've grown used to the idea of space, and perhaps we forget that we've only just begun. We're still pioneers. They, the members of the Challenger crew, were pioneers.</p><br><p>And I want to say something to the school children of America who were watching the live coverage of the shuttle's takeoff. I know it is hard to understand, but sometimes painful things like this happen. It's all part of the process of exploration and discovery. It's all part of taking a chance and expanding man's horizons. The future doesn't belong to the fainthearted; it belongs to the brave. The Challenger crew was pulling us into the future, and we'll continue to follow them...</p><br><p>The crew of the space shuttle Challenger honoured us by the manner in which they lived their lives. We will never forget them, nor the last time we saw them, this morning, as they prepared for the journey and waved goodbye and 'slipped the surly bonds of earth' to 'touch the face of God.'</p>",

		p4 = "<p>Now it is the time to act on behalf of women everywhere. If we take bold steps to better the lives of women, we will be taking bold steps to better the lives of children and families too. Families rely on mothers and wives for emotional support and care. Families rely on women for labor in the home. And increasingly, everywhere, families rely on women for income needed to raise healthy children and care for other relatives.</p><br><p>As long as discrimination and inequities remain so commonplace everywhere in the world, as long as girls and women are valued less, fed less, fed last, overworked, underpaid, not schooled, subjected to violence in and outside their homes -- the potential of the human family to create a peaceful, prosperous world will not be realized.</p><br><p>Let -- Let this conference be our -- and the world’s -- call to action. Let us heed that call so we can create a world in which every woman is treated with respect and dignity, every boy and girl is loved and cared for equally, and every family has the hope of a strong and stable future. That is the work before you. That is the work before all of us who have a vision of the world we want to see -- for our children and our grandchildren.</p>";

	var passages = [p0, p1, p2, p3, p4],
		elapsed,
		clock,
		cur_passage = passages[randomInt(0,4)];

	$('textarea').blur();

	$('button.start').on('click', function () {
		$('textarea').focus();
		$('#text_passage').html(cur_passage);
		$('.modal.start').fadeOut(300);
		
		$('textarea').one('input', function () {
			timer();
		});
	});

	$('.end p').on('click', function () {
		$('.modal.end').fadeOut(300);
	});

	function timer() {
		var start = new Date().getTime(),
			elapsed = 0;

		clock = setInterval(function () {
			var time = new Date().getTime() - start;

			elapsed = Math.floor(time / 1000);
			formatTime(60 - elapsed);

			if (elapsed == 60) {
				clearInterval(clock);
				checkTest($('textarea').val(), cur_passage);
			}

		}, 500);
	};

	function formatTime(seconds) {
		var min = Math.floor(seconds / 60), 
			sec = seconds % 60;

		if (sec < 10) {
			sec = '0' + sec;
		}
		if (min < 10) {
			min = '0' + min;
		}

		cur_time = min + ':' + sec;
		$('.timer').text(cur_time);
	};

	function checkTest(test, passage) {
		var occurrences = {},
			total_score = 0;

		passage = passage.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br>/g, ' ').split(' ');
		test = test.replace(/\r?\n|\r/g, ' ').replace(/  /g, ' ').split(' ');

		_.each(passage, function (word) {
			occurrences[word] = occurrences[word] ? occurrences[word] + 1 : 1;
		});

		_.each(test, function (word) {
			if (occurrences[word] && occurrences[word] > 0) {
				total_score += 1;
				occurrences[word] = occurrences[word] - 1;
			}
		});

		returnResult(total_score);
	};

	function returnResult(words) {
		$('.end .wpm').text('Words per minute: ' + words);
		$('.end').fadeIn(300);
	};


}
;
function viewGraph() {
	var number_of_views = $('#views_container > div').size(),
		incrementer = 1 / (number_of_views * 1.3),
		opacity = 1,
		cur_div = number_of_views;

	_.each(_.range(number_of_views), function (n) {
		assignBackground(cur_div - n);
		opacity -= incrementer;
	});

	$('#info_tab').on('click', function () {
		$('.modal.info').fadeIn('400');
	});

	$('.close').on('click', function () {
		$('.modal.info').fadeOut('300');
	});

	function assignBackground(n) {
		$('.view_mark:nth-child(' + n + ')').css('opacity', opacity);
	};
};
function whatDay() {
	var date = new Date()
		date.setHours(0,0,0,0);
	var today = {
		month: date.getMonth(),
		date: date.getDate(),
		year: date.getFullYear()
	};
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var text = '';

	$('form .month').val(today.month + 1);
	$('form .date').val(today.date);
	$('form .year').val(today.year);

	$('#day_container').text(months[today.month] + ' ' + today.date + ', ' + today.year + ' is a ' + days[date.getDay()]);

	getWikiEvents(months[today.month] + "%20" + today.date);

	$('form').on('submit', function (e) {
		$('#result').hide();
		e.preventDefault();
		var req_date = {
			month: Number($.trim($('form .month').val())) - 1,
			date: Number($.trim($('form .date').val())),
			year: Number($.trim($('form .year').val()))			
		}
		
		if (isNaN(req_date.month) || isNaN(req_date.date) || isNaN(req_date.year)) {
			req_date.month = today.month;
			req_date.date = today.date;
			req_date.year = today.year;
		}

		var new_date = new Date(req_date.year, req_date.month, req_date.date);
		var is_was = new_date < date ? 'was' : 'is';
		var text = months[new_date.getMonth()] + ' ' + new_date.getDate() + ', ' + new_date.getFullYear() + ' ' + is_was + ' a ' + days[new_date.getDay()]

		$('#day_container').text(text);
		$('form .month').val(new_date.getMonth() + 1);
		$('form .date').val(new_date.getDate());
		$('form .year').val(new_date.getFullYear());

		getWikiEvents(months[new_date.getMonth()] + "%20" + new_date.getDate());
	});

	function getWikiEvents(page) {
		$.getJSON("http://en.wikipedia.org//w/api.php?action=parse&format=json&page=" + page + "&prop=text&section=1&callback=?", function (data) { 
			wikipediaPageResult(data) 
		});
	} 

	function wikipediaPageResult(response) {
		if (response.parse) {
			var text = response.parse.text['*'].split('<ul>');
			text = text[1].split('</ul>')[0];
			text = text.replace(/\/wiki/g, 'http://en.wikipedia.org/wiki');
			$('#events_container').html(text);
		}

		$('#result').fadeIn(300);
	}
}
;
function windowPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 600;
	var width = 500;
	var outside = new Image();
	var g = ctx.createLinearGradient(0, canvas.height * 2.3, canvas.width * 1.5, 0 );
			g.addColorStop(0, 'rgba(209, 221, 229, 0.399)');
			g.addColorStop(0.135, 'rgba(255, 255, 255, 0.556)');
			g.addColorStop(0.19, 'rgba(224, 228, 251, 0.506)');
			g.addColorStop(0.355, 'rgba(255, 255, 255, 0.467)');
			g.addColorStop(0.5, 'rgba(255, 255, 255, 0.467)');
			g.addColorStop(0.76, 'rgba(179, 196, 239, 0.371)');
			g.addColorStop(0.925, 'rgba(255, 255, 255, 0.449)');
			g.addColorStop(0.99, 'rgba(210, 228, 249, 0.445)');
			
	canvas.height = height;
	canvas.width = width;

	var mouse = {
		y: canvas.height
	}
	var sound = new Howl({
		urls: ['/assets/nature.mp3', '/assets/nature.ogg'],
		volume: 0.0,
		loop: true
	});
	var images = $('#images').data('img');

	var windowPane = {
		width: canvas.width,
		height: canvas.height / 2,
		position: canvas.height,
		open: 0,
		draw: function () {
			//Draw top pane
			ctx.beginPath();
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, this.width, this.height);

			ctx.strokeStyle = '#fafafa';
			ctx.lineWidth = 10;
			ctx.moveTo(0, this.height);
			ctx.lineTo(this.width, this.height);
			ctx.stroke();
			ctx.closePath();

			// Draw bottom/movible pane
			ctx.beginPath();
			ctx.fillStyle = g;
			ctx.fillRect(0, this.position, this.width, -1 *this.height);

			ctx.strokeStyle = '#fafafa';
			ctx.lineWidth = 10;
			ctx.moveTo(0, this.position);
			ctx.lineTo(this.width, this.position);
			ctx.moveTo(0, this.position - this.height);
			ctx.lineTo(this.width, this.position - this.height);
			ctx.stroke();
			ctx.closePath();
		}
	};

	outside.onload = function () {
		drawWindow();
	};

	outside.draw = function () {
		var offset_x = (canvas.width - outside.width) / 2;
		var offset_y = (canvas.height - outside.height) / 2;

		ctx.drawImage(outside, offset_x, offset_y);		
	};

	$('canvas').on('mousemove', function (e) {
		mouse.y = e.pageY - canvas.offsetTop;

		if (mouse.y < 600 && mouse.y > canvas.height / 2) {
			windowPane.position = mouse.y;
			sound.volume(1 - ((mouse.y - canvas.height / 2) / (canvas.height / 2)));
		}

		drawWindow();
	});

	$('button').on('click', function () {
		outside.src = images[randomInt(0, images.length - 1)];
		drawWindow();
	})

	function drawWindow() {
		outside.draw();
		windowPane.draw();
	}

	sound.play().volume(0.0);

	outside.src = images[randomInt(0, images.length - 1)];
}
;
function windowSizer() {
	var screen_height = screen.availHeight;
	var screen_width = screen.availWidth;
	var target_width;
	var target_height;
	var running = false;
	var score = 0;

	$('#start').on('click', function () {
		$('#start_container').fadeOut(300);
		running = true;
		setNewTarget();
		timer();
	});

	
	$(window).resize(function () {
		if (window.innerWidth > target_width - 3 &&  window.innerWidth < target_width + 3 && 
			window.innerHeight > target_height - 3 && window.innerHeight < target_height + 3 &&
			running) {
			score += 1;
			setNewTarget();
		}
	});		


	function setNewTarget() {
		target_width = randomInt(500, screen_width - 200);
		target_height = randomInt(250, screen_height - 200);

		$('#target_text').text(target_width + ' x ' + target_height);
		$('#target_area').animate({
			width: target_width,
			height: target_height,
		}, 300).css({
			'backgroundColor': randomColorHex
		});

		$('#score').text('Resizes: ' + score);
	};

	function timer() {
		var start = new Date().getTime(),
			elapsed = 0;

		clock = setInterval(function () {
			var time = new Date().getTime() - start;

			elapsed = Math.floor(time / 1000);
			updateProgressBar(60 - elapsed);

			if (elapsed == 60) {
				clearInterval(clock);
				endGame();
			}
		}, 500);
	};

	function updateProgressBar(seconds) {
		$('#progress_bar').css('width', seconds / 60 * 100 + '%');
	};

	function endGame() {
		running = false;
		$('#info_container').hide();
		$('#final_score').text('Total Resizes: ' + score);
		$('#end_container').fadeIn(300);
	};
}
;
function wish() {
	var wishes = ['were younger.', 
				  'were thinner.', 
				  'had a faster processor.'];
	var index = 0;

	function showMessage() {
		$('#message').text(wishes[index]).show();	

		setTimeout(hideMessage, 380)
	};

	function hideMessage() {
		$('#message').hide();
		
		updateMessage()		
	};

	function updateMessage() {
		index += 1;

		if (index > 2) {
			index = 0;
		}

		showMessage();
	};


	showMessage();
};
function wordClock() {
	getTime();

	function getTime() {
		var hour = new Date().getHours();

		if (hour > 11) {
			var abbrev = "pm";
		} 
		else {
			var abbrev = "am";
		}

		var min = new Date().getMinutes();

		if (min > 10 && min < 20) {
			var min_tens = min;
			var min_ones = null;
		} else if (min > 9) {
			var min_tens = Math.floor(min/10) * 10;
			var min_ones = min % 10;
		} else if (min == 0) {
			var min_tens = null;
			var min_ones = null;
		}
		else {
			var min_tens = "zero";
			var min_ones = min;
		}

		$(".hour_list li").removeClass('now');

		if (hour % 12 == 0) {
			$(".hour_list ." + 12).addClass('now');
		} else {
			$(".hour_list ." + hour % 12).addClass('now');
		} 

		$(".abbrev").removeClass('now');
		$("#" + abbrev).addClass('now');
		

		$(".min_list li").removeClass('now');
		$(".min_list ." + min_ones).addClass('now');
		$(".min_list ." + min_tens).addClass('now');
	
		setTimeout( getTime, 1000 );
	};
};
function wordCloud() {
	$('#text_field').focus();

	$('form').on('submit', function (e) {
		var input = $('#text_field').val();

		if (input.length > 255) {
			e.preventDefault();
			showWarning('Your text is too long.');
		} else if (input.length < 1) {
			e.preventDefault();
			showWarning('Your text is too short.')
		}
	});

	$('#info_tab').on('click', function () {
		$('.modal').fadeIn(400);
	});

	$('.close').on('click', function () {
		$('.modal').fadeOut(400);
	});

	function showWarning(text) {
		$('.input_warning').css('opacity', 0).text(text).animate({
			opacity: 1
		}, 300);
		
		$('#text_field').focus();
	}
}
;
function yourSpace() {};
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function randomColorHex() {
	return '#' + Math.random().toString(16).slice(2, 8);
};

function randomColorRGB() {
  var r = randomInt(0, 255);
  var g = randomInt(0, 255);
  var b = randomInt(0, 255);

  return r + ', ' + g + ', ' + b;
};
function randomColorHSL() {
	var h = randomInt(0, 360);
	var s = randomInt(0, 100);
	var l = randomInt(0, 100);

	return {h: h, s: s, l: l};
};

function randomFloat(min, max) {
	return Math.random() * (max - min + 1) + min;
}

function randomNumWithGap(min1, max1, min2, max2) {
  var rand = Math.random();

  if (rand < 0.5) {
    return randomInt(min1, max1);
  } else {
    return randomInt(min2, max2);
  }
}

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function rgbComponentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function hexToRgb(hex) {
  var short_hand_regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(short_hand_regex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
$(document).ready(function () {
	var routes = {
		"users": nothing,
		"click_counter": clickCounter,
		"one_page": onePage,
		"make_a_dude": makeADude,
		"keep_it_up": keepItUpGame,
		"view_graph": viewGraph,
		"king_of_comments": kingOfComments,
		"pixshow": pixShow,
		"your_space": yourSpace,
		"hangman": hangmanGame,
		"pv_calculator": pvCalculator,
		"tiny_notes": tinyNotes,
		"capture": captureGame,
		"text_scroller": textScroller,
		"hollywood": hollywoodSign,
		"liquor_likes": liquorLikes,
		"fishy_friend": fishyFriend,
		"snare": snare,
		"quick_words": quickWords,
		"countdown": countdownClock,
		"hourglass": hourglass,
		"skinny_drinks": skinnyDrinks,
		"pinwheel": pinwheel,
		"typing_test": typingTest,
		"swivel": swivelGame,
		"mastermind": mastermindGame,
		"sparklers": sparklers,
		"postbored": postbored,
		"text_to_braille": textToBraille,
		"no_one_watching": noOneWatching,
		"tos": tos,
		"song_machine": songMachine,
		"globulator": globulator,
		"drying_paint": dryingPaint,
		"word_clock": wordClock,
		"emergency_off": emergencyOff,
		"infinite_descent": infiniteDescent,
		"wish": wish,
		"serious_question": seriousQuestion,
		"algae_tank": algaeTank,
		"colorworks": colorWorks,
		"effects": effects,
		"down_the_weight": downTheWeight,
		"check_sketch": checkSketch,
		"window_sizer": windowSizer,
		"image_palette": imagePalette,
		"splodin_bacon": splodinBacon,
		"glob_glob": globGlob,
		"forest": forest,
		"mishmosh": mishmosh,
		"todo": nothing,
		"button_maker": buttonMaker,
		"brick_smasher": brickSmasher,
		"balloon": balloon,
		"plinky": plinky,
		"screwdriver": screwdriver,
		"confused_twitter": confusedTwitter,
		"picnic": picnic,
		"share_a_secret": shareASecret,
		"here": herePage,
		"photobooth": photobooth,
		"cat_wall": catWall,
		"word_cloud": wordCloud,
		"sharks": sharks,
		"need_drink": needDrink,
		"signature": signature,
		"image_editor": imageEditor,
		"other_side": otherSide,
		"open_note": openNote,
		"more_drop_shadow": moreDropShadow,
		"elevation": elevationPage,
		"whats_my_ip": nothing,
		"must_write": mustWrite,
		"boom": boomPage,
		"color_picker": colorPickerPage,
		"tweet_time": tweetTime,
		"morse_coder": morseCoder,
		"ransom_note": ransomNote,
		"moment_of_peace": momentOfPeace,
		"pollsie": pollsie,
		"audio_recorder": audioRecorder,
		"salon": salonGalleries,
		"portrait": portraitPhotos,
		"letter_storm": letterStorm,
		"lights_on": lightsOn,		
		"what_day": whatDay,
		"color_walk": colorWalk,
		"commerce": commerce,	
		"teammates": teammates,
		"minesweeper": minesweeper,
		"lunar_phase": lunarPhase,
		"mousing": mousingPage,
		"window": windowPage,
		"picture_pen": picturePen,
		"taste": nothing,
		"audio_garden": audioGarden,
		"assault": assault,
		"coded": codedMessages,
		"polychrome": polychrome,
		"electro_bounce": electroBounce,
		"gfboom": googleFontsBrowser,
		"quick_compliments": quickCompliments,
		"chromatones": chromatones,
		"paths": pathsImages
	};
	var route = window.location.pathname.replace(/^\//, '').replace(/\/.*/, '');
	routes[route]();
});
var TasteEntry = Backbone.Model.extend({
	urlRoot: 'entries'
});
var TodoTodo = Backbone.Model.extend({
	urlRoot: 'todos'
});
var TasteEntriesCollection = Backbone.Collection.extend({
	model: TasteEntry,

	url: 'taste/entries'
});
var TodoTodosCollection = Backbone.Collection.extend({
	model: TodoTodo,

	url: 'todo/todos'
});
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/taste_entries/entry"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="name attr">',  get('name') ,'</div>\n<div class="kind attr">Type: ',  get('kind') ,'</div>\n<div class="rating attr">Rating: ',  get('rating') ,'</div>\n<div class="label attr">Notes:</div>\n<div class="comments attr">',  get('comments') ,'</div>\n<a class="delete">X</a>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/taste_entries/index"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<form id="entry_form">\n\t<h3>ADD A NEW ENTRY</h3>\n\n\t<table>\n\t\t<tr class="form_field" id="name_wrapper">\n\t\t\t<td><label>Item Name: </label></td><td class="inputs"><input id="name_input" type="text" maxlength="250" placeholder="Tequila Esperanto"></td>\n\t\t</tr>\n\n\t\t<tr class="form_field" id="kind_wrapper">\n\t\t\t<td><label>Type: </label></td><td class="inputs"><input id="kind_input" type="text" maxlength="250" placeholder="Reposado"></td>\n\t\t</tr>\n\n\t\t<tr class="form_field" id="rating_wrapper">\n\t\t\t<td><label>Rating: </label></td>\n\t\t\t<td class="inputs"><select id="rating_input">\n\t\t\t\t<option>0</option>\n\t\t\t\t<option>1</option>\n\t\t\t\t<option>2</option>\n\t\t\t\t<option>3</option>\n\t\t\t\t<option>4</option>\n\t\t\t\t<option>5</option>\n\t\t\t</select></td>\n\t\t</tr>\n\n\t\t<tr class="form_field" id="comments_wrapper">\n\t\t\t<td><label class="notes">Notes: </label></td><td class="inputs"><textarea id="comments_input" placeholder="Lots of agave. Hints of orange peel and lime. Excellent for sipping!"></textarea></td>\n\t\t</tr>\n\t</table>\n\n\t<div class="form_field" id="submit_wrapper">\n\t\t<input class="btn" type="submit" val="Submit">\n\t</div>\n</form>\n\n<div id="entries_container">\n\t<ul id="entries_list"></ul>\n\t<br class="clear">\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/todo_todos/index"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div>\n\t<h1>Your To Do List</h1>\n\t<ul id="todos_list"></ul>\n</div>\n\n\n<form id="todo_form">\n\t<h2>Add a new To Do</h2>\n\t<div class="form_field" id="title_wrapper"><label>Title:</label><input maxlength="200" type="text" id="title_input"></div>\n\t<div class="form_field" id="description_wrapper"><label>Description:</label><input maxlength="200" type="text" id="description_input"></div>\n\t<div class="form_field" id="submit_wrapper"><input class="btn" type="submit" val="Submit"></div>\n</form>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["templates/todo_todos/todo"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="title">',  get('title') ,'</div>\n<div class="description">',  get('description') ,'</div>\n<a class="delete">X</a>\n');}return __p.join('');};
}).call(this);
var TasteEntriesIndexEntryView = Backbone.View.extend({
	events: {
		'click .delete': 'remove'
	},

	render: function () {
		this.$el.html(render('taste_entries/entry', this.model));

		return this;
	},

	remove: function () {
		this.model.destroy();
	}
});
var TasteEntriesIndexFormView = Backbone.View.extend({

	events: {
		'submit': 'handleSubmit'
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var name = e.target[0].value;
		var kind = e.target[1].value;
		var rating = e.target[2].value;
		var comments = e.target[3].value;

		e.target[0].value = '';
		e.target[1].value = '';
		e.target[2].value = '0';
		e.target[3].value = '';

		var new_entry = new TasteEntry({
			name: name,
			kind: kind,
			rating: rating,
			comments: comments
		});

		new_entry.save();

		this.collection.add(new_entry);
	}
});
var TasteEntriesIndexListView = Backbone.View.extend({

	initialize: function () {
		this.render();

		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
	},

	render: function () {
		this.$el.html('');

		this.collection.each(function (entry) {
			this.renderEntry(entry);
		}, this);
	},

	renderEntry: function (entry) {
		var entry_view = new TasteEntriesIndexEntryView({
			tagName: 'li',
			model: entry
		});

		this.$el.prepend(entry_view.render().el);
	}
});
var TasteEntriesIndexView = Backbone.View.extend({

	initialize: function () {
		this.initial_data = $('#data').data('response');
		this.collection = new TasteEntriesCollection(this.initial_data);

		this.render();

		this.taste_entries_index_list_view = new TasteEntriesIndexListView({
			el: '#entries_list',
			collection: this.collection
		});

		this.taste_entries_index_form_view = new TasteEntriesIndexFormView({
			el: '#entry_form',
			collection: this.collection
		});
	},

	render: function () {
		this.$el.html('');
		this.$el.html(render('taste_entries/index', {}));
	}
});
var TodoTodosIndexFormView = Backbone.View.extend({

	events: {
		'submit': 'handleSubmit'
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var title = e.target[0].value;
		var description = e.target[1].value;
		e.target[0].value = '';
		e.target[1].value = '';
		
		var new_todo = new TodoTodo({
			title: title,
			description: description
		});

		new_todo.save();

		this.collection.add(new_todo);
	}

});
var TodoTodosIndexListView = Backbone.View.extend({

	initialize: function () {
		this.render();

		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
	},

	render: function () {
		this.$el.html('');
		
		this.collection.each(function (todo) {
			this.renderTodo(todo);
		}, this);
	},

	renderTodo: function (todo) {
		var todo_view = new TodoTodosIndexTodoView({
			tagName: 'li',
			model: todo
		});

		this.$el.append(todo_view.render().el);
	}
});
var TodoTodosIndexTodoView = Backbone.View.extend({
	events: {
		'click .delete': 'remove'
	},

	render: function () {
		this.$el.html(render('todo_todos/todo', this.model));

		return this;
	},

	remove: function () {
		this.model.destroy();
	}
});
var TodoTodosIndexView = Backbone.View.extend({

	initialize: function () {
		this.initial_data = $('#data').data('response');
		this.collection = new TodoTodosCollection(this.initial_data);
		
		this.render();

		this.todo_todos_index_list_view = new TodoTodosIndexListView({
			el: '#todos_list',
			collection: this.collection
		});

		this.todo_todos_index_form_view = new TodoTodosIndexFormView({
			el: '#todo_form',
			collection: this.collection
		});
	},

	render: function () {
		this.$el.html('');
		this.$el.html(render('todo_todos/index', {}));
	}
});
function render(template_path, data){
	return JST['templates/' + template_path](data);
}
;
var BbRouter = Backbone.Router.extend({
	routes: {
		'todo/todos': 'todo_index',
		'taste/entries': 'taste_index'
	},

	todo_index: function () {
		var todoTodosIndexView = new TodoTodosIndexView({ el: '#todos_index_container' });
	},

	taste_index: function () {
		var tasteEntriesIndexView = new TasteEntriesIndexView({ el: '#entries_index_container' });		
	}
});

new BbRouter();

$(document).ready(function () {
	Backbone.history.start({pushState: true});
});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//






















;
