class Coverage {
    mintermValueSet = new Set();
    mintermArray = [];

    get length() {
        return this.mintermArray.length;
    }

    push(minterm) {
        this.mintermValueSet.add(minterm.value);
        if (this.mintermValueSet.size > this.mintermArray.length) {
            this.mintermArray.push(minterm);
            return true;
        }
        return false;
    }

    disjunct(coverage) {
        let result = new Coverage();
        this.mintermArray.forEach(v => result.push(v));
        coverage.mintermArray.forEach(v => result.push(v));
        return result;
    }

    conjunct(coverage) {
        let result = new Coverage();
        this.mintermArray.forEach(minterm1 => {
            coverage.mintermArray.forEach(minterm2 => {
                /*debug
                console.log(minterm1.value, 'conjuct', minterm2.value, minterm1.conjunct(minterm2))
                //debug*/
                result.push(minterm1.conjunct(minterm2));
            });
        });
        return result;
    }

    delete(minterm) {
        this.mintermValueSet.delete(minterm.value);
        if (this.mintermValueSet.size < this.mintermArray.length) {
            let index = this.mintermArray.findIndex((m) => {
                return minterm.value === m.value;
            });
            this.mintermArray.splice(index, 1);
        }
    }

    deleteAll(coverage) {
        coverage.mintermArray.forEach(v => this.delete(v));
    }

    conjunctPairwise() {
        let result = new Coverage();
        let length = this.length;
        for (let i = 0; i < length; i++) {
            for (let j = i + 1; j < length; j++) {
                result.push(this.mintermArray[i].conjunct(this.mintermArray[j]));
            }
        }
        return result;
    }

    fullLargestCoverage() {
        let result = new Coverage();
        let startIndexes = [];
        let length = this.length;
        for (let i = 0; i < length; i++) {
            result.push(this.mintermArray[i]);
            startIndexes.push(1 + i);
        }
        let toDelete = new Coverage();
        let i = 0;
        do {
            /*debug
            console.log(i);
            debugger;
            //debug*/
            let minterm_i = result.mintermArray[i];
            for (let j = startIndexes[i]; j < length; j++) {
                let minterm_j = result.mintermArray[j];
                let combineSub = minterm_i.combineSub(minterm_j);
                if (combineSub !== null && result.push(combineSub)) {
                    if (combineSub.conjunct(minterm_i).equals(minterm_i)) {
                        toDelete.push(minterm_i);
                    }
                    if (combineSub.conjunct(minterm_j).equals(minterm_j)) {
                        toDelete.push(minterm_j);
                    }
                    startIndexes[i]++;
                    startIndexes.push(result.length);
                }
                startIndexes[i]++;
            }
            length = result.length;
        } while ((i = startIndexes.findIndex(index => index < length)) !== -1);
        result.deleteAll(toDelete);
        return result;
    }

    simplify() {
        let result = this.fullLargestCoverage();
        result.deleteAll(result.conjunctPairwise().fullLargestCoverage());
        return result;
    }
}

export {
    Coverage
}

/*test push delete disjunct deleteAll
import {Minterm} from "@/logic/minterm";

let coverage1 = new Coverage();
coverage1.push(new Minterm('111'));
console.log(coverage1.mintermArray.map(v => v.value));
coverage1.push(new Minterm('111'));
console.log(coverage1.mintermArray.map(v => v.value));
coverage1.push(new Minterm('11*'));
console.log(coverage1.mintermArray.map(v => v.value));
coverage1.delete(new Minterm('111'));
console.log(coverage1.mintermArray.map(v => v.value));

let coverage2 = new Coverage();
coverage1.push(new Minterm('000'));
coverage2.push(new Minterm('001'));
coverage2.push(new Minterm('101'));
let dis = coverage1.disjunct(coverage2);
console.log(dis.mintermArray.map(v => v.value));
dis.deleteAll(coverage1);
console.log(dis.mintermArray.map(v => v.value));

//test push delete disjunct deleteAll*/

/*test conjunct conjunctPairwise
import {Minterm} from "@/logic/minterm";

let coverage1 = new Coverage();
coverage1.push(new Minterm('1**'))
coverage1.push(new Minterm('*1*'))
let coverage2 = new Coverage();
coverage2.push(new Minterm('*0*'))
coverage2.push(new Minterm('*10'))
console.log(coverage1.conjunct(coverage2).mintermArray.map(v => v.value));
let coverage = coverage1.disjunct(coverage2);
console.log(coverage.mintermArray.map(v => v.value));
console.log(coverage.conjunctPairwise().mintermArray.map(v => v.value));
//test conjunct conjunctPairwise*/

/*test fullLargestCoverage simplify
import {Minterm} from "@/logic/minterm";

let coverage = new Coverage();
coverage.push(new Minterm('---'))
console.log(coverage.fullLargestCoverage().mintermArray.map(v => v.value));
console.log(coverage.simplify().mintermArray.map(v => v.value));
//test fullLargestCoverage simplify*/