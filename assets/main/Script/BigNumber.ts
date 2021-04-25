const UNIT_NUM = 7;
export class BigNumber {
	N:number;
    K:number;
    M:number;
    G:number;
    T:number;
    P:number;
    E:number;

	head:number;//最高位置(提高算法效率) 0：代表所有都为0 1：代表只有n>0 2：代表k>0 ...
	numStr:string;
	constructor(protoBig) {
		this.reset();
		this.N = protoBig.N;
		this.K = protoBig.K;
		this.M = protoBig.M;
		this.G = protoBig.G;
		this.T = protoBig.T;
		this.P = protoBig.P;
		this.E = protoBig.E;
		this.serialize();
		return this;
	}
	reset() {
		this.N = 0;
		this.K = 0;
		this.M = 0;
		this.G = 0;
		this.T = 0;
		this.P = 0;
		this.E = 0;
		this.numStr = "0";
		this.head = 0;
	}
	serialize():string {
		let array=[this.E, this.P, this.T, this.G, this.M, this.K, this.N];
		let str = '';
		let appended = false;
		for (let index = 0; index < array.length; index++) {
			const value = array[index];
			if (value>0) {
				if (appended) {
					str += ('000' + value).slice(-3);
				} else {
					str += value;
					this.head = UNIT_NUM - index;
				}
				appended = true;
			}else{
				if (appended) {
					str += '000';
				}
			}
		}
		this.numStr = str
		return  str;
	}
	//获取缩略值，例：102.9K
	getShrinkNumber():string{
		let numStr = '';
		let array = [0, this.N, this.K, this.M, this.G, this.T, this.P, this.E];
		if (this.head == 0 || this.head == 1) {
			return '' + this.N;
		}
		numStr = array[this.head] + '.' + Math.round(array[this.head - 1] / 100) + this.getUnitName();
		return numStr;
	}
	getUnitName():string {
		switch (this.head) {
			case 1: return 'N';
			case 2: return 'K';
			case 3: return 'M';
			case 4: return 'G';
			case 5: return 'T';
			case 6: return 'P';
			case 7: return 'E';
			default: return '';
		}
	}
	// 1:大 -1:小 0:相等
	compare(bigNum:BigNumber):number{
		if (this.head > bigNum.head) {
			return 1;
		}else if (this.head < bigNum.head) {
			return -1;
		}
		let array1 = [this.E, this.P, this.T, this.G, this.M, this.K, this.N];
		let array2 = [bigNum.E, bigNum.P, bigNum.T, bigNum.G, bigNum.M, bigNum.K, bigNum.N];
		for (let index = 0; index < array1.length; index++) {
			if (array1[index] > array2[index]) {
				return 1;
			} else if (array1[index] < array2[index]) {
				return -1;
			}
		}
		return 0;
	}
	//由于int64类型的数字转化为Number会丢失部分数据，所以打算转化为string计算
	compareS(numStr_: string) {
		if (this.numStr.length > numStr_.length) {
			return 1;
		} else if (this.numStr.length < numStr_.length) {
			return -1;
		}
		for (let index = 0; index < this.numStr.length; index++) {
			let unitNum1 = Number(this.numStr[index]);
			let unitNum2 = Number(numStr_[index]);
			if (unitNum1 > unitNum2) {
				return 1;
			}else if (unitNum1 < unitNum2) {
				return -1;
			}
		}
		return 0;
	}
	sub(bigNum:BigNumber){
		if (bigNum.head === 0) {
			return;//减数为0，不需要运算
		}
		let temp,parentMinusedNum = 0;
		let array1 = [this.N, this.K, this.M, this.G, this.T, this.P, this.E];
		let array2 = [bigNum.N, bigNum.K, bigNum.M, bigNum.G, bigNum.T, bigNum.P, bigNum.E];
		for (let index = 0; index < UNIT_NUM; index++) {
			temp = array1[index] - array2[index] - parentMinusedNum;
			if (temp < 0) {
				if (index == UNIT_NUM - 1) {
					this.reset();//不可为负数
				} else {
					this.updateByUnit(index + 1, temp + 1000)
					parentMinusedNum = 1;
				}
			} else {
				this.updateByUnit(index + 1, temp);
				parentMinusedNum = 0;
			}
			if (index >= bigNum.head - 1 && parentMinusedNum === 0) {
				break;
			}
		}
		this.serialize();
	}
	//由于int64类型的数字转化为Number会丢失部分数据，所以打算转化为string计算
	subS(numStr: string){
		if (numStr.length == 0 || numStr == '0') {
			return;//减数为0，不需要运算
		}
		let array1 = [this.N, this.K, this.M, this.G, this.T, this.P, this.E];
		let array2 = [0, 0, 0, 0, 0, 0, 0];
		let unitIndex = this.strToNumberArray(numStr,array2);
		
		let temp,parentNum = 0;
		for (let index = 0; index < UNIT_NUM; index++) {
			temp = array1[index] - array2[index] - parentNum;
			if (temp < 0) {
				if (index == UNIT_NUM - 1) {
					this.reset();//不可为负数
				} else {
					this.updateByUnit(index + 1, temp + 1000)
					parentNum = 1;
				}
			} else {
				this.updateByUnit(index + 1, temp);
				parentNum = 0;
			}
			if (index >= unitIndex - 1 && parentNum === 0) {
				break;
			}
		}
		this.serialize();
	}
	add(bigNum:BigNumber){
		if (bigNum.head === 0) {
			return;//加数为0，不需要运算
		}
		
		let array1 = [this.N, this.K, this.M, this.G, this.T, this.P, this.E];
		let array2 = [bigNum.N, bigNum.K, bigNum.M, bigNum.G, bigNum.T, bigNum.P, bigNum.E];
		let temp,parentNum = 0;
		for (let index = 0; index < UNIT_NUM; index++) {
			temp = array1[index] + array2[index] + parentNum;
			if (temp >= 1000) {
				this.updateByUnit(index + 1, temp - 1000)
				parentNum = 1;
			} else {
				this.updateByUnit(index + 1, temp);
				parentNum = 0;
			}
			if (index >= bigNum.head - 1 && parentNum === 0) {
				break;
			}
		}
		this.serialize();
	}
	//由于int64类型的数字转化为Number会丢失部分数据，所以打算转化为string计算
	addS(numStr: string){
		if (numStr.length == 0 || numStr == '0') {
			return;//加数为0，不需要运算
		}
		let array1 = [this.N, this.K, this.M, this.G, this.T, this.P, this.E];
		let array2 = [0, 0, 0, 0, 0, 0, 0];
		let unitIndex = this.strToNumberArray(numStr,array2);

		let temp,parentNum = 0;
		for (let index = 0; index < UNIT_NUM; index++) {
			temp = array1[index] + array2[index] + parentNum;
			if (temp >= 1000) {
				this.updateByUnit(index + 1, temp - 1000)
				parentNum = 1;
			} else {
				this.updateByUnit(index + 1, temp);
				parentNum = 0;
			}
			if (index >= unitIndex - 1 && parentNum === 0) {
				break;
			}
		}
		this.serialize();
	}
	strToNumberArray(numStr:string,array){
		let tempStr:string = numStr;
		let unitIndex = 0;
		for (let index = 0; index < array.length; index++) {
			if (tempStr.length < 3) {
				tempStr = ('000' + tempStr).slice(-3);
			}
			array[index] = Number(tempStr.substring(tempStr.length - 3));
			tempStr = tempStr.substring(0, tempStr.length - 3);
			if (tempStr.length <= 0) {
				unitIndex = index + 1;
				break;
			}
		}
		return unitIndex;
	}
	updateByUnit(unit,number){
		switch(unit){
			case 1:this.N = number;
			break;
			case 2:this.K = number;
			break;
			case 3:this.M = number;
			break;
			case 4:this.G = number;
			break;
			case 5:this.T = number;
			break;
			case 6:this.P = number;
			break;
			case 7:this.E = number;
			break;
		}
	}
}
