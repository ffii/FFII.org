//
// MoinMoin commonly used JavaScript functions
//

// We keep here the state of the search box
searchIsDisabled = false;

function searchChange(e) {
    // Update search buttons status according to search box content.
    // Ignore empty or whitespace search term.
    var value = e.value.replace(/\s+/, '');
    if (value == '' || searchIsDisabled) { 
        searchSetDisabled(true);
    } else {
        searchSetDisabled(false);
    }
}

function searchSetDisabled(flag) {
    // Enable or disable search
    document.getElementById('fullsearch').disabled = flag;
    document.getElementById('titlesearch').disabled = flag;
}

function searchFocus(e) {
    // Update search input content on focus
    if (e.value == search_hint) {
        e.value = '';
        e.className = '';
        searchIsDisabled = false;
    }
}

function searchBlur(e) {
    // Update search input content on blur
    if (e.value == '') {
        e.value = search_hint;
        e.className = 'disabled';
        searchIsDisabled = true;
    }
}

function actionsMenuInit(title) {
    // Initialize action menu
    for (i = 0; i < document.forms.length; i++) {
        var form = document.forms[i];
        if (form.className == 'actionsmenu') {
            // Check if this form needs update
            var div = form.getElementsByTagName('div')[0];
            var label = div.getElementsByTagName('label')[0];
            if (label) {
                // This is the first time: remove label and do buton.
                div.removeChild(label);
                var dobutton = div.getElementsByTagName('input')[0];
                div.removeChild(dobutton);
                // and add menu title
                var select = div.getElementsByTagName('select')[0];
                var item = document.createElement('option');
                item.appendChild(document.createTextNode(title));
                item.value = 'show';
                select.insertBefore(item, select.options[0]);
                select.selectedIndex = 0;
            }
        }
    }
}

// use this instead of assigning to window.onload directly:
function addLoadEvent(func) {
    // alert("addLoadEvent " + func)
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

// copy from fckeditor browser check code (fckeditor.js:298, function : FCKeditor_IsCompatibleBrowser)
function can_use_gui_editor() {
    var sAgent = navigator.userAgent.toLowerCase() ;

    // Internet Explorer 5.5+
    if ( /*@cc_on!@*/false && sAgent.indexOf("mac") == -1 )
    {
        var sBrowserVersion = navigator.appVersion.match(/MSIE (.\..)/)[1] ;
        return ( sBrowserVersion >= 5.5 ) ;
    }

    // Gecko (Opera 9 tries to behave like Gecko at this point).
    if ( navigator.product == "Gecko" && navigator.productSub >= 20030210 && !( typeof(opera) == 'object' && opera.postError ) )
        return true ;

    // Opera 9.50+
    if ( window.opera && window.opera.version && parseFloat( window.opera.version() ) >= 9.5 )
        return true ;

/*
  // disable safari : until fck devteam fix http://dev.fckeditor.net/ticket/2333
  
    // Adobe AIR
    // Checked before Safari because AIR have the WebKit rich text editor
    // features from Safari 3.0.4, but the version reported is 420.
    if ( sAgent.indexOf( ' adobeair/' ) != -1 )
        return ( sAgent.match( / adobeair\/(\d+)/ )[1] >= 1 ) ; // Build must be at least v1

    // Safari 3+
    if ( sAgent.indexOf( ' applewebkit/' ) != -1 )
        return ( sAgent.match( / applewebkit\/(\d+)/ )[1] >= 522 ) ;    // Build must be at least 522 (v3)
*/
    return false ;

}


function update_edit_links() {
    // Update editlink according if if the browser is compatible
    if (can_use_gui_editor() == false){
        //alert("update_edit_links: can't use gui editor");
        return;
    }
    var editlinks = document.getElementsByName("editlink");
    for (i = 0; i < editlinks.length; i++) {
        var link = editlinks[i];
        href = link.href.replace('editor=textonly','editor=guipossible');
        link.href = href;
        //alert("update_edit_links: modified to guipossible");
    }
}


function add_gui_editor_links() {
    // Add gui editor link after the text editor link
    
    // If the variable is not set or browser is not compatible, exit
    try {gui_editor_link_href}
    catch (e) {
        //alert("add_gui_editor_links: gui_editor_link_href not here");
        return
    }
    if (can_use_gui_editor() == false){
        //alert("add_gui_editor_links: can't use gui_editor");
        return;
    }
    var all = document.getElementsByName('texteditlink');
    for (i = 0; i < all.length; i++) {
        var textEditorLink = all[i];
        // Create a list item with a link
        var guiEditorLink = document.createElement('a');
        guiEditorLink.href = gui_editor_link_href;
        var text = document.createTextNode(gui_editor_link_text);
        guiEditorLink.appendChild(text);
        var listItem = document.createElement('li')
        listItem.appendChild(guiEditorLink);
        // Insert in the editbar
        var editbar = textEditorLink.parentNode.parentNode
        var nextListItem = textEditorLink.parentNode.nextSibling;
        editbar.insertBefore(listItem, nextListItem);
        //alert("add_gui_editor_links: added gui editor link");
    }
}
 

function show_switch2gui() {
    // Show switch to gui editor link if the browser is compatible
    if (can_use_gui_editor() == false) return;
    
    var switch2gui = document.getElementById('switch2gui')
    if (switch2gui) {
        switch2gui.style.display = 'inline';
    }
}

// for long documents with many comments this is expensive to calculate,
// thus we keep it here:
comments = null;

function toggleComments() {
    // Toggle visibility of every tag with class "comment"
    for (i = 0; i < comments.length; i++){
        el = comments[i];
        if ( el.style.display != 'none' ) {
            el.style.display = 'none';
        } else {
            el.style.display = '';
        }
    }
}

function show_toggleComments() {
    // Show edit bar item for toggling inline comments on/off only if inline comments exist on the page
    comments = getElementsByClassName('comment', null, document);
    if (comments.length > 0) {
        var buttons = getElementsByClassName('toggleCommentsButton', null, document);
        for (i = 0; i < buttons.length; i++){
            el = buttons[i];
            el.style.display = '';
        }
    }
}


function load() {
    // Do not name this "onload", it does not work with IE :-)
    // TODO: create separate onload for each type of view and set the
    // correct function name in the html. 
    // e.g <body onlod='editor_onload()'>

    // login focus
    if (document.forms['loginform']) {
        document.forms['loginform'].elements['name'].focus();
    }
    
    // Page view stuff
    update_edit_links();
    add_gui_editor_links();
    
    // Editor stuff
    show_switch2gui();

    // Enable menu item "ToggleComments" if inline comments exist
    show_toggleComments();
 
    // data browser widget
    dbw_hide_buttons();
}


function before_unload(evt) {
    // TODO: Better to set this in the editor html, as it does not make
    // sense elsehwere.
    // confirmleaving is available when editing
    try {return confirmleaving();}
    catch (e) {}
}

// Initialize after loading the page
addLoadEvent(load)

// Catch before unloading the page
window.onbeforeunload = before_unload

function dbw_update_search(dbw_id)
{
    var table = document.getElementById(dbw_id+'table');
    var cell;
    var shown;
    var i
    var cols = table.rows[0].cells.length;
    var filter = new Array();
    var dofilter = new Array();
    var form = document.forms[dbw_id+'form'];

    for (i = 0; i < cols; i++) {
        dofilter[i] = false;
        if (form[dbw_id+'filter'+i]) {
            dofilter[i] = true;
            filter[i] = form[dbw_id+'filter'+i].value;
            if (filter[i] == '[all]')
                dofilter[i] = false;
            if (filter[i] == '[empty]')
                filter[i] = '';
        }
    }

    for (i = 1; i < table.rows.length; i++) {
        var show = true;
        for (col = 0; col < cols; col++) {
            if (!dofilter[col])
                continue;

            cell = table.rows[i].cells[col];

            if (filter[col] == '[notempty]') {
                if (cell.abbr == '') {
                    show = false;
                    break;
                }
            } else if (filter[col] != cell.abbr) {
                show = false;
                break;
            }
        }
        if (show)
            table.rows[i].style.display = '';
        else
            table.rows[i].style.display = 'none';
    }
}

function dbw_hide_buttons() {
    var form;
    var elem;
    var name;

    for (var fidx = 0; fidx < document.forms.length; fidx++) {
        form = document.forms[fidx];
        for (var eidx = 0; eidx < form.elements.length; eidx++) {
            elem = form.elements[eidx];
            name = elem.name;
            if (name) {
                if (name.indexOf('dbw.') >= 0 && name.substr(-7) == '.submit')
                    elem.style.display = 'none';
            }
        }
    }
}

/*  getElementsByClassName
    Developed by Robert Nyman, http://www.robertnyman.com
    Code/licensing: http://code.google.com/p/getelementsbyclassname/ (MIT license)
    Version: 1.0.1
*/  
var getElementsByClassName = function (className, tag, elm){
    if (document.getElementsByClassName) {
        getElementsByClassName = function (className, tag, elm) {
            elm = elm || document;
            var elements = elm.getElementsByClassName(className),
                nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
                returnElements = [],
                current;
            for(var i=0, il=elements.length; i<il; i+=1){
                current = elements[i];
                if(!nodeName || nodeName.test(current.nodeName)) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    }
    else if (document.evaluate) {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" "),
                classesToCheck = "",
                xhtmlNamespace = "http://www.w3.org/1999/xhtml",
                namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
                returnElements = [],
                elements,
                node;
            for(var j=0, jl=classes.length; j<jl; j+=1){
                classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
            }
            try {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
            }
            catch (e) {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
            }
            while ((node = elements.iterateNext())) {
                returnElements.push(node);
            }
            return returnElements;
        };
    }
    else {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" "),
                classesToCheck = [],
                elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
                current,
                returnElements = [],
                match;
            for(var k=0, kl=classes.length; k<kl; k+=1){
                classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
            }
            for(var l=0, ll=elements.length; l<ll; l+=1){
                current = elements[l];
                match = false;
                for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
                    match = classesToCheck[m].test(current.className);
                    if (!match) {
                        break;
                    }
                }
                if (match) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    }
    return getElementsByClassName(className, tag, elm);
};

