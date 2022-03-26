import {CoverageCreator} from "@/logic/coverage-creator";
import {MintermCreator} from "@/logic/minterm-creator";
import {Conjunction, Disjunction, False, IFF, Implication, Negation, True} from "@/logic/well-formed";
import {CoverageWellFormedConvertor} from "@/logic/coverage-well-formed-convertor";
import {MintermWellFormedConvertor} from "@/logic/minterm-well-formed-convertor";
import {TrueTable} from "@/logic/true-table";

class WellFormedSimplifier {
    constructor(wellFormed) {
        this.wellFormed = wellFormed;
        let atomicPropositionOrder = wellFormed.atomicPropositionOrder;
        this.atomicPropositionCount = atomicPropositionOrder.length;
        if (atomicPropositionOrder.length === 0) return this;
        this.coverageCreator = new CoverageCreator(new MintermCreator(atomicPropositionOrder));
        this.coverageWellFormedConvertor = new CoverageWellFormedConvertor(new MintermWellFormedConvertor(atomicPropositionOrder));
    }

    get trueTable() {
        if (this._trueTable === undefined) {
            this._trueTable = new TrueTable(this.wellFormed);
        }
        return this._trueTable;
    }

    simplifyDisjunctiveTrueTableMethod() {
        if (this.wellFormed instanceof True) {
            throw 'getSimplifiedCoverageTrueTableMethod meet true error!'
        }
        if (this.wellFormed instanceof False) {
            throw 'getSimplifiedCoverageTrueTableMethod meet false error!'
        }
        let assignmentsMakeWellFormedTrue = this.trueTable.getAssignmentsMakeWellFormedTrue();
        if (assignmentsMakeWellFormedTrue.size === 0) {
            return new False();
        }
        let coverage = this.coverageCreator.createFromAssignments(assignmentsMakeWellFormedTrue);
        coverage = coverage.simplify();
        return this.coverageWellFormedConvertor.convertCoverageToDisjunction(coverage);

    }

    simplifyDisjunctive() {
        if (this.atomicPropositionCount === 0) return this.wellFormed.boolFunction() ? new True() : new False();
        if (this.atomicPropositionCount < 8) {
            return this.simplifyDisjunctiveTrueTableMethod();
        } else {
            switch (this.wellFormed.constructor) {
                case Negation:
                    return new WellFormedSimplifier(this.wellFormed.inward()).simplifyDisjunctive();
                case Implication:
                    return new WellFormedSimplifier(this.wellFormed.toDisjunction()).simplifyDisjunctive();
                case IFF:
                    return new WellFormedSimplifier(this.wellFormed.toConjunction()).simplifyDisjunctive();
                case Conjunction: {
                    let conjuncts = this.wellFormed.conjuncts;
                    let length = conjuncts.length;
                    let simplify1 = undefined;
                    let simplify2 = undefined;
                    let splitIndex = Math.floor(length / 2);
                    if (length <= 3) {
                        let split1 = conjuncts[0];
                        simplify1 = new WellFormedSimplifier(split1).simplifyDisjunctive();
                    } else {
                        let split1 = new Conjunction(...conjuncts.slice(0, splitIndex));
                        simplify1 = new WellFormedSimplifier(split1).simplifyDisjunctive();
                    }
                    if (length === 2) {
                        let split2 = conjuncts[1];
                        simplify2 = new WellFormedSimplifier(split2).simplifyDisjunctive();
                    } else {
                        let split2 = new Conjunction(...conjuncts.slice(splitIndex, length));
                        simplify2 = new WellFormedSimplifier(split2).simplifyDisjunctive();
                    }
                    let coverageConjunted = this.coverageCreator.createFromSimpleDisjunction(simplify1).conjunct(this.coverageCreator.createFromSimpleDisjunction(simplify2));
                    return this.coverageWellFormedConvertor.convertCoverageToDisjunction(coverageConjunted.simplify());
                }
                case Disjunction: {
                    let disjuncts = this.wellFormed.disjuncts;
                    let length = disjuncts.length;
                    let simplify1 = undefined;
                    let simplify2 = undefined;
                    let splitIndex = Math.floor(length / 2);
                    if (length <= 3) {
                        simplify1 = new WellFormedSimplifier(disjuncts[0]).simplifyDisjunctive();
                    } else {
                        simplify1 = new WellFormedSimplifier(new Disjunction(...disjuncts.slice(0, splitIndex))).simplifyDisjunctive();
                    }
                    if (length === 2) {
                        simplify2 = new WellFormedSimplifier(disjuncts[1]).simplifyDisjunctive();
                    } else {
                        simplify2 = new WellFormedSimplifier(new Disjunction(...disjuncts.slice(splitIndex, length))).simplifyDisjunctive();
                    }
                    let coverage1 = this.coverageCreator.createFromSimpleDisjunction(simplify1);
                    let coverage2 = this.coverageCreator.createFromSimpleDisjunction(simplify2);
                    let coverageDisjuncted = coverage1.disjunct(coverage2);
                    return this.coverageWellFormedConvertor.convertCoverageToDisjunction(coverageDisjuncted.simplify());
                }
                default:
                    throw 'type error';
            }
        }
    }

    simplifyConjunctive() {
        let inversed = this.wellFormed.inverse();
        let simplifiedInversed = new WellFormedSimplifier(inversed).simplifyDisjunctive();
        return simplifiedInversed.inverse();
    }
}

export {WellFormedSimplifier}

/*test simplifyDisjunctive simplifyConjunctive
import compiler from "@/logic/compiler";

// let wellFormedSimplifier = new WellFormedSimplifier(compiler.parse('not b and c or a and b'));
// console.log(wellFormedSimplifier.simplifyDisjunctive().toString());
// console.log(wellFormedSimplifier.simplifyConjunctive().toString());
// let wellFormedSimplifier = new WellFormedSimplifier(compiler.parse("a and (a <-> b) and (b<->c) and (c<->d) and (d<->e) and (e<->f) and (f<->g) and (h<->i) and (i<->j) and (j<->k) and (k<->l) and (l<->m) -> m"));
// let wellFormedSimplifier = new WellFormedSimplifier(compiler.parse(" not a and not b or a and b or c -> d  "));
// let wellFormedSimplifier = new WellFormedSimplifier(compiler.parse('not(a ->b)'));
console.log(wellFormedSimplifier.simplifyDisjunctive().toString());
console.log(wellFormedSimplifier.simplifyConjunctive().toString());
;
//test simplifyDisjunctive simplifyConjunctive*/