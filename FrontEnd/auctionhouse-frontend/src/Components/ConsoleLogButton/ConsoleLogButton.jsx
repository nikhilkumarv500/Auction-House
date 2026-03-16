import React from "react";
import { Button } from "react-bootstrap";
import { useStore } from "../../Config/StoreContext/StoreContext";
import "./ConsoleLogButton.scss";
import apiCall from "../../Config/AxiosConfig/apiCall";

const ConsoleLogButton = () => {
  const { globalStore } = useStore();

  const onButtonClick = async () => {
    console.log(globalStore);
  };

  return (
    <Button className="console-log-button" onClick={onButtonClick}>
      ConsoleLog
    </Button>
  );
};

export default ConsoleLogButton;
