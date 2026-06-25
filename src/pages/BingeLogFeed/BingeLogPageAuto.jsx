//IMPORTS - Components
import FeedCard from "./Status/FeedCard";

//IMPORTS - Styles
import styles from "./BingeLogPageAuto.module.css";

//IMPORTS - Hooks

//IMPORTS - Components
import { useSelector, useDispatch } from "react-redux";
import { socialFeedActions } from "../../store/slices/socialFeedSlice";

function BingeLogPageAuto() {
  const dispatch = useDispatch();
  const friendStatuses = useSelector((state) => state.socialfeed.autoStatuses);

  const handleStatusTimeSort = (statusArr) => {
    const sorted = [...statusArr].sort((a, b) => b.timeStamp - a.timeStamp);
    dispatch(socialFeedActions.updateAutoStatuses(sorted));
  };

  const handleStatusTimeSortOld = (statusArr) => {
    const sorted = [...statusArr].sort((a, b) => a.timeStamp - b.timeStamp);
    dispatch(socialFeedActions.updateAutoStatuses(sorted));
  };

  const handleStatusUserNameSort = (statusArr) => {
    const sorted = [...statusArr].sort((a, b) =>
      a.userId.localeCompare(b.userId),
    );
    dispatch(socialFeedActions.updateAutoStatuses(sorted));
  };

  return (
    <main className={styles.mainAutoFeedWrapper}>
      <h1>BingeLog Auto Feed</h1>
      <div className={styles.sortingDiv}>
        <h3>Sort:</h3>
        <p onClick={() => handleStatusUserNameSort(friendStatuses)}>Username</p>
        <p onClick={() => handleStatusTimeSort(friendStatuses)}>
          Recently Updates
        </p>
        <p onClick={() => handleStatusTimeSortOld(friendStatuses)}>
          Older Updates
        </p>
      </div>
      {friendStatuses?.length === 0 ? (
        <p>Add friends to see what they are watching!</p>
      ) : (
        friendStatuses.map((status) => (
          <FeedCard key={status.statusId} status={status} />
        ))
      )}
    </main>
  );
}
export default BingeLogPageAuto;
