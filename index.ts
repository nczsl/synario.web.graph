///<reference path='./moduledef.d.ts' />
export const version = '250718.06';
export const moduleCount = 15;
export * as builders_mod from './src/builders';
export * as camera_mod from './src/camera';
export * as control_mod from './src/control';
export * as data_access_mod from './src/data-access';
export * as gmath_mod from './src/gmath';
export * as node_cs_mod from './src/node-cs';
export * as node_rs_mod from './src/node-rs';
export * as pipeline_builder_mod from './src/pipeline-builder';
export * as render_graph_mod from './src/render-graph';
export * as scene_mod from './src/scene';
export * as scenery_mod from './src/scenery';
export * as signal_mod from './src/signal';
export * as store_mod from './src/store';
export * as types_mod from './src/types';
export * as vertex_format_builder_mod from './src/vertex-format-builder';


// shader exports
import camera_wgsl from './shader/camera.wgsl' with { type: 'text' };
export { camera_wgsl };
import model_wgsl from './shader/model.wgsl' with { type: 'text' };
export { model_wgsl };
import random_wgsl from './shader/random.wgsl' with { type: 'text' };
export { random_wgsl };
import signal_wgsl from './shader/signal.wgsl' with { type: 'text' };
export { signal_wgsl };
