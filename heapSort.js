// Модуль пірамідального сортування (Heap Sort)
// compare(a, b) < 0  => a має стояти раніше за b

class HeapSort {
  constructor(compare) {
    this.compare = compare || ((a, b) => a - b);
  }

  // просіювання елемента i вниз у купі розміру n
  heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && this.compare(arr[left], arr[largest]) > 0) largest = left;
    if (right < n && this.compare(arr[right], arr[largest]) > 0) largest = right;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      this.heapify(arr, n, largest);
    }
  }

  sort(array) {
    const arr = array.slice();
    const n = arr.length;

    // побудова max-купи
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) this.heapify(arr, n, i);

    // по одному виносимо максимум у кінець
    for (let end = n - 1; end > 0; end--) {
      [arr[0], arr[end]] = [arr[end], arr[0]];
      this.heapify(arr, end, 0);
    }
    return arr;
  }
}

module.exports = HeapSort;
