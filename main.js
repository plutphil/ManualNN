// Create a neural network instance
let slidermax = 1000;
// Training data
let trainingData = [
    { inputs: [0, 0], targets: [0] },
    { inputs: [0, 1], targets: [1] },
    { inputs: [1, 0], targets: [1] },
    { inputs: [1, 1], targets: [0] },
];
let biases = [];
let all_weights = [];

let all_nodes = [];
let all_inputs = [];
function Input() {
    let o = new InputNN(0);
    all_inputs.push(o);
    return o;
}
function Node(inputs) {
    let o = new NodeNN(inputs);
    all_nodes.push(o);
    return o;
}
let inp_a = Input();
let inp_b = Input();
inputsNodes = [inp_a, inp_b]
let hnode1 = Node(inputsNodes);
let hnode2 = Node(inputsNodes);

let outputNode = Node([
    Node([hnode1, hnode2]),
    Node([hnode1, hnode2])
]);
/*let outputNode = Node([
  Node(inputsNodes),
  Node([Node(inputsNodes)])
]);*/
console.log(all_nodes, all_inputs);
function setInputs(inpdata) {
    for (let i = 0; i < all_inputs.length; i++) {
        all_inputs[i].value = inpdata[i];
    }
}
function addSlider(name) {
    const input = document.createElement("input");

    input.type = "range";
    input.max = slidermax;
    //input.value=((weights[i]+weightsize/2)/weightsize)*slidermax;
    //input.id="w"+i;

    const spantext = document.createElement("span");
    spantext.className = "spantext";
    spantext.textContent = "0.0";
    input.spantext = spantext;


    const span2 = document.createElement("span");
    span2.textContent = name;
    input.slidertitle = span2;

    const div = document.createElement("div");
    div.className = "sliders";

    div.appendChild(span2);
    div.appendChild(input);
    div.appendChild(spantext);

    document.body.appendChild(div);
    return input;
}
window.addEventListener("load", () => {
    for (let i = 0; i < all_nodes.length; i++) {
        const node = all_nodes[i];
        for (let y = 0; y < node.weights.length; y++) {
            console.log()
            const sl = addSlider("n" + i + "w" + y);

            sl.oninput = e => {

                node.weights[y] = sl.value / slidermax * weightsize - weightsize / 2;
                node.spantext = "" + node.weights[y];

            }
            sl.value = Math.random() * slidermax / 2 + slidermax / 2;
            sl.oninput(0);
        }
        const sl = addSlider("n" + i + "b");
        sl.oninput = e => {
            node.bias = (slidermax - sl.value) / slidermax * weightsize - weightsize / 2;
            node.spantext = "" + node.bias;
        }
        sl.value = Math.random() * slidermax / 2 + slidermax / 2;
        sl.oninput(0);
    }
})
let points = [];
for (let i = 0; i < 100; i++) {
    let x = Math.random();
    let y = Math.random();
    let input = [x, y];
    points.push({ x, y, output: Math.round(x) ^ Math.round(y) });
}
function updatePoints() {
    for (let i = 0; i < points.length; i++) {
        let x = points[i].x;
        let y = points[i].y;
        let input = [x, y];
        let output = nn.predict(input)[0];
        points[i].output = output;
    }
}
let weights = new Float32Array(11);
function calcVal(input) {
    let wi = 0;
    let v0 = calcNeuron(input, [weights[wi++], weights[wi++]], weights[wi++]);
    let v1 = calcNeuron([v0], [weights[wi++]], weights[wi++]);
    let v2 = calcNeuron(input, [weights[wi++], weights[wi++]], weights[wi++]);
    let res = calcNeuron([v1, v2], [weights[wi++], weights[wi++]], weights[wi++]);
    //console.log(wi);
    return res;
}
weightsize = 4;
function setRandomWeights() {
    for (let i = 0; i < weights.length; i++) {
        d = weightsize;
        weights[i] = Math.random() * d - d / 2;
    }
}
function lerp(a, b, i) {
    return a * i + (1 - i) * b;
}
function fadeColor(a, b, i) {
    return [lerp(a[0], b[0], i), lerp(a[1], b[1], i), lerp(a[2], b[2], i), lerp(a[3], b[3], i)];
}
function fadeColorDef(v) {
    //f59423
    //009cff
    return fadeColor([1, 0.5, 0, 1], [0, 0.5, 1, 1], v)
}
//v = testdat[0][0]
function testTrainingData() {
    let error = 0;
    for (let i = 0; i < trainData.length; i++) {
        let testdat = trainData[i];

        error += Math.abs(calcVal(testdat[0]) - testdat[1][0]);
    }
    return error / trainData.length;
}
let trainData = [];
for (let i = 0; i < 1000; i++) {
    let x = Math.random();
    let y = Math.random();
    trainData.push([[x, y], [Math.round(x) ^ Math.round(y)]]);
}
setRandomWeights();
weights[0] = 1
weights[1] = 0
weights[2] = -0.5

textnode = document.createTextNode("Result" + testTrainingData());
document.body.appendChild(textnode)

const neuronCanvas = document.getElementById('neuronCanvas');
const neuronCanvasCtx = neuronCanvas.getContext("2d");
const n0 = new Image(16, 16)

imdata = neuronCanvasCtx.getImageData(0, 0, neuronCanvas.width, neuronCanvas.height);
function setRect(sx, sy, w, h, c) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            off = ((sy + y) * imdata.width + (sx + x)) * 4
            imdata.data[off] = c[0] * 255
            imdata.data[off + 1] = c[1] * 255
            imdata.data[off + 2] = c[2] * 255
            imdata.data[off + 3] = c[3] * 255
        }
    }
}
function updateNeuron() {
    function drawNeuron(fun, offx, offy) {
        const s = 32;
        const ps = 2;
        for (let y = 0; y < s; y++) {
            for (let x = 0; x < s; x++) {
                fx = x / s;
                fy = y / s;
                input = [fx, fy]
                v0 = fun(input)

                //setRect(x * ps + offx, y * ps + offy, ps, ps, [v0, 0, 0, 1]);
                setRect(x * ps + offx, y * ps + offy, ps, ps, fadeColorDef(v0));
            }
        }
    }


    for (let i = 0; i < all_nodes.length; i++) {
        let n = all_nodes[i];
        drawNeuron((input) => {
            setInputs(input);
            return n.calc();
        }, i * (16 * 4 + 3), 0)
    }
    //console.log(imdata)
    neuronCanvasCtx.putImageData(imdata, 0, 0)
}
// Function to update the canvas with a point
function updateCanvas() {
    let canvas = document.getElementById('visualizationCanvas');
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < 1; i++) {
        let data = trainingData[Math.floor(Math.random() * trainingData.length)];
        //nn.train(data.inputs, data.targets);
    }

    for (let i = 0; i < trainData.length; i++) {
        let testdat = trainData[i];
        //console.log(testdat)
        setInputs(testdat[0]);
        let v0 = outputNode.calc();
        let col = fadeColorDef(v0);
        rgbColor = `rgb(${col[0] * 255}, ${col[1] * 255}, ${col[2] * 255})`;

        // Draw the point on the canvas
        ctx.fillStyle = rgbColor;
        ctx.fillRect(testdat[0][0] * canvas.width, testdat[0][1] * canvas.height, 5, 5);
    }
    textnode.textContent = "Result" + testTrainingData()
    updateNeuron();
    // Request the next frame
    requestAnimationFrame(updateCanvas);
}

// Start the visualization
updateCanvas();