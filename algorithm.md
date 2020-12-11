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
