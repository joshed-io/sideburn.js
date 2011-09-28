sideburn.js (1.3K)
=================

> Convert HTML to mustache-friendly JSON.

Given this DOM:

    <div><img src="foo.png"/>sideburn</div>


`sideburn(domElement)` produces a JSON object structure:


    {
      div : {
        img : { src : 'foo.png' },
        text : 'sideburn'
      }
    }

These are just a few of the properties that are created.

Usage
--------------
sideburn gives you a JSON DOM representation that's easily templatable
with logic-less engines like mustache.

Sample Use: You're writing a bookmarklet, extension, or [scrapp](http://scrappit.org) that seeks to
replace the interface of an existing web site with something better.

You'd like to use the existing HTML and template it with mustache to create new HTML.

Here's the HTML you're starting with - in this case it's a tangled
mess of presentational and semantic HTML:

    <div id="address-section">
      <div id="address-data" class="grid11 clearfix">
        <div class="placename large grid4">Dogpatch Saloon</div>
        <span class="thick"><number>2496</number> 3rd St.</span>
        <div role='city' class="floatleft">San Francisco</div>,
        <div class="state grid2 floatright">CA</div> 94107
      </div>
    </div>

Let's use sideburn and mustache to turn this into nice, semantic markup without the cruft

Here's the sideburn call:


    var addressJSON = sideburn(document.getElementById("address-section"));


(Note: sideburn expects a DOM element or a string of XML. The string of XML is converted using sideburn.textToDocument(str)
before the JSON transformation.)

Here's the mustache template. It uses the JSON to create microformat-compatible address markup:

    {{#address_data}}
      <div class="adr">
        <div class="name">{{placename}}</div>
        {{#thick}}
          <div class="street">{{number}}
          {{text}}</div>
        {{/thick}}
        {{#role}}
          <span class="locality">{{text}}</span>,
        {{/role}}
        {{#_div_2}}
          <span class="region">{{text}}</span>
        {{/_div_2}}
        <span class="postal-code">{{text_trimmed}}</span>
        <div class="country-name">U.S.A.</div>
      </div>
    {{/address_data}}

Put it all together:

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


File Size
---------
sideburn.js is 2.8K minified, and 1.3K when minified and gzipped.

Tests
---------
Check out the `/tests` folder for more examples. You can see all of the properties that are become available on the JSON.

You can also see how precedence is handled when child elements are found
via different methods - e.g. class, id, element, and attribute names. And more!

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