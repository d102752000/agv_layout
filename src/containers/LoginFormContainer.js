import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Row, Col, Modal } from 'antd';

import { doLoginRequest } from './../actions';

const FormItem = Form.Item;

class LoginFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.formDisplay = this.formDisplay.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { isLoginBtnLoading: false };
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { doLoginRequest } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // if (values.userName === 'admin' && values.userPassword === 'admin') {
        //   console.log('fffff');
        //   setTimeout(() => this.props.history.push('/admin/'), 1500);
        // } else {
        //   Modal.error({
        //     title: 'Login Failure !!',
        //     content: 'Please check your account or password.',
        //     onOk: () => this.setState({ isLoginBtnLoading: false }),
        //     okText: 'Got it!'
        //   });
        // }
        doLoginRequest(values);
        this.setState({ isLoginBtnLoading: true });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const type = nextProps.type.split('_');
    if (type[type.length - 1] === 'SUCCESS' && nextProps.type !== this.props.type) {
      setTimeout(() => this.props.history.push('/admin/'), 1500);
    } else if (type[type.length - 1] === 'FAILURE' && nextProps.type !== this.props.type) {
      Modal.error({
        title: 'Login Failure !!',
        content: 'Please check your account or password.',
        onOk: () => this.setState({ isLoginBtnLoading: false }),
        okText: 'Got it!'
      });
    }
  }
  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  formDisplay() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('userPassword') && getFieldError('userPassword');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <div className="formInputDiv">
          <FormItem
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
            className="formInput"
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
            )}
          </FormItem>
        </div>
        <div className="formInputDiv">
          <FormItem
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
            className="formInput"
          >
            {getFieldDecorator('userPassword', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
        </div>
        <div className="submitButton">
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.hasErrors(getFieldsError())}
              loading={this.state.isLoginBtnLoading}
            >
              Log in
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
  render() {
    return (
      <Row id="loginForm-container">
        <Col span={24} className="emptyDiv" />
        <Col span={24} className="loginTitle">AGV Operation System</Col>
        <Col span={6} />
        <Col span={12} className="formDiv">
          {this.formDisplay()}
        </Col>
        <Col span={6} />
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return (
    { ...state.admin }
  );
};

const WrappedLoginFormContainer = Form.create()(LoginFormContainer);

export default connect(
  mapStateToProps,
  {  doLoginRequest },
)(WrappedLoginFormContainer);