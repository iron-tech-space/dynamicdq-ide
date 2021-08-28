import React, {useState, useEffect} from 'react';
import {Form, Input, Button, notification, Row, Col, Space, Spin} from 'antd';
import SaveFormLogic from './SaveFormLogic';
import {Select} from 'rt-design';
import {getParentPath, notificationError} from '../../../../../utils/baseUtils';
import {apiPostReq, catchNotification, requestLoadConfig} from "../../../../../apis/network";
import {
	convertSharedForRolesStringToTable, convertSharedForRolesTableToString,
	convertSharedForUsersStringToTable,
	convertSharedForUsersTableToString, LargeModalArrayFields,
} from "../Core/ModalArrayFields";
import {ReloadOutlined} from "@ant-design/icons";

const SaveForm = ({data}) => {

	const [loaded, setLoaded] = useState(false);
	const [saveConfig, setSaveConfig] = useState(null);

	useEffect(() => {
		if(!loaded){
			requestLoadConfig(data.url.configuration.get)()
				.then(res => {
					const config = {...data, ...res.data}
					config.logic = JSON.parse(config.logic);
					setSaveConfig(config);
					setLoaded(true);
				})
				.catch(catchNotification)
		}
	}, [loaded])

	const onClickReloadConfig = (e) => {
		setLoaded(false);
	}

	const onSaveAndUpdateHandler = (values) => {
		if(data.dataBase.readOnly){
			notification.error({
				message: 'База доступна только на чтение'
			});
		} else {
			let saveObject = {
				...saveConfig,
				...values,
				logic: JSON.stringify(values.logic),
			};
			apiPostReq(data.url.configuration.set, saveObject)
				.then(res => {
					// setLocalData(newData)
					notification.success({message: `Save [${data.configName}]`})
				})
				.catch(err => catchNotification(err))
		}
	};

	const onFinish = (values) => {
		console.log('Success:', values);
		onSaveAndUpdateHandler(values);
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const prefixCls = 'save-form';

	if (loaded) {
		return (
			<Form
				style={{
					flex: 1,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
				}}
				wrapperCol={{span: 24}}
				// layout={'inline'}
				initialValues={{...saveConfig}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
			>
				{/*<div className={`${prefixCls}-cmd-panel`}>*/}

				{/*</div>*/}
				<div className={`${prefixCls}-fields-panel`}>
					<Row gutter={8}>
						<Col span={9}>
							<Space direction={"vertical"} size={4} style={{width: '100%'}}>
								<span>Description</span>
								<Form.Item
									name={'description'}
									className={'mb-0'}
								>
									<Input/>
								</Form.Item>
							</Space>
						</Col>
						<Col span={5}>
							<LargeModalArrayFields
								id={data.id}
								span={24}
								type={'save'}
								buttonLabel={({length}) => <span>Пользователей: {length}</span> }
								modalTitle={'Доступ пользователям'}
								name={'sharedForUsers'}
								stringToTable={convertSharedForUsersStringToTable}
								tableToString={convertSharedForUsersTableToString}
							/>
						</Col>
						<Col span={5}>
							<LargeModalArrayFields
								id={data.id}
								span={24}
								type={'save'}
								buttonLabel={({length}) => <span>Ролей: {length}</span> }
								modalTitle={'Доступ ролям'}
								name={'sharedForRoles'}
								stringToTable={convertSharedForRolesStringToTable}
								tableToString={convertSharedForRolesTableToString}
							/>
						</Col>
						<Col span={5}>
							{/*<Col span={24} style={{alignItems:'end', height: '100%' paddingBottom: '4px'}}>*/}
								<Space style={{display: "flex", alignItems:'end', height: '100%', paddingBottom: '4px'}}>
									<Button icon={<ReloadOutlined/>} onClick={onClickReloadConfig}>Reload config</Button>
									<Button htmlType='submit' style={{backgroundColor: '#8dd28d', width: '100%'}}>Сохранить</Button>
								</Space>
							{/*</Col>*/}
						</Col>
					</Row>
				</div>
				<Form.Item label='Logic' name='logic' noStyle={true}>
					<SaveFormLogic dataBase={data.dataBase}/>
				</Form.Item>
			</Form>
		);
	} else return <Spin/>;
};

SaveForm.propTypes = {};

export default SaveForm;
