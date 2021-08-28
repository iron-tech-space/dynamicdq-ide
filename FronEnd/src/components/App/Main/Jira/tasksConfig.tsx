import React from 'react';
import {Tag, Tooltip} from "antd"

interface StatusModel {
    "id": string;
    "name": string;
    "statusCategory": {
        "colorName": 'blue-gray' | 'yellow' | 'green'
    }
}

interface issueType {
    id: string;
    iconUrl: string;//	"https://atlassian.dias-dev.ru/jira/images/icons/issuetypes/epic.svg"
    name: string; //"Epic"
}

const defFieldParams = {
    "alias": null,
    "position": 0,
    "visible": true,
    "resizable": true,
    "sortable": false,
    "align": "left",
    // "width": 200,
    "defaultSort": null,
    "defaultFilter": null
}

export const config = {
    "hierarchical": false,
    "hierarchyField": "",
    "hierarchyView": "",
    "hierarchyLazyLoad": false,
    "fields": [{
        ...defFieldParams,
        // "name": ['fields', 'issuetype'],
        "name": 'issuetype',
        "header": 'Type',
        "align": "center",
        "resizable": false,
        "width": 50,
    }, {
        ...defFieldParams,
        // "name": ['fields', 'priority', 'name'],
        "name": 'priority',
        "header": 'Priority',
        "width": 100,
    },{
        ...defFieldParams,
        "name": 'status', //['fields', 'status'],
        "header": 'Status',
        "alias": 'status',
        // "width": 205,
        "width": 140,
    },{
        ...defFieldParams,
        "name": ['fields', 'project', 'name'],
        "header": 'Project',
        "width": 150,
    },{
        ...defFieldParams,
        "name": 'key',
        "header": 'Key',
        "width": 150,
    },{
        ...defFieldParams,
        "name": ['fields', 'assignee', 'displayName'],
        "header": 'Assignee',
        "width": 130,
    },{
        ...defFieldParams,
        "name": ['fields', 'summary'],
        "header": 'Summary', // priority
    },]
}

export const configRenders = [{
    name: 'issuetype',
    cellRenderer: ({rowData}: any) => {
        return <Tooltip title={rowData.fields.issuetype.name}><img src={rowData.fields.issuetype.iconUrl}/></Tooltip>
    }
}, {
    name: 'key',
    cellRenderer: ({cellData}: any) => <a href={`https://atlassian.dias-dev.ru/jira/browse/${cellData}`} target={'_blank'}>{cellData}</a>
}, {
    name: 'priority',
    cellRenderer: ({rowData}: any) => {
        const priority = rowData.fields.priority as StatusModel;
        return <div className={`jira-priority jira-priority-${priority.name}`}>{priority.name}</div>
    }
}, {
    name: 'status',
    cellRenderer: ({rowData}: any) => {
        const status = rowData.fields.status as StatusModel;
        return <div className={`jira-status jira-status-${status.statusCategory.colorName}`}>{status.name}</div>
    }
}]