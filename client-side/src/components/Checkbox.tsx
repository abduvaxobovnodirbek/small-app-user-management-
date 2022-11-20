import React from 'react';
import { Switch, Space } from 'antd';

interface ISwitchProps {
  handleChange:(e:any)=>void,
  active:boolean
}

const Checkbox: React.FC<ISwitchProps> = ({handleChange,active}) => (
 
  <Space direction="vertical">
    <Switch checkedChildren="active" checked={active} onChange = {(e)=>handleChange(e)} unCheckedChildren="blocked" />
  </Space>
);

export default Checkbox;