import React, { FC, useEffect, useState } from "react";
import {
  Table as TableBlock,
  ConfigProvider,
  Form,
  Input,
  Popconfirm,
  Typography,
} from "antd";
import { format } from "date-fns";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { TableRowSelection } from "antd/es/table/interface";
import { deleteUser, editUser, getUsers } from "../store/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Checkbox from "./Checkbox";
import {
  errorNotification,
  successNotification,
} from "../helpers/notification";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "text";
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {<Input />}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Table: FC = () => {
  const dispatch = useAppDispatch();
  const usersList = useAppSelector((state) => state.users.list);
  const loading = useAppSelector((state) => state.users.loading);

  const [form] = Form.useForm();
  const [data, setData] = useState<any>([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    setData(usersList);
  }, [usersList]);
  const isEditing = (record: any) => record._id === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: any) => {
    try {
      const row = (await form.validateFields()) as any;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }

      dispatch(editUser({ _id: key, ...row }))
        .unwrap()
        .then(() => {
          successNotification(
            "bottomRight",
            "user has successfully been updated"
          );
          dispatch(getUsers());
          setSelectedRowKeys([]);
        })
        .catch((err) => {
          errorNotification(
            "bottomRight",
            err?.response?.data?.error || "internal error"
          );
        });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleStatus = (e: any): any => {
    dispatch(editUser({ ...e, status: !e.status }))
      .unwrap()
      .then(() => {
        successNotification("bottomRight", "user status is changed");
      })
      .catch((err) => {
        errorNotification(
          "bottomRight",
          err?.response?.data?.error || "internal error"
        );
      });
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
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            className="mx-5"
          >
            <EditOutlined style={{ fontSize: "20px" }} />
          </Typography.Link>
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
            onSelect: () => {
              dispatch(
                deleteUser({ ids: selectedRowKeys } as { ids: string[] })
              )
                .unwrap()
                .then(() => {
                  successNotification(
                    "bottomRight",
                    "user has successfully been deleted"
                  );
                  dispatch(getUsers());
                  setSelectedRowKeys([]);
                })
                .catch((err) => {
                  errorNotification(
                    "bottomRight",
                    err?.response?.data?.error || "internal error"
                  );
                });
            },
          }
        : "SELECT_ALL",
    ],
  };

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
