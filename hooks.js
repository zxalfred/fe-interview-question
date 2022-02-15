function useRequest(fn, delay) {
  const [state, setState] = useState({ data: undefined, loading: false, error: undefined})
  const persistFn = useCallback(fn, [fn])
  const timerRef = useRef()
  const run = useCallback(async (...args) => {
    const timer = timerRef.current
    if (timer) clearTimeout(timer)
    setTimeout(() => {
      try {
        const data = await persistFn(...args)
        setState({data, loading: false, error: undefined})
      } catch (error) {
        setState({data: undefined, loading: false, error})
      }
    }, delay)
    setState((v) => ({...v, loading: true}))
    
  }, [persistFn, timerRef])
  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    run,
  }
}

function useMemoizedFn() {
  const fnRef = useRef(fn)
  fnRef.current = useMemo(() => fn, [fn])

  const memoizedFn = useRef()
  if (!memoizedFn.current) {
    memoizedFn.current = function (...args) {
      return fnRef.current.apply(this, args)
    }
  }

  return memoizedFn.current
}
