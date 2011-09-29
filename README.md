sideburn.js (1.3K)
=================

> Convert HTML to mustache-friendly JSON.

Usage
--------------
Given some DOM:

    <body>
      <div id='burner'>
        <img src="foo.png"/>
        sideburn
      </div>
    </body>


`sideburn(document.body)` produces a JSON object structure like this:


    {
      div : {
        id : 'burner',
        img : { src : 'foo.png' },
        text : 'sideburn'
      }
    }

This JSON is structured so that it's easy to input into a logic-less templating engine like [mustache](http://mustache.github.com).
This process allows you to create new HTML from old HTML using a fast and familiar transformation.

sideburn accepts DOM elements, XML document elements, and strings containing HTML/XML. Strings are converted to documents
first via `sideburn.textToDocument`, which is exposed for you to call separately if you like.


When would I use this?
--------------
Any time you need to convert HTML to HTML, XML to HTML, or either just to create JSON that's easy to traverse via property access.

[Scrapps](http://scrappit.org), bookmarklets and userscripts regularly convert
a web site's original HTML into new HTML meant to order to provide an enhanced user interface. If you're writing one and doing it the old fashioned way, give this a try.

Example
-------
Use Case: You'd like to use some existing HTML and template it with mustache to create new HTML.

Here's the HTML you're starting with - in this case it's a **tangled mess of presentational and semantic HTML**:

    <div id="address-section">
      <div id="address-data" class="grid11 clearfix">
        <div class="placename large grid4">Dogpatch Saloon</div>
        <span class="thick"><number>2496</number> 3rd St.</span>
        <div role='city' class="floatleft">San Francisco</div>,
        <div class="state grid2 floatright">CA</div> 94107
      </div>
    </div>

Let's use sideburn and mustache to turn this into nice, semantic markup without the cruft.

Here's the sideburn call:


    var addressJSON = sideburn(document.getElementById("address-section"));


And here's the mustache template. It uses the JSON to create microformat-compatible address markup:

    {{#address_data}}
      <div class="adr">
        <div class="name">{{placename}}</div>
        {{#thick}}
          <div class="street">{{number}}
          {{text}}</div>
        {{/thick}}
        {{#role}}<span class="locality">{{text}}</span>, {{/role}}
        {{#_div_2}}<span class="region">{{text}}</span> {{/_div_2}}
        <span class="postal-code">{{_text_trimmed_4}}</span>
        <div class="country-name">U.S.A.</div>
      </div>
    {{/address_data}}

Now, use mustache to render our template based on the sideburn JSON representation:

    Mustache.to_html(template, addressJSON)

And see the final result:

    <div class="adr">
      <div class="name">Dogpatch Saloon</div>
      <div class="street">2496 3rd. St</div>
      <span class="locality">San Francisco</span>,
      <span class="region">CA</span>
      <span class="postal-code">94107</span>
      <div class="country-name">U.S.A.</div>
    </div>

**It's the markup we've always wanted, and we didn't have to write any custom code.**

_See this example live at `examples/index.html`_

File Size & Exports
-------------------
sideburn.js is 1.3K when minified and gzipped.

sideburn supports AMD (require/define) and commonjs (module/exports), and in these cases it does not export to global.

Tests
---------
Check out the `/tests` folder for more examples - you can run them right in your browser. This will help you see all of the properties that are available on the JSON that sideburn creates.

You can also see how precedence is handled when child elements are found via different methods - e.g. class, id, element, and attribute names.

Be Scrappy!
-----------
sideburn.js is part of the scrappit project at [http://scrappit.org](http://scrappit.org).
scrappit is all about breathing new life into old interfaces.

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