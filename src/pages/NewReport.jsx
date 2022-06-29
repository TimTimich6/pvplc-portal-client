import cl from "./NewReport.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import RoundButton from "../components/Reusable/RoundButton";
import Select from "react-select";
import Activity from "../components/Activity";
import { useList, useTitle } from "react-use";
import { v4 as uuid } from "uuid";
import reserves from "../components/reserves.json";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const NewReport = () => {
  const nav = useNavigate();
  const axios = useApi();
  const emptyActivity = { trail: "", activity: "", notes: "", quantity: 0, uuid: "" };
  const [error, setError] = useState("");
  useTitle("Create Report");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("13:10");
  const [endTime, setEndTime] = useState("14:40");

  const [reserve, setReserve] = useState(null);
  const today = new Date();

  const [activities, { removeAt, push, reset, updateAt }] = useList([{ trail: "", activity: "", notes: "", quantity: 0, uuid: "first" }]);
  function deleteActivity(index) {
    removeAt(index);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    const resp = await axios
      .post("/reports", {
        reserve: reserve.value,
        activities,
        date: startDate,
        startTime,
        endTime,
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
    if (resp.data) {
      console.log(resp.data);
      nav("/reports");
    }
  }
  console.log(activities);
  return (
    <div className={cl.total}>
      <h1 className={cl.title}>New Report</h1>
      <div className={cl.slot}>
        <span className={cl.label}>Date</span>
        <DatePicker selected={startDate} maxDate={today} className={cl.input} onChange={(date) => setStartDate(date)}></DatePicker>
      </div>
      <div className={cl.slot}>
        <span className={cl.label}>Start Time</span>
        <input type="time" name="time" id="" className={cl.input} value={startTime} onChange={(event) => setStartTime(event.target.value)} />
      </div>
      <div className={cl.slot}>
        <span className={cl.label}>End Time</span>
        <input type="time" name="time" id="" className={cl.input} value={endTime} onChange={(event) => setEndTime(event.target.value)} />
      </div>
      <div className={cl.slot}>
        <span className={cl.label}>Reserve</span>
        <Select
          options={reserves}
          className={cl.input + " " + cl.select}
          placeholder={"Select One"}
          value={reserve}
          onChange={(pick) => setReserve(pick)}
        />
      </div>
      {activities.map((activity, index) => {
        console.log(activity);
        return (
          <Activity
            key={activity.uuid}
            updateAt={updateAt}
            activity={activity}
            index={index}
            delete={() => deleteActivity(index)}
            reserve={reserve}
          />
        );
      })}
      <div className={cl.buttons}>
        <RoundButton
          cl={cl.smallbutton}
          onClick={() => {
            const emptycopy = emptyActivity;
            const id = uuid();
            emptycopy.uuid = id;
            push(emptycopy);
          }}
        >
          Add Activity
        </RoundButton>
        <RoundButton cl={cl.smallbutton} onClick={reset}>
          Clear Activities
        </RoundButton>
      </div>
      <RoundButton cl={cl.button} onClick={(e) => submit(e)}>
        Submit
      </RoundButton>
      {error && <p className={cl.error}>{error}</p>}
    </div>
  );
};

export default NewReport;