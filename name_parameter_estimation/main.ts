/**
 * 2024/08/13 現在、バート人名は 14 個生成されている。
 * 父名と子名を合わせて 28 個、「名前の確率分布」から乱択されたのである。
 * 
 * さて、その内訳は
 * - 4 回: kádan 
 * - 3 回: korúṣam
 * - 2 回: bániwaim, bánim, ághim (3 種)
 * - 1 回: zíṣom, eghin, ṣádhosammá, aghauṭawaim, woghitam, epam, ádhín, woghitaim, záwaim, rúkasam, dílitam, náḷawaim, cáwaṭaim, íditaim, rohatam (15 種)
 * 
 * さて、「順位と出現率」を log-log plot にすると、
 * まあ雑に「最初の方は傾きが小さめの負の直線、途中から傾きが大き目の負の直線」といった感じになることが知られているらしい。
 * ということで、これを折れ線で近似したときの折れ目の x 座標を U とでもしておく。
 * グラフの上下方向への正規化は後で考えればいいので、(U,0) を通るようにして、
 * y = (x<U) ? V * (U-x) : W * (U-x)
 * という関係式にしておけばいい。
 *  */

function get_env(props: { cutoff_rank: number, popular_slope: number, unpopular_slope: number }) {

    const V = props.popular_slope; // slope where popular
    const W = props.unpopular_slope; // slope where unpopular

    function rank_to_unnormalized_prob(rank: number) {
        const x = Math.log(rank);
        const U = Math.log(props.cutoff_rank);
        const y = x < U ? V * (U - x) : W * (U - x);
        return Math.exp(y);
    }

    const total_unnormalized_prob = (() => {
        let sum = 0;
        for (let i = 1; i <= 2e5; i++) {
            sum += rank_to_unnormalized_prob(i);
        }
        return sum;
    })();

    function rank_to_prob(rank: number) {
        return rank_to_unnormalized_prob(rank) / total_unnormalized_prob;
    }

    function uniform_to_rank(uniform_rand: number) {
        let sum = 0;
        for (let i = 1; i <= 2e5; i++) {
            sum += rank_to_prob(i);
            if (uniform_rand < sum) {
                return i;
            }
        }
        return 2e5;
    }
    return { uniform_to_rank, rank_to_prob };
}

function search_main() {
    const params = {
        cutoff_rank: Math.random() * 200,
        popular_slope: Math.random() * 2,
        unpopular_slope: Math.random() * 2
    };
    const ranks = Array.from(
        { length: 28 },
        (_) => get_env(params).uniform_to_rank(Math.random())
    );

    // group by occurrence
    const rank_to_occurrence = new Map<number, number>();
    for (const rank of ranks) {
        rank_to_occurrence.set(rank, (rank_to_occurrence.get(rank) || 0) + 1);
    }
    // console.log(rank_to_occurrence);

    const occurrences = Array.from(rank_to_occurrence.values());
    occurrences.sort((a, b) => b - a);
    //console.log(occurrences);

    if (JSON.stringify(occurrences) === JSON.stringify([
        4, 3, 2, 2, 2,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1])) {
        console.log(`DING!`);
        console.log(`params`, params);
        console.log(`ranks`, ranks);

    }
}
function search() {
    for (let i = 0; i < 1e6; i++) {
        if (i % 1e3 === 0) {
            console.log(i);
        }
        search_main();
    }
}


/**-----------------------------------
 * この探索の結果見つけた、よいパラメータ
 */
const params = {
    cutoff_rank: 43.36831499130107,
    popular_slope: 0.9488784563321069,
    unpopular_slope: 1.9872547841234591
};
const env = get_env(params);

const entropy_in_bits = (() => {
    let sum = 0;
    for (let i = 1; i <= 2e5; i++) {
        const p = env.rank_to_prob(i);
        sum += -p * Math.log2(p);
    }
    return sum;
})();

console.log(`entropy_in_bits`, entropy_in_bits);
/*
console.log(`------------\nrank to prob`);
for (let i = 1; i <= 1000; i++) {
    console.log(`${i}\t${(env.rank_to_prob(i) * 100).toPrecision(2)}%`);
}*/

const log_likelihood = [
    38, 13, 1, 8, 55, 11, 10, 67,
    30, 19, 2, 2, 1, 16, 2, 9,
    18, 8, 50, 1, 19, 56, 1, 6,
    22, 3, 105, 3
].map(rank => Math.log10(env.rank_to_prob(rank))).reduce((a, b) => a + b, 0);

console.log(`log_likelihood`, log_likelihood);