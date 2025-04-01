import React, { useState } from "react";
import { Row, Col, Typography, Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import ViewNoteModal from "../components/ViewNoteModal";
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from "../hooks/useNotes";

const { Title } = Typography;

const COLORS = {
  red: { light: "#FED5D5", dark: "#FF8A8A" },
  green: { light: "#D5FEDA", dark: "#55D764" },
  brown: { light: "#EFC9A1", dark: "#CE8F4D" },
  purple: { light: "#D3C3E8", dark: "#653F97" },
};

const NotesPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: notes = [], isLoading } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  const handleCreateOrEditNote = (noteData) => {
    if (selectedNote) {
      updateNote.mutate(
        { id: selectedNote.id, data: noteData },
        { onSuccess: () => messageApi.success('Заметка обновлена') }
      );
    } else {
      createNote.mutate(noteData, { onSuccess: () => messageApi.success('Заметка добавлена') });
    }
    setModalVisible(false);
    setSelectedNote(null);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteNote.mutate(id, { onSuccess: () => messageApi.success('Заметка удалена') });
  };

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div>
      {contextHolder}
      <Flex wrap justify="left" gap={"large"}>
        {notes.map((note) => (
          <NoteCard
            title={note.title}
            content={note.content}
            color={COLORS[note.color].light}
            onEdit={() => handleEdit(note)}
            onDelete={() => handleDelete(note.id)}
            onView={() => setViewingNote(note)}
          />
        ))}
      </Flex>

      <div className="new-note-button-container">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedNote(null);
            setModalVisible(true);
          }}
        >
          Новая заметка
        </Button>
      </div>

      <NoteModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNote(null);
        }}
        onSubmit={handleCreateOrEditNote}
        initialValues={selectedNote}
      />
      <ViewNoteModal
        visible={!!viewingNote}
        onClose={() => setViewingNote(null)}
        note={viewingNote}
      />
    </div>
  );
};

export default NotesPage;
