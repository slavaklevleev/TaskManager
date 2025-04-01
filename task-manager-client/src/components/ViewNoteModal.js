import React from "react";
import { Modal, Typography } from "antd";

const { Title, Paragraph } = Typography;

const COLORS = {
  red: { light: "#FED5D5", dark: "#FF8A8A" },
  green: { light: "#D5FEDA", dark: "#55D764" },
  brown: { light: "#EFC9A1", dark: "#CE8F4D" },
  purple: { light: "#D3C3E8", dark: "#653F97" },
};

const ViewNoteModal = ({ visible, onClose, note }) => {
  if (!note) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={note.title}
      bodyStyle={{ backgroundColor: COLORS[note.color].light, padding: 24 }}
    >
      <Paragraph style={{ whiteSpace: "pre-wrap", color: "#000" }}>
        {note.content}
      </Paragraph>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
      >
        <button
          style={{
            padding: "8px 16px",
            border: "none",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </Modal>
  );
};

export default ViewNoteModal;
