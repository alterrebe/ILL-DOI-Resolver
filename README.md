# ILLiad DOI Resolver

This is a quick guide to help you add a DOI resolver to your ILLiad article request forms. Setup requires only minimal knowledge of HTML.

## What does it do?

- Retrieves the metadata associated with a DOI from doi.org, and automatically fills out an article request form with it.
- Checks openaccessbutton.org for an open access copy of the material, and displays a link to it if one is available.



## Setup Instructions

1. Find the main directory for your ILLiad web pages. This is the directory that contains ILLiadMainMenu.html, ArticleRequest.html, etc.
2. Create a folder called "js" in that directory, and save a copy of DOIResolver.js in that folder.
3. Open ArticleRequest.html, or any other form you'd like to add the resolver to. I strongly suggest saving a backup copy of this page before you make any changes, just in case.
4. Add the following line to your file, below the `<head>` line but above the `</head>` line. If the file already contains `<script>` lines, place it immediately after those.
```
<script type="text/javascript" src="js/DOIResolver.js"></script>
```
5. Find the code that defines the DOI field on your form. It should look something like this:
```
<label for="DOI">
 <span class="field">
 <span class="valid"><strong>Volume</strong></span>
 </span></br>
 <input id="DOI" name="DOI" type="text" size="40" class="f-name" tabindex="7" value=""><br />
</label>
```

6. You'll probably want to move the DOI field to the top of your request form, so delete those lines and add the following lines at the top of the field set (below the `<fieldset>` line, but above the first `<label for=...>`/* DOIResolver.js
   Author: Austin Smith, University of Maryland Libraries
  These functions are intended for use with the ILLiad ArticleReqest.html page.
*/


/* Attempt to retrieve the JSON metadata associated with a DOI.
   If successful, pass the JSON to a function which will populate the form.
   Otherwise, display an error message.
*/ line).

```
<label for="DOI">
 <span class="field">
  <span class="valid"><strong>DOI</strong></span><br />
 </span></br>
 <span class="note">Have the DOI? Try resolving it to auto populate the form.</span>
 <input id="DOI" name="DOI" type="text" size="20" class="f-name" tabindex="1" value="">
 <button type="button" id="doibutton" onclick="resolveDOI()">Resolve DOI</button><br />
 <span class="note" id="doierrormessage"></span>
</label>
```

7. Now you'll need to go through each of the fields defined on your form and change the tab indexes, so that users will be able to tab through the form in order. Look for the lines with `<input>` tags, and change the `tabindex` values to reflect the new order of the fields. Make sure to enclose the numbers in quotes.

8. Save your changes and try it out! The Resolve DOI button should now be present & functional on your request form.

## Other Uses

The javascript provided here is designed for use with the ILLiad request forms, but it should be easy to modify it for use with other types of forms. Please feel free to do so!
