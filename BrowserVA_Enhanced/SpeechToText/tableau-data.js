
var viz, workbook, activeSheet, Worksheet, worksheet, vizData, table1;
function initializeViz() {
  // responsiveVoice.speak("Hi. I am your Tableau Assistant. How may I help you?", "US English Female");
  var placeholderDiv = document.getElementById("tableauViz");
  var url = "https://public.tableau.com/shared/Z49GSRCMM?:display_count=yes";
  // var url = "https://public.tableau.com/views/MostCommonLastNames/MostCommonLastNames?:embed=y&:embed_code_version=3&:loadOrderID=0&:display_count=yes";
  var options = {
    width: placeholderDiv.width,
    height: placeholderDiv.height,
    hideTabs: true,
    hideToolbar: true,
    onFirstInteractive: function () {
      workbook = viz.getWorkbook();
      activeSheet = workbook.getActiveSheet();
    }
  };
  viz = new tableau.Viz(placeholderDiv, url, options);
}

//Tabitha says hello
 responsiveVoice.speak("Hi. I am your Tableau Assistant. How may I help you?", "US English Female");
//Make Character selection

function salesData(attr, prop, state, region, year) {
  getUnderlyingData(attr, prop, state, region, year);
}

function getUnderlyingData(attr, prop, state, region, year) {
  sheet = viz.getWorkbook().getActiveSheet().getWorksheets()[0];
  // If the active sheet is not a dashboard, then you can just enter:
  // viz.getWorkbook().getActiveSheet();
  options = {
    maxRows: 0, // Max rows to return. Use 0 to return all rows
    ignoreAliases: false,
    ignoreSelection: true,
    includeAllColumns: false
  };

  sheet.getUnderlyingDataAsync(options).then(function (t) {
    table1 = t;
    var tgt = document.getElementById("dataTarget");
    var columns = table1.getColumns();
    var data = table1.getData();
    // console.log(table.getData());
    //console.log(data[0]);

    // //convert to field:values convention
    function reduceToObjects(cols, data) {
      var fieldNameMap = $.map(cols, function (col) {
        return col.getFieldName();
      });
      var dataToReturn = $.map(data, function (d) {
        return d.reduce(function (memo, value, idx) {
          memo[fieldNameMap[idx]] = value.value;
          return memo;
        }, {});
      });
      return dataToReturn;
    }

    var niceData = reduceToObjects(columns, data);
    //var jsonData = JSON.stringify(niceData);
    var max = 0;
    if ((attr == "maximum" || attr == "highest" || attr == "most") && (prop == "sales")) {
      if (state != null && region == null && year == null) {
        var newData = niceData.filter(function (salesData) {
          return salesData.State == state;
        });
        max = parseFloat(Math.max.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for ' + state + ' is ' + max.toFixed(2) + ' dollars.');
      }
      else if (state !== null && region === null && year !== null) {
        // var newData=$(niceData).filter(function (i,n){ return (parseInt(n["Order Date"].toString()).toString() === year && n.State == state)});
        var newData = niceData.filter(function (salesData) {
          // console.log(salesData);
          return (salesData.State == state && parseInt(salesData["Order Date"].toString()).toString() == year);
        });
        // console.log(newData);
        max = parseFloat(Math.max.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);

        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for year ' + year + ' by ' + state + ' is ' + max.toFixed(2) + ' dollars.');
      }
      else if (state == null && region != null && year == null) {
        var newData = niceData.filter(function (salesData) {
          return salesData.Region == region;
        });
        max = parseFloat(Math.max.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for ' + region + ' is ' + max.toFixed(2) + ' dollars.');
      }
      else if (state == null && region != null && year != null) {
        // var newData=$(niceData).filter(function (i,n){ return (parseInt(n["Order Date"].toString()).toString() === year && n.State == state)});
        var newData = niceData.filter(function (salesData) {
          // console.log(salesData);
          return (salesData.Region == region && parseInt(salesData["Order Date"].toString()).toString() == year);
        });
        // console.log(newData);
        max = parseFloat(Math.max.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);

        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for year ' + year + ' by ' + region + ' is ' + max.toFixed(2) + ' dollars.');
      }
    }
    else if ((attr == "minimum" || attr == "lowest" || attr == "least") && (prop == "sales")) {
      if (state != null && region == null && year == null) {
        var newData = niceData.filter(function (salesData) {
          return salesData.State == state;
        });
        max = parseFloat(Math.min.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for ' + state + ' is ' + max.toFixed(2) + ' dollars.');
      }
      else if (state != null && region == null && year != null) {
        // var newData=$(niceData).filter(function (i,n){ return (parseInt(n["Order Date"].toString()).toString() === year && n.State == state)});
        var newData = niceData.filter(function (salesData) {
          // console.log(salesData);
          return (salesData.State == state && parseInt(salesData["Order Date"].toString()).toString() == year);
        });
        // console.log(newData);
        max = parseFloat(Math.min.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);

        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for year ' + year + ' by ' + state + ' is ' + max.toFixed(2) + ' dollars.');
      }
      else if (state == null && region != null && year == null) {
        var newData = niceData.filter(function (salesData) {
          return salesData.Region == region;
        });
        max = parseFloat(Math.min.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for ' + region + ' is ' + max.toFixed(2) + ' dollars.');
      }
      else if (state == null && region != null && year != null) {
        // var newData=$(niceData).filter(function (i,n){ return (parseInt(n["Order Date"].toString()).toString() === year && n.State == state)});
        var newData = niceData.filter(function (salesData) {
          // console.log(salesData);
          return (salesData.Region == region && parseInt(salesData["Order Date"].toString()).toString() == year);
        });
        // console.log(newData);
        max = parseFloat(Math.min.apply(Math, newData.map(function (o) { return o.Sales; })));
        console.log(max);

        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak(attr + ' sales for year ' + year + ' by ' + region + ' is ' + max.toFixed(2) + ' dollars.');
      }
    }
    else if ((attr == "total") && (prop == "sales")) {
      var total = 0
      if (state != null && region == null && year == null) {
        var newData = niceData.filter(function (salesData) {
          return salesData.State == state;
        });
        //  console.log(newData);
        for (var i = 0; i < newData.length; i++) {
          //  console.log(newData[i]["Sales"]);
          total += parseFloat(newData[i][sentenceCase(prop)]);
        }
        console.log(total.toFixed(2));
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        responsiveVoice.speak('Total sales by ' + state + ' is ' + total.toFixed(2) + ' dollars.');
      }
      else if (state != null && region == null && year != null) {
        // var newData=$(niceData).filter(function (i,n){ return (parseInt(n["Order Date"].toString()).toString() === year && n.State == state)});
        var newData = niceData.filter(function (salesData) {
          // console.log(salesData);
          return (salesData.State == state && parseInt(salesData["Order Date"].toString()).toString() == year);
        });
        for (var i = 0; i < newData.length; i++) {
          //  console.log(newData[i]["Sales"]);
          total += parseFloat(newData[i][sentenceCase(prop)]);
        }
        console.log(total.toFixed(2));
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak('Total sales by ' + state + 'in year ' + year + ' is ' + total.toFixed(2) + ' dollars.');
      }
      else if (state == null && region != null && year == null) {
        var newData = niceData.filter(function (salesData) {
          return salesData.Region == region;
        });
        for (var i = 0; i < newData.length; i++) {
          //  console.log(newData[i]["Sales"]);
          total += parseFloat(newData[i][sentenceCase(prop)]);
        }
        console.log(total.toFixed(2));
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        // workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        // workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        // workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        // workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak('Total sales by ' + region + ' is ' + total.toFixed(2) + ' dollars.');
      }
      else if (state == null && region != null && year != null) {
        // var newData=$(niceData).filter(function (i,n){ return (parseInt(n["Order Date"].toString()).toString() === year && n.State == state)});
        var newData = niceData.filter(function (salesData) {
          // console.log(salesData);
          return (salesData.Region == region && parseInt(salesData["Order Date"].toString()).toString() == year);
        });
        for (var i = 0; i < newData.length; i++) {
          //  console.log(newData[i]["Sales"]);
          total += parseFloat(newData[i][sentenceCase(prop)]);
        }
        console.log(total.toFixed(2));
        workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
        responsiveVoice.speak('Total sales by ' + region + 'in year ' + year + ' is ' + total.toFixed(2) + ' dollars.');
      }
    }
    // else if ((attr == "maximum" || attr == "highest" || attr == "most") && (prop == "state" || prop == "region" || prop == "year"))
    // {
    //   if (prop == "state") {
    //     var newData = niceData.filter(function (salesData) {
    //       return salesData.State == state;
    //     });
    //     max = parseFloat(Math.max.apply(Math, newData.map(function (o) { return o.Sales; })));
    //     console.log(max);
    //     workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
    //     workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
    //     workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
    //     workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
    //     responsiveVoice.speak(attr + ' sales for ' + state + ' by ' + max.toFixed(2) + ' dollars.');
    //   }
    // }
    tgt.innerHTML = "<h4>Underlying Data:</h4><p>" + max + "</p>";


  });
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

function selectRegion(region) {
  // alert(region);
  workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("Region", region, tableau.SelectionUpdateType.REPLACE);
}

function selectState(state) {
  // alert(state);
  workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync("State", state, tableau.SelectionUpdateType.REPLACE);
}


function filterByYear(year) {
  //  alert(year);
  workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("YEAR(Order Date)", year, tableau.FilterUpdateType.REPLACE);
}

function filterByState(state) {
  //  alert(state);
  workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("State", state, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("State", state, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("State", state, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("State", state, tableau.FilterUpdateType.REPLACE);
}
function filterByRegion(region) {
  //  alert(state);
  workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("Region", region, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("Region", region, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("Region", region, tableau.FilterUpdateType.REPLACE);
  workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("Region", region, tableau.FilterUpdateType.REPLACE);
}



function queryDashboard() {
  workbook.activateSheetAsync("Geographical Sales Performance v3")
    .then(function (dashboard) {
      var worksheets = dashboard.getWorksheets();
      var text = getSheetsAlertText(worksheets);
      text = "Worksheets in the dashboard:\n" + text;
      alert(text);
      return text;
    });
}

function querySheets() {
  var sheets = workbook.getPublishedSheetsInfo().get("Sales Map");
  var text = workbook.getSheetsAlertText(sheets);
  text = "Sheets in the workbook:\n" + text;
  alert(text);
  return text;
}
//Start Viz Over
function startover() {

  viz.revertAllAsync();
}

function getMax(vizData, prop) {
  var max, total = 0;
  console.log(vizData);
  for (var i = 0; i < vizData.length; i++) {
    console.log(Math.max.apply(Math, vizData.map(function (o) { return o.y; })));

    if (!max || parseInt(vizData[i][prop]) > parseInt(max[prop]))
      max = vizData[i];
    if (vizData[i]["State"] == "California")
      total += parseInt(vizData[i][prop]);
  }
  return total;
}

// function getFormattedData() {
//   options = {
//     maxRows: 0, // Max rows to return. Use 0 to return all rows
//     ignoreAliases: false,
//     ignoreSelection: true,
//     includeAllColumns: false
//   };
//   var sheetName = workbook.getActiveSheet().getWorksheets()[0].getName();
//   // alert(sheetName);
//   workbook.getActiveSheet().getWorksheets()[0].getUnderlyingDataAsync(options).then(function (t) {
//     prepareTable(sheetName, t);
//   });
// }
//restructure the data and build something with it
function prepareTable(name, table) {
  var rowNum = 0;
  //the data returned from the tableau API
  var columns = table.getColumns();
  var data = table.getData();
  // console.log(table.getData());
  //console.log(data[0]);

  // //convert to field:values convention
  function reduceToObjects(cols, data) {
    var fieldNameMap = $.map(cols, function (col) {
      return col.getFieldName();
    });
    var dataToReturn = $.map(data, function (d) {
      return d.reduce(function (memo, value, idx) {
        memo[fieldNameMap[idx]] = value.value;
        return memo;
      }, {});
    });
    return dataToReturn;
  }


  var niceData = reduceToObjects(columns, data);
  //OutPut JSON.stringify(niceData)
  // console.log(niceData);
  //var d = JSON.stringify(niceData);
  var vizData = niceData;
  var maxSales = getMax(vizData, "Sales");
  console.log(maxSales);

}