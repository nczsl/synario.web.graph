# synario.graphic

To install dependencies:
@webgpu/types

```pwsh
npm install file:"$_dir" --save 
```
build:
```pwsh
# cd tslib directory then
tsc
```
or,run ~/tslib/build.ps1
```pwsh
.\build.ps1
```
import:
```pwsh
import {scenery,mtype} from 'synario.graph'
```

## 命名规范

### 文件命名规则
- 源文件（src目录下的.ts文件）采用全小写，单词间用短杠（-）连接
  例如：`vector-math.ts`, `scene-renderer.ts`

### 模块导入规范
导入使用 `import * as xxx` 时，模块别名(xxx)的命名规则：
- 单个单词的模块：使用 `模块名_mod` 形式
  例如：`import * as math_mod from './math'`
- 多个单词的模块：使用 `单词首字母相加 + '_mod'` 形式
  例如：`import * as vm_mod from './vector-math'`
- 处理重名情况：
  - 单个单词重名：添加数字区分，如 `math_mod1`, `math_mod2`
  - 缩写重名：使用模块全名，如 `vectormath_mod`
  - 如果仍有重名：添加数字，如 `vectormath_mod1`

### summary :

  include typescript modules on local place, such as *netcon*,that is a fetch api packaged module, *scenery* that is a web 3d graphics use webgpu techloyage; *gmath* that is a 3d math module; *tecompiler* that is a emmet engine ,it can be transform from emmet expression to string of html dom; at so on.
