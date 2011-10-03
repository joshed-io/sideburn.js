/*
 sideburn.js
 http://scrappit.org/sideburn
 MIT License
 Author: Josh Dzielak, Copyright (c) 2011

 Convert HTML to mustache-friendly JSON.

 Given this DOM:
    <div><img src="foo.png"/>sideburn</div>

  sideburn.js produces a superset of this JSON object structure:

  {
    div : {
      img : { src : 'foo.png' },
      text : 'sideburn'
    }
  }

 To maximize the Child nodes are reachable from their parent by
 attribute names, element names, classes, or ID.

 */
(function(context, document) {

  var version = '0.1.0+',
    undef = undefined,
    strUndef = '' + undef,
    toString = Object.prototype.toString,

    //used to generate property names
    pfx = '_',

    //used for internal/private property names: _children
    internalPfx = pfx,

    //used for array property names: _span
    arrayPfx = pfx,

    //used for internal arrays that add elements by selector type: _by_id
    selectorPfx = internalPfx + 'by' + internalPfx,

    nmAttributes = 'attributes',
    nmChildren = 'children',

    nmNode = 'node',
    nmNodeName = 'node_name',

    //the five sources of properties
    nmText = 'text',
    nmAttribute = 'attribute',
    nmElement = 'element',
    nmClass = 'class',
    nmId = 'id',

    nmTrimmed = internalPfx + 'trimmed',
    nmTextTrimmed = nmText + nmTrimmed,

    formatRegex = /-/g,
    trimRegex = /^\s+|\s+$/gm;

  function isArray(obj) {
    return toString.call(obj) === '[object Array]';
  }

  function nodeName(node) {
    return (node.localName) ? node.localName : node.baseName;
  }

  function trim(str) {
    return str.replace(trimRegex, '');
  }

  function format(name) {
    //change dash to underscore for ease of referencing literals
    return String(name).replace(formatRegex, '_');
  }

 function _get(obj, key) {
    return obj[format(key)];
  }

  function put(obj, key, value) {
    obj[format(key)] = value;
  }

  function selectorKey(key) {
    return selectorPfx + key;
  }

  function arrayKey(key) {
    return arrayPfx + key;
  }

  function internalKey(key) {
    return internalPfx + key;
  }

  function newObj(node) {
    var newObj = {
      toString: function() {
        return this[nmText];
      }
    };

    newObj[internalKey(nmNode)] = node;
    newObj[internalKey(nmNodeName)] = nodeName(node);
    newObj[internalKey(nmChildren)] = [];
    newObj[internalKey(nmAttributes)] = {};
    newObj[arrayKey(nmText)] = [];

    var selectorNmList = [nmAttribute, nmElement, nmClass, nmId];
    for (var i=0,l=selectorNmList.length; i < l; i++) {
      var selectorNm = selectorNmList[i];
      newObj[selectorKey(selectorNm)] = {};
    }

    return newObj;
  }

  function extendAttributes(node, obj) {
    var attrs = node.attributes;
    for (var i=0, l=attrs.length; i < l; i++) {
      var attr = attrs[i],
        attrName = attr.name,
        attrValue = attr.value;
      put(obj[arrayKey(nmAttributes)], attrName, attrValue);
      put(obj, attrName, attrValue);
    }
  }

  function extendByAttribute(node, cObj, obj) {
    var attrs = node.attributes;
    for (var i=0, l=attrs.length; i < l; i++) {
      var attr = attrs[i];
      if (attr.name !== nmText) { //dont override _text here
        pushToArrayAtKey(obj[selectorKey(nmAttribute)], attr.name, cObj);
      }
    }
  }

  function extendByClass(node, cObj, obj) {
    var klassAttr = node.attributes.getNamedItem(nmClass);
    if (klassAttr) {
      var klasses = klassAttr.value.split(' ');
      for (var i=0, l=klasses.length; i < l; i++) {
        var className = klasses[i];
        if (className !== nmText) { //dont override _text here
          pushToArrayAtKey(obj[selectorKey(nmClass)], className, cObj);
        }
      }
    }
  }

  function extendById(node, cObj, obj) {
    var idAttr = node.attributes.getNamedItem(nmId);
    if (idAttr) {
      var idValue = idAttr.value;
      if (idValue !== nmText) { //dont override _text here
        pushToArrayAtKey(obj[selectorKey(nmId)], idValue, cObj);
      }
    }
  }

  function extendByElement(node, cObj, obj) {
    var  _nodeName = nodeName(node);
    if (_nodeName !== nmText) {
      pushToArrayAtKey(obj[selectorKey(nmElement)], _nodeName, cObj);
    }
  }

  function pushIfAbsent(obj, arry) {
    var seen = false;
    for (var i=0, l=arry.length; i < l; i++) {
      var thisElem = arry[i];
      if (thisElem == obj) {
        seen = true;
        break;
      }
    }
    if (!seen) {
      arry.push(obj);
    }
  }

  function pushToArrayAtKey(obj, key, value, suppressDup) {
    var arryAtKey;
    if (!(arryAtKey = _get(obj, key))) {
      put(obj, key, arryAtKey = []);
    }

    if (!isArray(value)) {
      value = [value];
    }

    for (var i=0, l=value.length; i < l; i++) {
      var thisVal = value[i];
      suppressDup ?
        arryAtKey.push(thisVal) : pushIfAbsent(thisVal, arryAtKey);
    }
  }

  function flatIndexKey(key, index) {
    return arrayKey(key + arrayKey(index));
  }

  function expandToArrayIndices(obj, key, list) {
    for (var i=0, l=list.length; i < l; i++) {
      put(obj, flatIndexKey(key, i), list[i]);
    }
  }

  function extend(obj, selectorHashes) {
    for(var i=0, l=selectorHashes.length; i < l; i++) {
      var selectorHash = selectorHashes[i];
      for(key in selectorHash) {
        var cObjList = selectorHash[key];

        //handle special keys that should not be overridden
        //currently, just 'text'
        //to get the skipped value, use _text[0]
        if (key !== nmText) {
          put(obj, key, cObjList[0]);
        }

        pushToArrayAtKey(obj, arrayKey(key), cObjList);
        expandToArrayIndices(obj, key, cObjList);

        //also add each value to the overall children hash
        pushToArrayAtKey(obj, internalKey(nmChildren), cObjList);
      }
    }
  }

  function setTrimmed(str) {
    //trim any string {{#text}}{{_trimmed}}{{/text}}
    str[nmTrimmed] = trim(str);
  }

  function extendText(obj) {
    var texts = obj[arrayKey(nmText)],
        trimmedTexts = [];

    //concat the text nodes
    var buf = '';
    for(var i=0, l=texts.length; i<l; i++) {
      var str = texts[i];
      trimmedTexts.push(trim(str));
      buf += str;
    }
    obj[nmText] = buf;
    obj[nmTextTrimmed] = trim(buf);

    expandToArrayIndices(obj, nmText, texts);
    expandToArrayIndices(obj, nmTextTrimmed, trimmedTexts);
  }

  function setObjects(obj) {
    var node = obj[internalKey(nmNode)];
    if (node && node.hasChildNodes()) {
      var nodeCount = node.childNodes.length - 1;
      var n = 0;
      do {
        var cnode = node.childNodes[n];
        switch (cnode.nodeType) {
          case 1:
            var cObj = newObj(cnode);
            extendByAttribute(cnode, cObj, obj);
            extendByElement(cnode, cObj, obj);
            extendByClass(cnode, cObj, obj);
            extendById(cnode, cObj, obj);

            //recurse of the mummy
            setObjects(cObj, cnode);

            break;
          case 3:
            pushToArrayAtKey(obj, arrayKey(nmText), cnode.nodeValue, true);
            break;
          case 4: //CDATA
            pushToArrayAtKey(obj, arrayKey(nmText), cnode.text ? cnode.text : cnode.nodeValue, true);
            break;
          }
      } while (n++ < nodeCount);
    }

    //after child nodes processed, add properties based on priority
    extend(obj,
     [obj[selectorKey(nmAttribute)],
      obj[selectorKey(nmElement)],
      obj[selectorKey(nmClass)],
      obj[selectorKey(nmId)]]);

    extendAttributes(node, obj);
    extendText(obj);

    return obj;
  }

  function domToJSON(xdoc) {
    return setObjects(newObj(xdoc));
  }

  function textToDocument(strXML) {
    var xmlDoc = (document.all) ? new ActiveXObject('Microsoft.XMLDOM') : new DOMParser();
    xmlDoc.async = false;

    if (document.all) {
      return (xmlDoc.loadXML(strXML)) ? xmlDoc : false;
    } else {
      return xmlDoc.parseFromString(strXML, 'text/xml');
    }
  }

  var _sideburn = function() {
    var sideburn = function(input) {
      if (typeof(input) === 'string') {
        input = textToDocument(input).documentElement;
      }
      return domToJSON(input);
    }
    sideburn.textToDocument = textToDocument;
    return sideburn;
  };

  //export to amd, commonjs, or context
  var exportToContext = true;

  if (typeof define === 'function' && define.amd) {
    define([], _sideburn);
    exportToContext = false;
  }

  if ((typeof module !== strUndef) && module.exports) {
    module.exports = _sideburn(); //unwrap
    exportToContext = false;
  }

  if (exportToContext) {
    context.sideburn = _sideburn(); //unwrap
  }

})(this, document);
