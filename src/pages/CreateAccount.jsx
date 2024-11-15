
import { Card, Space } from 'antd';

   import React, { useState } from 'react';
   import {
     AutoComplete,
     Button,
     Cascader,
     Checkbox,
     Col,
     Form,
     Input,
     InputNumber,
     Row,
     Select,
   } from 'antd';
   const { Option } = Select;
   const formItemLayout = {
     labelCol: {
       xs: {
         span: 24,
       },
       sm: {
         span: 8,
       },
     },
     wrapperCol: {
       xs: {
         span: 24,
       },
       sm: {
         span: 16,
       },
     },
   };
   const tailFormItemLayout = {
     wrapperCol: {
       xs: {
         span: 24,
         offset: 0,
       },
       sm: {
         span: 16,
         offset: 8,
       },
     },
   };
   export const CreateAccount = () => {
     const [form] = Form.useForm();
     const [role, setRole] = useState(''); 
     
     
     const onRoleChange = (value) => {
       setRole(value);
     };
     const onFinish = (values) => {
       console.log('Received values of form: ', values);
     };
     const prefixSelector = (
       <Form.Item name="prefix" noStyle>
         <Select
           style={{
             width: 70,
           }}
         >
           <Option value="27">+27</Option>
         </Select>
       </Form.Item>
     );
     return (
       <div className="LogInpage">
         <Card>
           <Form
             {...formItemLayout}
             form={form}
             name="register"
             onFinish={onFinish}
             initialValues={{
               prefix: "27",
             }}
             style={{
               maxWidth: 600,
             }}
             scrollToFirstError
           >
            <h1>Register</h1>
            
             <Form.Item
               name="Name"
               label="Name"
               rules={[
                 {
                   required: true,
                   message: "Please input your Name!",
                   whitespace: true,
                 },
               ]}
             >
               <Input />
             </Form.Item>
             <Form.Item
               name="Surname"
               label="Surname"
               rules={[
                 {
                   required: true,
                   message: "Please input your Surname!",
                   whitespace: true,
                 },
               ]}
             >
               <Input />
             </Form.Item>
             <Form.Item
               name="email"
               label="E-mail"
               rules={[
                 {
                   type: "email",
                   message: "The input is not valid E-mail!",
                 },
                 {
                   required: true,
                   message: "Please input your E-mail!",
                 },
               ]}
             >
               <Input />
             </Form.Item>
             <Form.Item
               name="phone"
               label="Phone Number"
               rules={[
                 {
                   required: true,
                   message: "Please input your phone number!",
                 },
               ]}
             >
               <Input
                 addonBefore={prefixSelector}
                 style={{
                   width: "100%",
                 }}
               />
             </Form.Item>
             <Form.Item
               name="role"
               label="Role"
               rules={[
                 {
                   required: true,
                   message: "Please select role!",
                 },
               ]}
             >
               <Select placeholder="select your role" onChange={onRoleChange}>
                 <Option value="member">Member</Option>
                 <Option value="specialist">Specialist</Option>
               </Select>
             </Form.Item>
             {role === "specialist" && (
              <>
               <Form.Item
                 name="specialization"
                 label="Specialization"
                 rules={[
                   { required: true, message: "Please select specialization" },
                 ]}
               >
                 <Select placeholder="select your specialization">
                   <Option value="biokineticist">Biokineticist</Option>
                   <Option value="dietitian">Dietitian</Option>
                   <Option value="physiotherapist">Physiotherapist</Option>
                 </Select>{" "}
               </Form.Item>
             
             <Form.Item
               name="password"
               label="Password"
               rules={[
                 {
                   required: true,
                   message: "Please input your password!",
                 },
               ]}
               hasFeedback
             >
               <Input.Password />
             </Form.Item>
             
             <Form.Item
               name="confirm"
               label="Confirm Password"
               dependencies={["password"]}
               hasFeedback
               rules={[
                 {
                   required: true,
                   message: "Please confirm your password!",
                 },
                 ({ getFieldValue }) => ({
                   validator(_, value) {
                     if (!value || getFieldValue("password") === value) {
                       return Promise.resolve();
                     }
                     return Promise.reject(
                       new Error(
                         "The new password that you entered do not match!"
                       )
                     );
                   },
                 }),
               ]}
             >
               <Input.Password />
             </Form.Item>
             </>
              )}
             <Form.Item
               name="agreement"
               valuePropName="checked"
               rules={[
                 {
                   validator: (_, value) =>
                     value
                       ? Promise.resolve()
                       : Promise.reject(new Error("Should accept agreement")),
                 },
               ]}
               {...tailFormItemLayout}
             >
               <Checkbox>
                 I have read the <a href="">agreement</a>
               </Checkbox>
             </Form.Item>
             <Form.Item {...tailFormItemLayout}>
               <Button type="primary" htmlType="submit">
                 Register
               </Button>
             </Form.Item>
           </Form>
         </Card>
       </div>
     );
   };
