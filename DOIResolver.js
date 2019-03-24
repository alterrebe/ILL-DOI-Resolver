
function resolveDOI(){
  hideOpenAccessLink();
  
  // perform some basic cleanup on the DOI - 
  // use https, remove spaces, ensure the correct url is used, 
  // remove a trailing period if there is one.
  var doi = document.getElementById('DOI').value;
  doi = doi.replace("http:","https:").replace(" ","").replace("dx.doi.org","doi.org");
  if (doi.substr(-1) == "."){ doi = doi.substr(0, doi.length - 1); }
  var doi_url = (doi.includes("https://doi.org/")) ? doi : "https://doi.org/" + doi;

  // create an http request, specifying that a JSON response is desired.
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onloadend = function() {
    if (xmlhttp.status == 200) {
      autofillFields(this.responseText);
      checkOpenAccess(doi_url);
    } else if (xmlhttp.status == 404) {
      displayErrorMessage();
    }
  };
  xmlhttp.open("GET", doi_url, true);
  xmlhttp.setRequestHeader("Accept", "application/vnd.citationstyles.csl+json")
  xmlhttp.send();
}

function displayErrorMessage(){
  error_message = document.getElementById("doierrormessage")
  error_message.innerHTML = "<b>There was a problem retrieving metadata for this DOI.</b><br>"
}

function autofillFields(responseText){
  citation_json = JSON.parse(responseText);
  console.log(citation_json);

  var author_list = new Array();
  if (citation_json.author){
    citation_json.author.forEach( function(auth) {
      author_list.push(auth.given + " " + auth.family);
    })
    authors = author_list.join(", ");
  }

  document.getElementById("PhotoJournalTitle").value = citation_json["container-title"] || null;
  document.getElementById("PhotoJournalVolume").value = citation_json.volume || null;
  document.getElementById("PhotoJournalIssue").value = citation_json.issue || null;
  document.getElementById("PhotoJournalYear").value = citation_json.issued["date-parts"][0][0] || null;
  document.getElementById("PhotoJournalMonth").value = citation_json.issued["date-parts"][0][1] || null;
  document.getElementById("PhotoJournalInclusivePages").value = citation_json.page || null;
  document.getElementById("PhotoArticleAuthor").value = authors || null;
  document.getElementById("PhotoArticleTitle").value = citation_json.title || null;
  document.getElementById("ISSN").value = citation_json.ISSN[0] || cotation_json.ISBNN[0] || null;
}

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

function displayOpenAccessLink(url){
  link = document.getElementById("openaccesslink");
  link.href = url;
  link.innerHTML = "An Open Access version of this article may be available here.";
}

function hideOpenAccessLink()
{  link = document.getElementById("openaccesslink");
  link.href = "";
  link.innerHTML = "";
}
