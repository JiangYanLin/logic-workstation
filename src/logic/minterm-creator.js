import {Minterm} from "@/logic/minterm";
import {AtomicProposition, Conjunction, False, Negation, True} from "@/logic/well-formed";

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

    createFromSimpleConjunction(conjunction) {
        switch (conjunction.constructor) {
            case True:
                return new Minterm('*'.repeat(this.atomicPropositionOrder.length));
            case False:
                return new Minterm('-'.repeat(this.atomicPropositionOrder.length));
            case AtomicProposition: {
                let indexOfTrue = this.atomicPropositionOrder.getIndexOf(conjunction.name);
                let mintermString = '';
                for (let i = 0; i < this.atomicPropositionOrder.length; i++) {
                    mintermString += i === indexOfTrue ? '1' : '*';
                }
                return new Minterm(mintermString);
            }
            case Negation: {
                //debug
                if (!(conjunction.item instanceof AtomicProposition)) {
                    throw 'minterm create type error';
                }
                //debug*/
                let indexOfTrue = this.atomicPropositionOrder.getIndexOf(conjunction.item.name);
                let mintermString = '';
                for (let i = 0; i < this.atomicPropositionOrder.length; i++) {
                    mintermString += i === indexOfTrue ? '0' : '*';
                }
                return new Minterm(mintermString);
            }
            case Conjunction:
                let mintermStringArray = '*'.repeat(this.atomicPropositionOrder.length).split('');
                conjunction.conjuncts.forEach(conjunct => {
                    if (conjunct instanceof AtomicProposition) {
                        mintermStringArray[this.atomicPropositionOrder.getIndexOf(conjunct.name)] = '1';
                    } else if ((conjunct instanceof Negation) && (conjunct.item instanceof AtomicProposition)) {
                        mintermStringArray[this.atomicPropositionOrder.getIndexOf(conjunct.item.name)] = '0';
                    }
                    //debug
                    else {
                        throw 'minterm create error';
                    }
                    //debug*/
                });
                return new Minterm(mintermStringArray.join(''));
        }
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