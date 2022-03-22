import {AtomicProposition, Conjunction, False, Negation, True} from "@/logic/well-formed";

class MintermWellFormedConvertor {
    constructor(atomicPropositionOrder) {
        this.atomicPropositionOrder = atomicPropositionOrder;
    }

    convertMintermToConjunction(minterm) {
        let value = minterm.value;
        //debug
        if (value.length < 1) throw 'minterm value error!'
        //debug*/
        if (value === '-'.repeat(value.length)) return new False();
        if (value === '*'.repeat(value.length)) return new True();
        let conjuncts = [];
        for (let i = 0; i < value.length; i++) {
            switch (value[i]) {
                case '0':
                    conjuncts.push(new Negation(new AtomicProposition(this.atomicPropositionOrder.getValueOf(i))));
                    break;
                case '1':
                    conjuncts.push(new AtomicProposition(this.atomicPropositionOrder.getValueOf(i)));
                    break;
                case '*':
                    break;
                default:
                    throw 'unknow char'
            }
        }
        if (conjuncts.length === 1) {
            return conjuncts[0];
        }
        return new Conjunction(...conjuncts);
    }
}

export {MintermWellFormedConvertor}

/*test convertMintermToConjunction
import {StringOrder} from "@/logic/string-order";
import {Minterm} from "@/logic/minterm";
let order = new StringOrder();
order.push('a');
order.push('b');
order.push('c');
let test = new Minterm('---');
let testCovertor = new MintermWellFormedConvertor(order);
console.log(testCovertor.convertMintermToConjunction(test).toString());
test = new Minterm('***');
console.log(testCovertor.convertMintermToConjunction(test).toString());
test = new Minterm('1*0');
console.log(testCovertor.convertMintermToConjunction(test).toString());
test = new Minterm('110');
console.log(testCovertor.convertMintermToConjunction(test).toString());
//test convertMintermToConjunction*/