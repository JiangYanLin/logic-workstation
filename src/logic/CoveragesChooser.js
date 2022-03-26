import {Coverage} from "@/logic/coverage";

class CoveragesChooser {
    constructor(coverages) {
        if (coverages.length === 0 || coverages.length === undefined) {
            throw 'CoveragesChooser init error';
        }
        this.coverages = coverages;
        this.current = -1;
        this.total = 1;
        this.lengths = coverages.map(coverage => coverage.length);
        this.lengths.forEach((length) => {
            this.total *= length;
        });
        this.choose = [];
        for (let i = 0; i < this.lengths.length; i++) {
            this.choose[i] = 0;
        }
    }

    hasNext() {
        return this.current < this.total;
    }

    next() {
        this.current++;
        let choose = this.choose;
        for (let i = choose.length - 1; i > 0; i--) {
            if (choose[i] + 1 === this.lengths[i]) {
                choose[i] = 0;
            } else {
                choose[i] += 1;
                break;
            }
        }
        let result = new Coverage();
        this.coverages.forEach((coverage, index) => {
            result.push(coverage.mintermArray[this.choose[index]]);
        });
        return result;
    }
}

export {CoveragesChooser}

/*test next
import {Minterm} from "@/logic/minterm";

console.log('start')
let param = [];
let coverage1 = new Coverage();
coverage1.push(new Minterm('1**'));
coverage1.push(new Minterm('01*'));
let coverage2 = new Coverage();
coverage2.push(new Minterm('01*'));
coverage2.push(new Minterm('1*0'));
let coverage3 = new Coverage();
coverage3.push(new Minterm('1**'))
coverage3.push(new Minterm('**0'))
coverage3.push(new Minterm('0*0'))
param.push(coverage1)
param.push(coverage2)
param.push(coverage3)
let chooser = new CoveragesChooser(param);
while (chooser.hasNext()) {
    console.log(1)
    console.log(chooser.next().mintermValueSet);
}
//test next*/