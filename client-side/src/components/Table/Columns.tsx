import { FC } from "react";
import { Popconfirm, Typography } from "antd";
import { format, formatRelative,formatISO9075 } from "date-fns";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { TableProps } from "./model.table";
import Checkbox from "../Checkbox";

const ColumnData = ({
  data,
  edit,
  editingKey,
  cancel,
  save,
  form,
  handleDelete,
  handleStatus,
  isEditing,
  loading,
  selectedRowKeys,
  setSelectedRowKeys,
}: TableProps): any => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any, record: any) => (
        <Checkbox handleChange={() => handleStatus(record)} active={text} />
      ),
    },
    {
      title: "Last Login Time",
      dataIndex: "lastLoginAt",
      render: (text: any) => format(new Date(text), "hh:mm a (MMM do. yyyy)")
    },
    {
      title: "Registered Time",
      dataIndex: "createdAt",
      render: (text: any) => format(new Date(text), "hh:mm a (MMM do. yyyy)")
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Popconfirm
              title="Sure to change?"
              onConfirm={() => save(record._id)}
            >
              <CheckCircleOutlined
                style={{ color: "blue", fontSize: "20px", marginRight: 15 }}
              />
            </Popconfirm>

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <EditOutlined style={{ fontSize: "20px" }} />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete([record._id])}
            >
              <DeleteOutlined
                disabled={editingKey !== ""}
                className="ml-4"
                style={{ color: "red", fontSize: "20px" }}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return mergedColumns;
};

export default ColumnData;
