import {Coverage} from "@/logic/coverage";

class Minterm {
    constructor(v = undefined) {
        if (v !== undefined) {
            //debug
            if (v.match(/[^10*-]/) !== null) {
                throw 'invalid minterm';
            }
            //debug*/
            this.value = v.toString();
        }
    }

    equals(minterm) {
        return this.value === minterm.value;
    }

    isFALSE() {
        return this.value === '-'.repeat(this.value.length);
    }

    conjunct(minterm) {
        //debug
        if (this.value === undefined || minterm.value === undefined) throw 'not initialized'
        if (this.value.length !== minterm.value.length) throw 'invalid conjunct';
        //debug*/
        if (this.isFALSE()) {
            return this;
        }
        if (minterm.isFALSE()) {
            return minterm;
        }
        if (this.equals(minterm)) {
            return this;
        }
        let length = this.value.length;
        let resultValue = '';
        for (let i = 0; i < length; i++) {
            let this_i = this.value[i];
            let minterm_i = minterm.value[i];
            if (this_i === minterm_i) {
                resultValue += this_i;
            } else {
                if (this_i === '*') {
                    resultValue += minterm_i;
                } else if (minterm_i === '*') {
                    resultValue += this_i;
                } else {
                    return new Minterm('-'.repeat(this.value.length));
                }
            }
        }
        let result = new Minterm();
        result.value = resultValue;
        return result;
    }

    starCount() {
        let length = this.value.length;
        let count = 0
        for (let i = 0; i < length; i++) {
            if (this.value[i] === '*') {
                count++;
            }
        }
        return count;
    }

    combineSub(minterm) {
        if (this.isFALSE()) {
            return this;
        }
        if (minterm.isFALSE()) {
            return minterm;
        }
        let tag = true;
        let length = this.value.length;
        let resultValue = '';
        for (let i = 0; i < length; i++) {
            let this_i = this.value[i];
            let minterm_i = minterm.value[i];
            if (this_i === minterm_i) {
                resultValue += this_i;
            } else {
                if (this_i === '*') {
                    resultValue += minterm_i
                } else if (minterm_i === '*') {
                    resultValue += this_i;
                } else if (tag) {
                    resultValue += '*';
                    tag = false;
                } else {
                    return null;
                }
            }
        }
        if (tag) {
            return null;
        }
        let result = new Minterm();
        result.value = resultValue;
        return result;
    }

    cost(forConjunction = false) {
        let _cost = -1;
        for (let i = 0; i < this.value.length; i++) {
            switch (this.value[i]) {
                case '0':
                    _cost += forConjunction ? 1 : 2;
                    break;
                case '1':
                    _cost += forConjunction ? 2 : 1;
                    break
                default:
            }
        }
        return _cost;
    }

    negate() {
        let len = this.value.length;
        if (this.isFALSE()) return new Minterm('*'.repeat(len));
        if (this.value === '-'.repeat(len)) return new Minterm('-'.repeat(len))
        let result = new Coverage();
        for (let i = 0; i < len; i++) {
            switch (this.value[i]) {
                case '*':
                    break;
                case '0': {
                    let valueArray = this.value.split('');
                    valueArray[i] = '1';
                    let newValue = valueArray.join('');
                    result.push(new Minterm(newValue));
                    break;
                }
                case '1': {
                    let valueArray = this.value.split('');
                    valueArray[i] = '0';
                    let newValue = valueArray.join('');
                    result.push(new Minterm(newValue));
                    break;
                }

            }
        }
        return result;
    }

}


export {
    Minterm
}


/*test conjunct
let m1 = new Minterm();
m1.value = new String('1*0');
let m2 = new Minterm();
m2.value = '*00';
console.log('1*0 and *00', m1.conjunct(m2).value, m2.conjunct(m1).value);
let f = new Minterm();
f.value = '---';
console.log('---', f.conjunct(m1).value, m1.conjunct(f).value);
let m3 = new Minterm();
m3.value = '*11';
console.log('*00 and *11', m3.conjunct(m2), m2.conjunct(m3));
//test conjunct*/

/*test combineSub
let x, y;
[x, y] = ['10*1', '11*1'];
console.log(x, y, new Minterm(x).combineSub(new Minterm(y)).value);
//test combineSub*/

/*test cost
let x = new Minterm('---');
console.log(x.cost());
//test cost*/

//test negate
// console.log(new Minterm('10**0').negate());
//test negate*/
