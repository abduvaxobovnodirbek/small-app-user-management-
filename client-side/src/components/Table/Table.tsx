import { FC } from "react";
import { Table as TableBlock, ConfigProvider, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableRowSelection } from "antd/es/table/interface";
import type { TableProps } from "./model.table";
import EditableCell from "./EditableCell";
import ColumnData from "./Columns";

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
  setSelectedRowKeys,
  selectedRowKeys,
}) => {
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
          columns={ColumnData({
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
          })}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          rowKey="_id"
          loading={loading}
         scroll={{ x: 240 }}
        />
      </Form>
    </ConfigProvider>
  );
};

export default Table;
