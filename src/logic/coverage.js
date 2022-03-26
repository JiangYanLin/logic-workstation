import {CoveragesChooser} from "@/logic/CoveragesChooser";
import {Minterm} from "@/logic/minterm";

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
        //debug
        if (this.length === 0 || coverage.length === 0) throw 'coverage disjunct param error!';
        //debug*/
        let result = new Coverage();
        this.mintermArray.forEach(v => result.push(v));
        coverage.mintermArray.forEach(v => result.push(v));
        return result;
    }

    conjunct(coverage) {
        //debug
        if (this.length === 0 || coverage.length === 0) throw 'coverage conjunct param error!';
        //debug*/
        let result = new Coverage();
        this.mintermArray.forEach(minterm1 => {
            coverage.mintermArray.forEach(minterm2 => {
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

    fullLargestCoverage() {
        if (this.length === 0) return this;
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
            let minterm_i = result.mintermArray[i];
            for (let j = startIndexes[i]; j < length; j++) {
                let minterm_j = result.mintermArray[j];
                let combineSub = minterm_i.combineSub(minterm_j);
                if (combineSub !== null) {
                    if (combineSub.conjunct(minterm_i).equals(minterm_i)) {
                        toDelete.push(minterm_i);
                    }
                    if (combineSub.conjunct(minterm_j).equals(minterm_j)) {
                        toDelete.push(minterm_j);
                    }
                    if (result.push(combineSub)) {
                        startIndexes[i]++;
                        startIndexes.push(result.length);
                    }
                }
                startIndexes[i]++;
            }
            length = result.length;
        } while ((i = startIndexes.findIndex(index => index < length)) !== -1);
        result.deleteAll(toDelete);
        return result;
    }

    isIntersectedWith(coverage) {
        for (let i = 0; i < this.mintermArray.length; i++) {
            for (let j = 0; j < coverage.mintermArray.length; j++) {
                if (this.mintermArray[i].equals(coverage.mintermArray[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    cost(forConjuncion = false) {
        let _cost = this.length - 1;
        this.mintermArray.forEach((minterm) => {
            _cost += minterm.cost(forConjuncion);
        });
        return _cost;
    }

    simplify(forConjunctive = false) {
        let result = this.fullLargestCoverage();
        let conjunctPairwise = new ConjunctPairwise(result);
        result.deleteAll(conjunctPairwise.getLargestMultiOccupiedCoverage());
        conjunctPairwise.deleteAllEntriesWhichValuesIntersectedWith(result);
        if (conjunctPairwise.size === 0) {
            return result;
        } else if (result.length === 0) {
            return conjunctPairwise.minimalCoverage(forConjunctive);
        } else {
            return result.disjunct(conjunctPairwise.minimalCoverage(forConjunctive));
        }
    }
}

class ConjunctPairwise extends Map {
    constructor(coverage) {
        super();
        if (!(coverage instanceof Coverage) || coverage.length === 0 || coverage.length === undefined) {
            throw  'ConjunctPairwise init error'
        }
        this.mintermLength = coverage.mintermArray[0].value.length;
        this.coverageMultiOccupied = new Coverage();
        let mintermArray = coverage.mintermArray;
        for (let i = 0; i < mintermArray.length; i++) {
            let minterm_i = mintermArray[i];
            for (let j = i + 1; j < mintermArray.length; j++) {
                let minterm_j = mintermArray[j];
                let mintermMultiOccupied = minterm_i.conjunct(minterm_j);
                let key = mintermMultiOccupied.value;
                this.coverageMultiOccupied.push(mintermMultiOccupied);
                if (this.get(key) === undefined) {
                    this.set(key, new Coverage());
                }
                let coverage = this.get(key);
                coverage.push(minterm_i);
                coverage.push(minterm_j);
            }
        }
    }

    getLargestMultiOccupiedCoverage() {
        return this.coverageMultiOccupied.fullLargestCoverage();
    }


    delete(mintermMultiOccupied) {
        super.delete(mintermMultiOccupied.value);
        this.coverageMultiOccupied.delete(mintermMultiOccupied);
    }

    deleteAllEntriesWhichValuesIntersectedWith(coverage) {
        let toDelete = new Set();
        this.forEach((value, mintermMultiOccupied) => {
            if (value.isIntersectedWith(coverage)) {
                toDelete.add(mintermMultiOccupied);
            }
        });
        toDelete.forEach(v => {
            this.delete(new Minterm(v));
        });
        this.delete(new Minterm('-'.repeat(this.mintermLength)));
    }

    minimalCoverage(forConjunction = false) {
        let param = [];
        this.forEach(coverage => {
            param.push(coverage);
        });
        let _cost = Number.MAX_SAFE_INTEGER;
        let result = undefined;
        let chooser = new CoveragesChooser(param);
        if (chooser.total < 2 ** 12) {
            while (chooser.hasNext()) {
                let candidateCoverage = chooser.next();
                let cost = candidateCoverage.cost(forConjunction);
                if (cost < _cost) {
                    _cost = cost;
                    result = candidateCoverage;
                }
            }
        } else {
            throw '算力不足！'
        }
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