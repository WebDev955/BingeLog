import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toastActions } from "../../store/slices/toastSlice"
import styles from "./ToastNotification.module.css"

const TOAST_DURATION_MS = 3000;

function ToastItem({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(toastActions.dismissToast(toast.id))
    }, TOAST_DURATION_MS)

    return () => clearTimeout(timer)
  }, [toast.id, dispatch])

  return (
    <p className={`${styles.toast} ${styles[toast.type]}`}>{toast.message}</p>
  )
}

function ToastNotification() {
  const queue = useSelector((state) => state.toast.queue)

  return (
    <div className={styles.toastWrapper}>
      {queue.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
export default ToastNotification;
