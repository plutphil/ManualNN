function stepFun(x){
    return x>0;
}
function sigmoid(x){
    return 1/(1+Math.pow(Math.E,x))
}
function sigmoiderror(x){
    return 1/(1+Math.pow(Math.E,x))*2-1
}

function calcNeuron(inputs, weights, bias){
    let sum = bias;
    let scaling = 10;
    for (let i = 0; i < inputs.length; i++) {
        sum += inputs[i]*weights[i];
    }
    return sigmoid(sum*scaling);
}
class InputNN{
    constructor(val){
        this.value=val;
        if(val==undefined){
            this.value=0;
        }
    }
    calc(){
        return this.value;
    }
}
class NodeNN{
    constructor(inputs){
        this.inputs=inputs;
        this.weights = new Float32Array(this.inputs.length);
        this.bias = 0;
    }
    calc(){
        let vals = new Float32Array(this.inputs.length);
        for (let i = 0; i < this.inputs.length; i++) {
            const inp = this.inputs[i];
            vals[i]=inp.calc();
        }
        return calcNeuron(vals, this.weights, this.bias);
    }
}