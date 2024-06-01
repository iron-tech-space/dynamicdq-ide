// Проверяет, является ли нода листом дерева
const isLeaf = (node) => !!node.isGroup;

// Фильтрация дерева по строке поиска
// Ищет только по листам (use isLeaf)
export const onSearchConfig = (data, searchValue) => {
    const treeData = [];
    const expandedKeys = [];
    for (let i = 0; i < data.length; i++) {
        if(data[i].isLeaf) {
            // console.log('data[i] => ', data[i]);

            // Ищем сроку в именя конфига
            const value = data[i].configName.toLowerCase();
            const match = value.match(searchValue);

            // Если нашли, то добавляем в данные
            match !== null && treeData.push(data[i]);
            // console.log('data[i].configName.toLowerCase() => ', value, value.match(searchValue));

            // const index = value.indexOf(searchValue);
            // Если нашли, то добавляем в данные
            // index > -1 && treeData.push(data[i]);
        } else {
            // Ищем строку поиска в детях
            const [children, expanded] = onSearchConfig(data[i].children, searchValue);
            // Если детей больше 0, то добавляем в данные
            if (children.length > 0) {
                treeData.push({...data[i], children: children});
                expandedKeys.push(...expanded, data[i].key);
            }
        }
    }
    return [treeData, expandedKeys];
};
