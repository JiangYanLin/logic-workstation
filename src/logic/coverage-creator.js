import {Coverage} from "@/logic/coverage";
import {AtomicProposition, Conjunction, Disjunction, False, Negation, True} from "@/logic/well-formed";

class CoverageCreator {
    constructor(mintermCreator = undefined) {
        if (mintermCreator !== undefined) {
            this.mintermCreator = mintermCreator;
        }
    }

    createFromAssignments(assignments) {
        let result = new Coverage();
        assignments.forEach(assignment => {
            result.push(this.mintermCreator.createFromAssignment(assignment));
        });
        return result;
    }

    createFromSimpleDisjunction(disjunction) {
        let result = new Coverage();
        switch (disjunction.constructor) {
            case True:
            case False:
            case AtomicProposition:
            case Negation:
            case Conjunction:
                result.push(this.mintermCreator.createFromSimpleConjunction(disjunction));
                return result;
            case Disjunction:
                disjunction.disjuncts.forEach((disjunct => {
                    result.push(this.mintermCreator.createFromSimpleConjunction(disjunct));
                }))
                return result;
            default:
                throw 'coverage create type error'
        }
    }
}

export {CoverageCreator}

/*test createFromAssignmentsF
import {Assignment} from "@/logic/assignment";
import {MintermCreator} from "@/logic/minterm-creator";
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('b');
order.push('a');
order.push('c');
let coverageCreator = new CoverageCreator(new MintermCreator(order));
let assignments = new Set();
let assignment1 = new Assignment();
assignment1.set('a', false);
assignment1.set('b', false);
assignment1.set('c', false);
assignments.add(assignment1);

let assignment2 = new Assignment();
assignment2.set('a', false);
assignment2.set('b', true);
assignment2.set('c', false);
assignments.add(assignment2);
console.log(coverageCreator.createFromAssignments(assignments).mintermArray.map(v => v.value));
//test createFromAssignments*/

/*test createFromSimpleDisjunction
import compiler from "@/logic/compiler";
import {MintermCreator} from "@/logic/minterm-creator";
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('a');
order.push('b');
order.push('c');
let coverageCreator = new CoverageCreator(new MintermCreator(order));
console.log(coverageCreator.createFromSimpleDisjunction(compiler.parse('a and b or true or false or a and c ')));
console.log(coverageCreator.createFromSimpleDisjunction(compiler.parse('a and b')));

//test createFromSimpleDisjunction*/
