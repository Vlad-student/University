// Модуль пірамідального сортування на основі класу MaxHeap
// compare(a, b) > 0  => a "більше" за b (після сортування стоятиме далі)

class MaxHeap {
    constructor(compare) {
        this.heap = [];
        this.compare = compare || ((a, b) => a - b);
    }

    getParentIndex(i) { return Math.floor((i - 1) / 2); }
    getLeftChildIndex(i) { return 2 * i + 1; }
    getRightChildIndex(i) { return 2 * i + 2; }

    swap(i, j) {
        let temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    siftUp(index) {
        let parentIndex = this.getParentIndex(index);

        while (index > 0 && this.compare(this.heap[parentIndex], this.heap[index]) < 0) {
            this.swap(index, parentIndex);
            index = parentIndex;
            parentIndex = this.getParentIndex(index);
        }
    }

    insert(value) {
        this.heap.push(value);
        this.siftUp(this.heap.length - 1);
    }

    siftDown(index) {
        const length = this.heap.length;
        let largest = index;
        const left = this.getLeftChildIndex(index);
        const right = this.getRightChildIndex(index);

        if (left < length && this.compare(this.heap[left], this.heap[largest]) > 0) {
            largest = left;
        }
        if (right < length && this.compare(this.heap[right], this.heap[largest]) > 0) {
            largest = right;
        }

        if (largest !== index) {
            this.swap(index, largest);
            this.siftDown(largest);
        }
    }

    remove() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return max;
    }

    buildHeap(array) {
        this.heap = array;
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.siftDown(i);
        }
    }

    heapSort() {
        const sortedArray = [];
        const tempHeap = new MaxHeap(this.compare);
        tempHeap.buildHeap([...this.heap]);

        while (tempHeap.heap.length > 0) {
            sortedArray.push(tempHeap.remove());
        }

        return sortedArray.reverse();
    }

    sort() {
        return this.heapSort();
    }

    print() {
        console.log(this.heap.join(" | "));
    }
}

module.exports = MaxHeap;
