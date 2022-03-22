import {Minterm} from "@/logic/minterm";

class MintermCreator {
    constructor(atomicPropositionOrder) {
        this.atomicPropositionOrder = atomicPropositionOrder;
    }

    createFromAssignment(assignment) {
        let length = this.atomicPropositionOrder.length;
        let resultValue = '';
        for (let i = 0; i < length; i++) {
            let trueValue = assignment.get(this.atomicPropositionOrder.getValueOf(i));
            //debug
            if (trueValue === undefined) {
                throw 'create minterm form assignment error';
            }
            //debug*/
            resultValue += trueValue ? '1' : '0';
        }
        return new Minterm(resultValue);
    }
}

export {MintermCreator}

/*test createFromAssignment
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('b');
order.push('a');
order.push('c');
let assignment = new Assignment();
assignment.set('a', true);
assignment.set('b', false);
assignment.set('c', true);
console.log(new MintermCreator(order).createFromAssignment(assignment).value);
//test createFromAssignment*/