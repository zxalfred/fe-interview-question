function isObject(target) {
  const type = typeof target
  return target !== null && (type === 'object' || type === 'function')
}

function forEach(array, iteratee) {
  let index = -1
  const { length } = array
  while (++index < length) {
    iteratee(array[index], index)
  }
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const numberTag = '[object Number]';
const regexpTag = '[object RegExp]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function getInit(target) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneOtherType(target, type) {
  const Ctor = target.constructor;
  switch (type) {
      case boolTag:
      case numberTag:
      case stringTag:
      case errorTag:
      case dateTag:
          return new Ctor(target);
      case regexpTag:
          return cloneReg(target);
      case symbolTag:
          return cloneSymbol(target);
      default:
          return null;
  }
}

function cloneSymbol(target) {
  return Object(Symbol.prototype.valueOf.call(target));
}

function cloneReg(target) {
  const reFlags = /\w*$/;
  const result = new target.constructor(target.source, reFlags.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}


function clone(target, map = new WeakMap()) {
  // 原始类型
  if (!isObject(target)) return target

  // 初始化
  const type = getType(target)
  let cloneTarget
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type)
  } else {
    return cloneOtherType(target, type)
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  // 克隆set
  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(clone(value, map))
    })
    return cloneTarget
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  const keys = Array.isArray(target) ? undefined : Object.keys(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    cloneTarget[key] = clone(target[key], map)
  })
  
  return cloneTarget
}

const target = {
  field1: 1,
  field2: undefined,
  field3: {
      child: 'child'
  },
  field4: [2, 4, 8],
  f: () => {},
};

const result = clone(target)
console.log(result)

