import {AssignmentCreator} from "@/logic/assignment-creator";
import {TrueTable} from "@/logic/true-table";

class TrueTableComputer {
    constructor(wellFormed, atomicPropositionOrder) {
        this.wellFormed = wellFormed;
        wellFormed.atomicPropositionOrder = atomicPropositionOrder;
        this.assignemtCreator = new AssignmentCreator(atomicPropositionOrder);
    }

    getTureTable() {
        let length = 2 ** (this.wellFormed.atomicPropositionOrder.length);
        let result = new TrueTable(this.assignemtCreator);
        for (let i = 0; i < length; i++) {
            let assignment = this.assignemtCreator.createAssignmentFromIntValue(i);
            result.setValue(i, this.wellFormed.boolFunction(assignment));
        }
        return result;
    }
}

export {TrueTableComputer}

/*test getTureTable
import compiler from "@/logic/compiler";
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('a');
order.push('b');
let formula = compiler.parse('a and b');
let computer = new TrueTableComputer(formula, order);
let trueTable = computer.getTureTable();
console.log(trueTable, TrueTableShowable.showable(trueTable, formula));
//test getTureTable*/