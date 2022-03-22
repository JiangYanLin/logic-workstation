import {TrueTableComputer} from "@/logic/true-table-computer";
import {CoverageCreator} from "@/logic/coverage-creator";
import {MintermCreator} from "@/logic/minterm-creator";
import {False, True} from "@/logic/well-formed";
import {Coverage} from "@/logic/coverage";
import {Minterm} from "@/logic/minterm";
import {CoverageWellFormedConvertor} from "@/logic/coverage-well-formed-convertor";
import {MintermWellFormedConvertor} from "@/logic/minterm-well-formed-convertor";

class WellFormedSimplifier {
    constructor(wellFormed) {
        this.wellFormed = wellFormed;
        let atomicPropositionOrder = wellFormed.atomicPropositionOrder;
        this.trueTableComputer = new TrueTableComputer(wellFormed, atomicPropositionOrder);
        this.coverageCreator = new CoverageCreator(new MintermCreator(atomicPropositionOrder));
        this.coverageWellFormedConvertor = new CoverageWellFormedConvertor(new MintermWellFormedConvertor(atomicPropositionOrder));
    }

    getSimplifiedCoverageTrueTableMethod() {
        if (this.wellFormed instanceof True) {
            let result = new Coverage();
            result.push(new Minterm('*'.repeat(this.wellFormed.atomicPropositionOrder.length)));
            return result;
        }
        if (this.wellFormed instanceof False) {
            let result = new Coverage();
            result.push(new Minterm('-'.repeat(this.wellFormed.atomicPropositionOrder.length)));
            return result;
        }
        let assignmentsMakeWellFormedTrue = this.trueTableComputer.getTureTable().getAssignmentsMakeWellFormedTrue();
        let coverage = this.coverageCreator.createFromAssignments(assignmentsMakeWellFormedTrue);
        return coverage.simplify();
    }

    getSimplifiedCoverageDivideMethod() {
        if (this.wellFormed.atomicPropositionOrder.length < 8) {
            return this.getSimplifiedCoverageTrueTableMethod();
        }

    }

    simplifyDisjunctive() {
        let coverage = this.getSimplifiedCoverageDivideMethod();
        return this.coverageWellFormedConvertor.convertCoverageToDisjunction(coverage);
    }

    simplifyConjunctive() {
        return new WellFormedSimplifier(this.wellFormed.inverse()).simplifyDisjunctive().inverse();
    }
}

export {WellFormedSimplifier}

//test simplifyDisjunctive simplifyConjunctive
import compiler from "@/logic/compiler";

let wellFormedSimplifier = new WellFormedSimplifier(compiler.parse('not b and c or a and b'));
console.log(wellFormedSimplifier.simplifyDisjunctive().toString());
console.log(wellFormedSimplifier.simplifyConjunctive().toString());
wellFormedSimplifier = new WellFormedSimplifier(compiler.parse('a1 and a2 and a3 and a4 and a5 and a6 and a7 and a8 and a9 and a10'));
console.log(wellFormedSimplifier.simplifyDisjunctive().toString());
console.log(wellFormedSimplifier.simplifyConjunctive().toString());
//test simplifyDisjunctive simplifyConjunctive*/