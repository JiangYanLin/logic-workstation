class Assignment extends Map {
    /**
     *
     * @param atomicPropositionOrder
     */
    getIntValue(atomicPropositionOrder) {
        let value = 0;
        let length = atomicPropositionOrder.length;
        this.forEach((trueValue, atomic) => {
            if (trueValue) {
                value += 2 ** (length - 1 - atomicPropositionOrder.getIndexOf(atomic));
            }
        });
        return value;
    }
}

export {Assignment}

/*test getIntValue
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('a')
order.push('b')
order.push('c')
let assignment = new Assignment();
assignment.set('a', true);
assignment.set('c', false);
assignment.set('b', true)
console.log(assignment.getIntValue(order));
//test getIntValue*/
