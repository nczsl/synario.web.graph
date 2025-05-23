import { util_mod, engine_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as data_access_mod from './data-access';
import * as model_mod from './model';
export var ResType;
(function (ResType) {
    ResType[ResType["buffer"] = 0] = "buffer";
    ResType[ResType["texture"] = 1] = "texture";
    ResType[ResType["externalTexture"] = 2] = "externalTexture";
    ResType[ResType["sampler"] = 3] = "sampler";
    ResType[ResType["colorTargetState"] = 4] = "colorTargetState";
    ResType[ResType["bindGroup"] = 5] = "bindGroup";
    ResType[ResType["bindGroupLayout"] = 6] = "bindGroupLayout";
    ResType[ResType["textureView"] = 7] = "textureView";
    ResType[ResType["vertexBufferLayout"] = 8] = "vertexBufferLayout";
    ResType[ResType["pipelineLayout"] = 9] = "pipelineLayout";
    ResType[ResType["renderpipeline"] = 10] = "renderpipeline";
    ResType[ResType["computepipeline"] = 11] = "computepipeline";
    ResType[ResType["colorAttachment"] = 12] = "colorAttachment";
    ResType[ResType["renderBundleDescriptor"] = 13] = "renderBundleDescriptor";
    ResType[ResType["querySet"] = 14] = "querySet";
    ResType[ResType["passParam"] = 15] = "passParam";
})(ResType || (ResType = {}));
export function ensureParamArray(value) {
    return Array.isArray(value) ? value : [value];
}
