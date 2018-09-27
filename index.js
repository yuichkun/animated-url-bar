console.log("App Started");
const FPS = 7; 
const SCENE_2_LAST = '🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮🌮TACOS';

function flatten() {
    const arr = arguments[0];
    const hoge = [].concat.apply([], arr);
    return hoge;
};

function render(txt) {
    try {
        window.history.pushState(null, null, txt);
    } catch (e) {
        debugger;
    }
}

async function animate( { texts, fps} ){
    const interval = 1000 / fps;

    function thread(text, isFirst = false){
        return new Promise(resolve => {
            if( !isFirst ){
                setTimeout(()=>{
                    render(text);
                    // console.log(text);
                    resolve();
                }, interval);
            }
        });
    }
    for(const text of texts){
        await thread(text);
    }
}


function flingText( {text, intensity} ){
    let stageIndex = intensity;
    let texts = [];

    function fling(power) {
        const chars = Array.from(text);
        return chars.map(char => {
            const flung = String.fromCharCode(char.charCodeAt(0) - power)
            const ESCAPE_CHAR_CODES = [92, 37, 47];
            return ESCAPE_CHAR_CODES.includes(flung.charCodeAt(0)) ? '-' : flung;
        }).join('');
    }

    while (stageIndex >= 0){
        const text = fling(stageIndex);
        texts.push(text);
        stageIndex--;
    };
    return texts;
}

function flowText({text, flowDirection = 0, waveSymbol, waveSize}){
    const waves = Array(waveSize).fill(encodeURI(waveSymbol));
    const LeftToRight = flowDirection === 0; 

    function insertAt(position){
        let order = [waves.slice(0, position), text, waves.slice(position)];
        if ( !LeftToRight ) {
            order = order.reverse();
        }
        return flatten(order).join('')
    }

    let texts = [];
    for(let i = 0; i < waveSize+1; i++){
        texts.push(insertAt(i));
    }
    return texts;
}

function pauseText({text, length}){
    return Array(length).fill(text);    
}
function combineScenes(){
    const args = arguments[0];
    const scenes = args.map(_arr=> flatten(_arr));
    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    this.run = async ()=>{
        for(let scene of scenes){
            const texts = flatten(scene);
            await animate({texts, fps: FPS});
            await sleep(500);
        }
    };
    return this;
}

const scenes = combineScenes(
    [
        [
            flowText({
                text: 'SOCAT',
                waveSize: 20,
                waveSymbol: '🌮',
                flowDirection: 1
            }),
            flowText({
                text: 'TACOS',
                waveSymbol: '🌮',
                waveSize: 20
            })
        ],
        [
            flowText({
                text: 'TACOS',
                waveSize: 20,
                waveSymbol: '🌮',
                flowDirection: 1
            }),
        ],
        [
            flingText({
                text: 'WELCOME',
                intensity: parseInt(FPS / 3)
            })
        ],
        [
            flingText({
                text: 'WELCOME_TO',
                intensity: parseInt(FPS / 3)
            }),
        ],
        [
            flingText({
                text: 'WELCOME_TO_TACOS',
                intensity: parseInt(FPS / 2)
            })
        ],
        [
            flingText({
                text: 'WELCOME_TO_TACOS_SITE',
                intensity: parseInt(FPS * 1.5)
            }),
            ['🌮🌮🌮🌮WELCOME_TO_TACOS_SITE🌮🌮🌮🌮']
        ]
    ]
);

scenes.run();
