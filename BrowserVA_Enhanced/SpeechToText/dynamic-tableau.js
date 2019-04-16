
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function (stream) {
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });

//const ut = new SpeechSynthesisUtterance('No warning should arise');
//speechSynthesis.speak(ut);
//Tabitha says hello
//Make Character selection


if (annyang) {
    // These are the voice commands in quotes followed by the function
    var commands = {
        //'Select *ColType': function (ColType) { getSelectionValue(ColType);},
        //'Show *column': function (column) { var ColType = localStorage.getItem("Column");; selectColumn(column, ColType); responsiveVoice.speak('Showing data for ' + column); },
        'start over': function () { startover(); responsiveVoice.speak('starting over'); },
        'Filter by *ColType': function (ColType) { getColumnName(ColType); },
        'Value *columnName': function (column) { var ColType = localStorage.getItem("Column"); filterByColumn(ColType, column); responsiveVoice.speak('Showing data for ' + column); }

        //'calculate :quarter stats': {'regexp': /^Filter by (January|April|July|October) ColType$/, 'callback': calculateFunction}
    };
    // Add commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start();

}
else if (!annyang) {
    console.log("Speech Recognition is not supported");
}

function getSelectionValue(ColType) {
    localStorage.setItem("Column", ColType);
    responsiveVoice.speak('Choose any value to select ' + ColType);
}

function getColumnName(ColType) {
    localStorage.setItem("Column", ColType);
    responsiveVoice.speak('Choose any value to filter ' + ColType);
}

function sentenceCase(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function showActiveSheet() {
    var worksheet1;

    worksheet1 = viz.getWorkbook().getActiveSheet().getWorksheets();
    for (var i = 0; i < worksheet1.length; i++) {
        sheet = worksheet1[i];
        var sheetName = sheet.getName();
        alert(sheetName);
    }
}

function selectColumn(column, ColType) {
    var _colType = (sentenceCase(ColType));
   // alert(column, ColType);
    workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
}


function filterByColumn(ColType, column) {
    var _colType = (sentenceCase(ColType));
    var _column = (sentenceCase(column));
    //alert(_colType);
    //alert(column);.
    var colNames = [];
    colNames = localStorage.getItem("Fields");
    var str_array = colNames.split(',');
    for (let index = 0; index < str_array.length; index++) {
        if (str_array[index].toLowerCase() === _colType.toLowerCase()) {
            _colType = str_array[index];
            break;
        }
    }

    var colData = [];
    colData = localStorage.getItem("FieldData");
    var data_array = colData.split(',');
    for (let index = 0; index < data_array.length; index++) {
        if (data_array[index].toLowerCase() === column.toLowerCase()) {
            column = data_array[index];
            break;
        }
    }
    // workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);
    // workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);
    // workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);
    // workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);

    workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
}

//Start Viz Over
function startover() {

    viz.revertAllAsync();
}


function onMarksSelection(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks);
}

//function reportSelectedMarks(marks) {
//    var html = [];
//    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
//        var pairs = marks[markIndex].getPairs();
//        html.push("<b>Mark " + markIndex + ":</b><ul>");
//        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
//            var pair = pairs[pairIndex];
//            html.push("<li><b>fieldName:</b> " + pair.fieldName);
//            html.push("<br/><b>formattedValue:</b> " + pair.formattedValue + "</li>");
//        }
//        html.push("</ul>");
//    }

//    var dialog = $("#dialog");
//    dialog.html(html.join(""));
//    dialog.dialog("open");
//}

function reportSelectedMarks(marks) {
    var html = "";

    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        html += "<b>Mark " + markIndex + ":</b><ul>";

        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
            var pair = pairs[pairIndex];
            html += "<li><b>Field Name:</b> " + pair.fieldName;
            html += "<br/><b>Value:</b> " + pair.formattedValue + "</li>";

           // var result = pair.fieldName.match("");
            if (pair.fieldName.match("SUM*")) {

                var _name = pair.fieldName.replace("SUM", "");
                responsiveVoice.speak("The sum of " + _name + " is " + pair.formattedValue);

            }
            else if (pair.fieldName.match("AVG*")){

                var _data = pair.fieldName.replace("AVG", "");
                var val = pair.formattedValue.replace("AVG", "");
                responsiveVoice.speak("average " + _data + " is " + val);
            }
            else if (pair.fieldName.match("AGG*")) {

                var _d = pair.fieldName.replace("AGG", "");
                responsiveVoice.speak("The aggregate of  " + _d + " is " + pair.formattedValue);
            }
            //else if (pair.fieldName.match("WEEK*")) {

            //    var _week = pair.fieldName.replace("DATE CLOSED", "");
            //    responsiveVoice.speak("For week ending  " + _d + "revenue is " + pair.formattedValue);
            //}

        }

        html += "</ul>";
    }

    var infoDiv = document.getElementById('markDetails');
    infoDiv.innerHTML = html;


}


