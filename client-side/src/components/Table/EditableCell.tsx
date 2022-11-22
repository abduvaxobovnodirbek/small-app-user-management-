import type { EditableCellProps } from "./model.table";

import { FC } from "react";
import { Form, Input } from "antd";

const EditableCell: FC<EditableCellProps> = ({
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

export default EditableCell;
