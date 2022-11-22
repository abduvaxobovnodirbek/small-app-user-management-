import React, { FC, useState } from "react";
import {
  Table as TableBlock,
  ConfigProvider,
  Form,
  Popconfirm,
  Typography,
} from "antd";
import { format, formatRelative } from "date-fns";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { TableRowSelection } from "antd/es/table/interface";
import type { TableProps } from "./model.table";
import EditableCell from "./EditableCell";
import Checkbox from "../Checkbox";

const Table: FC<TableProps> = ({
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
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      selectedRowKeys.length
        ? {
            key: "",
            text: <DeleteOutlined style={{ color: "red" }} />,
            onSelect: () => handleDelete(selectedRowKeys as string[]),
          }
        : "SELECT_ALL",
    ],
  };

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
      render: (text: any) => formatRelative(new Date(text), new Date()),
    },
    {
      title: "Registered Time",
      dataIndex: "createdAt",
      render: (text: any) => format(new Date(text), "MMMM do. yyyy"),
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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: "#c0c7d5",
          colorPrimaryBgHover: "#e6f4ff",
        },
      }}
    >
      <Form form={form} component={false}>
        <TableBlock
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowSelection={rowSelection}
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          rowKey="_id"
          loading={loading}
        />
      </Form>
    </ConfigProvider>
  );
};

export default Table;
