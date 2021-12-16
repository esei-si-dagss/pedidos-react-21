import React, { useState, useEffect } from 'react';

import { TabView, TabPanel } from 'primereact/tabview';

import AlmacenesInfo from "./almacenesInfo";
import AlmacenesStock from "./almacenesStock";


export default function AlmacenesDetalle() {

    return (
        <div>
            <TabView>
                <TabPanel header="Información de almacén">
                    <AlmacenesInfo />
                </TabPanel>
                <TabPanel header="Stock del almacén">
                    <AlmacenesStock />
                </TabPanel>
            </TabView>
        </div>
    );
}