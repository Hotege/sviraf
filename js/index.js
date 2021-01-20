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
var paramsProc = [
    function(ctn, id) {
    },
    function(ctn, id) {
        var sp = document.createElement("span");
        sp.innerHTML = "radius: ";
        var input = document.createElement("input");
        input.id = "in_" + id.toString() + "_radius";
        input.type = "text";
        input.value = 3;
        sp.appendChild(input);
        ctn.appendChild(sp);
    },
    function(ctn, id) {
        var txt = document.createElement("input");
        txt.id = "in_" + id.toString() + "_text";
        txt.readonly = "1";
        txt.onclick = function(n) {
            return function() {
                selectFile("in_" + n.toString() + "_file", "in_" + n.toString() + "_img", "in_" + n.toString() + "_text");
            };
        }(id);
        ctn.appendChild(txt);
        var sp = document.createElement("span");
        sp.innerHTML = "filter size: ";
        var tfs = document.createElement("input");
        tfs.id = "in_" + id.toString() + "_filter_size";
        tfs.type = "text";
        tfs.value = 16;
        sp.appendChild(tfs);
        ctn.appendChild(sp);
        ctn.appendChild(document.createElement("br"));
        var filter = document.createElement("input");
        filter.style.display = "none";
        filter.type = "file";
        filter.id = "in_" + id.toString() + "_file";
        filter.name = "filter";
        filter.accpet = "image/x-png,image/jpeg,image/bmp";
        ctn.appendChild(filter);
        var img = document.createElement("img");
        img.id = "in_" + id.toString() + "_img";
        ctn.appendChild(img);
    },
    function(ctn, id) {
        var sp1 = document.createElement("span");
        sp1.innerHTML = "radius: ";
        var r = document.createElement("input");
        r.id = "in_" + id.toString() + "_radius";
        r.type = "text";
        r.value = "32.0";
        sp1.appendChild(r);
        ctn.appendChild(sp1);
        ctn.appendChild(document.createElement("br"));
        var sp2 = document.createElement("span");
        sp2.innerHTML = "search times: ";
        var k = document.createElement("input");
        k.id = "in_" + id.toString() + "_search_times";
        k.type = "text";
        k.value = "32";
        sp2.appendChild(k);
        ctn.appendChild(sp2);
    }
];
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
    var params = document.getElementById("irafl_params");
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
        var d = document.createElement("div");
        d.id = "d_" + i.toString();
        if (i == 0) {
            d.style.display = "block";
        } else {
            d.style.display = "none";
        }
        paramsProc[i](d, i);
        params.appendChild(d);
    }
}
