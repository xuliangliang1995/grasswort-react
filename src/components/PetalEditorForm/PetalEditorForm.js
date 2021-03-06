import React from 'react';
import {Form, Button, Col, Row, Input, Select, Layout, message} from 'antd';
import Iframe from '../../components/Ifame/Iframe';
import Request from "../Axios/Axios";

const { Content,Footer  } = Layout;const { Option } = Select;
const { TextArea } = Input;
class PetalEditorFormBox extends React.Component {
    constructor(props){
        super(props);
        this.state={
            variety: 1,
            flowerId: props.flowerId,
            petalId: props.petalId?props.petalId:0,
            petalName: '',
            petalNote:''
        }
    }

    async componentDidMount(){
        if(this.state.petalId > 0){
            const path = '/flowers/'+this.state.flowerId+'/petal/'+this.state.petalId;
            await Request.get(path)
                .then(res => {
                    this.setState({
                        petalName: res.data.name,
                        petalNote: res.data.note
                    })
                })
                .catch(err => {
                    message.error(err.response.date[0].message)
                })
        }
    }
    getPreviewHtml=()=>{
        return this.props.buildPreviewHtml();
    }
    onClose = ()=>{
        this.props.onClose();
    }
    handleSubmit=(e) => {
        e.preventDefault();
        let _this = this;
        _this.props.form.validateFields((err, values) => {
            if(!err){
                values["raw"]=this.props.editorState.toRAW();
                values["text"]=this.props.editorState.toHTML();
                console.log(values)
                if(this.state.petalId ==0 ){
                    const path = "/flowers/"+this.state.flowerId+"/petal";
                    Request.post(path,values).then((res) => {
                        this.setState({
                            petalId: res.data.id
                        })
                        message.success("添加成功！")
                        this.onClose()
                    }).catch(error => {
                        message.warning(error.response.data[0].message);
                    })
                }else{
                    const path = "/flowers/"+this.state.flowerId+"/petal/"+this.state.petalId;
                    Request.put(path,values).then(res => {
                        message.success("编辑成功！")
                        this.onClose()
                    }).catch(err => {
                        message.warning(err.response.data[0].message)
                    })
                }
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout>
                <Content style={{ height:'50%' }}>
                    <Form layout="vertical" hideRequiredMark style={{ height:'100%',padding:'5px'}}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="">
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请输入标题' }],
                                        initialValue: this.state.petalName,
                                        setFieldsValue: this.state.petalName
                                    })(<Input placeholder="请输入标题" />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="">
                                    {getFieldDecorator('petalVariety', {
                                        rules: [],
                                        initialValue: this.state.variety
                                    })(
                                        <Select placeholder={ "请选择类型" }>
                                            <Option value={1}>富文本</Option>
                                            <Option value={2} disabled>链接</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="">
                                    {getFieldDecorator('note', {
                                        rules: [{ required: true, message: '请填写备注' }],
                                        initialValue: this.state.petalNote,
                                        setFieldsValue: this.state.petalNote
                                    })(
                                        <TextArea
                                            style={{ width: '100%',height:'100%',minHeight:'400px' }}
                                            placeholder="请输入备注信息"
                                            autosize
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Iframe style={{ height:'100%',margin:'0px'}} document={ this.getPreviewHtml() }/>
                        </Row>
                    </Form>
                </Content>
                <Footer style={{ padding:'0px 0px 0px'}}>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e8e8e8',
                            padding: '10px 16px',
                            textAlign: 'right',
                            left: 0,
                            background: '#fff',
                            borderRadius: '0 0 4px 4px',
                        }}
                    >
                        <Button
                            style={{
                                marginRight: 8,
                            }}
                            onClick={this.onClose}
                        >
                            取消
                        </Button>
                        <Button onClick={ this.handleSubmit } type="primary">提交</Button>
                    </div>
                </Footer>
            </Layout>
        );
    }
}

const PetalEditorForm = Form.create()(PetalEditorFormBox);

export default PetalEditorForm;