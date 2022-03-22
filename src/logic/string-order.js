class StringOrder {
    stringIndexMap = new Map();
    stringArray = [];

    get length() {
        return this.stringArray.length;
    }

    push(value) {
        if (this.stringIndexMap.has(value)) {
            return false;
        }
        let length = this.stringArray.push(value);
        this.stringIndexMap.set(value, length - 1);
        return true;
    }

    pushAll(stringOrder) {
        stringOrder.stringArray.forEach(string => this.push(string));
    }

    getIndexOf(value) {
        return this.stringIndexMap.get(value);
    }

    getValueOf(index) {
        return this.stringArray[index];
    }
}

export {StringOrder}


/*test getIndexOf getValueOf
let order = new StringOrder();
order.push('abc');
order.push('bcd');
order.push('cde');
console.log('abc', order
    .getIndexOf('bcd'));
console.log(2, order.getValueOf(2))
//test getIndexOf getValueOf*/