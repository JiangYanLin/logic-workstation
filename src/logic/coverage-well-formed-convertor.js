import {Disjunction, False} from "@/logic/well-formed";

class CoverageWellFormedConvertor {
    constructor(mintermWellFormedConvertor) {
        this.mintermWellFormedConvertor = mintermWellFormedConvertor;
    }

    convertCoverageToDisjunction(coverage) {
        if (coverage.length === 0) return new False();
        if (coverage.length === 1) return this.mintermWellFormedConvertor.convertMintermToConjunction(coverage.mintermArray[0]);
        let disjunctive = [];
        coverage.mintermArray.forEach((minterm) => {
            disjunctive.push(this.mintermWellFormedConvertor.convertMintermToConjunction(minterm));
        });
        return new Disjunction(...disjunctive);
    }
}

export {CoverageWellFormedConvertor}

/*test convertCoverageToDisjunction
import {Coverage} from "@/logic/coverage";
import {Minterm} from "@/logic/minterm";
import {StringOrder} from "@/logic/string-order";
import {MintermWellFormedConvertor} from "@/logic/minterm-well-formed-convertor";

let order = new StringOrder();
order.push('a');
order.push('b');
order.push('c');
let convertor = new CoverageWellFormedConvertor(new MintermWellFormedConvertor(order));
let coverage = new Coverage();
console.log(convertor.convertCoverageToDisjunction(coverage).toString());
coverage.push(new Minterm('010'));
console.log(convertor.convertCoverageToDisjunction(coverage).toString());
coverage.push(new Minterm('1*0'));
coverage.push(new Minterm('***'));
coverage.push(new Minterm('---'));
console.log(convertor.convertCoverageToDisjunction(coverage).toString());
//test convertCoverageToDisjunction*/