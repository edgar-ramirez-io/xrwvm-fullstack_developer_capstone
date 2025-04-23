import { useEffect, useState } from "react";

const MAX = 3000;

const DeleteConfirmation = ({ onCancel, onConfirm }) => {
  const [remaining, setRemaining] = useState(MAX);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("INTERVAL");
      setRemaining((oldValue) => oldValue - 10);
    }, 10);

    return () => {
      console.log("INTERVAL clean up!");
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log("TIMER");
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    return () => {
      console.log("clean up TIMER");
      clearTimeout(timer);
    };
  }, [onConfirm]);
  return (
    <div className="delete-confirmation">
      <h2>Do you want to delete this place?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remaining} max={MAX} />
    </div>
  );
};

export default DeleteConfirmation;
