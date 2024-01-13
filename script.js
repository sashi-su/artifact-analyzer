//preparing an object that memorises artifact's top%
const tops = {};

function calculate_top() {    
    //getting a data table   
    //quoted from https://kasumiblog.org/javascript-csv-array/
    let csv = new XMLHttpRequest();
    csv.open("GET", "data_table.csv", false);
    
    try {
    csv.send(null);
    } catch (err) {
    alert("私はこの文章が見えないと信じています。");
    }
    
    let table = [];
    let lines = csv.responseText.split(/\r\n|\n/);
    for (let i = 0; i < lines.length; ++i) {
    let cells = lines[i].split(",");
    if (cells.length != 1) {
        table.push(cells);
    }
    }
    const table_read = [
        [0, 8, 8, 8, 8, 18, 8, 8, 8, 26, 8, 8, 8],
        [2, 8, 10, 10, 10, 20, 8, 10, 10, 28, 8, 10, 10],
        [4, 10, 12, 12, 10, 22, 10, 12, 10, 30, 10, 12, 10],
        [6, 16, 14, 10, 14, 24, 16, 14, 14, 32, 16, 14, 14],
        [2, 10, 8, 10, 10, 20, 10, 8, 10, 28, 10, 8, 10],
        [4, 12, 10, 12, 10, 22, 12, 10, 10, 30, 12, 10, 10],
        [6, 14, 16, 10, 14, 24, 14, 16, 14, 32, 14, 16, 14]
    ];

    const main_p = [1, 4/15, 4/15, 0.1, 0.1, 0.05, 0.1925, 0.1925, 0.025, 0.1, 0.22, 0.22, 0.04];

    //caluclate top%
    let formula = document.getElementById("multiplierSelect").value;

    let flower_score = document.getElementById('flower_score').value;
    let plume_score = document.getElementById('plume_score').value;
    let sand_score = document.getElementById('sand_score').value;
    let goblet_score = document.getElementById('goblet_score').value;
    let circlet_score = document.getElementById('circlet_score').value;

    let sand_main = parseFloat(document.getElementById("sand_main").value);
    let goblet_main = parseFloat(document.getElementById("goblet_main").value);
    let circlet_main = parseFloat(document.getElementById("circlet_main").value);

    let flower_3optop = table[table_read[formula][0]][Math.round(flower_score*7 / 1.36)] || 0;
    let flower_4optop = table[table_read[formula][0]+1][Math.round(flower_score*7 / 1.36)] || 0;
    let plume_3optop = table[table_read[formula][0]][Math.round(plume_score*7 / 1.36)] || 0;
    let plume_4optop = table[table_read[formula][0]+1][Math.round(plume_score*7 / 1.36)] || 0;
    let sand_3optop;
    if (sand_score === ""){sand_3optop = 1} else {sand_3optop = main_p[sand_main] * table[table_read[formula][sand_main]][Math.round(sand_score*7 / 1.36)] || 0}
    let sand_4optop;
    if (sand_score === ""){sand_4optop = 1} else {sand_4optop = main_p[sand_main] * table[table_read[formula][sand_main]+1][Math.round(sand_score*7 / 1.36)] || 0}
    let goblet_3optop;
    if (goblet_score == ""){goblet_3optop = 1} else {goblet_3optop = main_p[goblet_main] * table[table_read[formula][goblet_main]][Math.round(goblet_score*7 / 1.36)] || 0}
    let goblet_4optop;
    if (goblet_score == ""){goblet_4optop = 1} else {goblet_4optop = main_p[goblet_main] * table[table_read[formula][goblet_main]+1][Math.round(goblet_score*7 / 1.36)] || 0}
    let circlet_3optop;
    if (circlet_score == ""){circlet_3optop = 1} else {circlet_3optop = main_p[circlet_main] * table[table_read[formula][circlet_main]][Math.round(circlet_score*7 / 1.36)] || 0}
    let circlet_4optop;
    if (circlet_score == ""){circlet_4optop = 1} else {circlet_4optop = main_p[circlet_main] * table[table_read[formula][circlet_main]+1][Math.round(circlet_score*7 / 1.36)] || 0}

    tops.flower_3op = flower_3optop;
    tops.flower_4op = flower_4optop;
    tops.plume_3op = plume_3optop;
    tops.plume_4op = plume_4optop;
    tops.sand_3op = sand_3optop;
    tops.sand_4op = sand_4optop;
    tops.goblet_3op = goblet_3optop;
    tops.goblet_4op = goblet_4optop;
    tops.circlet_3op = circlet_3optop;
    tops.circlet_4op = circlet_4optop;

    document.getElementById('flower_top').innerHTML = `<p>上位${(100 * (flower_3optop*11/15 + flower_4optop*4/15)).toPrecision(3)}%</p>`;
    document.getElementById('plume_top').innerHTML = `<p>上位${(100 * (plume_3optop*11/15 + plume_4optop*4/15)).toPrecision(3)}%</p>`;
    document.getElementById('sand_top').innerHTML = `<p>上位${(100 * (sand_3optop*11/15 + sand_4optop*4/15)).toPrecision(3)}%</p>`;
    document.getElementById('goblet_top').innerHTML = `<p>上位${(100 * (goblet_3optop*11/15 + goblet_4optop*4/15)).toPrecision(3)}%</p>`;
    document.getElementById('circlet_top').innerHTML = `<p>上位${(100 * (circlet_3optop*11/15 + circlet_4optop*4/15)).toPrecision(3)}%</p>`;

    //calculate a rank
    document.getElementById('flower_rank').innerHTML = `<p>${caluclate_rank(flower_3optop*11/15 + flower_4optop*4/15)}</p>`;
    document.getElementById('plume_rank').innerHTML = `<p>${caluclate_rank(plume_3optop*11/15 + plume_4optop*4/15)}</p>`;
    document.getElementById('sand_rank').innerHTML = `<p>${caluclate_rank(sand_3optop*11/15 + sand_4optop*4/15)}</p>`;
    document.getElementById('goblet_rank').innerHTML = `<p>${caluclate_rank(goblet_3optop*11/15 + goblet_4optop*4/15)}</p>`;
    document.getElementById('circlet_rank').innerHTML = `<p>${caluclate_rank(circlet_3optop*11/15 + circlet_4optop*4/15)}</p>`;

    var tableContainer = document.querySelector('.tap_to_scrollright');
    tableContainer.scrollLeft = 1000;
}


function caluclate_rank(top){
    let rank;
    if (top == 0){
        rank = "実現不可能"
    } else {
        let x = -2 * Math.log10(100*top);
        if (x <= -4){
            rank = "―"
        } else if (x < -1) {
            rank = "C";
        } else if (x < 0) {
            rank = "B";
        } else if (x < 1) {
            rank = "A";
        } else {
            rank = "S".repeat(Math.floor(x));
        }
    }
    return rank
}


function show_or_hide(){
    const getting_way = document.getElementById("getting-way");
    const strong_both_showed = document.getElementById("strong-both-showed");
    const domain_both_showed1 = document.getElementById("domain-both-showed1");
    const domain_both_showed2 = document.getElementById("domain-both-showed2");
    const strong_showed1 = document.getElementById("strong-showed1");
    const strong_showed2 = document.getElementById("strong-showed2");
    
    if (getting_way.value === "domain") {
        strong_both_showed.style.display = "none";
        domain_both_showed1.style.display = "inline";
        domain_both_showed2.style.display = "inline";
        strong_showed1.style.display = "none";
        strong_showed2.style.display = "none";

    } else if (getting_way.value === "strong") {
        strong_both_showed.style.display = "inline";
        domain_both_showed1.style.display = "none";
        domain_both_showed2.style.display = "none";
        strong_showed1.style.display = "inline";
        strong_showed2.style.display = "inline";
    
    } else {
        strong_both_showed.style.display = "inline";
        domain_both_showed1.style.display = "inline";
        domain_both_showed2.style.display = "inline";
        strong_showed1.style.display = "none";
        strong_showed2.style.display = "none";
    }
}


function calculate_probability(){
    calculate_top()
    const getting_way = document.getElementById("getting-way").value;
    const strong_rate = document.getElementById("strong-rate").value/100;
    const probability = document.getElementById("getting_probability").value/100;
    const trial_input = document.getElementById("trials").value;

    let flower_top;
    let plume_top;
    let sand_top;
    let goblet_top;
    let circlet_top;
    let multiplier;
    if (getting_way === "domain") {
        flower_top = (tops.flower_4op/5 + 4*tops.flower_3op/5)/10;
        plume_top = (tops.plume_4op/5 + 4*tops.plume_3op/5)/10;
        sand_top = (tops.sand_4op/5 + 4*tops.sand_3op/5)/10;
        goblet_top = (tops.goblet_4op/5 + 4*tops.goblet_3op/5)/10;
        circlet_top = (tops.circlet_4op/5 + 4*tops.circlet_3op/5)/10;
        multiplier = 2.14;
    } else if (getting_way === "strong") {
        flower_top = (tops.flower_4op/3 + 2*tops.flower_3op/3)/5;
        plume_top = (tops.plume_4op/3 + 2*tops.plume_3op/3)/5;
        sand_top = (tops.sand_4op/3 + 2*tops.sand_3op/3)/5;
        goblet_top = (tops.goblet_4op/3 + 2*tops.goblet_3op/3)/5;
        circlet_top = (tops.circlet_4op/3 + 2*tops.circlet_3op/3)/5;
        multiplier = 1/(3-strong_rate);
    } else {
        // be careful that artifact_top is no longer a top x%.
        flower_top = 1-(1-(tops.flower_4op/5 + 4*tops.flower_3op/5)/10) * (1-(tops.flower_4op/3 + 2*tops.flower_3op/3)/5)**(strong_rate/(3-strong_rate));
        plume_top = 1-(1-(tops.plume_4op/5 + 4*tops.plume_3op/5)/10) * (1-(tops.plume_4op/3 + 2*tops.plume_3op/3)/5)**(strong_rate/(3-strong_rate));
        sand_top = 1-(1-(tops.sand_4op/5 + 4*tops.sand_3op/5)/10) * (1-(tops.sand_4op/3 + 2*tops.sand_3op/3)/5)**(strong_rate/(3-strong_rate));
        goblet_top = 1-(1-(tops.goblet_4op/5 + 4*tops.goblet_3op/5)/10) * (1-(tops.goblet_4op/3 + 2*tops.goblet_3op/3)/5)**(strong_rate/(3-strong_rate));
        circlet_top = 1-(1-(tops.circlet_4op/5 + 4*tops.circlet_3op/5)/10) * (1-(tops.circlet_4op/3 + 2*tops.circlet_3op/3)/5)**(strong_rate/(3-strong_rate));
        multiplier = 2.14;
    }
    let trials = multiplier*trial_input;

    //calculate the probability to get a stronger artifact
    document.getElementById("flower_probability").innerHTML = `<p>${(100*(1 - (1-flower_top)**trials)).toPrecision(3)}%</p>`;
    document.getElementById("plume_probability").innerHTML = `<p>${(100*(1 - (1-plume_top)**trials)).toPrecision(3)}%</p>`;
    document.getElementById("sand_probability").innerHTML = `<p>${(100*(1 - (1-sand_top)**trials)).toPrecision(3)}%</p>`;
    document.getElementById("goblet_probability").innerHTML = `<p>${(100*(1 - (1-goblet_top)**trials)).toPrecision(3)}%</p>`;
    document.getElementById("circlet_probability").innerHTML = `<p>${(100*(1 - (1-circlet_top)**trials)).toPrecision(3)}%</p>`;
    document.getElementById("artifact_probability").innerHTML = `<p>${(100*(1 - ((1-flower_top)*(1-plume_top)*(1-sand_top)*(1-goblet_top)*(1-circlet_top))**trials)).toPrecision(3)}%</p>`;

    //calculate number of trials necessary to get a stronger artifact
    let flower_trials = isFinite(1/(1-probability) + 1/flower_top) ? Math.ceil((Math.log(1-probability) / Math.log(1-flower_top))/multiplier) : "無限";
    let plume_trials = isFinite(1/(1-probability) + 1/plume_top) ? Math.ceil((Math.log(1-probability) / Math.log(1-plume_top))/multiplier) : "無限";
    let sand_trials = isFinite(1/(1-probability) + 1/sand_top) ? Math.ceil((Math.log(1-probability) / Math.log(1-sand_top))/multiplier) : "無限";
    let goblet_trials = isFinite(1/(1-probability) + 1/goblet_top) ? Math.ceil((Math.log(1-probability) / Math.log(1-goblet_top))/multiplier) : "無限";
    let circlet_trials = isFinite(1/(1-probability) + 1/circlet_top) ? Math.ceil((Math.log(1-probability) / Math.log(1-circlet_top))/multiplier) : "無限";
    let artifact_trials = isFinite((Math.log(1-probability) / Math.log((1-flower_top)*(1-plume_top)*(1-sand_top)*(1-goblet_top)*(1-circlet_top)))) ? Math.ceil((Math.log(1-probability) / Math.log((1-flower_top)*(1-plume_top)*(1-sand_top)*(1-goblet_top)*(1-circlet_top)))/multiplier) : "無限";

    document.getElementById("flower_trials").innerHTML = `<p>${flower_trials}</p>`;
    document.getElementById("plume_trials").innerHTML = `<p>${plume_trials}</p>`;
    document.getElementById("sand_trials").innerHTML = `<p>${sand_trials}</p>`;
    document.getElementById("goblet_trials").innerHTML = `<p>${goblet_trials}</p>`;
    document.getElementById("circlet_trials").innerHTML = `<p>${circlet_trials}</p>`;
    document.getElementById("artifact_trials").innerHTML = `<p>${artifact_trials}</p>`;
}


function never_minus(inputElement){
    let inputValue = inputElement.value;
    if (inputValue < 0) {
        inputValue = 0;
    }
    inputElement.value = inputValue;
}
function never_over100(inputElement){
    let inputValue = inputElement.value;
    if (inputValue > 100) {
        inputValue = 100;
    }
    inputElement.value = inputValue;
}
