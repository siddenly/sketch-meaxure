// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.

import { context } from '../common/context';
import { createWebviewPanel } from '../../webviewPanel';
import { getResourcePath } from '../helpers/helper';
import { getLanguage } from '../common/language';

interface SettingData {
    language?: Object;
    scale: number;
    units: string;
    colorFormat: string;
    cssVarMap: {[k: string]: {[k: string]: string}};
}

export function settingsPanel() {
    let panel = createWebviewPanel({
        identifier: 'co.jebbs.sketch-meaxure.settings',
        url: getResourcePath() + "/panel/settings.html",
        width: 280,
        height: 474,
    });
    if (!panel) return undefined;

    let data = <SettingData>{};
    data.language = getLanguage();
    if (context.configs) {
        data.scale = context.configs.resolution;
        data.units = context.configs.units;
        data.colorFormat = context.configs.format;
        data.cssVarMap = context.configs.cssVarMap;
    }
    panel.onDidReceiveMessage('init', () => data);
    panel.onDidReceiveMessage<SettingData>('submit', (data: SettingData) => {
        context.configs.resolution = data.scale;
        context.configs.units = data.units;
        context.configs.format = data.colorFormat;
        context.configs.cssVarMap = data.cssVarMap;
        panel.close();
    });
    panel.show();
}
