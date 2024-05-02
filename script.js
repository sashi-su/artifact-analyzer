// コードをご覧いただきありがとうございます。
// javascriptは初心者なので、冗長で分かりにくいコードがあると思いますが、ご了承くださいませ。


// 聖遺物の種類に応じてメインステータスの選択肢を制御する関数
// onchangeとaddEventListenerによる二重の呼び出しが起こっていて、良くない気がするが、とりあえず動くので放置
function main_select(){
    var category_select = document.getElementsByClassName("category-select");
    for (var i = 0; i < category_select.length; i++) {
        category_select[i].addEventListener("change", function() {
            var row = this.parentNode.parentNode;
            var category_select = row.cells[1].querySelector("select");
            var main_status = row.cells[2];
            
            var category = category_select.value;
            var flower_showed = main_status.querySelector(".flower_showed");
            var plume_showed = main_status.querySelector(".plume_showed");
            var other_showed = main_status.querySelector(".other_showed");

            if (category == "flower") {
                flower_showed.style.display = "inline";
                plume_showed.style.display = "none";
                other_showed.style.display = "none";
            } else if (category == "plume") {
                flower_showed.style.display = "none";
                plume_showed.style.display = "inline";
                other_showed.style.display = "none";
            } else {
                flower_showed.style.display = "none";
                plume_showed.style.display = "none";
                other_showed.style.display = "inline";

                var attack = main_status.querySelector(".main_attack");
                var er = main_status.querySelector(".main_er");
                var dmgbuff = main_status.querySelector(".main_damagebuff");
                var rate = main_status.querySelector(".main_critrate");
                var dmg = main_status.querySelector(".main_critdamage");

                if (category == "sand") {
                    er.disabled = false;
                    dmgbuff.disabled = true;
                    rate.disabled = true;
                    dmg.disabled = true;
                    attack.selected = true;
                } else if (category == "goblet") {
                    er.disabled = true;
                    dmgbuff.disabled = false;
                    rate.disabled = true;
                    dmg.disabled = true;
                    dmgbuff.selected = true;
                } else if (category == "circlet") {
                    er.disabled = true;
                    dmgbuff.disabled = true;
                    rate.disabled = false;
                    dmg.disabled = false;
                    rate.selected = true;
                } else {
                    alert_error(1);
                }
            }
        });
    }
}
// この下のmain_select(); を消してはいけない
main_select();


// 聖遺物の追加ボタンの制御
document.getElementById("addRowBtn").addEventListener("click", function(event) {
    event.preventDefault();

    // スコアと上位% の表の制御
    var table = document.getElementById("artifact_table").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);
    var cell7 = newRow.insertCell(6);
    var cell8 = newRow.insertCell(7);
    var cell9 = newRow.insertCell(8);
    var cell10 = newRow.insertCell(9);

    cell1.innerHTML = String(table.rows.length);
    cell2.innerHTML =
    `<select onchange="main_select(), set_header()" class="category-select">
        <option value="flower">花</option>
        <option value="plume">羽</option>
        <option value="sand">時計</option>
        <option value="goblet">杯</option>
        <option value="circlet">冠</option>
    </select>`;
    cell3.innerHTML =
    `<span class="flower_showed">HP実数</span>
    <span class="plume_showed" style="display:none">攻撃力実数</span>
    <select onchange="set_header()" class="mein-select other_showed" style="display:none">
        <option value="1" class="main_attack">攻撃力%</option>
        <option value="2">HP%</option>
        <option value="3">防御力%</option>
        <option value="4" class="main_em">元素熟知</option>
        <option value="5" class="main_er">元素チャージ効率%</option>
        <option value="6" class="main_damagebuff">元素・物理ダメージバフ</option>
        <option value="7" class="main_critrate">会心率%</option>
        <option value="8" class="main_critdamage">会心ダメージ%</option>
    </select>`;
    cell4.innerHTML = `<input type="number" class="score-input no-spin" step="0.1" onchange="never_minus(this), calculate_score()">`;
    cell5.innerHTML = `<input type="number" class="score-input no-spin" step="0.1" onchange="never_minus(this), calculate_score()">`;
    cell6.innerHTML = `<input type="number" class="score-input no-spin" step="0.1" onchange="never_minus(this), calculate_score()">`;
    cell7.innerHTML = `<input type="number" class="score-input no-spin" step="0.1" onchange="never_minus(this), calculate_score()">`;
    cell8.innerHTML = '<input type="number" class="score-input no-spin" step="0.1" onchange="never_minus(this)">点';
    cell9.innerHTML = "";
    cell10.innerHTML = "";
    set_status();

    
    // 更新確率の表の制御
    var table2 = document.getElementById("probability_table");
    var headerRow = table2.rows[0];
    var newHeaderCell = document.createElement("th");
    var allartifacts_probability_column = document.getElementById("probability_allartifacts_column");

    newHeaderCell.classList.add("table-artifact");
    newHeaderCell.innerHTML = String(headerRow.cells.length);
    headerRow.insertBefore(newHeaderCell, allartifacts_probability_column);

    var bodyRows = document.getElementById("probability_row");
    var newRowCell = bodyRows.insertCell(bodyRows.cells.length - 1);
    newRowCell.innerHTML = "";
    

    // 周回数の表の制御
    var table3 = document.getElementById("trials_table");
    headerRow = table3.rows[0];
    newHeaderCell = document.createElement("th");
    var artifacts_trials = document.getElementById("trials_allartifacts_column");

    newHeaderCell.classList.add("table-artifact");
    newHeaderCell.innerHTML = String(headerRow.cells.length);
    headerRow.insertBefore(newHeaderCell, artifacts_trials);

    bodyRows = document.getElementById("trials_row");
    var newRowCell = bodyRows.insertCell(bodyRows.cells.length - 1);
    newRowCell.innerHTML = "";

    set_header();
    // この下のmain_select(); を消してはいけない
    main_select();
});


// 聖遺物の削除ボタンの制御
document.getElementById("removeRowBtn").addEventListener("click", function(event) {
    event.preventDefault();

    // スコアと上位% の表の行を1つ削除
    var table = document.getElementById("artifact_table").getElementsByTagName('tbody')[0];
    if (table.rows.length > 1) {
      table.deleteRow(table.rows.length - 1);
    }

    // 更新確率の表と周回数の表の列を1つ削除
    var table2_header = document.getElementById("probability_table").getElementsByTagName("tr")[0];
    var table3_header = document.getElementById("trials_table").getElementsByTagName("tr")[0];
    var table2_row = document.getElementById("probability_table").getElementsByTagName("tr")[1];
    var table3_row = document.getElementById("trials_table").getElementsByTagName("tr")[1];
    if (table2_header.cells.length > 2) {
        table2_header.deleteCell(table2_header.cells.length - 2);
        table2_row.deleteCell(table2_row.cells.length - 2);
    }
    if (table3_header.cells.length > 2) {
        table3_header.deleteCell(table3_header.cells.length - 2);
        table3_row.deleteCell(table3_row.cells.length - 2);
    }
  });


function show_or_hide(){
    // カスタム計算式の制御
    const formula = document.getElementById("multiplierSelect").value;
    const score_formula = document.getElementById("score_formula");
    const score_formula2 = document.getElementById("customizable_score_formula");

    if (formula == 5) {
        score_formula.style.display = "none";
        score_formula2.style.display = "inline";
    } else {
        score_formula.style.display = "inline";
        score_formula2.style.display = "none";
    }


    // 聖遺物の入手方法の制御
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


// 負の値の入力を禁止する
function never_minus(inputElement){
    let inputValue = inputElement.value;
    if (inputValue < 0) {
        inputValue = 0;
    }
    inputElement.value = inputValue;
}

// 100を超える値の入力を禁止する
function never_over100(inputElement) {
    let inputValue = inputElement.value;
    if (inputValue > 100) {
        inputValue = 100;
    }
    inputElement.value = inputValue;
}


// スコア計算式の入力において、高すぎる係数の設定を不可能にする
function never_toobig() {
    let a_multiplier = document.getElementById('a_multiplier');
    let b_multiplier = document.getElementById('b_multiplier');
    let c_multiplier = document.getElementById('c_multiplier');
    let d_multiplier = document.getElementById('d_multiplier');

    let selectA = document.getElementById('status_a');
    let selectB = document.getElementById('status_b');


    if (selectA.value == 4) {
        if (a_multiplier.value > 2.5) {
            a_multiplier.value = 2.5;
        }
    } else {
        if (a_multiplier.value > 10) {
            a_multiplier.value = 10;
        }
    }

    if (selectB.value == 4) {
        if (b_multiplier.value > 2.5) {
            b_multiplier.value = 2.5;
        }
    } else {
        if (b_multiplier.value > 10) {
            b_multiplier.value = 10;
        }
    }

    if (c_multiplier.value > 20) {
        c_multiplier.value = 20;
    }
    if (d_multiplier.value > 10) {
        d_multiplier.value = 10
    }
}


// スコア計算式の入力において、同一のステータスの設定を不可能にする
let selectA = document.getElementById('status_a');
let selectB = document.getElementById('status_b');

updateOptions()
selectA.addEventListener('change', updateOptions);
selectB.addEventListener('change', updateOptions);

function updateOptions() {
    const selectedOptionA = selectA.value;
    const selectedOptionB = selectB.value;
    const optionsA = selectA.querySelectorAll('option');
    const optionsB = selectB.querySelectorAll('option');


    optionsA.forEach(option => {
        if (option.value === selectedOptionB && !(option.value == 0)) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });

    optionsB.forEach(option => {
        if (option.value === selectedOptionA && !(option.value == 0)) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
}


// スコアの自動計算のための入力欄の制御
function set_status() {
    var calculate_score = document.getElementById("calculate_score").checked;
    var table_header = document.getElementById("artifact_table_header");
    var table_rows = document.getElementById("artifact_table_rows");
    var formula = document.getElementById("multiplierSelect").value;

    if (calculate_score) {
        // いったん全て表示しておき、そのあと不要な列を削除する
        table_header.cells[3].style.display = "table-cell";
        table_header.cells[4].style.display = "table-cell";
        table_header.cells[5].style.display = "table-cell";
        table_header.cells[6].style.display = "table-cell";
        for (let i = 0; i < table_rows.rows.length; i++) {
            table_rows.rows[i].cells[3].style.display = "table-cell";
            table_rows.rows[i].cells[4].style.display = "table-cell";
            table_rows.rows[i].cells[5].style.display = "table-cell";
            table_rows.rows[i].cells[6].style.display = "table-cell";
        }

        // 会心率と会心ダメージは、係数が0であれば削除
        let c_multiplier = document.getElementById("c_multiplier").value;
        let d_multiplier = document.getElementById("d_multiplier").value;
        if (c_multiplier == 0) {
            table_header.cells[3].style.display = "none";
            for (let i = 0; i < table_rows.rows.length; i++) {
                table_rows.rows[i].cells[3].style.display = "none";
            }
        }
        if (d_multiplier == 0) {
            table_header.cells[4].style.display = "none";
            for (let i = 0; i < table_rows.rows.length; i++) {
                table_rows.rows[i].cells[4].style.display = "none";
            }
        }

        // ステータスAとステータスBは、なしなら削除、選択されているならそのステータスをヘッダーに表示
        let status_a = 0;
        let status_b = 0;
        if (formula == 0) {
        } else if (formula == 1) {
            status_a = 1;
        } else if (formula == 2) {
            status_a = 1;
            status_b = 4;
        } else if (formula == 3) {
            status_a = 2;
        } else if (formula == 4) {
            status_a = 2;
            status_b = 4;
        } else if (formula == 5) {
            status_a = document.getElementById("status_a").value;
            status_b = document.getElementById("status_b").value;
        }

        if (status_a == 0) {
            table_header.cells[5].style.display = "none";
            for (let i = 0; i < table_rows.rows.length; i++) {
                table_rows.rows[i].cells[5].style.display = "none";
            }
        } else {
            let status_a_name = {1: "攻撃力%", 2: "HP%", 3: "防御力%", 4: "元素熟知", 5: "元素チャージ効率%"}[status_a];
            document.getElementById("status_a_name").innerHTML = `<nobr>${status_a_name}</nobr>`;
        }
        if (status_b == 0) {
            table_header.cells[6].style.display = "none";
            for (let i = 0; i < table_rows.rows.length; i++) {
                table_rows.rows[i].cells[6].style.display = "none";
            }
        } else {
            let status_b_name = {1: "攻撃力%", 2: "HP%", 3: "防御力%", 4: "元素熟知", 5: "元素チャージ効率%"}[status_b];
            document.getElementById("status_b_name").innerHTML = `<nobr>${status_b_name}</nobr>`;
        }

    } else {
        table_header.cells[3].style.display = "none";
        table_header.cells[4].style.display = "none";
        table_header.cells[5].style.display = "none";
        table_header.cells[6].style.display = "none";
        for (let i = 0; i < table_rows.rows.length; i++) {
            table_rows.rows[i].cells[3].style.display = "none";
            table_rows.rows[i].cells[4].style.display = "none";
            table_rows.rows[i].cells[5].style.display = "none";
            table_rows.rows[i].cells[6].style.display = "none";
        }
    }
}
set_status();


// スコアを自動で計算する関数
function calculate_score() {
    var goon = document.getElementById("calculate_score").checked;
    if (goon) {
        // 各ステータスに乗じる係数を決定
        let formula = parseFloat(document.getElementById("multiplierSelect").value);
        let a_multiplier = 1;
        let b_multiplier = 0;
        let c_multiplier = 2;
        let d_multiplier = 1;

        if (formula == 0) {
            a_multiplier = 0;
        } else if (formula == 2 || formula == 4) {
            b_multiplier = 0.25;
        } else if (formula == 5) {
            a_multiplier = parseFloat(document.getElementById("a_multiplier").value) || 0;
            b_multiplier = parseFloat(document.getElementById("b_multiplier").value) || 0;
            c_multiplier = parseFloat(document.getElementById("c_multiplier").value) || 0;
            d_multiplier = parseFloat(document.getElementById("d_multiplier").value) || 0;
        }

        // 各聖遺物に対してスコアを計算し、入力する
        var tableRows = document.querySelectorAll("#artifact_table tbody tr");
        tableRows.forEach(function(row) {
            let status_a = row.cells[5].querySelector("input").value;
            let status_b = row.cells[6].querySelector("input").value;
            let status_c = row.cells[3].querySelector("input").value;
            let status_d = row.cells[4].querySelector("input").value;

            let score = a_multiplier*status_a + b_multiplier*status_b + c_multiplier*status_c + d_multiplier*status_d;
            if (score) {
                row.cells[7].querySelector("input").value = score;
            }
        });
    }
}


// section2 の表の第一行に、"1 攻撃時計" などと表示する（表示しなおす）関数
function set_header() {
    // main_select() 関数の前に実行されると不具合が起こるため、0.05秒待機してから処理を行う
    setTimeout(function(){
        var headerRow1 = document.getElementById("probability_table_header");
        var headerRow2 = document.getElementById("trials_table_header");
        var category_selects = document.getElementsByClassName("category-select");
        var mainstatus_selects = document.getElementsByClassName("mein-select");

        for (let i = 0; i < category_selects.length; i++) {
            let main_status = "";
            let category;
            if (category_selects[i].value == "flower") {
                category = "花";
            } else if (category_selects[i].value == "plume") {
                category = "羽";

            } else {
                if (category_selects[i].value == "sand") {
                    category = "時計";
                } else if (category_selects[i].value == "goblet") {
                    category = "杯";
                } else if (category_selects[i].value == "circlet") {
                    category = "冠";
                } else {
                    alert_error(2);
                }

                // ステータスは 0: なし, 1: 攻撃力%, 2: HP%, 3: 防御力%, 4: 元素熟知, 5: 元素チャージ効率,
                // 6: 元素・物理ダメージバフ, 7: 会心率, 8: 会心ダメージ
                if (mainstatus_selects[i].value == 1) {
                    main_status = "攻撃";
                } else if (mainstatus_selects[i].value == 2) {
                    main_status = "HP";
                } else if (mainstatus_selects[i].value == 3) {
                    main_status = "防御";
                } else if (mainstatus_selects[i].value == 4) {
                    main_status = "熟知";
                } else if (mainstatus_selects[i].value == 5) {
                    main_status = "元チャ";
                } else if (mainstatus_selects[i].value == 6) {
                    main_status = "";
                } else if (mainstatus_selects[i].value == 7) {
                    main_status = "率";
                } else if (mainstatus_selects[i].value == 8) {
                    main_status = "ダメ";
                } else {
                    alert_error(3);
                }
            }
            headerRow1.cells[i].innerHTML = `<nobr><input type="checkbox" class="checkbox_input" onchange="change_below()" checked>${String(i+1) + " " + main_status + category}</nobr>`;
            headerRow2.cells[i].innerHTML = `<nobr><input type="checkbox" class="checkbox_input" onchange="change_above()" checked>${String(i+1) + " " + main_status + category}</nobr>`;
        }
    },50);
}
set_header();


// セクション2の2箇所のチェックボックスについて、同じ聖遺物どうしの入力状態をリンクさせる
function change_below() {
    let above_header = document.getElementById("probability_table_header");
    let below_header = document.getElementById("trials_table_header");

    for (let i = 0; i < above_header.cells.length - 1; i++) {
        let above_checkbox = above_header.cells[i].querySelector("input");
        let below_checkbox = below_header.cells[i].querySelector("input");

        if (above_checkbox.checked) {
            below_checkbox.checked = true;
        } else {
            below_checkbox.checked = false;
        }
    }
}

function change_above() {
    let above_header = document.getElementById("probability_table_header");
    let below_header = document.getElementById("trials_table_header");

    for (let i = 0; i < below_header.cells.length - 1; i++) {
        let above_checkbox = above_header.cells[i].querySelector("input");
        let below_checkbox = below_header.cells[i].querySelector("input");

        if (below_checkbox.checked) {
            above_checkbox.checked = true;
        } else {
            above_checkbox.checked = false;
        }
    }
}


// 行列の積を計算する関数
function matrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}


// スコア計算式と種類、産地、スコアから上位% を取得するテーブルを返す関数
// https://www.hoyolab.com/article/23047502 を参照のこと
// 以下において聖遺物の「種類」（英: "category"）とは、聖遺物の花、羽、時計、杯、および冠の5つの属性のことを指す

// a0, b0, c0, d0 はステータスA, B, C, D のスコア基礎値
// セット効果や種類、メインステータスの確率は考慮していない
// 出力される二次元配列は、縦軸(先に指定する方)がスコア(単位は s = 1.36/7 点)、横軸(後に指定する方)が種類と産地
// 横軸は['flower(domain)', 'flower(box)', 'a-sand(domain)', 'a-sand(box)',
//       'b-sand(domain)', 'b-sand(box)', 'p-sand(domain)', 'p-sand(box)',
//       'goblet(domain)', 'goblet(box)', 'c-circlet(domain)', 'c-circlet(box)',
//       'd-circlet(domain)', 'd-circlet(box)']

function get_top(a0, b0, c0, d0) {
    // strengtheningArray を取得
    // strengtheningArray は横軸に聖遺物の種類と産地、縦軸に聖遺物の最終的なスコアをとり、対応する交点にその確率を格納する配列
    // 読み込むcsvファイルは"artifact probability calculator.ver3.py"（未公開）を用いて作成した

    // console.log("start calculating...")

    // https://kasumiblog.org/javascript-csv-array/ からコードを引用
    let csv = new XMLHttpRequest();
    csv.open("GET", "strengtheningArray.csv", false);

    try {
        csv.send(null);
    } catch (err) {
        alert_error(4);
    }

    let strengtheningArray = [];
    let lines = csv.responseText.split(/\r\n|\n/);
    for (let i = 0; i < lines.length; ++i) {
        let cells = lines[i].split(",");
        if (cells.length != 1) {
            strengtheningArray.push(cells.map(Number));
        }
    }
    // console.log(strengtheningArray)


    // p[n][s] は 0, 1, 2, 3 の中から和がsになるようにn個とる場合の数
    let p = [];
    for (let n = 0; n < 8; n++) {
        let q = new Array(3 * n + 1).fill(0);
        for (let i = 0; i < Math.pow(4, n); i++) {
            let binary = i.toString(4).padStart(n, '0');
            let sum = 0;
            for (let j = 0; j < binary.length; j++) {
                sum += parseInt(binary[j]);
            }
            q[sum]++;
        }
        p.push(q);
    }
    // console.log(p);


    // iniSlots は聖遺物の初めのステータスの内容
    const iniSlots = [
        [1, 1, 1, 1], [1, 1, 1, 0], [1, 1, 0, 1], [1, 1, 0, 0],
        [1, 0, 1, 1], [1, 0, 1, 0], [1, 0, 0, 1], [1, 0, 0, 0],
        [0, 1, 1, 1], [0, 1, 1, 0], [0, 1, 0, 1], [0, 1, 0, 0],
        [0, 0, 1, 1], [0, 0, 1, 0], [0, 0, 0, 1], [0, 0, 0, 0]
    ];


    // ultSlots は聖遺物の最終的なステータスの内容
    const ultSlots = [];
    for (const [a, b, c, d] of iniSlots) {
        for (let x = 0; x <= 5; x++) {
            for (let y = 0; y <= 5; y++) {
                for (let z = 0; z <= 5; z++) {
                    for (let w = 0; w <= 5; w++) {
                        for (let i of [4, 5]) {
                            if (x + y + z + w === i) {
                                const content = [a * (x + 1), b * (y + 1), c * (z + 1), d * (w + 1)];
                                if (!ultSlots.some(slot => slot.every((val, idx) => val === content[idx]))) {
                                    ultSlots.push(content);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // console.log(ultSlots);


    // scoreArray を作成
    // scoreArray は横軸に聖遺物の最終的なステータス、縦軸に聖遺物のスコアをとり、対応する交点にその確率を格納する配列
    const statusList = [a0, b0, c0, d0];
    const maax = Math.ceil((Math.max(...statusList) * 5 + a0 + b0 + c0 + d0) * 10) + 1;
    const scoreArray = Array.from({ length: maax }, () => Array(ultSlots.length).fill(0));

    for (let x = 0; x < ultSlots.length; x++) {
        const [a, b, c, d] = ultSlots[x];
        const mainScore = 7 * (a0*a + b0*b + c0*c + d0*d);

        for (let i = 0; i <= 3 * a; i++) {
            for (let j = 0; j <= 3 * b; j++) {
                for (let k = 0; k <= 3 * c; k++) {
                    for (let l = 0; l <= 3 * d; l++) {
                        const subScore = (a0*i + b0*j + c0*k + d0*l);
                        const roundScore = Math.round(mainScore + subScore);
                        scoreArray[roundScore][x] += p[a][i] * p[b][j] * p[c][k] * p[d][l] / Math.pow(4, a+b+c+d);
                    }
                }
            }
        }
    }
    // console.log(scoreArray);


    // scoreArray を作成
    // scoreArray は、横軸に聖遺物種類と産地、縦軸に聖遺物の上位%をとり、対応する交点にその確率を格納する配列
    let data_table = matrixMultiply(scoreArray, strengtheningArray);
    for (let j = 2; j <= data_table.length; j++) {
        for (let i = 0; i < data_table[0].length; i++) {
            data_table[data_table.length-j][i] += data_table[data_table.length-j + 1][i];
        }
    }
    // console.log(data_table);

    // console.log("finished calculating")
    // console.log(data_table.length)
    return data_table;
}


// 聖遺物の上位% を保存する配列の作成
var domain_tops;
var box_tops;


// 聖遺物の上位%と評価を計算する関数
function calculate_top(){
    domain_tops = [];
    box_tops = [];

    // スコア基礎値の決定、data_table の作成
    let formula = parseFloat(document.getElementById("multiplierSelect").value);

    // ステータスは 0: なし, 1: 攻撃力%, 2: HP%, 3: 防御力%, 4: 元素熟知, 5: 元素チャージ効率,
    // 6: 元素・物理ダメージバフ, 7: 会心率, 8: 会心ダメージ
    // 治療効果バフは扱わない
    let status_a;
    let status_b;

    let a_multiplier = 1;
    let b_multiplier = 1;
    let c_multiplier = 2;
    let d_multiplier = 1;

    let a0 = 0;
    let b0 = 0;
    let c0 = 4;
    let d0 = 4;

    if (formula == 0) {
        status_a = 0;
        status_b = 0;
    } else if (formula == 1) {
        status_a = 1;
        status_b = 0;
    } else if (formula == 2) {
        status_a = 1;
        status_b = 4;
        b_multiplier = 1/4;
    } else if (formula == 3) {
        status_a = 2;
        status_b = 0;
    } else if (formula == 4) {
        status_a = 2;
        status_b = 4;
        b_multiplier = 1/4;
    
    } else {
        status_a = parseFloat(document.getElementById("status_a").value);
        status_b = parseFloat(document.getElementById("status_b").value);
        
        // 各ステータスに乗じる係数の入力欄が空欄のとき、0として認識し、また自動で0を入力する
        a_multiplier = parseFloat(document.getElementById("a_multiplier").value) || 0;
        b_multiplier = parseFloat(document.getElementById("b_multiplier").value) || 0;
        c_multiplier = parseFloat(document.getElementById("c_multiplier").value) || 0;
        d_multiplier = parseFloat(document.getElementById("d_multiplier").value) || 0;

        if (a_multiplier === 0) {
            document.getElementById("a_multiplier").value = 0;
        }
        if (b_multiplier === 0) {
            document.getElementById("b_multiplier").value = 0;
        }
        if (c_multiplier === 0) {
            document.getElementById("c_multiplier").value = 0;
        }
        if (d_multiplier === 0) {
            document.getElementById("d_multiplier").value = 0;
        }
    }

    if (status_a == 1) {
        a0 = 3 * a_multiplier;
    } else if (status_a == 2) {
        a0 = 3 * a_multiplier;
    } else if (status_a == 3) {
        a0 = (15/4) * a_multiplier;
    } else if (status_a == 4) {
        a0 = 12 * a_multiplier;
    } else if (status_a == 5) {
        a0 = (10/3) * a_multiplier;
    } else if (status_a == 0) {
        a0 = 0;
    } else {
        alert_error(5);
    }

    if (status_b == 1) {
        b0 = 3 * b_multiplier;
    } else if (status_b == 2) {
        b0 = 3 * b_multiplier;
    } else if (status_b == 3) {
        b0 = (15/4) * b_multiplier;
    } else if (status_b == 4) {
        b0 = 12 * b_multiplier;
    } else if (status_b == 5) {
        b0 = (10/3) * b_multiplier;
    } else if (status_b == 0) {
        b0 = 0;
    } else {
        alert_error(6);
    }

    c0 = 2 * c_multiplier;
    d0 = 4 * d_multiplier;
    // console.log(a0, b0, c0, d0)

    const data_table = get_top(a0, b0, c0, d0);


    // artifact_table の各列に対して上位% と評価を求める
    var tableRows = document.querySelectorAll("#artifact_table tbody tr");
    tableRows.forEach(function(row) {
        var category_select = row.cells[1].querySelector("select");
        var main_status_select = row.cells[2].querySelector("select");

        if (category_select) {
            let category = category_select.value;

            // data_table の読み込む場所とメインステータスが一致する確率を決定
            let type;
            let main_p;
            
            if (category == "flower" || category == "plume") {
                type = 0;
                main_p = 1;

            } else if (main_status_select) {
                let main_status = main_status_select.value;
                
                if (main_status == 6) {
                    type = 8;
                } else if (main_status == 7) {
                    type = 10;
                } else if (main_status == 8) {
                    type = 12;
                } else if (main_status == status_a) {
                    type = 2;
                } else if (main_status == status_b) {
                    type = 4;
                } else {
                    type = 6;
                }

                // メインステータスが一致する確率は
                // https://genshin-impact.fandom.com/wiki/Artifact/Distribution を参照のこと
                if (category == "sand") {
                    if (main_status == 1 || main_status == 3) {
                        main_p = 1333/5000;
                    } else if (main_status == 2) {
                        main_p = 667/2500;
                    } else if (main_status == 4 || main_status == 5) {
                        main_p = 1/10;
                    }

                } else if (category == "goblet") {
                    if (main_status == 6) {
                        main_p = 1/20;
                    } else if (main_status == 1 || main_status == 2) {
                        main_p = 77/400;
                    } else if (main_status == 3) {
                        main_p = 19/100;
                    } else if (main_status == 4) {
                        main_p = 1/40;
                    }
                
                // 治療効果バフは扱わない
                } else if (category == "circlet") {
                    if (main_status == 7 || main_status == 8) {
                        main_p = 1/10;
                    } else if (main_status == 1 || main_status == 2 || main_status == 3) {
                        main_p = 11/50;
                    } else if (main_status == 4) {
                        main_p = 1/25;
                    }
                } else {
                    alert_error(7);
                }
            }
            if (!main_p) {alert_error(8);}


            // 聖遺物の上位% を産地別で求める
            // この上位% は聖遺物のメインステータスを考慮するが、セット効果や種類の確率は考慮しない
            let domain_top = 0;
            let box_top = 0;
            let score = row.cells[row.cells.length-3].querySelector("input").value;


            // 実現不可能なほど高すぎるスコアの場合は上位0% とする
            // スコアの入力欄に0と入力されていれば「メインステータスは一致しているがスコアは0」の聖遺物とみなす
            // スコアの入力欄が空欄であればその聖遺物は上位100% とする
            if (score == "") {
                domain_top = 1;
                box_top = 1;
            } else {
                try {
                    domain_top = main_p * data_table[Math.round(score * (700/136))][type];
                    box_top = main_p * data_table[Math.round(score * (700/136))][type + 1];
                } catch {}
            }


            // 求めた上位% を関数外の配列に保存
            domain_tops.push(domain_top);
            box_tops.push(box_top);


            // html に秘境産と廻聖産の上位% の平均値とそれをもとにした評価を表示
            row.cells[row.cells.length-2].innerHTML = `上位<nobr>${(100 * (domain_top/2 + box_top/2)).toPrecision(3)}%</nobr>`;
            row.cells[row.cells.length-1].innerHTML = `${caluclate_rank(domain_top/2 + box_top/2)}`;
        }
    });


    // 上位% を計算後、表を右側にスクロールさせる
    var tableContainer = document.querySelector('.tap_to_scrollright');
    tableContainer.scrollLeft = 1000;
}


// 聖遺物の上位% から評価を求める関数
// 評価基準はimage.png を参照のこと
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
    return rank;
}


// 更新確率と周回数を計算する関数
// https://www.hoyolab.com/article/25100475 を参照のこと
function calculate_probability(){
    calculate_top();
    let probability_row = document.getElementById("probability_row");
    let trials_row = document.getElementById("trials_row");

    // 公式p = 1 - (1 - a)^(kn) において、p はprobability, (1 - a) はbase, k はmultiplier, n はtrial_input
    const getting_way = document.getElementById("getting-way").value;
    const strong_rate = document.getElementById("strong-rate").value/100;
    const probability = document.getElementById("getting_probability").value/100;
    const trial_input = document.getElementById("trials").value;


    // 個々の聖遺物についての分析

    // base はいずれか一つを更新する確率におけるp = 1 - (1 - a)^(kn) の(1 - a) に対応する
    // get_base() に関しては後に定義
    let multiplier;
    for (let i = 0; i < domain_tops.length; i++) {
        let base = get_base(domain_tops[i], box_tops[i], getting_way, strong_rate);

        if (getting_way === "domain" || getting_way === "both") {
            multiplier = 2.14;
        } else if (getting_way === "box") {
            multiplier = 1 / (3 - strong_rate);
        } else {
            alert_error(9);
        }

        // より強い聖遺物を獲得する確率を計算
        // p = 1 - (1 - a)^(kn)
        let p = 1 - base**(multiplier*trial_input);
        probability_row.cells[i].innerHTML = `<nobr>${(100*p).toPrecision(3)}%</nobr>`;

        // 周回数を計算
        // 最低限必要な周回数のため、小数第一位で切り上げして表示
        // n = log(1 - p) / (k * log(1 - a))
        let trials;
        if (base == 1 || probability == 1) {
            trials = "無限";
        } else {
            trials = Math.ceil(Math.log(1 - probability) / (multiplier * Math.log(base)));
        }
        trials_row.cells[i].innerHTML = `${trials}`;
    }


    // 複数の聖遺物についての分析

    // 互いに排反な、つまり種類またはメインステータスが異なる聖遺物を格納するオブジェクトを用意
    const bases = {flower: 1, plume: 1, atk_sand: 1, hp_sand: 1, def_sand: 1, em_sand: 1, er_sand: 1,
                   atk_goblet: 1, hp_goblet: 1, def_goblet: 1, em_goblet: 1, dmgbuff_goblet: 1,
                   atk_circlet: 1, hp_circlet: 1, def_circlet: 1, em_circlet: 1, rate_circlet: 1, dmg_circlet: 1};

    var tableRows = document.querySelectorAll("#artifact_table tbody tr");
    var tablecells = document.querySelectorAll("#probability_table thead tr th");


    for (let i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        var category = row.cells[1].querySelector("select").value;
        var main_status = row.cells[2].querySelector("select").value;
        var check = tablecells[i].querySelector("input").checked;
        var base = get_base(domain_tops[i], box_tops[i], getting_way, strong_rate)

        // チェックのついた各聖遺物を、用意したオブジェクトの指定した場所に入れる
        if (category == "flower") {
            if (check && bases.flower > base) {bases.flower = base;}
        } else if (category == "plume") {
            if (check && bases.plume > base) {bases.plume = base;}
        } else if (category == "sand") {
            if (main_status == 1) {
                if (check && bases.atk_sand > base) {bases.atk_sand = base;}
            } else if (main_status == 2) {
                if (check && bases.hp_sand > base) {bases.hp_sand = base;}
            } else if (main_status == 3) {
                if (check && bases.def_sand > base) {bases.def_sand = base;}
            } else if (main_status == 4) {
                if (check && bases.em_sand > base) {bases.em_sand = base;}
            } else if (main_status == 5) {
                if (check && bases.er_sand > base) {bases.er_sand = base;}
            } else {
                alert_error(10);
            }
        } else if (category == "goblet") {
            if (main_status == 1) {
                if (check && bases.atk_goblet > base) {bases.atk_goblet = base;}
            } else if (main_status == 2) {
                if (check && bases.hp_goblet > base) {bases.hp_goblet = base;}
            } else if (main_status == 3) {
                if (check && bases.def_goblet > base) {bases.def_goblet = base;}
            } else if (main_status == 4) {
                if (check && bases.em_goblet > base) {bases.em_goblet = base;}
            } else if (main_status == 6) {
                if (check && bases.dmgbuff_goblet > base) {bases.dmgbuff_goblet = base;}
            } else {
                alert_error(11);
            }
        } else if (category == "circlet") {
            if (main_status == 1) {
                if (check && bases.atk_circlet > base) {bases.atk_circlet = base;}
            } else if (main_status == 2) {
                if (check && bases.hp_circlet > base) {bases.hp_circlet = base;}
            } else if (main_status == 3) {
                if (check && bases.def_circlet > base) {bases.def_circlet = base;}
            } else if (main_status == 4) {
                if (check && bases.em_circlet > base) {bases.em_circlet = base;}
            } else if (main_status == 7) {
                if (check && bases.rate_circlet > base) {bases.rate_circlet = base;}
            } else if (main_status == 8) {
                if (check && bases.dmg_circlet > base) {bases.dmg_circlet = base;}
            } else {
                alert_error(12);
            }
        } else {
            alert_error(13);
        }
    }

    // （少々煩雑な）計算をすると、いずれか1つの聖遺物を入手する確率計算におけるbase は、聖遺物の入手方法に関わらず、結果的に各聖遺物のbase の積としてよいことが分かる
    base = 1;
    Object.keys(bases).forEach(function (key) {
        base *= bases[key];
    });


    // より強い聖遺物を獲得する確率を計算
    // p = 1 - (1 - a)^(kn)
    let p = 1 - base**(multiplier*trial_input);
    probability_row.cells[probability_row.cells.length - 1].innerHTML = `<nobr>${(100*p).toPrecision(3)}%</nobr>`;

    // 周回数を計算
    // 最低限必要な周回数のため、小数第一位で切り上げして表示
    // n = log(1 - p) / (k * log(1 - a))
    let trials;
    if (base == 1 || probability == 1) {
        trials = "無限";
    } else {
        trials = Math.ceil(Math.log(1 - probability) / (multiplier * Math.log(base)));
    }
    trials_row.cells[trials_row.cells.length - 1].innerHTML = `${trials}`;
}


// 更新確率と周回数の計算において用いるbase を計算する関数
function get_base(domain_top, box_top, birthplace, strong_rate) {
    if (birthplace == "domain") {
        return 1 - domain_top/10;
    } else if (birthplace == "box") {
        return 1 - box_top/5;
    } else if (birthplace == "both") {
        return (1 - domain_top/10) * (1 - box_top/5)**(strong_rate/(3 - strong_rate));
    } else {
        alert_error(14);
    }
}


// ファイルの読み込み失敗や条件分岐の失敗が起こった際にアラートする
function alert_error(number) {
    alert(`予期せぬエラーが発生しました。ページを読み込みなおしてください。お手数ですが、制作者までご連絡くださるとうれしいです。エラー番号: ${number}`);
}
