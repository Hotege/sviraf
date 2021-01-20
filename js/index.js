// index.js
var selected = 0;
function selectFile() {        
    var input = document.getElementById("file");
    var sourceImg = document.getElementById("source");
    var inputText = document.getElementById("input_text");
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
function uploadAndFilter() {
    switch (selected) {
        case 0:
            postIrafl("/api/irafl/gray");
            break;
        case 1:
            postIrafl("/api/irafl/gaussblur?r=" + document.getElementById("in_1_radius").value);
            break;
        case 2:
            var r = document.getElementById("in_2_radius").value;
            var k = document.getElementById("in_2_search_times").value;
            postIrafl("/api/irafl/voronoi?r=" + r + "&k=" + k);
            break;
    }
}
