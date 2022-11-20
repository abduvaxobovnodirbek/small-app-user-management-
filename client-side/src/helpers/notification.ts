import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

export const errorNotification = (
  placement: NotificationPlacement,
  sentence: string
) => {
  notification.error({
    duration: 3,
    style: { background: "#f2163e", color: "white" },
    description: `${sentence}`,
    placement,
    message: "",
  });
};

export const successNotification = (
  placement: NotificationPlacement,
  sentence: string
) => {
  notification.success({
    duration: 3,
    style: { background: "rgb(75,181,67)", color: "white" },
    description: `${sentence}`,
    placement,
    message: "",
  });
};
