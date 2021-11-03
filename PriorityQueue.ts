// 测试一下
class PriorityQueue<T> {
    size: number = 0
    private compare: (item1: T, item2: T) => boolean
    private heap: Array<T> = []

    constructor(compare: (item1: T, item2: T) => boolean) {
        this.compare = compare
        this.heap.length = 1
    }

    private _parentIndex(index: number): number {
        if(index === 1) {
            return 1
        }
        return Math.floor(index / 2)
    }

    private _leftIndex(index: number): number {
        return index * 2
    }

    private _rightIndex(index: number): number {
        return index * 2 + 1
    }

    private _swap(index1: number, index2: number): void {
        const temp = this.heap[index1]
        this.heap[index1] = this.heap[index2]
        this.heap[index2] = temp
    }

    private _up(index: number): void {
        let parentIndex = this._parentIndex(index)
        while(index >= 1 && this.compare(this.heap[index], this.heap[parentIndex])) {
            this._swap(index, parentIndex)
            index = parentIndex
            parentIndex = this._parentIndex(index)
        }
    }

    private _down(index: number): void {
        let currentIndex = index
        while(this._leftIndex(currentIndex) <= this.size) {
            let leftIndex = this._leftIndex(currentIndex)
            const rightIndex = this._rightIndex(currentIndex)
            if(rightIndex <= this.size && this.compare(this.heap[rightIndex], this.heap[leftIndex])){
                leftIndex = rightIndex
            }

            if(this.compare(this.heap[currentIndex], this.heap[leftIndex])){
                return 
            }
            this._swap(currentIndex, leftIndex)
            currentIndex = leftIndex
        }
    }

    push(item: T): boolean {
        this.heap.push(item)
        this._up(this.heap.length - 1)
        this.size++
        return true
    }

    pop(): T | undefined {
        if(this.size === 0) {
            return undefined
        }
        this._swap(1, this.heap.length - 1)
        const res = this.heap.pop()
        this.size--
        this._down(1)
        return res
    }

    peek(): T | undefined {
        if(this.size === 0) {
            return undefined
        }
        return this.heap[1]
    }
}