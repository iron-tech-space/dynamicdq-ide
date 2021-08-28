import React from "react";
import {EyeOutlined, SortAscendingOutlined, ArrowsAltOutlined} from "@ant-design/icons";
import { Tooltip } from 'antd';

const selectOptions = {
    visible: [null, true, false],
    typeData: ['uuid', 'text', 'json', 'int', 'timestamp', 'date', 'time', 'bool', 'double'],
    typeField: [ null, 'column', 'link', 'linkBack', 'custom', 'customAggregate'],
    align: ['left', 'center', 'right']
}
// aliasOrName: "id"
// filterInside: null
// orderByInside: null
// width: 350

export const columns = [{
    title: 'Наименование',
    dataKey: 'name',
    width: 250,
    resizable: true,
    fixed: 'left',
}, {
    title: 'Псевдоним',
    dataKey: 'alias',
    width: 200,
    resizable: true,
    // fixed: 'left',
}, {
    title: 'Заголовок',
    dataKey: 'header',
    resizable: true,
    width: 250
}, {
    title: 'Align',
    dataKey: 'align',
    component: 'select',
    props: {
        showSearch: true,
        options: selectOptions.align.map(item => ({ label: `${item}`, value: item }))
    },
    width: 75
}, {
    title: 'T data',
    dataKey: 'typeData',
    component: 'select',
    props: {
        showSearch: true,
        options: selectOptions.typeData.map(item => ({ label: `${item}`, value: item }))
    },
    width: 75
}, {
    title: 'T field',
    dataKey: 'typeField',
    component: 'select',
    props: {
        showSearch: true,
        options: selectOptions.typeField.map(item => ({ label: `${item}`, value: item }))
    },
    width: 120
}, {
    title: 'Width',
    dataKey: 'width',
    width: 50
}, {
    title: <Tooltip title="Visible"><EyeOutlined /></Tooltip>,
    dataKey: 'visible',
    align: 'center',
    width: 25,
    component: 'checkbox',
}, {
    title: <Tooltip title="Sortable"><SortAscendingOutlined /></Tooltip>,
    dataKey: 'sortable',
    align: 'center',
    component: 'checkbox',
    width: 25
}, {
    title: <Tooltip title="Resizable"><ArrowsAltOutlined /></Tooltip>,
    dataKey: 'resizable',
    align: 'center',
    component: 'checkbox',
    width: 25
}, {
    title: 'Ссылка',
    dataKey: 'linkPath',
    resizable: true,
    width: 200
}, {
    title: 'Поле ссылки',
    dataKey: 'linkView',
    resizable: true,
    width: 200
}, {
    title: 'Filter fields',
    dataKey: 'filterFields',
    resizable: true,
    width: 150
}, {
    title: 'Filter signs',
    dataKey: 'filterSigns',
    resizable: true,
    width: 150
}, {
    title: 'Default filter',
    dataKey: 'defaultFilter',
    resizable: true,
    width: 115
}, {
    title: 'Default sort',
    dataKey: 'defaultSort',
    resizable: true,
    width: 115

}, {
    title: 'Filter inside',
    dataKey: 'filterInside',
    resizable: true,
    width: 115
}, {
    title: 'Order by inside',
    dataKey: 'orderByInside',
    resizable: true,
    width: 125

}]