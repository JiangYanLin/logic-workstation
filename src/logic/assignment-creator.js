import {Assignment} from "@/logic/assignment";

class AssignmentCreator {
    constructor(atomicPropositionOrder) {
        this.atomicPropositionOrder = atomicPropositionOrder;
    }

    createAssignmentFromIntValue(intValue) {
        let binaryValueArray = intValue.toString(2).split('').map((v) => {
            switch (v) {
                case '0':
                    return false;
                case '1':
                    return true;
                //debug
                default:
                    throw 'getAssignmentByIntValue value error';
                //debug*/
            }
        });
        let length = this.atomicPropositionOrder.length;
        while (binaryValueArray.length < length) {
            binaryValueArray.unshift(false);
        }
        let assignment = new Assignment();
        for (let i = 0; i < length; i++) {
            assignment.set(this.atomicPropositionOrder.getValueOf(i), binaryValueArray[i]);
        }
        return assignment;
    }
}

export {AssignmentCreator}

/*test createAssignmentFromIntValue
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('a');
order.push('b');
order.push('c');
let assignmentCreator = new AssignmentCreator(order);
console.log(assignmentCreator.createAssignmentFromIntValue(5));
console.log(assignmentCreator.createAssignmentFromIntValue(0));
//test createAssignmentFromIntValue*/