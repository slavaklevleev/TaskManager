import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "./SchedulePage.css";
import { COLORS } from "../const";
import { useEvents, useCreateEvent, useUpdateEvent } from "../hooks/useEvents";

const { TextArea } = Input;

dayjs.locale("ru");

const ColorPicker = ({ value, onChange }) => (
  <Row gutter={8} style={{ marginTop: 10, marginBottom: 20 }}>
    {Object.keys(COLORS).map((colorKey) => (
      <Col key={colorKey}>
        <div
          className={`color-square ${value === colorKey ? "selected" : ""}`}
          style={{ backgroundColor: COLORS[colorKey].light }}
          onClick={() => onChange(colorKey)}
        />
      </Col>
    ))}
  </Row>
);

const renderEventContent = (eventInfo) => <div>{eventInfo.event.title}</div>;

const SchedulePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: events = [], refetch } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === info.event.id);
    setEditingEvent(event);
    form.setFieldsValue({
      title: event.title,
      date: dayjs(event.start),
      startTime: dayjs(event.start),
      endTime: dayjs(event.end),
      comment: event.comment,
      color: event.color,
    });
    setIsModalVisible(true);
  };
  
  useEffect(() => {
      const handle = (e) => {
        const event = events.find((event) => event.id == e.detail.id);
        if (event) {
          handleEventClick({event: {id: event.id}})
        }
      };
      window.addEventListener("open-event-modal", handle);
      return () => window.removeEventListener("open-event-modal", handle);
    }, [events]);

  const handleDateClick = (info) => {
    form.resetFields();
    setEditingEvent({ date: info.dateStr });
    form.setFieldsValue({ date: dayjs(info.dateStr) });
    setIsModalVisible(true);
  };

  

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const date = values.date.format("YYYY-MM-DD");
      const start_time = values.startTime.format("HH:mm:ss");
      const end_time = values.endTime.format("HH:mm:ss");

      const payload = {
        title: values.title,
        date,
        start_time,
        end_time,
        comment: values.comment,
        color: values.color,
      };

      if (editingEvent?.id) {
        await updateEvent.mutateAsync({ id: editingEvent.id, data: payload });
        messageApi.success("Событие обновлено");
      } else {
        await createEvent.mutateAsync(payload);
        messageApi.success("Событие добавлено");
      }

      refetch();
      setIsModalVisible(false);
      setEditingEvent(null);
      form.resetFields();
    } catch (error) {
      if (error?.errorFields) {
        error.errorFields.forEach((field) => messageApi.error(field.errors[0]));
      } else {
        messageApi.error("Ошибка сохранения события");
      }
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[ruLocale]}
          locale="ru"
          dayMaxEvents={3}
          customButtons={{
            addEvent: {
              text: "+",
              click: () => {
                form.resetFields();
                setEditingEvent(null);
                setIsModalVisible(true);
              },
            },
          }}
          headerToolbar={{
            start: "dayGridMonth timeGridWeek timeGridDay",
            center: "prev,title,next",
            end: "today addEvent",
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events.map((event) => ({
            ...event,
            backgroundColor: COLORS[event.color]?.light,
            borderColor: COLORS[event.color]?.dark,
          }))}
          eventDidMount={(info) => {
            if (info.el.classList.contains("fc-daygrid-dot-event")) {
              info.el.style.setProperty("border-color", info.event.borderColor);
              info.el.style.setProperty("background-color", info.event.backgroundColor);
            }
          }}
          eventContent={renderEventContent}
          eventClassNames="myclassname"
          contentHeight="800px"
        />
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingEvent(null);
          form.resetFields();
        }}
        title={editingEvent ? "Редактировать событие" : "Новое событие"}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Название события"
            rules={[{ required: true, message: "Введите название события" }]}
          >
            <Input placeholder="Например: Встреча с командой" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата события"
            rules={[{ required: true, message: "Выберите дату" }]}
          >
            <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} placeholder="Введите дату" />
          </Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Время начала"
                rules={[{ required: true, message: "Выберите время" }]}
              >
                <TimePicker format="HH:mm" style={{ width: "100%" }} placeholder="Введите время" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="Время окончания"
                rules={[
                  { required: true, message: "Выберите время окончания" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startTime = getFieldValue("startTime");
                      if (!startTime || !value) return Promise.resolve();
                      if (value.isBefore(startTime)) {
                        return Promise.reject(new Error("Время окончания не может быть раньше начала"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <TimePicker format="HH:mm" style={{ width: "100%" }} placeholder="Введите время" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="comment" label="Комментарий">
            <TextArea rows={3} placeholder="Например: подготовить документы..." />
          </Form.Item>
          <Form.Item
            name="color"
            label="Цвет события"
            rules={[{ required: true, message: "Выберите цвет" }]}
          >
            <ColorPicker />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setIsModalVisible(false)}>Отменить</Button>
            <Button type="primary" onClick={handleSave}>Сохранить</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SchedulePage;