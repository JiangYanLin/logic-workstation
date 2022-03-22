import {Coverage} from "@/logic/coverage";

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
