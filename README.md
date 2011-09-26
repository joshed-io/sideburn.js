sideburn.js (1.3K)
=================

> Convert HTML to mustache-friendly JSON.

Given this DOM:

    <div><img src="foo.png"/>sideburn</div>


`sideburn(domElement)` produces a JSON object structure:

``` js
{
  div : {
    img : { src : 'foo.png' },
    text : 'sideburn'
  }
}
```

These are just a few of the properties that are created.

Usage
--------------
sideburn's DOM representation in JSON contains a variety of properties to
help you you reach any node with logic-less, [mustache](http://mustache.github.com)-style templating.

See this somewhat laundry list example of all of the properties reflected in the JSON.

    <div id="test-container">
      <nav id="semid" class="semclass" semattr="semattrvalue"></nav>
      <p>sempone</p>
      <p>semptwo</p>
      textnode
    </div>

``` js
{
  _attributes: Object
  _by_attribute: Object
  _by_class: Object
  _by_element: Object
  _by_id: Object
  _children: Array[3]
  _class: Array[1]
  _class_0: Object
  _id: Array[1]
  _id_0: Object
  _nav: Array[1]
  _nav_0: Object
  _node: HTMLDivElement
  _node_name: "div"
  _p:
    [{
      _attributes: Object
      _by_attribute: Object
      _by_class: Object
      _by_element: Object
      _by_id: Object
      _children: Array[0]
      _node: HTMLParagraphElement
      _node_name: "p"
      _text: Array[1]
      _text_0: "sempone"
      _text_trimmed_0: "sempone"
      text: "sempone"
      text_trimmed: "sempone"
    },
    { .. }]
  }
  _p_0: Object
  _p_1: Object
  _semattr: Array[1]
  _semattr_0: Object
  _semclass: Array[1]
  _semclass_0: Object
  _semid: Array[1]
  _semid_0: Object
  _text: Array[4]
  _text_0: "↵  "
  _text_1: "↵  "
  _text_2: "↵  "
  _text_3: "↵  textnode↵"
  _text_trimmed_0: ""
  _text_trimmed_1: ""
  _text_trimmed_2: ""
  _text_trimmed_3: "textnode"
  id: "test-container"
  nav: Object
  p: Object
  semattr: Object
  semclass: Object
  semid: Object
  text: "↵  ↵  ↵  ↵  textnode↵"
  text_trimmed: "textnode"
}
```

Use this data as the view for a mustache template. For example, we can print only the text of the second paragraph within the `div` element.

```
{{#test-container}}
  <div id="test-container">
    {{#_p_1}}
      {{text}}
    {{/_p_1}}
  </div>
{{/test-container}}
```

Outputs:

```
<div id="test-container">
  semptwo
</div>
```

File Size
---------
sideburn.js is 2.8K minified, and 1.3K when minified and gzipped.

More Coming Soon!
-----------------
More documentation and examples are coming soon. For now check out /test folder.

Be Scrappy!
-----------
sideburn.js is part of the scrappit project at [http://scrappit.org](http://scrappit.org).
sideburn helps you template directly against an underlying DOM without complex logic or
scattered & expensive DOM hits. This makes it easier to create new interfaces
from existing HTML.

License
-------
(The MIT License)

Copyright (c) 2011 [Josh Dzielak](http://joshdzielak.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.