import React from 'react';
import {FormBody, Modal} from "rt-design";
import {SelectDataBase} from "./SelectDataBase";

const MigrateModal = (props: {databases: any[]}) => {

    const {databases = []} = props;

    return (
        <Modal
            buttonProps={{ hidden: true }}
            modalConfig={{
                type: 'save',
                // @ts-ignore
                title: `Migrate configs`,
                // width: 600,
                // bodyStyle: {height: 320},
                form: {
                    name: 'migrateConfigs',
                    labelCol: {span: 10},
                    wrapperCol: {span: 12},
                },
            }}
            // dispatch={{
            //     path: '2debug.form.table.events.onEditModal',
            //     //type: 'event',
            // }}
            subscribe={[
                {
                    name: `migrateConfigsModal`,
                    path: `rtd.leftSide.configs.events.onMigrateConfigs`,
                    onChange: ({value, setModalData, openModal}) => {
                        openModal();
                    },
                },
            ]}

        >
            <FormBody noPadding={false} scrollable={false}>
                <SelectDataBase databases={databases}/>
                <SelectDataBase databases={databases}/>
            </FormBody>
        </Modal>
    );
};

MigrateModal.propTypes = {
    
};

export default MigrateModal;