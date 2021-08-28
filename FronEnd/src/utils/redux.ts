import moment from 'moment';
import {setDataStore} from 'rt-design/lib/redux/rtd.actions';

interface DispatchToStoreOptions {
    dispatch: (any)
    path: string;
    value: any;
    type?: string;
}

export const dispatchToStore = ({dispatch, path, value, type} : DispatchToStoreOptions) => {
    // console.log("storeHOC => dispatchToStore", dispatch, setDateStore);
    if(dispatch && path && setDataStore) {
        if(type === 'event')
            dispatch(setDataStore(path,  {
                timestamp: moment(),
                value: value,
            }));
        else
            dispatch(setDataStore(path, value));
    }
}