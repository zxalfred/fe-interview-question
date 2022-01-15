# Algorithm

* 数组乱序 `easy`

  ```javascript
  // Fisher-Yates 乱序法（可用数学归纳法证明）
  const shuffle = (nums) => {
    for (let i = nums.length - 1; i > 0; i--) {
      const j = ~~(Math.random() * (i + 1))
      [nums[i], nums[j]] = [nums[j], nums[i]]
    }
    return nums
  }
  ```

* 数组扁平化 `easy`

  ```javascript
  const flattenDeep = (arr) => Array.isArray(arr)
    ? arr.reduce((a, b) => [...a, ...flattenDeep(b)] , [])
    : [arr]
  ```

* 最长不重复子串 `medium`
  ```javascript
  const lengthOfLongestSubstring = function(s) {
    let result = 0
    const map = new Map()
    let start = 0
    for (let i = 0; i < s.length; i++) {
      const index = map.get(s[i])
      if (index !== undefined && index >= start) {
        start = map.get(s[i]) + 1
      } else {
        result = Math.max(result, i - start + 1)
      }
      map.set(s[i], i)
    }
    return result
  }
  ```
* 公共前缀 `easy`
  ```javascript
  var longestCommonPrefix = function(strs) {
    if (!strs.length) return ''
    if (strs.length === 1) return strs[0]
    let result = ''
    const baseStr = strs[0]
    for (let i = 0; i < baseStr.length; i++) {
      const prefix = baseStr[i]
      for (let j = 1; j < strs.length; j++) {
        if (strs[j][i] !== prefix) return result
      }
      result += prefix
    }
    return result
  };
  ```
* LRU cache
  ```javascript
  class Node {
    constructor(key, val) {
      this.key = key
      this.val = val
    }
  }

  class DoubleList {
    constructor() {
      this.head = new Node(0, 0)
      this.tail = new Node(0, 0)
      this.size = 0
      this.head.next = this.tail
      this.tail.prev = this.head
    }

    addFirst(node) {
      node.next = this.head.next
      node.prev = this.head
      this.head.next.prev = node
      this.head.next = node
      this.size++
    }

    remove(node) {
      node.prev.next = node.next
      node.next.prev = node.prev
      this.size--
    }

    removeLast() {
      if (this.tail.prev === this.head) {
        return null
      }
      const last = this.tail.prev
      this.remove(last)
      return last
    }
  }

  var LRUCache = function(capacity) {
    this.cap = capacity
    this.map = new Map()
    this.cache = new DoubleList()
  };

  LRUCache.prototype.get = function(key) {
    if (!this.map.has(key)) {
      return -1
    }
    const val = this.map.get(key).val
    this.put(key, val)
    return val
  };

  LRUCache.prototype.put = function(key, value) {
    const node = new Node(key, value)
    if (this.map.has(key)) {
      this.cache.remove(this.map.get(key))
    } else if (this.cap === this.cache.size) {
      const last = this.cache.removeLast()
      this.map.delete(last.key)
    }
    this.cache.addFirst(node)
    this.map.set(key, node)
  };
  ```

  * 八皇后
  ```javascript
  var solveNQueens = function(n) {
    if (n < 1) return []
    const result = []
    const help = (row, col, xySum, xyDiff) => {
      if (row >= n) {
        result.push(col)
        return
      }
      for (let i = 0; i < n; i++) {
        if (xySum.includes(i + row) || xyDiff.includes(i - row) || col.includes(i)) {
          continue
        }
        
        help(row + 1, col.concat(i), xySum.concat(i + row), xyDiff.concat(i - row))
      }
    }
    help(0, [], [], [])

    // format result
    for (let i = 0, l = result.length; i < l; i++) {
      for (let j = 0; j < n; j++) {
        const index = result[i][j]
        let val = new Array(n).fill('.')
        val[index] = 'Q'
        val = val.join('')
        result[i][j] = val
      }
    }

    return result
  };
  ```

  * 字符串处理
  ```javascript
  const test1 = "a2[b]a2[b2b2[c]]";
  // abbabccbcc
  const test2 = "2[3[c]]a2a";
  // cccccca2a
  const test3 = "11[abc][d]3[e2]4";
  // abcde2e2e24

  const test = (str) => {
    let leftCount = 0
    let rightCount = 0
    let leftIndex = 0
    let temStr = ''
    let res = ''
    let num = ''
    for(let i = 0; i<str.length; i++) {
        if(str[i] === '[') {
            if(leftCount === 0) {
                leftIndex = i
            }
            leftCount++
        }
        if(str[i] === ']') {
            rightCount++
        }
        if(leftCount === rightCount) {
            if(leftCount === 0) {
                if(!isNaN(Number(str[i]))) {
                    num += str[i]
                } else {
                    res += num + str[i]
                    num = ''
                }
            }else {
                temStr = str.slice(leftIndex + 1, i)
                if(num === '') {
                    res += test(temStr)
                }else {
                    res += test(temStr).repeat(Number(num))
                    num = ''
                }
                leftIndex = 0
                leftCount = 0
                rightCount = 0
            }
        }
    }
    return res + num
  }
  ```

  * 计算器
  ```javascript
   var calculate = function(s) {
    let stack = [], sign = '+', number = ''
    for(let index = 0 ; index < s.length || number; index++) {
        const char = s[index]
        if (char === ' ') continue
        if (/\D/.test(char)) {
            if (sign === '+') {
                stack.push(Number(number))
            } else if (sign === '-') {
                stack.push(-Number(number))
            } else if (sign === '*') {
                stack.push(stack.pop() * Number(number))
            } else {
                stack.push(stack.pop() / Number(number) | 0)
            }
            sign = char
            number = ''
        } else {
            number = number + char

        }
    }
    console.log(stack)
    return stack.reduce((p, v) => p + v)
  };
  ```