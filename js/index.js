// index.js
var count = 4;
var tagsName = ["gray", "gaussblur", "lut3d", "voronoi"];
var selected = 0;
function selectFile(fileId, displayId, textId) {        
    var input = document.getElementById(fileId);
    var sourceImg = document.getElementById(displayId);
    var inputText = document.getElementById(textId);
    input.click();
    input.onchange = event => {
        var file = event.target.files[0];
        inputText.value = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            sourceImg.src = reader.result;
        };
    };
}
function postIrafl(url) {
    var resultImg = document.getElementById("result");
    var form = new FormData();
    form.append("file", document.getElementById("file").files[0]);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onload = function (e) {
                resultImg.src = reader.result;
            };
        }
    };
    xhr.send(form);
}
function postIraflLut3D(url) {
    var resultImg = document.getElementById("result");
    var form = new FormData();
    form.append("file", document.getElementById("file").files[0]);
    form.append("filter", document.getElementById("in_2_file").files[0]);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onload = function (e) {
                resultImg.src = reader.result;
            };
        }
    };
    xhr.send(form);
}
function uploadAndFilter() {
    switch (selected) {
        case 0:
            postIrafl("/api/irafl/gray");
            break;
        case 1:
            postIrafl("/api/irafl/gaussblur?r=" + document.getElementById("in_1_radius").value);
            break;
        case 2:
            postIraflLut3D("/api/irafl/lut3d?size=" + document.getElementById("in_2_filter_size").value);
            break;
        case 3:
            var r = document.getElementById("in_3_radius").value;
            var k = document.getElementById("in_3_search_times").value;
            postIrafl("/api/irafl/voronoi?r=" + r + "&k=" + k);
            break;
    }
}
function switchTag(nid) {
    selected = nid;
    for (var i = 0; i < count; i++) {
        document.getElementById("t_" + i.toString()).style.backgroundColor = "white";
        document.getElementById("d_" + i.toString()).style.display = "none";
    }
    document.getElementById("t_" + nid.toString()).style.backgroundColor = "lightpink";
    document.getElementById("d_" + nid.toString()).style.display = "block";
}
function insertIrafl() {
    var tags = document.getElementById("irafl_tags");
    for (var i = 0; i < count; i++) {
        var _a = document.createElement("a");
        _a.id = "t_" + (i).toString();
        _a.style.border = "1px solid black";
        _a.style.paddingLeft = "4px";
        _a.style.paddingRight = "4px";
        _a.onclick = function(id) {
            return function() {
                switchTag(id);
            };
        }(i);
        _a.innerHTML = tagsName[i];
        if (i == 0){
            _a.style.backgroundColor = "lightpink";
        }
        tags.appendChild(_a);
    }
}
