import React, {useState, useEffect} from 'react';
import {Button, Input, Row, Col, Checkbox, Select, notification} from 'antd';
import objectPath from 'object-path';
import {
	ForkOutlined,
	TableOutlined,
	InsertRowRightOutlined,
	SisternodeOutlined,
	CloseOutlined,
} from '@ant-design/icons';
import {notificationError} from '../../../../../utils/baseUtils';
import {apiGetReq} from "../../../../../apis/network";
import {ColumnIcon, QueryIcon} from "../../../../../imgs/icons";

const prefixCls = 'save-form-logic';
const prefixTreeCls = `${prefixCls}-tree`;

const Div = (props) => {
	return (
		<div
			className={props.className}
			style={props.style}
			onClick={() => {
				// setActive('active');
				props.onClick(props.dataPath, props.dataType);
			}}
		>
			{props.children}
		</div>
	);
};

const SaveFormLogic = (props) => {
	const [logic, setLogic] = useState(undefined);
	const [editPath, setEditPath] = useState(undefined);
	const [formData, setFormData] = useState({});
	const [formType, setFormType] = useState('params');

	// Данные для селектов
	const [tableNames, setTableNames] = useState([]);
	const [tableFields, setTableFields] = useState([]);

	const {onChange, value, dataBase} = props;

	useEffect(() => {
		setLogic(value);
		// console.log('props ->', value)
	}, [value]);

	const onClickLogicParams = (path, dataType) => {
		// console.log(
		// 	'onClickLogicParams path => ',
		// 	path.slice(0, path.length - 2)
		// );
		console.log("onClickLogicParams => ", path);
		// console.log("onClickLogicParams => ", objectPath.get(logic, path));
		let fData = objectPath.get(logic, path);
		if(dataType === 'params') {
			if(Array.isArray(path) && path.length === 0) {
				fData.fieldType = fData.fieldType !== undefined ? fData.fieldType : 'root';
				fData.primaryKey = fData.primaryKey !== undefined ? fData.primaryKey : 'id';
			}

			fData.excludePrimaryKey = fData.excludePrimaryKey !== undefined ? fData.excludePrimaryKey : true;
			fData.autoGenerateCode = fData.autoGenerateCode !== undefined ? fData.autoGenerateCode : false;
		}
		setFormData(fData);
		setFormType(dataType);
		setEditPath(path);
		getFieldsByTable(
			objectPath.get(logic, [
				...path.slice(0, path.length - 2),
				'tableName',
			])
		);
	};

	const onClickAddChild = (path) => {
		let newLogic = {...logic};
		objectPath.push(newLogic, [...path, 'children'], {});
		onChange(newLogic);
	};

	const onClickAddField = (path) => {
		let newLogic = {...logic};
		objectPath.push(newLogic, [...path, 'fields'], {});
		onChange(newLogic);
	};

	const onClickDeleteField = (path) => {
		// console.log("onClickDeleteField path => ", path);
		let newLogic = {...logic};
		objectPath.del(newLogic, path);
		onChange(newLogic);
	};

	const onChangeInput = (name, value) => {
		// For form
		const data = {...formData, [name]: value};
		setFormData(data);

		// console.log("onChangeInput data => ", data);
		// console.log("onChangeInput editPath => ", editPath);
		// console.log("onChangeInput newLogic => ", newLogic);

		// Load columns after select table
		if(name === 'tableName')
			getFieldsByTable(value);

		let newLogic = {};
		if (editPath && editPath.length > 0) {
			newLogic = {...logic};
			objectPath.set(newLogic, editPath, data);
		} else newLogic = {...newLogic, ...data};

		console.log('onChangeInput newLogic => ', newLogic);

		onChange(newLogic);
	};

	const equalsPaths = (a, b) => {
		if(a)
			return a.join('.') === b.join('.');
		else
			return false;
	};

	const getLogicRender = (logic, path) => {
		// console.log('editPath === path> ', editPath, path, equalsArray(editPath, path));
		return (
			<div
				className={`${prefixTreeCls}${path.length > 0 ? '-child' : ''}`}
			>
				<div
					className={`${prefixTreeCls}-params ${
						equalsPaths(editPath, path) ? 'active' : ''
					}`}
				>
					<ForkOutlined />
					<Div
						onClick={onClickLogicParams}
						style={{flex: '1'}}
						dataPath={path}
						dataType={'params'}
					>
						<div className={`${prefixTreeCls}-field`}>
							[{logic.fieldName}] type of [{logic.fieldType}]
						</div>
						{/*<div className={`${prefixTreeCls}-field`}>primaryKey:       {logic.primaryKey}</div>*/}
						<div className={`${prefixTreeCls}-field`}>
							{logic.tableName}
						</div>
					</Div>
					{path.length > 0 ? (
						<Button
							size={'small'}
							shape='circle'
							icon={<CloseOutlined />}
							onClick={() => onClickDeleteField(path)}
						/>
					) : null}
					{/*<Button size={'small'} onClick={() => onClickAddChild(path)}>Add child</Button>*/}
					{/*<div className={`${prefixTreeCls}-field`}>autoGenerateCode: {logic.autoGenerateCode}</div>*/}
				</div>
				<div className={`${prefixTreeCls}-fields`}>
					<div className={`${prefixTreeCls}-fields-header`}>
						<QueryIcon />
						<div>Fields</div>
						<Button
							size={'small'}
							shape='round'
							onClick={() => onClickAddField(path)}
						>
							Add field
						</Button>
					</div>
					{logic.fields &&
						logic.fields.map((field, index) => {
							const dataPath = [...path, 'fields', index];
							return (
								<Div
									key={index}
									className={`${prefixTreeCls}-fields-params ${
										equalsPaths(editPath, dataPath)
											? 'active'
											: ''
									}`}
									onClick={onClickLogicParams}
									dataType={'fields'}
									dataPath={dataPath}
								>
									<div
										className={`${prefixTreeCls}-fields-params-data`}
									>
										{/*<InsertRowRightOutlined />*/}
										<ColumnIcon/>
										<div>
											[{field.name}] type of [{field.type}
											]
										</div>
									</div>
									<Button
										size={'small'}
										shape='circle'
										icon={<CloseOutlined />}
										onClick={() =>
											onClickDeleteField(dataPath)
										}
									/>
								</Div>
							);
						})}
				</div>
				<div className={`${prefixTreeCls}-children`}>
					<div className={`${prefixTreeCls}-children-header`}>
						<SisternodeOutlined />
						<div>Children</div>
						<Button
							size={'small'}
							shape='round'
							onClick={() => onClickAddChild(path)}
						>
							Add child
						</Button>
					</div>
					{logic.children &&
						logic.children.map((child, index) => (
							<React.Fragment key={index}>
								{getLogicRender(child, [
									...path,
									'children',
									index,
								])}
							</React.Fragment>
						))}
				</div>
			</div>
		);
	};

	const getTableNames = (open) => {
		// console.log("onDropdownVisibleChange open => ", open)
		if (open) {
			// /{dataSourceName}/configurations/save/tables
			apiGetReq(`/${dataBase.name}/configurations/save/tables`)
			// apiGetDbTable()
				.then((response) => {
					setTableNames(response.data);
				})
				.catch((error) => {
					notificationError(error, 'Ошибка загрузки данных');
				});
		} else {
			setTableNames([]);
		}
	};

	const getFieldsByTable = (tableName) => {
		//"/{dataSourceName}/configurations/save/fields/{tableName}"
		apiGetReq(`/${dataBase.name}/configurations/save/fields/${tableName}`)
		// apiGetDbFieldsByTable(tableName)
			.then((response) => {
				setTableFields(response.data);
			})
			.catch((error) => {
				notificationError(error, 'Ошибка загрузки данных');
			});
	};

	const logicFields = (
		<>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>Field type: </span>
				</Col>
				<Col span={16}>
					<Select
						value={formData && formData.fieldType}
						style={{width: '100%'}}
						onChange={(e) => onChangeInput('fieldType', e)}
					>
						<Select.Option value='root'>root</Select.Option>
						<Select.Option value='array'>array</Select.Option>
						<Select.Option value='object'>object</Select.Option>
					</Select>
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>Field name: </span>
				</Col>
				<Col span={16}>
					<Input
						value={formData && formData.fieldName}
						onChange={(e) =>
							onChangeInput('fieldName', e.target.value)
						}
					/>
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>Table name: </span>
				</Col>
				<Col span={16}>
					<Select
						showSearch={true}
						onDropdownVisibleChange={getTableNames}
						value={formData && formData.tableName}
						style={{width: '100%'}}
						onChange={(e) => onChangeInput('tableName', e)}
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{tableNames.map((table, index) => (
							<Select.Option key={index} value={table}>
								{table}
							</Select.Option>
						))}
					</Select>
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>Primary key: </span>
				</Col>
				<Col span={16}>
					{/*<Input*/}
					{/*	value={formData && formData.primaryKey}*/}
					{/*	onChange={(e) =>*/}
					{/*		onChangeInput('primaryKey', e.target.value)*/}
					{/*	}*/}
					{/*/>*/}
					<Select
						value={formData && formData.primaryKey}
						style={{width: '100%'}}
						onChange={(e) => onChangeInput('primaryKey', e)}
					>
						{tableFields.map((filed, index) => (
							<Select.Option key={index} value={filed.columnName}>
								{filed.columnName} [{filed.dataType}]
							</Select.Option>
						))}
					</Select>
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>Exclude primary key: </span>
				</Col>
				<Col span={16}>
					<Checkbox
						defaultChecked={false}
						checked={formData && formData.excludePrimaryKey}
						onChange={(e) =>
							onChangeInput('excludePrimaryKey', e.target.checked)
						}
					/>
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>Auto generate code: </span>
				</Col>
				<Col span={16}>
					<Checkbox
						defaultChecked={false}
						checked={formData && formData.autoGenerateCode}
						onChange={(e) =>
							onChangeInput('autoGenerateCode', e.target.checked)
						}
					/>
				</Col>
			</Row>
		</>
	);

	const fieldsFields = (
		<>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>name: </span>
				</Col>
				<Col span={16}>
					<Select
						value={formData && formData.name}
						style={{width: '100%'}}
						onChange={(e) => onChangeInput('name', e)}
					>
						{tableFields.map((filed, index) => (
							<Select.Option key={index} value={filed.columnName}>
								{filed.columnName} [{filed.dataType}]
							</Select.Option>
						))}
					</Select>

					{/*<Input value={formData && formData.name} onChange={(e) => onChangeInput('name', e.target.value)}/>*/}
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}>
					<span>type: </span>
				</Col>
				<Col span={16}>
					<Select
						listHeight={300}
						value={formData && formData.type}
						style={{width: '100%'}}
						onChange={(e) => onChangeInput('type', e)}
					>
						<Select.Option value='uuid'>uuid</Select.Option>
						<Select.Option value='text'>text</Select.Option>
						<Select.Option value='json'>json</Select.Option>
						<Select.Option value='int'>int</Select.Option>
						<Select.Option value='timestamp'>
							timestamp
						</Select.Option>
						<Select.Option value='date'>date</Select.Option>
						<Select.Option value='time'>time</Select.Option>
						<Select.Option value='bool'>bool</Select.Option>
						<Select.Option value='double'>double</Select.Option>
						<Select.Option value='parentResult'>
							parentResult
						</Select.Option>
						<Select.Option value='password'>password</Select.Option>
					</Select>
					{/*<Input value={formData && formData.type} onChange={(e) => onChangeInput('type', e)}/>*/}
				</Col>
			</Row>
			<Row justify='center' align='middle' gutter={[0, 8]}>
				<Col span={8}><span>validators: </span></Col>
				<Col span={16}>
					<Input
						value={formData && formData.validators}
						onChange={(e) =>
							onChangeInput('validators', e.target.value)
						}
					/>
				</Col>
			</Row>
		</>
	);

	return (
		<div className={prefixCls}>
			{logic && getLogicRender(logic, [])}
			<div className={`${prefixCls}-sub-form`}>
				{editPath && (formType === 'params' ? logicFields : fieldsFields)}
			</div>
		</div>
	);
};

export default SaveFormLogic;
