class TrueTable {
    constructor(assignmentCreator = undefined) {
        this.assignmentCreator = assignmentCreator;
    }

    trueValues = [];

    setValue(index, value) {
        this.trueValues[index] = value;
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

class TrueTableShowable {
    static showable(trueTable, wellFormed) {
        let result = new TrueTableShowable();
        let head = trueTable.assignmentCreator.atomicPropositionOrder.stringArray.map(v => v);
        head.push(wellFormed.toString());
        result.head = head;
        let rowLength = head.length - 1;
        let length = 2 ** (head.length - 1);
        for (let i = 0; i < length; i++) {
            let row = i.toString(2).split('');
            while (row.length < rowLength) {
                row.unshift('0');
            }
            row.push(trueTable.trueValues[i] ? '1' : '0');
            result.addRow(row);
        }
        return result;
    }

    head;
    body = [];

    addRow(row) {
        this.body.push(row);
    }
}

export {TrueTable, TrueTableShowable}

/*test getAssignmentsMakeWellFormedTrue
import {AssignmentCreator} from "@/logic/assignment-creator";
import {StringOrder} from "@/logic/string-order";

let order = new StringOrder();
order.push('b');
order.push('a');
order.push('c');
let trueTable = new TrueTable(new AssignmentCreator(order));
trueTable.setValue(0, true);
trueTable.setValue(1, false);
trueTable.setValue(2, true);
trueTable.setValue(3, true);
console.log(trueTable.getAssignmentsMakeWellFormedTrue());

//test getAssignmentsMakeWellFormedTrue*/