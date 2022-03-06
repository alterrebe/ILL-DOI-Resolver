/* DOIResolver.js
   Author: Austin Smith, University of Maryland Libraries
  These functions are intended for use with the ILLiad ArticleReqest.html page.
*/


/* Attempt to retrieve the JSON metadata associated with a DOI.
   If successful, pass the JSON to a function which will populate the form.
   Otherwise, display an error message.
*/
function resolveDOI(){
  hideOpenAccessLink();
  
  // perform some basic cleanup on the DOI - 
  // use https, remove spaces, ensure the correct url is used, 
  // remove a trailing period if there is one.
  // strip a possible URL prefix, remove spaces and trailing periods
  var doi = document.getElementById('DOI').value;
  doi = doi.replace(/^https?:\/\/[^\/]+\//, "").replace(" ","").replace(/\.+$/g, "");
  console.log("DOI = " + doi);

  // basic verification of the DOI format:
  // it should start from a group of at least three digits, possibly with periods and dashes as separators:
  if (doi.replace(/-|\./g, "").match(/^[0-9]{3,}/) == null) {
    displayErrorMessage("This DOI does not look correct.");
    return;
  }

  var doi_url = "https://doi.org/" + doi;

  // create an http request, specifying that a JSON response is desired.
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onloadend = function() {
    if (xmlhttp.status == 200) {
      autofillFields(this.responseText);
      checkOpenAccess(doi_url);
    } else if (xmlhttp.status == 404) {
      displayErrorMessage("There was a problem retrieving metadata for this DOI.");
    }
  };
  xmlhttp.open("GET", doi_url, true);
  xmlhttp.setRequestHeader("Accept", "application/vnd.citationstyles.csl+json")
  xmlhttp.send();
}

// Display a given error message
function displayErrorMessage(errMessage){
  error_message = document.getElementById("doierrormessage");
  error_message.innerHTML = `${errMessage}<br>`;
}

function autofillFields(responseText){
  console.log(responseText);
  citation_json = JSON.parse(responseText);
  console.log(citation_json);

  var author_list = new Array();
  if (citation_json.author){
    citation_json.author.forEach( function(auth) {
      author_list.push(auth.given + " " + auth.family);
    })
  }
  authors = author_list.join(", ");
  
  if (citation_json.ISSN){
    isxn = citation_json.ISSN[0];
  } else if (citation_json.ISBN){
    isxn = citation_json.ISBN[0];
  } else {
    isxn = "";
  }
    
  
  journal_title_field = document.getElementById("PhotoJournalTitle") || null;
  volume_field = document.getElementById("PhotoJournalVolume") || null;
  issue_field = document.getElementById("PhotoJournalIssue") || null;
  year_field = document.getElementById("PhotoJournalYear") || null;
  month_field = document.getElementById("PhotoJournalMonth") || null;
  pages_field = document.getElementById("PhotoJournalInclusivePages") || null;
  article_author_field = document.getElementById("PhotoArticleAuthor") || null;
  article_title_field = document.getElementById("PhotoArticleTitle") || null;
  isxn_field = document.getElementById("ISSN") || null;
  publisher_field = document.getElementById("PhotoItemPublisher") || null;
  
  // still need to find DOI field names for:
  //PhotoItemAuthor
  //PhotoItemEdition
  
  if (journal_title_field) {journal_title_field .value = citation_json["container-title"] || null;}
  if (volume_field) {volume_field .value = citation_json.volume || null;}
  if (issue_field) {issue_field .value = citation_json.issue || null;}
  if (year_field) {year_field .value = citation_json.issued["date-parts"][0][0] || null;}
  if (month_field) {month_field .value = citation_json.issued["date-parts"][0][1] || null;}
  if (pages_field) {pages_field .value = citation_json.page || null;}
  if (article_author_field) {article_author_field.value = authors || null;}
  if (article_title_field) {article_title_field.value = citation_json.title || null;}
  if (isxn_field) {isxn_field.value = isxn || null;}
  if (publisher_field) {publisher_field.value = citation_json.publisher || null;}
   
}

// Check openaccessbutton.org for an open access copy.
function checkOpenAccess(url){
  oa_url = "https://api.openaccessbutton.org/availability?url=" + url
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onloadend = function() {
    if (xmlhttp.status == 200) {
      response = JSON.parse(this.responseText)
      if (response.data.availability) {
        displayOpenAccessLink(response.data.availability[0].url);
      } else {
          console.log("no open access");
      }
    } else if (xmlhttp.status == 404) {
      console.log("no open access");
    }
  };
  xmlhttp.open("GET", oa_url, true);
  //xmlhttp.setRequestHeader("Accept", "application/vnd.citationstyles.csl+json")
  xmlhttp.send();
}

// If an OA link was found, display it.
function displayOpenAccessLink(url){
   oadiv = document.getElementById("openaccessdiv");
   oadiv.setAttribute("style", "display:block");
   oabtn = document.getElementById("openaccessbutton");
   oabtn.onclick = function(){ window.open(url,'_blank') }
}

function hideOpenAccessLink(){
   oadiv = document.getElementById("openaccessdiv");
   oadiv.setAttribute("style", "display:none");
}
