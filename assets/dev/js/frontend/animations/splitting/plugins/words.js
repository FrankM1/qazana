import { createPlugin } from '../core/plugin-manager';
import { splitText } from '../utils/split-text';
import { _ } from '../utils/objects';

export var WORDS = 'words'

export var wordPlugin = createPlugin(
    /*by: */ WORDS,
    /*depends: */ _,
    /*key: */ 'word',
    /*split: */ function(el, opt) {
        console.log(opt);

        return splitText(el, 'word', /\s+/, 0, 1, opt.exclude)
    }
);
