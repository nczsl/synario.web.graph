# Synario.Web Graph 项目模块与现状分析（2025-06-01）

## 概览

本项目为 Synario.Web 的 WebGPU 图形渲染核心库，位于 core/Synario.Web/graph 目录下。采用 TypeScript 编写，支持模块化导出，自动生成类型声明文件，适配现代 WebGPU 渲染需求。

## 主要模块及功能

- **src/control.ts**：输入与信号调度，负责事件监听与信号分发。
- **src/signal.ts**：信号与输入数据结构，管理鼠标、键盘、Tick 等输入状态，支持 buffer 打包。
- **src/model.ts**：3D 模型、Mesh、Gobj 相关类型与资源管理，支持实例化、间接绘制等高级特性。
- **src/render-graph.ts**：渲染图与节点管理，负责渲染/计算节点的组织、调度与执行。
- **src/camera.ts**：相机参数与矩阵管理，支持视图、投影矩阵计算。
- **src/data-access.ts**：GPU 资源注册、管理与访问。
- **src/builders.ts**、**src/pipeline-builder.ts** 等：各类 WebGPU 资源、管线、布局的构建器。
- **types/**：所有核心类型声明，tsc 自动生成，部分全局类型需手动维护。

## 现存主要问题

1. **类型声明自动化与全局类型冲突**
   - tsc 自动生成的 d.ts 文件为模块声明（带 import/export），无法通过三斜杠全局引用，需手动维护全局 d.ts（如 scenery.global.d.ts）。

2. **属性名/接口不一致**
   - 代码中部分属性名（如 bindgrouplayoutId_vs vs bindGroupLayoutId_vs）存在驼峰与下划线混用，导致类型检查报错，已逐步统一。

3. **部分类型/方法缺失**
   - 例如 signal.ts 的 updateFromEvent、buffer、gbufferId 等，已补全。
   - MeshRes、Mesh、Gobj 等类型的部分 getter、属性需补全以兼容旧代码。

4. **模块间依赖复杂**
   - 各模块间通过类型和资源强依赖，需注意循环依赖和类型导出方式。

5. **构建脚本与类型声明生成**
   - build.ps1 支持自动生成 index.ts 和类型声明，但全局类型声明仍需人工维护。

## 统计

- 主要模块（src/）：10+（control、signal、model、render-graph、camera、data-access、builders、pipeline-builder、store、types 等）
- 类型声明文件（types/）：10+，含自动生成与手动维护
- 资源文件（shader/）：支持自动导出

## 建议

- 继续统一属性命名规范，避免驼峰与下划线混用。
- 对于需全局可用的类型，单独维护 global.d.ts 文件。
- 定期梳理各模块依赖关系，减少循环依赖。
- 优化 build.ps1，支持类型声明自动补全全局声明。

---

> 本日志由自动化工具生成，供团队成员了解项目结构与当前主要问题。
