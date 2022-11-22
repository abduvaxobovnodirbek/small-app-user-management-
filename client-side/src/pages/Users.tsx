import { useEffect, useState } from "react";
import { Form } from "antd";

import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import { deleteUser, editUser, getUsers } from "../store/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import type { UserData } from "../components/Table/model.table";
import {
  errorNotification,
  successNotification,
} from "../helpers/notification";

import Table from "../components/Table/Table";

const Users = () => {
  const dispatch = useAppDispatch();
  const usersList = useAppSelector((state) => state.users.list);
  const loading = useAppSelector((state) => state.users.loading);
  const navigate = useNavigate();
  const cookie = new Cookies();
  const [form] = Form.useForm();
  const [data, setData] = useState<UserData[]>([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    dispatch(getUsers())
      .unwrap()
      .catch((err) => {
        errorNotification(
          "bottomRight",
          err?.response?.data?.error || "internal error"
        );
        if (err?.response?.data?.blocked) {
          cookie.remove("accessToken");
          navigate("/login");
        }
      });
  }, []);

  useEffect(() => {
    setData(usersList);
  }, [usersList]);

  const isEditing = (record: UserData) => record._id === editingKey;

  const edit = (record: UserData) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: string) => {
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
          // setSelectedRowKeys([]);
        })
        .catch((err) => {
          errorNotification(
            "bottomRight",
            err?.response?.data?.error || "internal error"
          );
          if (err?.response?.data?.blocked) {
            cookie.remove("accessToken");
            navigate("/login");
          }
        });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleStatus = (e: UserData): void => {
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
        if (err?.response?.data?.blocked) {
          cookie.remove("accessToken");
          navigate("/login");
        }
      });
  };

  const handleDelete = (id: string[]) => {
    dispatch(deleteUser({ ids: id } as { ids: string[] }))
      .unwrap()
      .then(() => {
        successNotification(
          "bottomRight",
          "user has successfully been deleted"
        );
        dispatch(getUsers());
        // setSelectedRowKeys([]);
      })
      .catch((err) => {
        errorNotification(
          "bottomRight",
          err?.response?.data?.error || "internal error"
        );
        if (err?.response?.data?.blocked) {
          cookie.remove("accessToken");
          navigate("/login");
        }
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <Table
        loading={loading}
        data={data}
        editingKey={editingKey}
        isEditing={isEditing}
        edit={edit}
        form={form}
        cancel={cancel}
        save={save}
        handleStatus={handleStatus}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Users;
