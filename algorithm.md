# Algorithm

* 数组乱序

  ```javascript
  // Fisher-Yates 乱序法（可用数学归纳法证明）
  const shuffle = (nums) => {
    for (let i = nums.length - 1; i > 0; i--) {
      const j = ~~(Math.random() * (i + 1))
      const temp = nums[i]
      nums[i] = nums[j]
      nums[j] = temp
    }
    return nums
  }
  ```

  