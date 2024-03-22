function show_or_hide(){
    // その他の計算式の制御
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


function never_minus(inputElement){
    let inputValue = inputElement.value;
    if (inputValue < 0) {
        inputValue = 0;
    }
    inputElement.value = inputValue;
}

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
        d_multiplier.value = 10}
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


// スコア計算式と部位、産地、スコアから上位% を取得するテーブルを返す関数
// https://www.hoyolab.com/article/23047502 を参照のこと

// a0, b0, c0, d0 はステータスA, B, C, D のスコア基礎値
// セット効果や部位、メインステータスの確率は考慮していない
// 出力される二次元配列は、縦軸(先に指定する方)がスコア(単位は s = 1.36/7 点)、横軸(後に指定する方)が部位と産地
// 横軸は['flower(domain)', 'flower(box)', 'a-sand(domain)', 'a-sand(box)',
//       'b-sand(domain)', 'b-sand(box)', 'p-sand(domain)', 'p-sand(box)',
//       'goblet(domain)', 'goblet(box)', 'c-circlet(domain)', 'c-circlet(box)',
//       'd-circlet(domain)', 'd-circlet(box)']

function get_top(a0, b0, c0, d0) {
    // strengtheningArray を取得
    // strengtheningArray は横軸に聖遺物の部位と産地、縦軸に聖遺物の最終的なスコアをとり、対応する交点にその確率を格納する配列
    // 読み込むcsvファイルは"artifact probability calculator.ver3.py" を用いて作成した

    // console.log("start calculating...")

    // https://kasumiblog.org/javascript-csv-array/ からコードを引用
    let csv = new XMLHttpRequest();
    csv.open("GET", "strengtheningArray.csv", false);

    try {
    csv.send(null);
    } catch (err) {
    alert("もしもこの文章が見えてしまったら、お手数ですがご連絡くださるとうれしいです。");
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
    // scoreArray は、横軸に聖遺物の部位と産地、縦軸に聖遺物の上位%をとり、対応する交点にその確率を格納する配列
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


// 聖遺物の上位% を保存するオブジェクトの作成
const tops = {};


// 聖遺物の上位%と評価を計算
function calculate_top(){
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
    } else {
        a0 = 0;
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
    } else {
        b0 = 0;
    }

    c0 = 2 * c_multiplier;
    d0 = 4 * d_multiplier;
    // console.log(a0, b0, c0, d0)

    const data_table = get_top(a0, b0, c0, d0);


    // data_table の読み込む場所を決定
    let sand_type;
    let goblet_type;
    let circlet_type;

    let sand_main = parseFloat(document.getElementById("sand_main").value);
    let goblet_main = parseFloat(document.getElementById("goblet_main").value);
    let circlet_main = parseFloat(document.getElementById("circlet_main").value);


    if (sand_main == status_a) {
        sand_type = 2;
    } else if (sand_main == status_b) {
        sand_type = 4;
    } else {
        sand_type = 6;
    }

    if (goblet_main == 6) {
        goblet_type = 8;
    } else if (goblet_main == status_a) {
        goblet_type = 2;
    } else if (goblet_main == status_b) {
        goblet_type = 4;
    } else {
        goblet_type = 6
    }

    if (circlet_main == 7) {
        circlet_type = 10;
    } else if (circlet_main == 8) {
        circlet_type = 12;
    } else if (circlet_main == status_a) {
        circlet_type = 2;
    } else if (circlet_main == status_b) {
        circlet_type = 4;
    } else {
        circlet_type = 6;
    }


    // メインステータスが一致する確率を求める
    // https://genshin-impact.fandom.com/wiki/Artifact/Distribution を参照のこと
    let sand_main_p;
    let goblet_main_p;
    let circlet_main_p;

    if (sand_main == 1 || sand_main == 3) {
        sand_main_p = 1333/5000;
    } else if (sand_main == 2) {
        sand_main_p = 667/2500;
    } else if (sand_main == 4 || sand_main == 5) {
        sand_main_p = 1/10;
    }

    if (goblet_main == 6) {
        goblet_main_p = 1/20;
    } else if (goblet_main == 1 || goblet_main == 2) {
        goblet_main_p = 77/400;
    } else if (goblet_main == 3) {
        goblet_main_p = 19/100;
    } else if (goblet_main == 4) {
        goblet_main_p = 1/40;
    }

    // 治療効果バフは扱わない
    if (circlet_main == 7 || circlet_main == 8) {
        circlet_main_p = 1/10;
    } else if (circlet_main == 1 || circlet_main == 2 || circlet_main == 3) {
        circlet_main_p = 11/50;
    } else if (circlet_main == 4) {
        circlet_main_p = 1/25;
    }


    // 聖遺物の上位% を産地別で求める
    // この上位% は聖遺物のメインステータスを考慮するが、セット効果や部位の確率は考慮しない
    let flower_domain_top = 0;
    let flower_box_top = 0;
    let plume_domain_top = 0;
    let plume_box_top = 0;
    let sand_domain_top = 0;
    let sand_box_top = 0;
    let goblet_domain_top = 0;
    let goblet_box_top = 0;
    let circlet_domain_top = 0;
    let circlet_box_top = 0;

    let flower_score = document.getElementById('flower_score').value;
    let plume_score = document.getElementById('plume_score').value;
    let sand_score = document.getElementById('sand_score').value;
    let goblet_score = document.getElementById('goblet_score').value;
    let circlet_score = document.getElementById('circlet_score').value;


    // 実現不可能なほど高すぎるスコアの入力を想定
    // 先に上位% として0を入れ、例外入力がなければ上書きし、例外入力があれば何もしない
    try {
        flower_domain_top = data_table[Math.round(flower_score * (700/136))][0];
        flower_box_top = data_table[Math.round(flower_score * (700/136))][1];
    } catch {}
    
    try {
        plume_domain_top = data_table[Math.round(plume_score * (700/136))][0];
        plume_box_top = data_table[Math.round(plume_score * (700/136))][1];
    } catch{}

    if (sand_score == "") {
        sand_domain_top = 1;
        sand_box_top = 1;
    } else {
        try {
            sand_domain_top = sand_main_p * data_table[Math.round(sand_score * (700/136))][sand_type];
            sand_box_top = sand_main_p * data_table[Math.round(sand_score * (700/136))][sand_type + 1];
        } catch {}
    }

    if (goblet_score == "") {
        goblet_domain_top = 1;
        goblet_box_top = 1;
    } else {
        try {
            goblet_domain_top = goblet_main_p * data_table[Math.round(goblet_score * (700/136))][goblet_type];
            goblet_box_top = goblet_main_p * data_table[Math.round(goblet_score * (700/136))][goblet_type + 1];
        } catch {}
    }

    if (circlet_score == "") {
        circlet_domain_top = 1;
        circlet_box_top = 1;
    } else {
        try {
            circlet_domain_top = circlet_main_p * data_table[Math.round(circlet_score * (700/136))][circlet_type];
            circlet_box_top = circlet_main_p * data_table[Math.round(circlet_score * (700/136))][circlet_type + 1];
        } catch {}
    }


    // 求めた上位% を関数外のオブジェクトに保存
    tops.flower_domain = flower_domain_top;
    tops.flower_box = flower_box_top;
    tops.plume_domain = plume_domain_top;
    tops.plume_box = plume_box_top;
    tops.sand_domain = sand_domain_top;
    tops.sand_box = sand_box_top;
    tops.goblet_domain = goblet_domain_top;
    tops.goblet_box = goblet_box_top;
    tops.circlet_domain = circlet_domain_top;
    tops.circlet_box = circlet_box_top;


    // html に秘境産と廻聖産の上位% の平均値を上位% として表示
    document.getElementById('flower_top').innerHTML = `<p>上位${(100 * (tops.flower_domain/2 + tops.flower_box/2)).toPrecision(3)}%</p>`;
    document.getElementById('plume_top').innerHTML = `<p>上位${(100 * (tops.plume_domain/2 + tops.plume_box/2)).toPrecision(3)}%</p>`;
    document.getElementById('sand_top').innerHTML = `<p>上位${(100 * (tops.sand_domain/2 + tops.sand_box/2)).toPrecision(3)}%</p>`;
    document.getElementById('goblet_top').innerHTML = `<p>上位${(100 * (tops.goblet_domain/2 + tops.goblet_box/2)).toPrecision(3)}%</p>`;
    document.getElementById('circlet_top').innerHTML = `<p>上位${(100 * (tops.circlet_domain/2 + tops.circlet_box/2)).toPrecision(3)}%</p>`;


    // html に評価を表示
    document.getElementById('flower_rank').innerHTML = `<p>${caluclate_rank(tops.flower_domain/2 + tops.flower_box/2)}</p>`;
    document.getElementById('plume_rank').innerHTML = `<p>${caluclate_rank(tops.plume_domain/2 + tops.plume_box/2)}</p>`;
    document.getElementById('sand_rank').innerHTML = `<p>${caluclate_rank(tops.sand_domain/2 + tops.sand_box/2)}</p>`;
    document.getElementById('goblet_rank').innerHTML = `<p>${caluclate_rank(tops.goblet_domain/2 + tops.goblet_box/2)}</p>`;
    document.getElementById('circlet_rank').innerHTML = `<p>${caluclate_rank(tops.circlet_domain/2 + tops.circlet_box/2)}</p>`;


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


// 更新確率と周回数を計算
function calculate_probability(){
    calculate_top();
    const getting_way = document.getElementById("getting-way").value;
    const strong_rate = document.getElementById("strong-rate").value/100;
    const probability = document.getElementById("getting_probability").value/100;
    const trial_input = document.getElementById("trials").value;

    // 公式p = 1 - (1 - a)^(kn) において、p はprobability, (1 - a) は(a name of artifact's category)_top, k はmultiplier, n はtrial_input
    let flower_top;
    let plume_top;
    let sand_top;
    let goblet_top;
    let circlet_top;

    let multiplier;


    if (getting_way === "domain") {
        flower_top = 1 - tops.flower_domain / 10;
        plume_top = 1 - tops.plume_domain / 10;
        sand_top = 1 - tops.sand_domain / 10;
        goblet_top = 1 - tops.goblet_domain / 10;
        circlet_top = 1 - tops.circlet_domain / 10;
        multiplier = 2.14;

    } else if (getting_way === "strong") {
        flower_top = 1 - tops.flower_box / 5;
        plume_top = 1 - tops.plume_box / 5;
        sand_top = 1 - tops.sand_box / 5;
        goblet_top = 1 - tops.goblet_box / 5;
        circlet_top = 1 - tops.circlet_box / 5;
        multiplier = 1 / (3 - strong_rate);

    } else {
        flower_top = (1 - tops.flower_domain / 10) * (1 - tops.flower_box / 5) ** (strong_rate/(3 - strong_rate));
        plume_top = (1 - tops.plume_domain / 10) * (1 - tops.plume_box / 5) ** (strong_rate/(3 - strong_rate));
        sand_top = (1 - tops.sand_domain / 10) * (1 - tops.sand_box / 5) ** (strong_rate/(3 - strong_rate));
        goblet_top = (1 - tops.goblet_domain / 10) * (1 - tops.goblet_box / 5) ** (strong_rate/(3 - strong_rate));
        circlet_top = (1 - tops.circlet_domain / 10) * (1 - tops.circlet_box / 5) ** (strong_rate/(3 - strong_rate));
        multiplier = 2.14;
    }

    // （少々煩雑な）計算をすると、聖遺物の厳選方法に関わらず、結果的に下のように定めてよいことが分かる
    // artifact_top はいずれか一つを更新する確率におけるp = 1 - (1 - a)^(kn) の(1 - a) に対応する
    let artifact_top = flower_top * plume_top * sand_top * goblet_top * circlet_top;


    // より強い聖遺物を獲得する確率を計算
    // p = 1 - (1 - a)^(kn)
    document.getElementById("flower_probability").innerHTML = `<p>${(100*(1 - flower_top**(multiplier*trial_input))).toPrecision(3)}%</p>`;
    document.getElementById("plume_probability").innerHTML = `<p>${(100*(1 - plume_top**(multiplier*trial_input))).toPrecision(3)}%</p>`;
    document.getElementById("sand_probability").innerHTML = `<p>${(100*(1 - sand_top**(multiplier*trial_input))).toPrecision(3)}%</p>`;
    document.getElementById("goblet_probability").innerHTML = `<p>${(100*(1 - goblet_top**(multiplier*trial_input))).toPrecision(3)}%</p>`;
    document.getElementById("circlet_probability").innerHTML = `<p>${(100*(1 - circlet_top**(multiplier*trial_input))).toPrecision(3)}%</p>`;
    document.getElementById("artifact_probability").innerHTML = `<p>${(100*(1 - artifact_top**(multiplier*trial_input))).toPrecision(3)}%</p>`;


    // 周回数を計算

    document.getElementById("flower_trials").innerHTML = `<p>${trials(flower_top, probability, multiplier)}</p>`;
    document.getElementById("plume_trials").innerHTML = `<p>${trials(plume_top, probability, multiplier)}</p>`;
    document.getElementById("sand_trials").innerHTML = `<p>${trials(sand_top, probability, multiplier)}</p>`;
    document.getElementById("goblet_trials").innerHTML = `<p>${trials(goblet_top, probability, multiplier)}</p>`;
    document.getElementById("circlet_trials").innerHTML = `<p>${trials(circlet_top, probability, multiplier)}</p>`;
    document.getElementById("artifact_trials").innerHTML = `<p>${trials(artifact_top, probability, multiplier)}</p>`;
}


// 一定確率でより強い聖遺物を獲得するために必要な秘境の周回数を計算する関数
// 最低限必要な周回数のため、小数第一位で切り上げして表示
// n = log(1 - p) / (k * log(1 - a))
// b = 1 - a
function trials(b, p, k) {
    if (b == 1 || p == 1) {
        return "無限";
    } else {
        return Math.ceil(Math.log(1 - p) / (k * Math.log(b)));
    }    
}
