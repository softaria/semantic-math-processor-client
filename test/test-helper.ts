import * as d from "jsdom";

const jsd = new d.JSDOM(`...`);
const window = jsd.window;

global["window"] = window;
global["document"] = window.document;
global["navigator"] = window.navigator;
