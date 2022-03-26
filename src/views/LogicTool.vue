<template>
  <div>
    <div>
      <input id="formula_input" type="text" v-model.lazy="input">
      <button id="formula_submit" @click="submitFormula">确定</button>
    </div>
    <div id="formula_show">
      <div>识别到公式：{{ wellFormedUtil.formulaString() }}</div>
      <div>最简合取式：{{ wellFormedUtil.simplifiedConjunctionString() }}</div>
      <div>最简析取式：{{ wellFormedUtil.simplifiedDisjunctionString() }}</div>
    </div>
    <div>
      <div v-if="wellFormedUtil.trueTableShowAble()">
        <table class="true_table">
          <thead>原始真值表</thead>
          <th v-for="th in wellFormedUtil.trueTable.head">{{ th }}</th>
          <tr v-for="tr in wellFormedUtil.trueTable.body">
            <td v-for="td in tr">{{ td }}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        原始真值表过长，请参考以下简化的真值表：
      </div>
      <div>
        <table class="true_table">
          <thead>简化的真值表</thead>
          <th v-for="th in wellFormedUtil.simplifiedTrueTable.head">
            {{ th }}
          </th>
          <tr v-for="tr in wellFormedUtil.simplifiedTrueTable.body">
            <td v-for="td in tr">
              {{ td }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {WellFormedUtil} from "@/logic/well-formed-util";

export default {
  name: "LogicTool",
  data() {
    return {
      input: "a and b",
      wellFormedUtil: new WellFormedUtil('a and b')
    }
  },
  methods: {
    submitFormula() {
      this.wellFormedUtil = null;
      this.wellFormedUtil = new WellFormedUtil(this.input);
    }
  }
}
</script>
<style>
#formula_input {
  width: 30%;
  margin: 6px;
}

#formula_submit {
  width: 5%;
  margin: 6px;
}

#formula_show {
  margin: 10px;
  font-size: 20px;
}

.true_table {
  margin: 0 auto;
}

.true_table,
.true_table th,
.true_table td {
  text-align: center;
  border-bottom: 1px solid rgb(161, 159, 159);
}

.true_table th,
.true_table td {
  padding: 0 10px;
}
</style>