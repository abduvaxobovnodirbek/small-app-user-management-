import React, { FC, useEffect, useState } from "react";
import { Table as TableBlock, ConfigProvider } from "antd";
import { format } from "date-fns";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { deleteUser, editUser, getUsers } from "../store/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Checkbox from "./Checkbox";
import {
  errorNotification,
  successNotification,
} from "../helpers/notification";

const Table: FC = () => {
  const dispatch = useAppDispatch();
  const usersList = useAppSelector((state) => state.users.list);
  const loading = useAppSelector((state) => state.users.loading);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

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

  const columns: ColumnsType = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <Checkbox handleChange={() => handleStatus(record)} active={text} />
      ),
    },
    {
      title: "Registered Time",
      dataIndex: "createdAt",
      render: (text) => format(new Date(text), "MMMM do. yyyy"),
    },
  ];

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
      <TableBlock
        rowSelection={rowSelection}
        columns={columns}
        dataSource={usersList}
        rowKey="_id"
        loading={loading}
      />
    </ConfigProvider>
  );
};

export default Table;
