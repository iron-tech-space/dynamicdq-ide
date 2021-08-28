import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Space, Spin, Input, Row} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {Modal, Custom, Checkbox, Layout, DatePicker} from "rt-design";
import {requestLoadData, requestLoadConfig} from "../../../../../../apis/network";
import {EditableTableItem, Col} from "../Query";
import {validateValue} from "../../../../../Base/EditableTable/EditableTable";

const FilterInput = ({span, label, value, onChange}) => {
    const myRef = useRef();
    useEffect(() => {
        myRef.current && myRef.current.focus()
    }, [value])
    return <Col span={span} label={label}>
        <Input
            size={'small'}
            ref={myRef}
            placeholder={`Введите ${label}`}
            value={value}
            onChange={(e) => onChange(validateValue(e.target.value))}
        />
    </Col>
}
const FilterDatePicker = ({span, label, value, onChange}) => {
    return <Col span={span} label={label}>
        <DatePicker
            size={'small'}
            value={value}
            onChange={(date) => onChange(date)}
        />
    </Col>
}
const FilterArray = ({id, span, label, name, value, onChange}) => {

    useEffect(() => {
        // console.log('FilterArray mounted');
    }, [])

    const arrayToObject = (array) => ({ [name]: array ? array.map(f => ({name: f}) ) : [] })
    const objectToArray = (object) => Array.isArray(object[name]) ? object[name].map(f => f.name) : []

    const loadInitData = (callBack) => {
        // console.log('FilterArray loadInitData', arrayToObject(value));
        callBack(arrayToObject(value))
    };
    const subscribeOnChange = ({value}) => {
        // onChange(value)
        // console.log("FilterArray subscribe => ", objectToArray(value));
        onChange(objectToArray(value))
    }

    return (
        <Col span={span} label={label}>
            <Custom
                // itemProps={{name: name}}
                subscribe={[{
                    name: `${id}.${name}`,
                    path: `rtd.query.config.${id}.preview.filters.${name}`,
                    onChange: subscribeOnChange,
                }]}
                render={() => {
                    // console.log('Custom', value);
                    return (
                        <Modal
                            buttonProps={{
                                size: 'small',
                                label: `Элементов: ${value ? value.length : 0}`,
                                type: 'default',
                                style: {width: '100%'}
                            }}
                            toolTipProps={{title: label}}
                            dispatch={{path: `query.config.${id}.preview.filters.${name}`}}
                            modalConfig={{
                                type: 'save',
                                title: label,
                                width: 600,
                                bodyStyle: {height: 500},
                                form: {
                                    name: 'TableList',
                                    noPadding: true,
                                    loadInitData: loadInitData
                                },
                            }}
                        >
                            <EditableTableItem name={name} columns={[{title: 'Наименование', dataKey: 'name'}]}/>
                        </Modal>
                    )
                }}
            />
        </Col>
    )
}

const PreviewBase = ({data, type, Component}) => {
    const [loaded, setLoaded] = useState(false);
    const [onlineUpdateFilters, setOnlineUpdateFilters] = useState(true);
    const [styleState, setStyleState] = useState({
        fixWidthColumn: true,
        infinityMode: false,
        zebraStyle: false,
        selectable: false,
        nodeAssociated: true,
    });
    const [filters, setFilters] = useState({})

    const formData = useSelector((state) => state?.rtd?.query?.config?.[data.id]?.form)
    // `query.config.${data.id}.form`
    //dispatch={{path: `query.config.${data.id}.form`}}
    useEffect(() => {
        if(!loaded){
            setTimeout(() => setLoaded(true), 20);
        }
    }, [loaded])

    useEffect(() => {
        onlineUpdateFilters && setLoaded(false)
    }, [filters])

    const requestLoadRowsHandler = () => {
        // console.log("requestLoadRowsHandler => ", formData);
        if(type === 'SQL')
            if(formData)
                return requestLoadData(formData.url.data.sql)
            else
                return requestLoadData(data.url.data.sql)
        else if(formData)
            return formData.hierarchical
                ? requestLoadData(formData.url.data.hierarchical)
                : requestLoadData(formData.url.data.flat)
        else
            return data.hierarchical
                ? requestLoadData(data.url.data.hierarchical)
                : requestLoadData(data.url.data.flat)
    }

    const onClickReload = () => setLoaded(false)

    const onChangeStyleState = (name) => (e) => {
        const value = e.target.checked;
        setLoaded(false)
        setStyleState({...styleState, [name]: value})
    }

    const StyleCheckBox = ({name, label}) => {
        return <Checkbox
            checked={styleState[name]}
            onChange={onChangeStyleState(name)}>{label}</Checkbox>
    }

    const onChangeFilterState = (filterItem) => (value) => {
        if(value)
            setFilters({...filters, [filterItem]: value})
        else
            setFilters({...filters, [filterItem]: undefined})
    }

    const renderFilters = () => {
        const id = formData ? formData.id : data.id;
        const fields = formData ? formData.fields : data.fields;
        let FilterComponent;
        return fields.map(field => {
            if (field?.filterFields && field?.filterSigns) {
                let filterFields = field.filterFields.split('/');
                let filterSigns = field.filterSigns.split('/');
                // console.log('renderFilters', filterFields, filterSigns)
                if(filterFields.length === filterSigns.length) {
                    return filterFields.map((filterItem, index) => {
                        if (filterSigns[index] === 'in')
                            FilterComponent = FilterArray;
                        else if(['timestamp', 'date'].includes(field.typeData))
                            FilterComponent = FilterDatePicker;
                        else
                            FilterComponent = FilterInput;
                        return <FilterComponent
                            key={index}
                            id={id}
                            span={3}
                            label={`${filterItem} [${filterSigns[index]}]`}
                            name={filterItem}
                            value={filters[filterItem]}
                            onChange={onChangeFilterState(filterItem)}
                            // onChange={(value) => { setFilters({...filters, [filterItem]: value}) }}
                        />
                    });
                }
            }
        })
    }

    return (
        <Layout>
            <Space direction={"vertical"} style={{marginBottom: '8px'}}>
                <div style={{display: "flex", justifyContent: 'space-between', paddingRight: '8px'}}>
                    <Space>
                        <Button size={'small'} icon={<ReloadOutlined/>} onClick={onClickReload}>Reload preview</Button>
                        <Checkbox
                            checked={onlineUpdateFilters}
                            onChange={(e) => setOnlineUpdateFilters(e.target.checked)}>
                            Online update filter
                        </Checkbox>
                    </Space>
                    <Space>
                        <StyleCheckBox name={'fixWidthColumn'} label={'Fix width column'}/>
                        {/*<StyleCheckBox name={'infinityMode'} label={'Infinity mode'}/>*/}
                        <StyleCheckBox name={'selectable'} label={'Selectable'}/>
                        <StyleCheckBox name={'zebraStyle'} label={'Zebra style'}/>
                        <StyleCheckBox name={'nodeAssociated'} label={'Node associated'}/>
                    </Space>
                </div>
                <Row gutter={8}>
                    {renderFilters()}
                </Row>
            </Space>
            {loaded
                ? <Layout>
                    <Component
                        {...styleState}
                        defaultFilter={filters}
                        requestLoadRows={requestLoadRowsHandler()}
                        requestLoadConfig={requestLoadConfig(data.url.configuration.get)}
                    />
                </Layout>
                : <Spin />
            }
        </Layout>
    )
}

export default PreviewBase;
