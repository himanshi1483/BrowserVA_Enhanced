$(document).ready(function () {

    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if ('SpeechRecognition' in window) {
        // speech recognition API supported
        console.log("Supported");

    } else {
        // speech recognition API not supported
        console.log("Not Supported");
    }
    //$("#tabs").show();
    //$("#tabs").tabs();
    $("#vizContainer").height(window.innerHeight - 200);
    $("#dataContainer").height(window.innerHeight - 250);
    //$("#tableauURL").change(function () {
    //    initViz();

    //});
    $("#btnSubmit").click(function () {
        initViz();
    });
    $("#menu").change(function () {
        //console.log(data[0]);

        fetchSheetData();
    });

});

function initViz() {
    $("#vizContainer").empty();
    $("#dataContainer").empty();
    $("#menu").empty();
    $("#vizContainer").append("<div id='tableau_visualization'></div>");
    var containerDiv = document.getElementById("tableau_visualization"),
        url = $("#tableauURL").val(),
        options = {
            hideTabs: true,
            hideToolbar: true,
            onFirstInteractive: function () {
                listenToMarksSelection();
                workbook = viz.getWorkbook();
                $("#dashboardTitle").text(workbook.getName());
                $("#dashboardTitle").css('display', 'block');
                $("#dashboardTitle").css('font-weight', 'bold');
                getVizData();
                saveUrl();

            }
        };
    viz = new tableau.Viz(containerDiv, url, options);
    //var test = tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "Sales Overtime").getDataSourcesAsync().then(datasources => {
    //    dataSource = datasources.find(datasource => datasource.name === "Salesforce Dashboard - Sales Overview");
    //    return dataSource.getUnderlyingDataAsync();
    //}).then(dataTable => {
    //    alert(dataTable);
    //});
    responsiveVoice.speak("Hi. I am Tablexa,your Tableau Assistant. How may I help you?", "US English Female");

}


function savetoDB(_url) {
    var dbClient = new awsSdk.DynamoDB.DocumentClient();
    var url = _url;
    var params = {
        TableName: "DashboardData",
        Key: {
            "Url": string.empty,
        },
        UpdateExpression: "set Url = :newUrl",
        ExpressionAttributeValues: {
            ":newUrl": url
        }
    };
    dbClient.update(params, (() => {
        this.emit(':ask', 'is this your dashboard');
    }));
}



//when viz is loaded (onFirstInteractive), request data
function getVizData() {
    options = {
        maxRows: 0, // Max rows to return. Use 0 to return all rows
        ignoreAliases: false,
        ignoreSelection: false,
        includeAllColumns: true
    };
    var ul = document.getElementById("dashboardCols");
    var lis = ul.children;

    const li_count = lis.length;
    // alert(li_count);
    if (li_count > 0 || li_count == 0) {
        for (let index = 0; index < li_count; index++) {
            ul.removeChild(lis[0]);
        }
    }
    var filter_ul = document.getElementById("filterOptions");
    var filter_lis = filter_ul.children;
    const fli_count = filter_lis.length;
    // alert(li_count);
    if (fli_count > 0 || fli_count === 0) {
        for (let index = 0; index < fli_count; index++) {
            filter_ul.removeChild(filter_lis[0]);
        }
    }

    sheet = viz.getWorkbook().getActiveSheet();
    //var filter_ul = document.getElementById("filterOptions");

    $('<legend style="font-size:14px;" class="btn btn-default">Filters</legend>').appendTo('#filterOptions');

    //var filter_lis = filter_ul.children;
    var onSuccess = function (filters) {
        $.each(filters, function (i, filter) {
            var fieldName = filter.getFieldName();
            var filterType = filter.getFilterType();
           // console.log(fieldName);
           // console.log(filterType);
            $('<li class="list-inline-item btn btn-info" style="margin-bottom:10px">' + fieldName + '</li>').appendTo('#filterOptions');

            //if (filterType === tableau.FilterType.CATEGORICAL) {
                
            //} else if (filterType === tableau.FilterType.QUANTITATIVE) {

            //    //TODO:
            //} else if (filterType === tableau.FilterType.HIERARCHICAL) {

            //    //TODO:
            //} else if (filterType === tableau.FilterType.RELATIVEDATE) {

            //    //TODO:
            //}
        });
    };

    var onFault = function (error) {
        //TODO:
    };


                if (sheet.getSheetType() === 'worksheet') {
                    $('#menu').append('<option>' + sheet.getName() + '</option>');
                    if ($('#menu option').length === 1) {
                        sheet.getUnderlyingDataAsync(options).then(function (t) {
                            // alert(2);
                            prepareTable(sheet.getName(), t);
                            // buildMenu(t);
                        });
                        sheet.getFiltersAsync()
                            .then(onSuccess, onFault);
                       // console.log(sheet.getObjects());
                    }
                    //if active sheet is a dashboard get data from a specified sheet
                } else {

                    // debugger;
                    worksheetArray = viz.getWorkbook().getActiveSheet().getWorksheets();
                    worksheetArray[0].getFiltersAsync()
                        .then(onSuccess, onFault);

                            //console.log(viz.getWorkbook());
                    for (var i = 0; i < worksheetArray.length; i++) {
                        sheet = worksheetArray[i];
                        if (sheet.getSheetType() === 'worksheet') {
                            $('#menu').append('<option>' + sheet.getName() + '</option>');
                           
                        }
                    }

                   
                    const li_count = lis.length;
                    // alert(li_count);
                    if (li_count > 0 || li_count == 0) {
                        for (let index = 0; index < li_count; index++) {
                            ul.removeChild(lis[0]);
                        }
                    }
                    fetchSheetData();
    }
            }

            function listenToMarksSelection() {
                viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
            }

            function fetchSheetData() {
                $('#dataContainer').empty();

                worksheetArray = viz.getWorkbook().getActiveSheet().getWorksheets();

                for (var i = 0; i < worksheetArray.length; i++) {
                    sheet = worksheetArray[i];
                

                    if (sheet.getSheetType() === 'worksheet' && sheet.getName() === $("#menu").val()) {
                        var sheetName = sheet.getName();
                        // console.log(sheetName);
                        sheet.getUnderlyingDataAsync(options).then(function (t) {
                            var ul = document.getElementById("dashboardCols");
                            var lis = ul.children;

                            const li_count = lis.length;
                            //  alert(li_count);
                            if (li_count > 0 || li_count == 0) {
                                for (let index = 0; index < li_count; index++) {
                                    ul.removeChild(lis[0]);
                                }
                            }

                            
                           
                            prepareTable(sheetName, t);
                        });
                    }

                }
            }

            //restructure the data and build something with it
            function prepareTable(name, table) {

                var rowNum = 50;
                //the data returned from the tableau API
                var columns = table.getColumns();
                var data = table.getData();

                $('<legend style="font-size:14px;" class="btn btn-default">Dimensions and Metrics</legend>').appendTo('#dashboardCols');

                convertColumnsObjectToArrayOfNames(table);
                
                // //convert to field:values convention
                function reduceToObjects(cols, data) {
                    var fieldNameMap = $.map(cols, function (col) {

                        var colsdata = col.getFieldName();
                       // arr.push(colsdata);

                       
                        return col.getFieldName();
                    });

                 
                  
                    var dataToReturn = $.map(data, function (d) {
                        return d.reduce(function (memo, value, idx) {
                            memo[fieldNameMap[idx]] = value.value;
                            //dataArr.push(memo[fieldNameMap[idx]]);
                            // alert(1);
                            // 
                            // alert(3);
                            return memo;
                        }, {});
                    });
                   // localStorage.setItem("FieldData", dataArr);
                    return dataToReturn;
                }

                var niceData = reduceToObjects(columns, data);
                //console.log(JSON.stringify(niceData));
                // createItem(niceData);

                var table1 = $("<table>");
                var tr = $("<tr>");
                columns.forEach(function (col, i) {
                    var th = $("<th>");
                    th.text(col.getFieldName());
                    tr.append(th);
                });
                table1.append(tr);

                data.every(function (row, i) {
                    if (i >= rowNum) {
                        return false;
                    }
                    tr = $("<tr>");
                    row.forEach(function (col) {
                        var td = $("<td>");
                        td.text(col.formattedValue);
                        tr.append(td);
                    });
                    table1.append(tr);
                    return true;
                });
                var tableContainer = $("<div class='tableContainer'>");
                var tableHeading = $("<p>" + (data.length > rowNum ? " (showing only " + rowNum + "/" + data.length + " rows)" : " (showing " + data.length + " rows)") + "</p>");
                tableContainer.append(tableHeading);
                tableContainer.append(table);
                $('#dataContainer').append(tableContainer);
            }

function getFilters(sheet) {
    sheet.getFiltersAsync()
        .then(function (filters) {

            console.log("promise returned");

            // Iterate (using ES6 style) through the filters retrieving properties
            for (filter of filters) {
                console.log(filter.getFieldName());
                console.log(filter.getFilterType());
            }
        });
}

function convertColumnsObjectToArrayOfNames(sheetDataObj) {
   var col_obj = sheetDataObj.getColumns();
    var col_array = new Array();
    var col_type = new Array();
    for (var k = 0; k < col_obj.length; k++) {
        col_array[k] = col_obj[k].getFieldName();
        col_type[k] = col_obj[k].getDataType();
        $('<li class="list-inline-item btn btn-info" style="margin-bottom:10px">' + col_array[k]+ '-' + col_type[k] + '</li>').appendTo('#dashboardCols');
    }
    console.log(col_array);
    return col_array;
}


            //restructure the data and build something with it
            function buildMenu(table) {
                var rowNum = 50;
                //the data returned from the tableau API
                var columns = table.getColumns();
                var data = table.getData();

                //convert to field:values convention
                function reduceToObjects(cols, data) {
                    var fieldNameMap = $.map(cols, function (col) { return col.getFieldName(); });
                    var dataToReturn = $.map(data, function (d) {
                        return d.reduce(function (memo, value, idx) {
                            memo[fieldNameMap[idx]] = value.value; return memo;
                        }, {});
                    });
                    return dataToReturn;
                }

                var niceData = reduceToObjects(columns, data);

                //create nested tree structure
                var menuTree = d3.nest()
                    .key(function (d) { return d.Level1; }).sortKeys(d3.ascending)
                    .key(function (d) { return d.Level2; }).sortKeys(d3.ascending)
                    .key(function (d) { return d.Level3; }).sortKeys(d3.ascending)
                    .rollup(function (leaves) { return leaves.length; })
                    .entries(niceData);

                //D3 layout menu list
                var menu = d3.select('#menuTree').selectAll('ul')
                    .data(menuTree)
                    .enter()
                    .append('ul');

                //append list items
                function writeMenu(parentList) {

                    var item = parentList
                        .filter(function (d) { return d.key !== "%null%"; })
                        .append('li')
                        .text(function (d) { return d.key; })
                        .classed("collapsed", true);
                    console.log(item);

                    var children = parentList.selectAll('ul')
                        .data(function (d) { return d.values; })
                        .enter().append('ul');

                    if (!children.empty()) {
                        writeMenu(children);
                    }
                }
                writeMenu(menu);

                //init collapible functions
                $('ul>li').siblings("ul").toggle();
                $('ul').not(':has(li)').remove(); //removes empty children with Null values. not a perfect approach, but easier for this demo
                $('ul>li').click(function () {

                    //expand if it has children
                    if ($(this).siblings('ul').length) {
                        $(this).toggleClass("collapsed");
                        $(this).siblings("ul").slideToggle(300);
                    }

                    //apply parameter to change the viz
                    // var depth = $(this).parents("ul").length;
                    // if ($(this).text()=="Show Top Level") {
                    // 	workbook.changeParameterValueAsync("nameInput","");
                    // 	workbook.changeParameterValueAsync("levelInput",0);
                    // } else {
                    // 	workbook.changeParameterValueAsync("nameInput",$(this).text());
                    // 	workbook.changeParameterValueAsync("levelInput",depth);
                    // }
                });
            }

