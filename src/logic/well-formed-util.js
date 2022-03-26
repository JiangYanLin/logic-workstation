import compiler from "@/logic/compiler";
import {SimplifiedTrueTable, TrueTable} from "@/logic/true-table";
import {WellFormedSimplifier} from "@/logic/well-formed-simplifier";

class WellFormedUtil {
    constructor(str) {
        this.wellFormed = compiler.parse(str);
        this.simplifier = new WellFormedSimplifier(this.wellFormed);
        this.simplifiedTrueTable = new SimplifiedTrueTable(this.wellFormed);
    }

    get trueTable() {
        if (this._trueTable === undefined) {
            this._trueTable = new TrueTable(this.wellFormed);
        }
        return this._trueTable;
    }

    formulaString() {
        return this.wellFormed.toString();
    }

    simplifiedDisjunctionString() {
        try {
            return this.simplifier.simplifyDisjunctive().toString();
        } catch (e) {
            return '算力不足无法计算！';
        }

    }

    simplifiedConjunctionString() {
        try {
            return this.simplifier.simplifyConjunctive().toString();
        } catch (e) {
            return '算力不足无法计算！';
        }
    }

    trueTableShowAble() {
        return this.wellFormed.atomicPropositionOrder.length < 6;
    }
}

export {
    WellFormedUtil
}