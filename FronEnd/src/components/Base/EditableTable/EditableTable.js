import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';

import {Checkbox, Dropdown, Input, Menu, Select} from "antd";
import { InsertRowAboveOutlined, InsertRowBelowOutlined, DeleteRowOutlined } from "@ant-design/icons";
import {Layout} from "rt-design";
import {useMounted} from "rt-design/lib/components/utils/baseUtils";
import { getTargetScrollBarSize } from 'rc-util/lib/getScrollBarSize';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

import {copyTextToClipboard} from "../../../utils/clipboardUtils";

const indexCol = {dataKey: 'index', width: 35, align: 'center', fixed: 'left'};
const colDefProps = {component: 'input'};
const defaultState = { colWidths: [], colStyles:[], scrollbarSize: 0, selectedCells: [], editingCell: {}, editValue: undefined}
const TableStateContext = createContext({});

const isEditing = (rowIndex, colIndex, state) =>
    state && state.editingCell.colIndex === colIndex && state.editingCell.rowIndex === rowIndex;
const isSelectedCell = (rowIndex, colIndex, state) =>
    state && state.selectedCells.findIndex(cell => cell.colIndex === colIndex && cell.rowIndex === rowIndex) !== -1;
const isSelectedRow = (rowIndex, state) =>
    state && state.selectedCells.findIndex(cell => cell.rowIndex === rowIndex) !== -1
const isInput = (columns, colIndex) => {
    const column = columns.find((col, index) => index === colIndex)
    return column ? column.component === 'input' : false;
}
const isSelect = (columns, colIndex) => {
    const column = columns.find((col, index) => index === colIndex)
    return column ? column.component === 'select' : false;
}
const isCheckBox = (columns, colIndex) => {
    const column = columns.find((col, index) => index === colIndex)
    return column ? column.component === 'checkbox' : false;
}

/** Get row style classes */
const rowCls = (rowIndex, state) => [
    'editable-table-row',
    isSelectedRow(rowIndex, state) ? 'editable-table-row-selected' : undefined,
].join(' ')

/** Get cell style classes */
const colCellCls = ({col, colIndex, columns}) => [
    'editable-table-cell',
    colIndex === 0 ? 'editable-table-cell-index' : undefined,
    col.align ? `cell-align-${col.align}` : undefined,
    col.fixed === 'left' ? 'editable-table-cell-fix-left' : undefined,
    col.fixed === 'left'
        ? (columns.find((col, index) => (colIndex < index && col.fixed === 'left')) ? undefined : 'editable-table-cell-fix-left-last')
        : undefined
].join(' ')

const cellCls = ({rowIndex, colIndex, state}) => [
    isSelectedCell(rowIndex, colIndex, state)? 'editable-table-cell-selected' : undefined,
    isEditing(rowIndex, colIndex, state) ? 'editable-table-cell-editing' : undefined,
].join(' ')

export const validateValue = (value) => {
    // console.log('validateValue typeof', typeof value, value);
    if(value === 'null') return null;
    switch (typeof value){
        case "string":
            if(value.length > 0 || value.trim()) {
                if (value.includes('\"')) // value.includes('\'') ||
                    return JSON.stringify(value.trim());
                else
                    value.trim();
            } else return null;
        default:
            return value
    }
}

const colStyle = (columns, colIndex, col, colWidths) => {
    const style = {};
    if(col.fixed === 'left') {
        if (colWidths && colWidths.length > 0)
            style.left = columns.reduce((total, col, index) => (index < colIndex && col.fixed === 'left') ? total + colWidths[index] : total, 0);
    }
    return style;
}

const ColGroup = ({colWidths = [], scrollbarSize, body}) => {
    const cols = [];
    for(let i = 0; i < colWidths.length; i++){
        const width = colWidths[i];
        if(width)
            cols.push(<col key={i} style={{width}}/>)
        else
            cols.push(<col key={i} style={{width}}/>)
    }
    if(scrollbarSize && body && body.scrollTopMax > 0)
        cols.push(<col key={colWidths.length} style={{width: scrollbarSize}}/>)
    // console.log("ColGroup: ", scrollbarSize, body);
    return <colgroup>{cols}</colgroup>;
}
const HeaderRow = ({rowIndex}) => {
    const {state, columns} = useContext(TableStateContext);
    const cells = [];
    for(let i = 0; i < columns.length; i++){
        // const style = {}
        // columns[i].fixed === 'left' && (style.left = leftStyleForFixCol(columns, i, state))
        // console.log('HeaderRow style', style)
        cells.push(<HeaderCell key={i} rowIndex={rowIndex} col={columns[i]} colIndex={i} style={state.colStyles[i]}/>)
    }
    return <tr key={`editable-table-row-${rowIndex}`} className={rowCls(rowIndex)}>{cells}</tr>
}
const HeaderCell = ({rowIndex, col, colIndex, ...rest}) => {

    /** ===================== Ref ====================== */
    const columnResizerRef = useRef(null)

    /** ===================== Context ====================== */
    const {state, columns, setState, onChangeValue} = useContext(TableStateContext);

    /** ===================== Effect ====================== */
    useEffect(() => {
        // if(columnResizerRef.current) {
        if(state.draggingColIndex === colIndex) {
            // console.log('ColWidthDragging addEventListener');
            window.addEventListener('mousemove', onDragColumn, false);
            window.addEventListener('mouseup', onDragColumnStop, false);
        }
        return () => {
            // if(columnResizerRef.current) {
            if(state.draggingColIndex === colIndex) {
                // console.log('ColWidthDragging removeEventListener')
                window.removeEventListener('mousemove', onDragColumn, false);
                window.removeEventListener('mouseup', onDragColumnStop, false);
            }
        };
    }, [state.draggingColIndex])

    /** ===================== Handlers ====================== */
    const onDragColumnStart = (dragColIndex) => (e) => {
        // Если есть редактируемое значение - сохранить и закрыть
        if(state.editValue) {
            // console.log('onDragColumnStart state.editValue', state.editValue);
            const {rowIndex, colIndex} = state.editingCell;
            onChangeValue(rowIndex, colIndex, state.editValue)
            setState(prevState => ({...prevState, editingCell: {}, editValue: undefined, draggingColIndex: dragColIndex}));
        } else {
            setState(prevState => ({...prevState, draggingColIndex: dragColIndex}))
        }
    }

    const onDragColumnStop = (e) => {
        if(state.draggingColIndex === colIndex) {
            // console.log('onDragColumnStop', state.draggingColIndex, colIndex);
            setState(prevState => ({...prevState, draggingColIndex: -1}))
        }
    }

    const onDragColumn = (e) => {
        // console.log('onDragColumn');
        let clientX = e.clientX;
        if (!columnResizerRef.current)
            return;
        const {offsetParent} = columnResizerRef.current;
        const offsetParentRect = offsetParent.getBoundingClientRect();
        const x = clientX + offsetParent.scrollLeft - offsetParentRect.left;
        setState(prevState => {
            const widths = [...prevState.colWidths];
            widths[colIndex] = x;
            const colStyles = columns.map((col, colIndex) => colStyle(columns, colIndex, col, widths))
            return {...prevState, colWidths: widths, colStyles: colStyles}
        })
    }

    /** ===================== Render ====================== */
    // console.log(`editable-table-cell-${rowIndex}-${colIndex}`, col.className);
    return <th key={`editable-table-cell-${rowIndex}-${colIndex}`}
        className={[col.className, cellCls({rowIndex, colIndex, state})].join(' ')}
        {...rest}
    >
        <div className={'title'}>{col.title}</div>
        {col.resizable &&
            <div
                ref={state.draggingColIndex === colIndex ? columnResizerRef : undefined}
                className={`column-resizer`}
                onMouseDown={onDragColumnStart(colIndex)}
            />}
    </th>
}
const Body = sortableContainer((props) =>
    <tbody className="editable-table-tbody"><BodyRows {...props}/></tbody>);
const BodyRows = ({data = []}) => {
    return data.map((rowData, rowIndex) =>
        <BodyRow key={`editable-table-row-${rowIndex}`} index={rowIndex} rowIndex={rowIndex} rowData={rowData}/>)
}
const BodyRow = sortableElement(({rowIndex, rowData}) => {
    const {state, columns} = useContext(TableStateContext);
    const cells = [];
    for(let i = 0; i < columns.length; i++){
        // const style = {}
        // columns[i].fixed === 'left' && (style.left = leftStyleForFixCol(columns, i, state))
        cells.push(<BodyCell key={i} rowIndex={rowIndex} rowData={rowData} colIndex={i} col={columns[i]} style={state.colStyles[i]}/>)
    }
    return <tr className={rowCls(rowIndex, state)}>{cells}</tr>
})
const BodyCell = ({rowIndex, rowData, colIndex, col, ...rest}) => {
    const {state, onCellClick} = useContext(TableStateContext);
    let cell;
    const valuePropName = col.component === 'checkbox' ? 'checked' : 'value';
    const generalProps = {
        [valuePropName]: col.component === 'checkbox' ? rowData[col.dataKey] : state.editValue,
        bordered: false,
        size: 'small'
    }
    if(colIndex === 0)
        cell = <CellIndex rowData={rowData} col={col}/>
    else if(col.component === 'checkbox')
        cell = <CellCheckbox {...generalProps} rowIndex={rowIndex} colIndex={colIndex}/>
    else if(isEditing(rowIndex, colIndex, state))
        if(col.component === 'select')
            cell = <CellSelect {...generalProps} rowIndex={rowIndex} colIndex={colIndex} col={col}/>
        else
            cell = <CellInput {...generalProps}/>
    else
        cell = <CellText rowIndex={rowIndex} rowData={rowData} colIndex={colIndex} col={col}/>

    return (
        <td key={`editable-table-cell-${rowIndex}-${colIndex}`}
            {...rest}
            className={[col.className, cellCls({rowIndex, colIndex, state})].join(' ')}
            onClick={onCellClick({col, colIndex, rowIndex, rowData})}
        >
            {cell}
        </td>
    )
}

// const Components = {
//     text: CellText,
//     input: CellInput,
//     select: CellSelect,
//     checkbox: CellCheckbox
// }

const onClickCellContextMenu = ({rowIndex, onAddRow, onRemoveRow, onRemoveSelectedRows}) => ({key}) => {
    // console.log('click', e);
    switch (key){
        case 'addUp': onAddRow(rowIndex); break;
        case 'addDown': onAddRow(rowIndex + 1); break;
        case 'addLast': onAddRow(null); break;
        case 'remove': onRemoveRow(rowIndex); break;
        case 'removeSelected': onRemoveSelectedRows(); break;

    }
}

const CellContextMenu = (props) => (
    <Menu onClick={onClickCellContextMenu(props)} className={'context-menu'}>
        <Menu.Item key="addUp"><InsertRowAboveOutlined />Добавить строку выше</Menu.Item>
        <Menu.Item key="addDown"><InsertRowBelowOutlined />Добавить строку ниже</Menu.Item>
        <Menu.Item key="addLast"><InsertRowBelowOutlined />Добавить строку в конец</Menu.Item>
        <Menu.Item key="remove"><DeleteRowOutlined />Удалить строку</Menu.Item>
        <Menu.Item key="removeSelected"><DeleteRowOutlined />Удалить выбранные строки</Menu.Item>
    </Menu>
);

// const CellIndex = sortableHandle((props) => <CellText {...props} />);
const CellIndex = sortableHandle(({rowData, col}) => <div className={'text'}>{rowData[col.dataKey]}</div>);

const CellText = ({rowIndex, rowData, colIndex, col, ...rest}) => {
    const {state, onPasteCells, onAddRow, onRemoveRow, onRemoveSelectedRows} = useContext(TableStateContext);
    const value = () => {
        if (rowData[col.dataKey] === undefined) return '<undefined>';
        else if (rowData[col.dataKey] === null) return '<null>';
        else return `${rowData[col.dataKey]}`;
    }
    const cls = () => {
        if(rowData[col.dataKey] === undefined || rowData[col.dataKey] === null)
            return 'null-text';
        else
            return 'text';
    }
    return (
        <Dropdown
            overlay={CellContextMenu({rowIndex, onAddRow, onRemoveRow, onRemoveSelectedRows})}
            trigger={['contextMenu']}
        >
            <Input {...rest}
               ref={(textInput) => {
                   isSelectedCell(rowIndex, colIndex, state) && textInput && textInput.focus()
               }}
               className={cls()}
               value={value()}
               bordered={false}
               size={'small'}
               onPaste={(e) => {
                   const pasteArray = (e.clipboardData || window.clipboardData).getData('text').trim().split("\n");
                   onPasteCells(pasteArray)
               }}
            />
        </Dropdown>
    )
}


const CellInput = (props) => {
    const {onChangeInput} = useContext(TableStateContext);
    // console.log('CellInput => ', props);
    return (
        <Input {...props}
               ref={(input) => { input && input.focus() }}
               onChange={e => onChangeInput(e.target.value)}
               onKeyPress={e => {e.key === 'Enter' && e.preventDefault()}}
        /> )
}

const CellCheckbox = ({rowIndex, colIndex, ...rest}) => {
    const {onChangeInputWithSave, state} = useContext(TableStateContext);
    return (
        <Checkbox
            {...rest}
            ref={(checkbox) => {
                isSelectedCell(rowIndex, colIndex, state) && checkbox && checkbox.focus()
            }}
            onChange={e => onChangeInputWithSave(rowIndex, colIndex, e.target.checked)}
        /> )
}

const CellSelect = ({rowIndex, colIndex, col, ...rest}) => {
    const {onChangeInputWithSave} = useContext(TableStateContext);
    return (
        <Select
            {...rest}
            {...col.props}
            ref={(select) => { select && select.focus() }}
            style={{width: '100%', ...col.props?.style}}
            defaultOpen={true}
            onChange={value => onChangeInputWithSave(rowIndex, colIndex, value)}
        />)
}



const EditableTable = (props) => {

    /** ===================== Memos ====================== */
    const mergeColumns = () => {
        // console.log("mergeColumns");
        const columns = [
            {...indexCol},
            ...props.columns
        ]
        return columns.map((col, colIndex) => ({
            ...colDefProps,
            ...col,
            className: colCellCls({col, colIndex, columns})
        }))
    }
    const mergeData = () => (props.data && props.data.map((row, index) => ({...row, index}))) || []
    const columns = useMemo(mergeColumns, [props.columns]);
    const data = useMemo(mergeData, [props.data]);

    /** ===================== Refs ====================== */
    const headerRef = useRef(null)
    const bodyRef = useRef(null);

    /** ===================== States ====================== */
    const initState = (columns) => {
        // console.log("initState");
        const colWidths = columns.map(col => col.width);
        const colStyles = columns.map((col, colIndex) => colStyle(columns, colIndex, col, colWidths));
        // console.log("initState", colStyles);
        return {...defaultState, colWidths, colStyles};
    }
    const [state, setState] = useState(initState(columns));
    // const setState = (param) => {
    //     console.log("setState", param);
    //     __setState(param)
    // }
    const scrollbarSize = getTargetScrollBarSize(bodyRef.current).width;

    const isMounted = useMounted()

    /** ===================== Effects ====================== */
    // useEffect(() => {
    //     console.log('setScrollbarSize');
        // setScrollbarSize(getTargetScrollBarSize(bodyRef.current).width);
    // }, []);

    useEffect(() => {
        if(isMounted) {
            // console.log('Update columns', columns);
            setState({...state, colWidths: columns.map(col => col.width)});
        }
    }, [columns]);

    useEffect(() => {
        if(isMounted) {
            // console.log('Update colStyles', state.colWidths);
            // setState({...state, colStyles:  columns.map((col, colIndex) => colStyle(columns, colIndex, col, state.colWidths))});
        }
    }, [state.colWidths])

    useEffect(() => {
        // console.log('LocalState addEventListener')
        window.addEventListener('keydown', onKeyDownHandler, false);
        window.addEventListener('keyup', onKeyUpHandler, false);
        return () => {
            // console.log('LocalState removeEventListener')
            window.removeEventListener('keydown', onKeyDownHandler, false);
            window.removeEventListener('keyup', onKeyUpHandler, false);
        };
    }, [state])

    /** ===================== Set State functions ====================== */
    const onChangeInput = (value) => {
        // console.log('onChangeInput => ', value);
        setState({...state, editValue: value});
    }
    const onChangeInputWithSave = (rowIndex, colIndex, value) => {
        // console.log('onChangeInputWithSave => ', value);
        onChangeInput(value);
        onChangeValueHandler(rowIndex, colIndex, value)
    }
    const onChangeCheckBoxFromKey = (rowIndex, colIndex) => {
        const dataKey = columns.find((col, index) => index === colIndex).dataKey
        onChangeValueHandler(rowIndex, colIndex, !data[rowIndex][dataKey])
    }
    const setSelectedCell = (rowIndex, colIndex, editing = false, editValue = undefined) => {
        // console.log('setSelectedCell => ', editValue);
        setState({
            ...state,
            selectedCells: [{rowIndex, colIndex}],
            editingCell: editing ? {rowIndex, colIndex} : {},
            editValue: editValue
        });
    }
    const addSelectedCell = (rowIndex, colIndex) => {
        setState(prevState => ({...prevState, selectedCells: [...prevState.selectedCells, {rowIndex, colIndex}]}))
    }
    const setEditingCell = (rowIndex, colIndex, editValue = undefined) => {
        if(editValue === undefined){
            const dataKey = columns.find((col, index) => index === colIndex).dataKey
            setSelectedCell(rowIndex, colIndex, true, data[rowIndex][dataKey]);
        } else {
            setSelectedCell(rowIndex, colIndex, true, editValue);
        }
    }
    const moveToSelected = (direction, rowIndex, colIndex, editing, editValue = undefined) => {
        let _rowIndex = rowIndex, _colIndex = colIndex;
        switch (direction){
            case 'up':    _rowIndex = _rowIndex - 1 >= 0 ? _rowIndex - 1 : _rowIndex; break;
            case 'right': _colIndex = columns.length > _colIndex + 1 ? _colIndex + 1 : _colIndex; break;
            case 'down':  _rowIndex =    data.length > _rowIndex + 1 ? _rowIndex + 1 : _rowIndex; break;
            case 'left':  _colIndex = _colIndex - 1 > 0 ? _colIndex - 1 : _colIndex; break;
            default: break;
        }
        console.log('moveTo: direction: [%s], _colIndex: [%s], _rowIndex: [%s], editing: [%s], editValue: [%s]', direction, _colIndex, _rowIndex, editing, editValue);
        setSelectedCell(_rowIndex, _colIndex, editing, editValue);
    }

    const changeIndexRow = (oldIndex, newIndex) => {
        if (newIndex >= 0 && newIndex < data.length) {
            let arr = [...data]; // Копируем массив
            const item = arr.splice(oldIndex, 1); // Удаляем элемент со старого места
            // console.log('_changeIndexRow => ',item);
            arr.splice(newIndex > 0 ? newIndex : 0, 0, item[0]); // Ставим элемент на новое место
            // console.log("changeIndexRow", arr);
            if(state.selectedCells && state.selectedCells.length > 0){
                setState(prevState => {
                    let nextState = {...prevState};
                    const selectedRowIndex = state.selectedCells[0].rowIndex
                    // Если переместилы выделенную строку
                    if(selectedRowIndex === oldIndex) {
                        nextState.selectedCells[0].rowIndex = newIndex;
                        nextState.editingCell.rowIndex = newIndex;
                    } else if(oldIndex <= selectedRowIndex && selectedRowIndex <= newIndex) {
                        nextState.selectedCells[0].rowIndex -= 1;
                        nextState.editingCell.rowIndex -= 1;
                    } else if(newIndex <= selectedRowIndex && selectedRowIndex <= oldIndex) {
                        nextState.selectedCells[0].rowIndex += 1;
                        nextState.editingCell.rowIndex += 1;
                    }
                    return nextState;
                })
            }
            props.onChange(arr);
        }
    };

    const clearMatrix = (sRow, sCol, fRow, fCol) => {
        const fields = [...data];
        let srIndex = sRow < fRow ? sRow : fRow;
        let frIndex = sRow > fRow ? sRow : fRow;
        let scIndex = sCol < fCol ? sCol : fCol;
        let fcIndex = sCol > fCol ? sCol : fCol;
        for(let iRow = srIndex; iRow <= frIndex; iRow++){
            for(let iCol = scIndex; iCol <= fcIndex; iCol++) {
                const dataKey = columns.find((col, index) => index === iCol).dataKey
                fields[iRow][dataKey] = null;
            }
        }
        props.onChange(fields);
    }

    const selectMatrix = (sRow, sCol, fRow, fCol) => {
        let srIndex = sRow < fRow ? sRow : fRow;
        let frIndex = sRow > fRow ? sRow : fRow;
        let scIndex = sCol < fCol ? sCol : fCol;
        let fcIndex = sCol > fCol ? sCol : fCol;
        setSelectedCell(sRow, sCol);
        for(let iRow = srIndex; iRow <= frIndex; iRow++){
            for(let iCol = scIndex; iCol <= fcIndex; iCol++) {
                if(!(iRow === sRow && iCol === sCol)) {
                    addSelectedCell(iRow, iCol);
                    // console.log("addSelectedCell", iRow, iCol)
                }
            }
        }
    }

    /** ===================== Handlers ====================== */
    const onKeyDownHandler = (e) => {
        (e.keyCode === 9 || (48 <= e.keyCode && e.keyCode <= 90)) && onKeyPressHandler(e);
        // (e.keyCode === 9 || e.keyCode === 67) && onKeyPressHandler(e);
    }
    const onKeyUpHandler = (e) => {
        // console.log('onKeyUpHandler e', e);
        (e.keyCode !== 9 && (e.keyCode < 48 || 90 < e.keyCode)) && onKeyPressHandler(e);
        // e.keyCode !== 9 && onKeyPressHandler(e);
    }
    const onKeyPressHandler = (e) => {
        const bodyRefContain = bodyRef && bodyRef.current && bodyRef.current.contains(e.target);

        // console.log('onKeyPressHandler bodyRefContain', bodyRefContain);
        if(bodyRefContain && state.selectedCells.length > 0) {
            const {rowIndex, colIndex} = state.selectedCells[state.selectedCells.length - 1];
            const _isEditing = isEditing(rowIndex, colIndex, state);
            const _isInput = isInput(columns, colIndex);
            const _isCheckBox = isCheckBox(columns, colIndex);


            const moveTo = (direction) => moveToSelected(direction, rowIndex, colIndex, false);
            const saveStateValue = () => onChangeValueHandler(rowIndex, colIndex, state.editValue);
            const saveValue = (value) => onChangeValueHandler(rowIndex, colIndex, value);

            // console.log('onKeyPressHandler e', e);
            if(!e.metaKey &&  !e.ctrlKey && 48 <= e.keyCode && e.keyCode <= 90 && !_isEditing) {
                // console.log("Латинские буквы и цыфры => ", e);
                moveToSelected(null, rowIndex, colIndex, true, e.key);
                // e.stopPropagation();
                e.preventDefault();
            } else if((e.metaKey || e.ctrlKey) && e.keyCode === 67){
                onCopyCells();
                e.preventDefault();
                // e.preventDefault();
            } else if((e.metaKey || e.ctrlKey) && e.keyCode === 86){
                // onPasteCells();
                // e.preventDefault();
            } else {
                switch (e.keyCode) {
                    case 9: // Tab
                        _isEditing && saveStateValue();
                        moveTo('right');
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case 13: // Enter
                        if (_isEditing) {
                            if(_isInput)
                                saveStateValue();
                            moveTo('down');
                        } else
                            !_isCheckBox && setEditingCell(rowIndex, colIndex);
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case 27: // Esc
                        moveTo(null);
                        break;
                    case 32: // Space
                        // console.log("Space", rowIndex, colIndex)
                        _isCheckBox && onChangeCheckBoxFromKey(rowIndex, colIndex);
                        !_isCheckBox && !_isEditing && moveToSelected(null, rowIndex, colIndex, true, e.key);
                        e.preventDefault();
                        break;
                    case 37: // LEFT
                        !_isEditing && moveTo('left'); break;
                    case 38: // UP // _isEditing && _isInput && saveStateValue();
                        !_isEditing && moveTo('up'); break;
                    case 39: // RIGHT
                        !_isEditing && moveTo('right'); break;
                    case 40: // DOWN // _isEditing && _isInput && saveStateValue();
                       !_isEditing && moveTo('down'); break;
                    case 8: // Backspace
                    case 46: // Delete
                        // !_isEditing && saveValue(null) && setSelectedCell(rowIndex, colIndex);
                        if(!_isEditing) {
                            const {rowIndex: startRow, colIndex: startCol} = state.selectedCells[0];
                            clearMatrix(startRow, startCol, rowIndex, colIndex);
                        }
                        e.preventDefault();
                        break;
                }
            }
        }
    }
    const onChangeValueHandler = (rowIndex, colIndex, value) => {
        // console.log('onChangeHandler => ', rowIndex, colIndex, value);
        const dataKey = columns.find((col, index) => index === colIndex).dataKey
        const _value = validateValue(value);
        const fields = [...data];
        fields[rowIndex][dataKey] = _value;
        props.onChange(fields);
    }

    const onScrollBody = ({ currentTarget, scrollLeft }) => {
        const mergedScrollLeft = typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;
        const target = headerRef.current
        if (!target) {
            return;
        }
        if (typeof target === 'function') {
            target(mergedScrollLeft);
            // console.log('forceScroll function');
        } else if (target.scrollLeft !== mergedScrollLeft) {
            // eslint-disable-next-line no-param-reassign
            target.scrollLeft = mergedScrollLeft;
            // console.log('forceScroll target.scrollLeft');
        }
    }
    const onSortEnd = ({oldIndex, newIndex}) => {changeIndexRow(oldIndex, newIndex);}

    const onCellClickHandler = ({rowIndex, rowData, colIndex, col}) => (e) => {
        // console.log('onCellClickHandler', rowIndex, colIndex, rowData, col);
        if(colIndex === 0) return;
        // One click
        if(e.detail === 1) {
            // console.log('One click', e);
            if(state.editValue) {
                const {rowIndex: eRowIndex, colIndex: eColIndex} = state.editingCell;
                if(rowIndex === eRowIndex && colIndex === eColIndex)
                    return;
                isInput(columns, eColIndex) && onChangeValueHandler(eRowIndex, eColIndex, state.editValue);
                isSelect(columns, eColIndex) && moveToSelected('down', eRowIndex, eColIndex, false);
                setSelectedCell(rowIndex, colIndex);
            } else {
                if(e.shiftKey){
                    const {rowIndex: startRow, colIndex: startCol} = state.selectedCells[0];
                    selectMatrix(startRow, startCol, rowIndex, colIndex);
                } else if(e.metaKey || e.ctrlKey){
                    const {rowIndex: startRow, colIndex: startCol} = state.selectedCells[0];
                    // setSelectedCell(startRow, startCol);
                    addSelectedCell(rowIndex, colIndex);
                } else {
                    // !isSelectedCell(rowIndex, colIndex, state) &&
                    setSelectedCell(rowIndex, colIndex);
                }
            }

        }
        // Double click
        else if(e.detail === 2) {
            // console.log('Double click');
            !isCheckBox(columns, colIndex) && !isEditing(rowIndex, colIndex, state) && setEditingCell(rowIndex, colIndex);
        }
    }
    const onCopyCells = () => {
        // console.log('onCopy', state.selectedCells)
        if(state.selectedCells && state.selectedCells.length > 0){
            let copyObjects = {}, copyRows = []
            for(let i = 0; i < state.selectedCells.length; i++){
                const {rowIndex, colIndex} = state.selectedCells[i];
                const dataKey = columns.find((col, index) => index === colIndex).dataKey
                if(copyObjects[rowIndex])
                    copyObjects[rowIndex].push(data[rowIndex][dataKey])
                else {
                    copyObjects[rowIndex] = [];
                    copyObjects[rowIndex].push(data[rowIndex][dataKey])
                }
            }
            // console.log('copyObjects', copyObjects);
            for(let key in copyObjects){
                // copyRows.push('\"' + copyObjects[key].join('\",\"') + '\"');
                let rowString = "";
                for(let i = 0; i < copyObjects[key].length; i++){
                    const value = validateValue(copyObjects[key][i])
                    if(value !== null)
                            rowString += i === 0 ? `${value}` : `,${value}`;
                    else
                        rowString += i === 0 ? '' : `,`;
                }
                // copyRows.push(copyObjects[key].join(','));
                copyRows.push(rowString);
            }
            // console.log('copyRows', copyRows);
            // console.log('copyRow', copyRows.join('\n'));
            copyTextToClipboard( copyRows.join('\n') || null);
        }
    }
    const onPasteCells = (values) => {
        // console.log('onPasteCells', values)
        if(state.selectedCells && state.selectedCells.length > 0){
                // const values = text.trim().split("\n");
                const {rowIndex, colIndex} = state.selectedCells[0];
                const dataKey = columns.find((col, index) => index === colIndex).dataKey
                let _data = [...data];
                let nextRowIndex = rowIndex;
                let value;
                for(let i = 0; i < values.length; i++){
                    value = validateValue(values[i]);
                    // console.log('validateValue result ', value)
                    if(nextRowIndex >= data.length)
                        _data.push({ [dataKey]: value })
                    else
                        _data[nextRowIndex][dataKey] = value;
                    nextRowIndex += 1;
                }
                props.onChange(_data);
        }
    }

    const onAddRow = (rowIndex) => {
        const newRow = {};
        if(data.length > 0) {
            for (let key in data[0])
                newRow[key] = null;
        } else {
            columns.forEach(col => newRow[col.dataKey] = null)
        }

        let arr = [...data];
        if(rowIndex === null)
            arr.splice(data.length, 0, newRow);
        else if (rowIndex === -1)
            arr.splice(0, 0, newRow);
        else
            arr.splice(rowIndex, 0, newRow);
        props.onChange(arr);
        // console.log('onAddRow', rowIndex);
    }

    const onRemoveRow = (rowIndex) => {
        let arr = [...data];
        arr.splice(rowIndex, 1); // Удаляем элемент со старого места
        props.onChange(arr);
        // console.log('onRemoveRow', rowIndex);
    }

    const onRemoveSelectedRows = () => {
        // console.log('onRemoveSelectedRows');
        if(state.selectedCells && state.selectedCells.length > 0){
            let arr = [...data];
            const selectedRows = state.selectedCells.map(cell => cell.rowIndex);

            // for(let index in state.selectedCells){
            //     const cell = state.selectedCells[index]
            arr = arr.filter((row) => !selectedRows.includes(row.index))
            // }
            props.onChange(arr);

        }
    }

    console.log('# Render editable-table', state.selectedCells && state.selectedCells.length);
    return (
        <TableStateContext.Provider value={{
            state: state,
            columns: columns,
            setState: setState,
            onCellClick: onCellClickHandler,
            onChangeInput: onChangeInput,
            onChangeInputWithSave: onChangeInputWithSave,
            onChangeValue: onChangeValueHandler,
            onPasteCells: onPasteCells,
            onAddRow: onAddRow,
            onRemoveRow: onRemoveRow,
            onRemoveSelectedRows: onRemoveSelectedRows,
        }}>
            <Layout>
                <div ref={headerRef} className={'editable-table-header'}>
                    <table className={'editable-table'}>
                        <ColGroup colWidths={state.colWidths} scrollbarSize={scrollbarSize} body={bodyRef.current}/>
                        <thead className="editable-table-thead">
                            <HeaderRow rowIndex={-1}/>
                        </thead>
                    </table>
                </div>
                <div ref={bodyRef}
                     className={'editable-table-body'}
                     style={{display: 'flex', flexDirection: 'column'}}
                     onScroll={onScrollBody}
                >
                    <table className={'editable-table'}>
                        <ColGroup colWidths={state.colWidths}/>
                        <Body data={data} onSortEnd={onSortEnd} useDragHandle/>
                    </table>
                    <Dropdown
                        trigger={['contextMenu']}
                        overlay={
                            <Menu onClick={() => onAddRow(data.length)}>
                                <Menu.Item key="addUp"><InsertRowBelowOutlined />Добавить строку</Menu.Item>
                            </Menu>}
                    >
                        <div style={{display: 'flex', flex: 'auto'}}/>
                    </Dropdown>
                </div>
            </Layout>
        </TableStateContext.Provider>
    );
};

EditableTable.propTypes = {

};

export default EditableTable;
