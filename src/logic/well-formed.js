import {StringOrder} from "@/logic/string-order";

class WellFormed {
    date = {
        atomicPropositionOrder: undefined
    }

    get atomicPropositionOrder() {
        if (this.date.atomicPropositionOrder !== undefined) {
            return this.date.atomicPropositionOrder;
        } else {
            return this.date.atomicPropositionOrder = this.getDefaultAtomicPropositionOrder();
        }
    }

    set atomicPropositionOrder(value) {
    }

    inverse() {
        return new Negation(this).inward();
    }

    getDefaultAtomicPropositionOrder() {
        throw 'need implementation';
    }

    inward() {
        throw 'need implementation';
    }

    boolFunction(assignment) {
        throw 'need implementation';
    }

    toStringInside(wellFormed) {
        throw 'need implementation';
    }

    toString() {
        throw 'need implementation';
    }
}

class True extends WellFormed {
    static instance = new True();

    constructor() {
        super();
        if (True.instance !== undefined) {
            return True.instance;
        }
    }

    getDefaultAtomicPropositionOrder() {
        return new StringOrder();
    }

    inverse() {
        return new False();
    }

    inward() {
        return new True();
    }

    boolFunction(assignment) {
        return true;
    }

    toStringInside(wellFormed) {
        return 'true';
    }

    toString() {
        return 'true';
    }
}

class False extends WellFormed {
    static instance = new False();

    constructor() {
        super();
        if (False.instance !== undefined) {
            return False.instance;
        }
    }

    getDefaultAtomicPropositionOrder() {
        return new StringOrder();
    }

    inverse() {
        return new True();
    }

    inward() {
        return new False();
    }

    boolFunction(assignment) {
        return false;
    }

    toStringInside(wellFormed) {
        return 'false';
    }

    toString() {
        return 'false';
    }
}

class AtomicProposition extends WellFormed {
    constructor(name) {
        super();
        this.name = name;
    }

    getDefaultAtomicPropositionOrder() {
        let order = new StringOrder();
        order.push(this.name);
        return order;
    }

    inward() {
        return this;
    }

    boolFunction(assignment) {
        return assignment.get(this.name);
    }

    toStringInside(wellFormed) {
        return this.name;
    }

    toString() {
        return this.name;
    }
}

class Negation extends WellFormed {
    constructor(item) {
        super();
        this.item = item;
    }

    getDefaultAtomicPropositionOrder() {
        return this.item.atomicPropositionOrder;
    }

    inverse() {
        return this.item.inward();
    }

    inward() {
        switch (this.item.constructor) {
            case True:
                return new False();
            case False:
                return new True();
            case AtomicProposition:
                return this;
            case Negation:
                return this.item.item.inward();
            case Conjunction:
                return new Disjunction(...this.item.conjuncts.map(conjunct => conjunct.inverse()));
            case Disjunction:
                return new Conjunction(...this.item.disjuncts.map(disjunct => disjunct.inverse()));
            case Implication:
                return new Disjunction(new Negation(this.item.antecedent), this.item.consequent).inverse();
            case IFF:
                return new Conjunction(new Implication(this.item.condition1, this.item.condition2), new Implication(this.item.condition2, this.item.condition1)).inverse();
            default:
                throw 'negation inward error';
        }
    }

    boolFunction(assignment) {
        return !this.item.boolFunction(assignment);
    }

    toStringInside(wellFormed) {
        if (wellFormed instanceof Negation || this.item instanceof AtomicProposition) {
            return this.toString();
        }
        return `(${this.toString()})`;
    }

    toString() {
        return `¬${this.item.toStringInside(this)}`;
    }
}

class Conjunction extends WellFormed {
    constructor(...conjuncts) {
        super();
        //debug
        if (conjuncts.length < 2) {
            throw 'conjunction create error';
        }
        //debug*/
        this.conjuncts = conjuncts;
    }

    getDefaultAtomicPropositionOrder() {
        let order = new StringOrder();
        this.conjuncts.forEach(conjunct => {
            order.pushAll(conjunct.atomicPropositionOrder);
        })
        return order;
    }


    inward() {
        return new Conjunction(...this.conjuncts.map(conjunct => conjunct.inward()));
    }

    boolFunction(assignment) {
        return !this.conjuncts.some(conjunct => !conjunct.boolFunction(assignment));
    }

    toStringInside(wellFormed) {
        return `(${this.toString()})`;
    }

    toString() {
        return this.conjuncts.map(conjunct => conjunct.toStringInside(this)).join('∧');
    }
}

class Disjunction extends WellFormed {
    constructor(...disjuncts) {
        super();
        //debug
        if (disjuncts.length < 2) throw'disjunction create error';
        //debug*/
        this.disjuncts = disjuncts;
    }


    getDefaultAtomicPropositionOrder() {
        let order = new StringOrder();
        this.disjuncts.forEach(disjunct => {
            order.pushAll(disjunct.atomicPropositionOrder);
        });
        return order;
    }

    inward() {
        return new Disjunction(...this.disjuncts.map(disjunct => disjunct.inward()));
    }

    boolFunction(assignment) {
        return this.disjuncts.some(disjunct => disjunct.boolFunction(assignment));
    }

    toStringInside(wellFormed) {
        return `(${this.toString()})`;
    }

    toString() {
        return this.disjuncts.map(disjunct => disjunct.toStringInside(this)).join('∨');
    }

}

class Implication extends WellFormed {
    constructor(antecedent, consequent) {
        super();
        this.antecedent = antecedent;
        this.consequent = consequent;
    }

    getDefaultAtomicPropositionOrder() {
        let order = new StringOrder();
        order.pushAll(this.antecedent.atomicPropositionOrder);
        order.pushAll(this.consequent.atomicPropositionOrder);
        return order;
    }

    inward() {
        return new Implication(this.antecedent.inward(), this.consequent.inward());
    }

    boolFunction(assignment) {
        return !this.antecedent.boolFunction(assignment) || this.consequent.boolFunction(assignment);
    }

    toStringInside(wellFormed) {
        return `(${this.toString()})`;
    }

    toString() {
        return `${this.antecedent.toStringInside(this)}→${this.consequent.toStringInside(this)}`;
    }

    toDisjunction() {
        return new Disjunction(new Negation(this.antecedent), this.consequent);
    }
}

class IFF extends WellFormed {
    constructor(condition1, condition2) {
        super();
        this.condition1 = condition1;
        this.condition2 = condition2;
    }

    getDefaultAtomicPropositionOrder() {
        let order = new StringOrder();
        order.pushAll(this.condition1.atomicPropositionOrder);
        order.pushAll(this.condition2.atomicPropositionOrder);
        return order;
    }

    inward() {
        return new IFF(this.condition1.inward(), this.condition2.inward());
    }

    boolFunction(assignment) {
        return this.condition1.boolFunction(assignment) === this.condition2.boolFunction(assignment);
    }

    toStringInside(wellFormed) {
        return `(${this.toString()})`;
    }

    toString() {
        return `${this.condition1.toStringInside(this)}↔${this.condition2.toStringInside(this)}`;
    }

    toConjunction() {
        return new Conjunction(new Implication(this.condition1, this.condition2), new Implication(this.condition2, this.condition1));
    }
}

export {WellFormed, True, False, AtomicProposition, Negation, Conjunction, Disjunction, IFF, Implication}


//import compiler from "@/logic/formula/compiler";
/*test toString
let true_ = compiler.parse('true');
console.log(true_.toString());
let f = compiler.parse('false');
console.log(f.toString());
let and = compiler.parse('(a and b) and c');
console.log(and.toString());
let or = compiler.parse('a or (b or c)');
console.log(or.toString());
let andor = compiler.parse('a or b and c or d');
console.log(andor.toString());
let imp = compiler.parse('a -> b');
console.log(imp.toString());
let iff = compiler.parse('a <-> b');
console.log(iff.toString());
let not = compiler.parse('not (a <-> b)');
console.log(not.toString());
//test toString*/

/*test inward inverse
let true_ = compiler.parse('true');
console.log(true_.inverse().toString());
let f = compiler.parse('false');
console.log(f.inverse().toString());
let and = compiler.parse('(a and b) and c');
console.log(and.inverse().toString());
let or = compiler.parse('a or (b or c)');
console.log(or.inverse().toString());
let andor = compiler.parse('a or b and c or d');
console.log(andor.inverse().toString());
let imp = compiler.parse('a -> b');
console.log(imp.inverse().toString());
let iff = compiler.parse('a <-> b');
console.log(iff.inverse().toString());
let not = compiler.parse('not (a <-> b)');
console.log(not.inverse().toString());
let inward = compiler.parse('not not a');
console.log(inward.inward().toString());
inward = compiler.parse('(not a and not (c and d))');
console.log(inward.inward().toString());
inward = compiler.parse('(not a or not not (c or d))');
console.log(inward.inward().toString());
inward = compiler.parse('not(a-> b)');
console.log(inward.inward().toString());
inward = compiler.parse('not(a<->not b)');
console.log(inward.inward().toString());
//test inward inverse*/

/*test atomicProposition
let test = compiler.parse('a');
console.log(test.atomicPropositionOrder);
test = compiler.parse('a and b and c or b');
console.log(test.atomicPropositionOrder);
test = compiler.parse('a or b and c');
console.log(test.atomicPropositionOrder);
test = compiler.parse('a -> b and c');
console.log(test.atomicPropositionOrder);
test = compiler.parse('a <-> b and c');
console.log(test.atomicPropositionOrder);
let order1 = test.atomicPropositionOrder;
test = compiler.parse('a');
test.atomicPropositionOrder = order1;
console.log(test.atomicPropositionOrder);
console.log(test.atomicPropositionOrder);
console.log(test.atomicPropositionOrder);
//test atomicProposition*/

/*test boolFunction
import {AssignmentCreator} from "@/logic/assignment-creator";

let test = compiler.parse('a and b or c -> not (d<->e) ');
let assignmentCreator = new AssignmentCreator(test.atomicPropositionOrder);
let assignment = assignmentCreator.createAssignmentFromIntValue(20);
console.log(test.boolFunction(assignment));
//test boolFunction*/