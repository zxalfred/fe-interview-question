# Algorithm

* 数组乱序

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

* 数组扁平化

  ```javascript
  const flattenDeep = (arr) => Array.isArray(arr)
    ? arr.reduce((a, b) => [...a, ...flattenDeep(b)] , [])
    : [arr]
  ```