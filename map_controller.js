// Data =======================================================================
var haveData = false;
var courses = [];

// Map ========================================================================
google.maps.visualRefresh = true;

var map, geocoder;
var markers = [];

// define center point of initial map render
var centerLat = 36.16;
var centerLng = 273.215;

// Sheets API =================================================================
var discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var apiKey = 'AIzaSyC8YkrMM7NEO59ERQ2OBkE6I3QfLyVmN64';

// sheet shared with me (nick), seemingly controlled by MNHRC
var spreadsheetId = '1aI16jUKAHFLmjKXtjI2nCYltDWa1awCFZ2Kt1IhhbZ4';

// Multi-lingual support of local text.
// Should be simple enough to extend to even more languages,
// but it might be beneficial to factor out to dynamic
// language requesting and translation.
// Adding more languages is simple, but please do not mess up
// the order it already is in, it will break the `translated`
// object. Please use ISO639-2 abbreviations.
function manyLanguages(english, spanish, french, arabic) {
  return { en: english, es: spanish, fr: french, ar: arabic };
}

// Do not even overwrite from headers.
// English is the only language that is fully filled out.
var defaultLanguageFallback = 'en';

// This can be replaced by header values.
// It is the value that is used when populating the text.
var currentLanguage = 'en';

// Every object key here maps directly to a tag that has the
// attribute id="ml-foobar". Use `manyLanguages` to populate
// the languages. Leaving languages unsupplied or empty string
// will result in a fallback to 'en' (defaultLanguageFallback)
// TODO: Still needs translation work.
var translated = {
  aboutp1: manyLanguages('wESL (We ESL) is a platform for easily finding ESL (English as a Second Language) classes in Nashville, TN. All organizations that offer ESL classes are listed on the map. You can click on the map location for more information about the organizations and the classes they offer. If you would like your organization\'s classes to be added to the platform, click on the link the in the left column titled "Submission Form."',
                         '',
                         '',
                         ''),
  aboutp2: manyLanguages('The wESL platform is offered and maintained by the Metro Human Relations Commission. If you have any questions, please email us at <a href="mailto:info@eslmap.com?subject=wESL" target="_blank">info@eslmap.com</a> and follow <a href="https://www.twitter.com/eslmap" target="_blank">@ESLmap</a> on Twitter for updates about the platform.',
                         '',
                         '',
                         ''),
  aboutp3: manyLanguages('For more info about the Metro Human Relations Commission, please visit <a href="http://www.1City4AllPeople.com" target="_blank">www.1City4AllPeople.com</a>, <a href="http://www.Facebook.com/NashMHRC" target="_blank">www.Facebook.com/NashMHRC</a>, or <a href="http://www.twitter.com/1City4AllPeople" target="_blank">www.twitter.com/1City4AllPeople</a>.',
                         '',
                         '',
                         ''),
  navTitle: manyLanguages('Davidson County English Language Courses',
                          '',
                          '',
                          ''),
  daySelect1: manyLanguages('Next 30 Days',
                            '',
                            '',
                            ''),
  daySelect2: manyLanguages('30 - 60 Days',
                            '',
                            '',
                            ''),
  daySelect3: manyLanguages('60 - 90 Days',
                            '',
                            '',
                            ''),
  scheduleSelect1: manyLanguages('Any',
                                 '',
                                 '',
                                 ''),
  scheduleSelect2: manyLanguages('Semester',
                                 '',
                                 '',
                                 ''),
  scheduleSelect3: manyLanguages('Trimester',
                                 '',
                                 '',
                                 ''),
  scheduleSelect4: manyLanguages('Quarterly',
                                 '',
                                 '',
                                 ''),
  scheduleSelect5: manyLanguages('Ongoing',
                                 '',
                                 '',
                                 ''),
  levelSelect1: manyLanguages('Any',
                              '',
                              '',
                              ''),
  levelSelect2: manyLanguages('Pre-Literate',
                              '',
                              '',
                              ''),
  levelSelect3: manyLanguages('Intro',
                              '',
                              '',
                              ''),
  levelSelect4: manyLanguages('Level 1',
                              '',
                              '',
                              ''),
  levelSelect5: manyLanguages('Level 2',
                              '',
                              '',
                              ''),
  levelSelect6: manyLanguages('Level 3',
                              '',
                              '',
                              ''),
  levelSelect7: manyLanguages('Level 4',
                              '',
                              '',
                              ''),
  levelSelect8: manyLanguages('Level 5',
                              '',
                              '',
                              ''),
  levelSelect9: manyLanguages('Conversation',
                              '',
                              '',
                              ''),
  levelSelect10: manyLanguages('GED',
                               '',
                               '',
                               ''),
  levelSelect11: manyLanguages('Citizenship',
                               '',
                               '',
                               ''),
  costSelect1: manyLanguages('Any',
                             '',
                             '',
                             ''),
  costSelect2: manyLanguages('Free',
                             '',
                             '',
                             ''),
  costSelect3: manyLanguages('$10',
                             '',
                             '',
                             ''),
  costSelect4: manyLanguages('$20',
                             '',
                             '',
                             ''),
  costSelect5: manyLanguages('$30',
                             '',
                             '',
                             ''),
  costSelect6: manyLanguages('$40',
                             '',
                             '',
                             ''),
  costSelect7: manyLanguages('$50',
                             '',
                             '',
                             ''),
  costSelect8: manyLanguages('$60',
                             '',
                             '',
                             ''),
  classSubmit: manyLanguages('To submit a class click <a href="https://docs.google.com/a/jasonamyers.com/forms/d/1yQP_1ph3Rx3VNEIiHvYny9QtoDClMXNa7F1ro0srFjA/viewform">here.</a>',
                             '',
                             '',
                             ''),
  aboutLink: manyLanguages('About this App',
                           '',
                           '',
                           ''),
  popupBack: manyLanguages('&lt; Back to Locations',
                           '',
                           '',
                           ''),
  popupTitleClasses: manyLanguages('Classes held at:',
                                   '',
                                   '',
                                   ''),
  popupTitleClass: manyLanguages('Class',
                                 '',
                                 '',
                                 ''),
  popupTitleDate: manyLanguages('Date',
                                '',
                                '',
                                ''),
  popupTitleSchedule: manyLanguages('Schedule',
                                    '',
                                    '',
                                    ''),
  popupTitleCurriculum: manyLanguages('Curriculum',
                                      '',
                                      '',
                                      ''),
  popupTitleFee: manyLanguages('Fee',
                               '',
                               '',
                               ''),
  searchBack: manyLanguages('&lt; Back to Search',
                            '',
                            '',
                            ''),
  locations: manyLanguages('Locations',
                           '',
                           '',
                           '')
};

// personal copy of sheet (nick@codefornashville.org)
//var spreadsheetId = '1fnAs8ZrPcNGP6LTDyV9ajiP2grdpNCiPQlSdCVFM7ug';

// lifecycle start
google.maps.event.addDomListener(window, 'load', initialize);

// connect to spreadsheet and pull data from it
function initGAPI (callback) {
    return new Promise(function (res, rej) {
        gapi.load('client', function () {
            gapi.client.init({
                apiKey: apiKey,
                discoveryDocs: discoveryDocs,
            })
                .then(loadSheetData)
                .then(function (locations) {
                    res(locations);
                });
                // no catch on this thing?
                //.catch(rej);
        });
    });
}

function loadSheetData () {
    console.info('gapi::loadSheetData');

    // send out a promise
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1'

    }).then(function onSheet (resp) {
        var values = resp.result.values;

        var fields = {
            "Organization"         : "organization",
            "address"              : "address",
            "Latitude/Longitude"   : "latitudeLongitude",
            "classAddress"         : "classAddress",
            "Courses Offered"      : "coursesOffered",
            "Start Date"           : "startDate",
            "Fee"                  : "fee",
            "Description"          : "description",
            "Phone Number"         : "phoneNumber",
            "Email Address"        : "emailAddress",
            "websiteURL"           : "websiteUrl",
            "Days Classes Offered" : "daysClassesOffered",
            "Class Times"          : "classTimes",
            "Faith Based"          : "faithBased",
            "Class Schedule"       : "classSchedule",
            "Status"               : "status",
            "Site2Address"         : "site2Address",
            "Curriculum Used"      : "curriculumUsed"
         };

        var headers = values[0].map(function mapHeader (header) {
            return fields[header];
        });

        var locations = values.slice(1).map(function makeLocations (row) {
            var location = {};

            return headers.reduce(function mapToCells (acc, header, i) {
                acc[header] = row[i];
                return acc;
            }, location);

        }).map(function extractLatLon (location) {
            // TODO a little checking would probably be good
            // look here if map errors?
            var latLon = location.latitudeLongitude.split(',');

            location.$lat = latLon[0];
            location.$lon = latLon[1];

            return location;
        });

        locations
            .filter(function (loc) { return loc.status === 'Approved'; })
            .forEach(function (loc) { courses.push(loc); });

        console.info('gapi::loadSheetData::ETL doneskies');

        haveData = true;

        return locations;
    }).then(function cleanVals (locations) {
        // big ugly data cleansing map
        return locations.map(function (loc) {
            if (loc.classSchedule === undefined)
                loc.classSchedule = "";

            return loc;
        });
    });
}

function listLocation(organization, classAddress) {
      var output = '<tr class="locations"><td class="location-list">'
            + '<div class="location-button" onclick="selectAddressFromList(\'' + classAddress + '\');">'
            + organization + '</div></td></tr>';
        $('#location_table tr:last').after(output);
}

// This is the function that figures out which courses to show on the map.
function getFilteredCourses() {

    // For each course, execute the function to determine whether we should
    // show it or not.
    return courses.filter(function (course) {

        // Filter by start date.
        var courseDate = course.startDate;
        if (courseDate !== "" && courseDate.indexOf('/') !== -1) {
          var filterInput = parseInt($("#start_date_menu").val());
          var filterEnd = moment().day(filterInput);
          var filterStart = moment();
          if (filterInput === 60) {
            filterStart = moment().add('d', 30);
          }
          if (filterInput === 90) {
            filterStart = moment().add('d', 60);
          }
          var courseCompare = moment(courseDate);
          if (courseCompare.valueOf() > filterEnd.valueOf() ||
              courseCompare.valueOf() < filterStart.valueOf()) {
            return false;
          }
        }

        // Filter by level.
        var level = $("#level_menu").val();
        if (level !== "" && course.coursesOffered.toLowerCase().indexOf(level.toLowerCase()) === -1) {
          return false;
        }

        // Filter by schedule.
        var schedule = $("#schedule_menu").val();

        if (schedule !== "" && course.classSchedule.toLowerCase().indexOf(schedule.toLowerCase()) === -1) {
          return false;
        }

        // Filter by cost.
        var fee = $("#cost_menu").val();
        var courseFee = course.fee.toLowerCase();
        if (fee !== courseFee.toLowerCase() && fee !== "") {
          if (courseFee !== "" && courseFee !== "free") {
            if (fee == "free") {
              return false;
            }
            var testFee = parseInt(courseFee);
            var filterFee = parseInt(fee);
            if (testFee >= filterFee) {
              return false;
            }
          }
        }

        // If we passed all those, this course is selected. Hooray!
        return true;
      });
  }


// Knockout bindings :( =======================================================

function ViewModel() {
    var self = this;

    self.organization = ko.observable();
    self.address = ko.observable();
    self.classAddress = ko.observable();
    self.phoneNumber = ko.observable();
    self.emailAddress = ko.observable();
    self.websiteUrl = ko.observable();
    self.coursesAtLocation = ko.observableArray();
    self.anySelected = ko.observable(false);
    self.description = ko.observable();
    self.faithBased = ko.observable();

    self.update = function (data) {
        self.organization(data.organization);
        self.address(data.address);
        self.classAddress(data.classAddress);
        self.emailAddress("<a href=mailto:" + data.emailAddress + ">" + data.emailAddress + "</a>");
        self.phoneNumber(data.phoneNumber);
        self.websiteUrl("<a href=" + data.websiteUrl + ">" + data.websiteUrl + "</a>");
        self.description(data.description);
        self.faithBased(data.faithBased);
        self.coursesAtLocation.removeAll();
        data.coursesAtLocation.forEach(function (course) {
            self.coursesAtLocation.push(course);
          });
      };
  }

var model = new ViewModel;
var selectedAddress = null;

function selectAddress(classAddress) {
  selectedAddress = classAddress;
  updatePopup();
}

function selectAddressFromList(classAddress) {
  selectedAddress = classAddress;
  toggleDetails();
  updatePopup();
}

function toggleDetails() {
  $("#location-popup").toggle();
  $("#location-list").toggle();
}

function updatePopup() {
  var matches = getFilteredCourses().filter(function (course) {
    return course.classAddress == selectedAddress;
  });
  if (matches.length !== 0) {
    model.update({
      organization: matches[0].organization,
      address: matches[0].address,
      classAddress: selectedAddress,
      phoneNumber: matches[0].phoneNumber,
      emailAddress: matches[0].emailAddress,
      websiteUrl: matches[0].websiteUrl,
      description: matches[0].description,
      faithBased: matches[0].faithBased,
      coursesAtLocation: matches
    });
    document.getElementById("location-popup").style.display = "block";
  }
}

function hidePopup() {
  document.getElementById("location-popup").style.display = "none";
}

function insertPin(course) {
  var address = course.classAddress;
  var organization = course.organization;
  $("#location_table tbody").html("");
  listLocation(organization, address); // here

  if (course.latitudeLongitude === "") {
    geocoder.geocode(
      {"address": address},
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          makeMarker(results[0].geometry.location);
        } else {
          console.error("Geocoding failed: " + status);
        }
      });
  } else {
    var parts = course.latitudeLongitude.split(",");
    makeMarker(new google.maps.LatLng(Number(parts[0]), Number(parts[1])));
  }

  function makeMarker(location) {
    var marker = new google.maps.Marker({
      map: map,
      position: location,
      title: organization
    });
    markers.push(marker);
    google.maps.event.addListener(marker, "click", function() {
      selectAddress(address);
    });
  }
}

function initialize() {
    // Create the map.
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: new google.maps.LatLng(centerLat, centerLng),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    geocoder = new google.maps.Geocoder();

    ko.applyBindings(model);
    // declare jquery listeners
    $("select.filter_menu").change(updateMap);
    $("#aboutLink").click(function() {
        $("#about_window").toggle();
    });

    initGAPI()
    .then(updateMap);
}

function showHideLocations() {
    $("#location-list").toggle();
    $("#location-top").toggle();
    $("#navigation").toggle();
}

function hideAbout() {
    $("#about_window").toggle();
}

function updateMap() {
    // Remove any old pins from the map.
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];

    // Insert new pins.
    var pinAddresses = [];
    getFilteredCourses().forEach(function (course) {
        if (pinAddresses.indexOf(course.classAddress) === -1) {
            pinAddresses.push(course.classAddress);
            insertPin(course);
        }
    });

    // If the popup is visible, we'll want to update that too.
    updatePopup();
    hidePopup();
}

// Programatically populate all text on the page with the new language.
// All tags with id="ml-foobar" will be populated with text from
// translated['foobar'], falling back on translated['foobar']['en']
// (defaultLanguageFallback) if the language is not implemented yet for
// that tag.
function populateText(lang) {
  if (lang) { currentLanguage = lang; }
  Object.keys(translated).forEach(function(key) {
    var text = translated[key][currentLanguage] ||
               translated[key][defaultLanguageFallback];
    $('#ml-' + key).html(text);
  });
}
