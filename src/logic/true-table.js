import {AssignmentCreator} from "@/logic/assignment-creator";
import {WellFormedSimplifier} from "@/logic/well-formed-simplifier";
import {AtomicProposition, Conjunction, Disjunction, False, Negation, True} from "@/logic/well-formed";

class TrueTableShowable {
    wellFormed;
    head;
    body;
}

class TrueTable extends TrueTableShowable {
    constructor(wellFormed) {
        super();
        this.wellFormed = wellFormed;
        let atomicPropositionOrder = wellFormed.atomicPropositionOrder;
        this.head = [];
        this.head.push(...atomicPropositionOrder.stringArray);
        this.head.push(wellFormed.toString());
        this.trueValues = [];
        this.body = [];
        this.assignmentCreator = new AssignmentCreator(atomicPropositionOrder);
        let atomicPropositionCount = atomicPropositionOrder.length;
        if (atomicPropositionCount === 0) {
            this.body.push(this.wellFormed.boolFunction() ? '1' : '0');
            return this;
        }
        let rowCount = 2 ** atomicPropositionCount;
        for (let i = 0; i < rowCount; i++) {
            let assignment = this.assignmentCreator.createAssignmentFromIntValue(i);
            let trueValue = wellFormed.boolFunction(assignment);
            this.trueValues[i] = trueValue;
            let row = i.toString(2).split('');
            while (row.length < atomicPropositionCount) {
                row.unshift('0');
            }
            row.push(trueValue ? '1' : '0');
            this.body.push(row);
        }

    }

    getAssignmentsMakeWellFormedTrue() {
        let result = new Set();
        this.trueValues.forEach((value, index) => {
            if (value) {
                result.add(this.assignmentCreator.createAssignmentFromIntValue(index));
            }
        });
        return result;
    }
}

class SimplifiedTrueTable extends TrueTableShowable {
    constructor(wellFormed) {
        super();
        this.wellFormed = wellFormed;
        let order = this.wellFormed.atomicPropositionOrder;
        this.head = order.stringArray.map(v => v);
        this.head.push(this.wellFormed.toString());
        this.wellFormedSimplifier = new WellFormedSimplifier(wellFormed);
        this.body = [];
        let count = this.wellFormed.atomicPropositionOrder.length;
        try {
            let simplifiedDisjunction = this.wellFormedSimplifier.simplifyDisjunctive();
            if (simplifiedDisjunction instanceof True) {
                this.head = [this.wellFormed.toString()];
                this.body.push(['1']);
                return this;
            }
            if (simplifiedDisjunction instanceof False) {
                this.body.push(['0']);
                return this;
            }
            if (!(simplifiedDisjunction instanceof Disjunction)) {
                simplifiedDisjunction.disjuncts = [simplifiedDisjunction];
            }
            simplifiedDisjunction.disjuncts.forEach(disjunct => {
                let row = '*'.repeat(count).split('');
                switch (disjunct.constructor) {
                    case AtomicProposition:
                        row[order.getIndexOf(disjunct.name)] = '1';
                        break;
                    case Negation:
                        row[order.getIndexOf(disjunct.item.name)] = '0';
                        break;
                    case Conjunction:
                        disjunct.conjuncts.forEach(conjunct => {
                            switch (conjunct.constructor) {
                                case AtomicProposition:
                                    row[order.getIndexOf(conjunct.name)] = '1';
                                    break;
                                case Negation:
                                    row[order.getIndexOf(conjunct.item.name)] = '0';
                                    break;
                                default:
                                    throw 'simplified true table error';
                            }
                        });
                        break;
                    default:
                        throw 'simplified true table error';
                }
                row.push('1')
                this.body.push(row);
            });
        } catch (e) {
        }

        try {
            let simplifiedConjunction = this.wellFormedSimplifier.simplifyConjunctive();
            if (simplifiedConjunction instanceof True) {
                this.head = [this.wellFormed.toString()];
                this.body.push(['1']);
                return this;
            }
            if (simplifiedConjunction instanceof False) {
                this.body.push(['0']);
                return this;
            }
            if (!(simplifiedConjunction instanceof Conjunction)) {
                simplifiedConjunction.constructs = [simplifiedConjunction];
            }
            simplifiedConjunction.conjuncts.forEach((conjunct) => {
                let row = '*'.repeat(count).split('');
                switch (conjunct.constructor) {
                    case AtomicProposition:
                        row[order.getIndexOf(conjunct.name)] = '0';
                        break;
                    case Negation:
                        row[order.getIndexOf(conjunct.item.name)] = '1';
                        break;
                    case Disjunction:
                        conjunct.disjuncts.forEach(disjunct => {
                            switch (disjunct.constructor) {
                                case AtomicProposition:
                                    row[order.getIndexOf(disjunct.name)] = '0';
                                    break;
                                case Negation:
                                    row[order.getIndexOf(disjunct.item.name)] = '1';
                                    break;
                                default :
                                    throw 'simplified true table error';
                            }
                        });
                        break;
                    default:
                        throw 'simplified true table error'
                }
                row.push('0');
                this.body.push(row);
            });
        } catch (e) {
        }
    }
}

export {TrueTable, TrueTableShowable, SimplifiedTrueTable}

/*test all
import compiler from "@/logic/compiler";

let trueTable = new TrueTable(compiler.parse('a and b'));
console.log(trueTable);
console.log(trueTable.getAssignmentsMakeWellFormedTrue());
trueTable = new TrueTable(compiler.parse('true'));
console.log(trueTable);
console.log(trueTable.getAssignmentsMakeWellFormedTrue());
trueTable = new TrueTable(compiler.parse('false'));
console.log(trueTable);
console.log(trueTable.getAssignmentsMakeWellFormedTrue());
//test all*/

//test SimplifiedTrueTable
import compiler from "@/logic/compiler";

console.log(new SimplifiedTrueTable(compiler.parse('a and b')));
//test SimplifiedTrueTable*/