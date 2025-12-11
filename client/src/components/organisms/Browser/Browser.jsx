import { Input, Row } from "antd";
import { useRef } from "react";

export const Browser = ({ projectId }) => {
  const browserRef = useRef(null);
  const port = 3000;

  if (!port) {
    return <div>Loading ...</div>;
  }

  return (
    <Row
      style={{
        backgroundColor: "#22212b",
      }}
    >
      <Input
        width={{
          width: "100%",
          height: "30px",
          color: "white",
          fontFamily: "Fira Code",
          backgroundColor: "#282a35",
        }}
        defaultValue={`http://localhost:${port}`}
      />
      <iframe
        ref={browserRef}
        src={`http://localhost:${port}`}
        style={{
          width: "100%",
          height: "95vh",
          border: "none",
        }}
      />
    </Row>
  );
};
